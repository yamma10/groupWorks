import express from "express";
import { LoginUser, ResponseUser } from "../model/User";
import { checkPass, login, registerPass } from "../controllers/usersController";
import { generageOntimePass } from "../components/ontimePass";

const router = express.Router();

router.get("/", (req: express.Request, res: express.Response) => {
    res.send("hello world");
})

//JSONを受け取る
router.post("/login", async (req: express.Request, res: express.Response) => {
    //loginUser
    let loginUser: LoginUser;
    try {
        loginUser = req.body;
        //loginUserのemployeeCodeが空だったら
        if(loginUser.account === "") {
            res.send("担当者コードが入力されていません");
            return ;
        }
        //loginUserのpasswordが空だったら
        if(loginUser.password === undefined) {
            res.send("パスワードが入力されていません");
            return;
        }


        const user: ResponseUser = await login(loginUser);
        const ontimePasword: string = generageOntimePass();

        //console.log(user)
        if(user.message == "true") {
            res.send(user);
        } else if (user.message == "false") {
            //console.log("false")
            res.send(user);
        } else {
            res.send(user);
        }
    } catch(e) {
        console.log(e);
    } 
    
    res.end();
})

//クエリで受け取る
router.post("/register_pass", async(req: express.Request, res: express.Response) => {
    let resMessage = {
        message: ""
    }
    if (req.body.employeeCode === undefined) {
        resMessage.message = "担当者コードが入力されていません";
        res.send(resMessage);
        return;
    }

    const register = await registerPass(req.body.employeeCode);
    if (register) {
        resMessage.message = "ok";
    } else {
        resMessage.message = "false";
    }
    res.send(resMessage);
    res.end();

})

router.post("/check_onetime", async(req: express.Request, res: express.Response) => {
    let resMessage = {
        message: ""
    }
    if (req.body.employeeCode === undefined) {
        resMessage.message = "担当者コードが入力されていません";
        res.send(resMessage);
        res.end();
        return;
    }
    if (req.body.onetimePass === undefined) {
        resMessage.message = "ワンタイムパスワードが入力されていません";
        res.send(resMessage);
        return;
    }
    resMessage.message = await checkPass(req.body.employeeCode, req.body.onetimePass);
    res.send(resMessage);
    res.end();
})

export default router;