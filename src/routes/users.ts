import express from "express";
import { LoginUser } from "../model/User";

const router = express.Router();

router.get("/", (req: express.Request, res: express.Response) => {
    res.send("hello world");
})

router.post("/login", (req: express.Request, res: express.Response) => {
    //loginUser
    let loginUser: LoginUser;
    try {
        loginUser = req.body;
        //loginUserのemployeeCodeが空だったら
        if(loginUser.employeeCode === "") {
            res.send("担当者コードが入力されていません");
        }
        //loginUserのpasswordが空だったら
        if(loginUser.password === undefined) {
            res.send("パスワードが入力されていません");
        }
        // console.log(typeof(loginUser.employeeCode))
        // console.log(typeof(loginUser.password))
    } catch(e) {
        console.log(e);
    } 
    
    res.end();
})

export default router;