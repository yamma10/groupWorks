import express from "express";
import { LoginUser } from "../model/User";
import { createLoginQuery } from "../components/createQuery";
import mssql from "mssql";
import {config} from "../../config";

export const login = async(loginUser: LoginUser): Promise<string> => {
    //loginの処理


    //クエリの作成
    const query: string = createLoginQuery(loginUser);
    //sqlの実行
    try {
        const conn = await mssql.connect(config);

        const res = await conn.request().query(query)
        console.log(res)
        
        if (res.rowsAffected[0] == 0){
            return "false";
        }
    } catch(e: any) {
        console.log(e.message)
        return e.message;
    }

    //loginできたらtrueを返す
    return "true";
}