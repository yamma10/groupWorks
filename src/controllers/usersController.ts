import express from "express";
import { LoginUser, ResponseUser } from "../model/User";
import {  createLoginQuery, createRegisterPassQuery, createSelectAllUsersQuery, createSelectMailQuery, createSelectMessagesByCodeQuery, createSelectPassByCodeQuery, createSelectRoomsByCodeQuery, createSelectUserByCodeQuery } from "../components/createQuery";
import mssql from "mssql";
import {config, options } from "../../config";
import { getTokenSourceMapRange } from "typescript";
import { generageOntimePass } from "../components/ontimePass";
import nodemailer from "nodemailer";
import { resOtp } from "../model/Otp";
import { send } from "../components/send";


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

export const registerPass = async(employeeCode: number): Promise<resOtp> => {
    const onetimePass: string = generageOntimePass();
    //クエリの作成
    const query: string = createRegisterPassQuery(employeeCode, onetimePass);

    let resOtp: resOtp = {
        employeeCode: 0,
        onetimePass: "",
        message: "",
    }

    //sqlの実行
    try {
        const conn = await mssql.connect(config);

        const res = await conn.request().query(query)
        if(res.rowsAffected[0] == 0) {
            resOtp.message = "false";
            return resOtp;
        } else {
            console.log("get otp")
            resOtp.employeeCode = res.recordset[0].担当者コード;
            resOtp.onetimePass = res.recordset[0].ワンタイムパスワード;
            resOtp.message = "true";
        }
        
        
    } catch(e: any) {
        console.log(e.message)
        resOtp.message = e.message;
        return resOtp;
    }
    return resOtp;
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

export const getAddressAndSendEmail = async(otp:string, employeeCode:number):Promise<string> => {

    const query = createSelectMailQuery(employeeCode);
    try {
        const conn = await mssql.connect(config);

        const res = await conn.request().query(query)
        if (res.rowsAffected[0] == 0){
            //返却されたレコードがない場合
            console.log("メールアドレスが登録されていません");
        } else {
            const mailAddress: string = res.recordset[0].メールアドレス;
            const check = await send(mailAddress, otp);
            if (check) {
                console.log("メールを送信しました");
            } else {
                console.log("メールを送信できませんでした");
            }
        }
    } catch(e: any) {
        console.log(e.message);
        return e.message;
    }


    return "true";
}

export const getAllUsers = async(): Promise<any> => {
    const query = createSelectAllUsersQuery();
    
    try {
        const conn = await mssql.connect(config);
        const res = await conn.request().query(query);
        
        console.log(res.recordset);
        return res.recordset;
    }
    catch (e: any) {
        console.log(e);
        return e.message;
    }

}

export const getUserByCode = async(employeeCode: number): Promise<any> => {
    const query = createSelectUserByCodeQuery(employeeCode);
    
    try {
        const conn = await mssql.connect(config);
        const res = await conn.request().query(query);
        
        console.log(res.recordset);
        return res.recordset;
    }
    catch (e: any) {
        console.log(e);
        return e.message;
    }

}

export const getRoomsByCode = async(employeeCode: number): Promise<any> => {
    const query = createSelectRoomsByCodeQuery(employeeCode);

    try {
        const conn = await mssql.connect(config);
        const res = await conn.request().query(query);
        
        console.log(res.recordset);
        return res.recordset;
    }
    catch (e: any) {
        console.log(e);
        return e.message;
    }
}

export const getFirstMessagesByCode = async(employeeCode: number): Promise<any> => {
    const query = createSelectMessagesByCodeQuery(employeeCode);

    try {
        const conn = await mssql.connect(config);
        const res = await conn.request().query(query);
        
        console.log(res.recordset);
        return res.recordset;
    }
    catch (e: any) {
        console.log(e);
        return e.message;
    }
}