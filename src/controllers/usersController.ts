import express from "express";
import { LoginUser, ResponseUser } from "../model/User";
import { createCheckPassQuery, createLoginQuery, createRegisterPassQuery, createSelectPassByCodeQuery } from "../components/createQuery";
import mssql from "mssql";
import {config} from "../../config";
import { getTokenSourceMapRange } from "typescript";
import { generageOntimePass } from "../components/ontimePass";

export const login = async(loginUser: LoginUser): Promise<ResponseUser> => {
    //loginの処理

    let user: ResponseUser = {
        employeeCode: 0,
        employeeName: "",
        message: "",
    };
    
    //クエリの作成
    const query: string = createLoginQuery(loginUser);
    //sqlの実行
    try {
        const conn = await mssql.connect(config);

        const res = await conn.request().query(query)
        //console.log(res)
        
        user.employeeCode = 0;
        if (res.rowsAffected[0] == 0){
            user.message = "false"
            return user;
        } else {
            if (res.recordset[0].パスワード != loginUser.password) {
                user.message = "パスワードが違います"
                return user;
            } else {
                user.employeeCode = res.recordset[0].担当者コード;
                user.employeeName = res.recordset[0].担当者名;
                user.message = "true"
            }
        
        }
    } catch(e: any) {
        console.log(e.message)
        user.message = e.message;
        return e.message;
    }

    //loginできたらtrueを返す
    return user;
}

export const registerPass = async(employeeCode: number): Promise<boolean> => {
    const onetimePass: string = generageOntimePass();
    //クエリの作成
    const query: string = createRegisterPassQuery(employeeCode, onetimePass);

    //sqlの実行
    try {
        const conn = await mssql.connect(config);

        const res = await conn.request().query(query)
        
    } catch(e: any) {
        console.log(e.message)
        return false;
    }
    return true;
}

export const checkPass = async(employeeCode: number, onetimePass: string): Promise<string> => {
    const query = createSelectPassByCodeQuery(employeeCode);
    try {
        const conn = await mssql.connect(config);

        const res = await conn.request().query(query)
        if (res.rowsAffected[0] == 0){
            //返却されたレコードがない場合
            return "ワンタイムパスワードが発行されていないか、期限が切れています";
        } else if (res.recordset[0].ワンタイムパスワード != onetimePass) {
            //ワンタイムパスワードが違う場合
            let check: boolean = false;
            res.recordset.map((recordset) => {
                // console.log("入力されたワンタイムパスワード: " + onetimePass)
                // console.log("record: " + recordset.ワンタイムパスワード)
                // console.log(recordset.ワンタイムパスワード == onetimePass)
                if (recordset.ワンタイムパスワード == onetimePass) {
                    check = true;
                }
            });
            if (check) {
                return "無効なワンタイムパスワードです"
            } else {
                return "ワンタイムパスワードが違います";
            }
            
        } else if (res.recordset[0].ワンタイムパスワード == onetimePass) {
            return "ok";
        } else {
            return "無効なワンタイムパスワードです";
        }
    } catch(e: any) {
        console.log(e.message);
        return e.message;
    }
}