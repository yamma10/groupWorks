import express from "express";
import { LoginUser } from "../model/User";
import { connect } from "../components/connectDatabase";
import { createLoginQuery } from "../components/createQuery";

export const login = (loginUser: LoginUser): boolean => {
    //loginの処理

    //クエリの作成
    const query: string = createLoginQuery(loginUser);
    //sqlの実行
    const sqlCheck: boolean = connect(query, "users");

    if(!sqlCheck) {
        return false;
    }
    //loginできたらtrueを返す
    return true;
}