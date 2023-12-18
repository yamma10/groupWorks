import express from "express";
import { LoginUser } from "../model/User";
import { login } from "../controllers/usersController";

const router = express.Router();

router.get("/", (req: express.Request, res: express.Response) => {
    res.send("hello world");
})

router.post("/login", async (req: express.Request, res: express.Response) => {
    //loginUser
    let loginUser: LoginUser;
    try {
        loginUser = req.body;
        //loginUserのemployeeCodeが空だったら
        if(loginUser.employeeCode === "") {
            res.send("担当者コードが入力されていません");
            return ;
        }
        //loginUserのpasswordが空だったら
        if(loginUser.password === undefined) {
            res.send("パスワードが入力されていません");
            return;
        }


        const loginCheck:string = await login(loginUser);
        
        if(loginCheck == "true") {
            res.send("ログイン成功");
        } else if (loginCheck == "false") {
            res.send("ログイン失敗");
        } else {
            res.send(loginCheck);
        }
    } catch(e) {
        console.log(e);
    } 
    
    res.end();
})

export default router;