import express from "express";
import { LoginUser, User } from "../model/User";
import {  createLoginQuery, createRegisterPassQuery, createSelectAllUsersQuery, createSelectMailQuery, createSelectMessagesByCodeQuery, createSelectPassByCodeQuery, createSelectRoomsByCodeQuery, createSelectUserByCodeQuery } from "../components/createQuery";
import mssql from "mssql";
import {config, options } from "../../config";
import { getTokenSourceMapRange } from "typescript";
import { generageOntimePass } from "../components/ontimePass";
import nodemailer from "nodemailer";
import { send } from "../components/send";
import { Otp } from "../model/Otp";
import { Room } from "../model/Room";
import { Message } from "../model/Message";


export const login = async(loginUser: LoginUser): Promise<User> => {
    
    //クエリの作成
    const query: string = createLoginQuery(loginUser);
    //sqlの実行
    try {
        const conn = await mssql.connect(config);

        const res = await conn.request().query(query)
        //console.log(res)
        
        if (res.rowsAffected[0] == 0){
            throw new Error("ユーザーが存在しません");
        } else {
            if (res.recordset[0].パスワード != loginUser.password) {
                throw new Error("パスワードが違います");
            } else {
                const user = new User(res.recordset[0].担当者コード, res.recordset[0].担当者名, res.recordset[0].部署名, res.recordset[0].役職, res.recordset[0].無効フラグ);
                return user;
            }
        
        }
    } catch(e: any) {
        console.log(e.message)
        throw new Error(e.message);
    }
}

export const registerPass = async(employeeCode: number): Promise<void> => {
    const onetimePass: string = generageOntimePass();
    //クエリの作成
    const query: string = createRegisterPassQuery(employeeCode, onetimePass);

    //sqlの実行
    try {
        const conn = await mssql.connect(config);

        const res = await conn.request().query(query)
        if(res.rowsAffected[0] == 0) {
            throw new Error("ユーザーが存在しません");
        } else {
            console.log("get otp")
            const otp = new Otp(res.recordset[0].担当者コード,res.recordset[0].ワンタイムパスワード);
            await getAddressAndSendEmail(otp.onetimePass, otp.employeeCode);
        }
    } catch(e: any) {
        console.log(e.message)
        throw new Error(e.message);
    }
}

export const checkPass = async(employeeCode: number, onetimePass: string): Promise<void> => {
    const query = createSelectPassByCodeQuery(employeeCode);
    try {
        const conn = await mssql.connect(config);

        const res = await conn.request().query(query)
        if (res.rowsAffected[0] == 0){
            //返却されたレコードがない場合
            throw new Error("ワンタイムパスワードが発行されていないか、期限が切れています");
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
                throw new Error("無効なワンタイムパスワードです");
            } else {
                throw new Error("ワンタイムパスワードが違います");
            }
            
        } else if (res.recordset[0].ワンタイムパスワード == onetimePass) {
            return;
        } else {
            throw new Error("無効なワンタイムパスワードです");
        }
    } catch(e: any) {
        console.log(e.message);
        throw new Error(e.message)
    }
}

export const getAddressAndSendEmail = async(otp:string, employeeCode:number):Promise<void> => {

    const query = createSelectMailQuery(employeeCode);
    try {
        const conn = await mssql.connect(config);

        const res = await conn.request().query(query)
        if (res.rowsAffected[0] == 0){
            //返却されたレコードがない場合
            console.log("メールアドレスが登録されていません");
        } else {
            const mailAddress: string = res.recordset[0].メールアドレス;
            await send(mailAddress, otp);
        }
    } catch(e: any) {
        console.log(e.message);
        throw new Error(e.message);
    }
}

export const getAllUsers = async(): Promise<User[]> => {
    const query = createSelectAllUsersQuery();
    
    try {
        const conn = await mssql.connect(config);
        const res = await conn.request().query(query);
        
        console.log("get All Users");
        let users : User[]  = [];
        if(res.rowsAffected[0] == 0) {
            throw new Error("ユーザーが存在しません");
        }
        res.recordset.map((recordset) => {
            const user = new User(recordset.担当者コード, recordset.担当者名, recordset.部署名, recordset.役職, recordset.無効フラグ);
            users.push(user);
        });
        return users;
    }
    catch (e: any) {
        console.log(e);
        throw new Error(e.message);
    }

}

export const getUserByCode = async(employeeCode: number): Promise<User> => {
    const query = createSelectUserByCodeQuery(employeeCode);
    
    try {
        const conn = await mssql.connect(config);
        const res = await conn.request().query(query);
        
        console.log("get User By Code");
        if(res.rowsAffected[0] == 0) {
            throw new Error("ユーザーが存在しません");
        }
        const user = new User(res.recordset[0].担当者コード, res.recordset[0].担当者名, res.recordset[0].部署名, res.recordset[0].役職, res.recordset[0].無効フラグ);
        return user;
    }
    catch (e: any) {
        console.log(e.message);
        throw new Error(e.message);
    }

}

export const getRoomsByCode = async(employeeCode: number): Promise<Room[]> => {
    const query = createSelectRoomsByCodeQuery(employeeCode);

    try {
        const conn = await mssql.connect(config);
        const res = await conn.request().query(query);
        
        console.log("get Rooms By Code");
        if(res.rowsAffected[0] == 0) {
            throw new Error("ルームが存在しません");
        }
        let rooms : Room[] = [];
        res.recordset.map((recordset) => {
            const room = new Room(recordset.ルームNo, recordset.ルーム名);
            rooms.push(room);
        });
        return rooms;
    }
    catch (e: any) {
        console.log(e);
        throw new Error(e.message)
    }
}

export const getFirstMessagesByCode = async(employeeCode: number): Promise<Message> => {
    const query = createSelectMessagesByCodeQuery(employeeCode);

    try {
        console.log("get First Messages By Code");
        const conn = await mssql.connect(config);
        const res = await conn.request().query(query);

        const message = new Message(res.recordset[0].ルームNo, res.recordset[0].担当者コード, res.recordset[0].担当者名, res.recordset[0].メッセージ, res.recordset[0].日時);
        return message;
    }
    catch (e: any) {
        console.log(e.message);
        throw new Error(e.message)
    }
}