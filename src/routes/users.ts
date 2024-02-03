import express from "express";
import { LoginUser, User } from "../model/User";
import { checkPass, login, registerPass, getAllUsers, getUserByCode, getRoomsByCode, getFirstMessagesByCode } from "../controllers/usersController";
import { Message, resMessage } from "../model/Message";

const router = express.Router();

router.get("/", async(req: express.Request, res: express.Response) => {
    try {
        const result: User[] = await getAllUsers();
        res.status(200).json(result).end();
    } catch(e: any) {
        const mes = new resMessage(e.message);
        res.status(400).json(mes).end();
    }
})

router.get("/:id", async(req: express.Request, res: express.Response) => {
    if (req.params.id === undefined) {
        const mes = new resMessage("idが入力されていません");
        res.status(400).json(mes);
        return;
    }

    try {
        const result:User = await getUserByCode(Number(req.params.id));
        res.status(200).json(result).end();
    } catch(e: any) {
        const mes = new resMessage(e.message);
        res.status(400).json(mes).end();
    }
    
})

router.get("/:id/rooms", async(req: express.Request, res: express.Response) => {
    if (req.params.id === undefined) {
        const mes = new resMessage("idが入力されていません");
        res.status(400).json(mes);
        return;
    }

    try {
        const result = await getRoomsByCode(Number(req.params.id));
        res.status(200).json(result).end();
    } catch(e: any) {
        const mes = new resMessage(e.message);
        res.status(400).json(mes).end();
    }
    
})

router.get("/:id/messages", async(req: express.Request, res: express.Response) => {
    if (req.params.id === undefined) {
        const mes = new resMessage("idが入力されていません");
        res.status(400).json(mes);
        return;
    }

    try {
        const result:Message = await getFirstMessagesByCode(Number(req.params.id));
        res.status(200).json(result).end();
    } catch(e: any) {
        const mes = new resMessage(e.message);
        res.status(400).json(mes).end();
    }

})

//JSONを受け取る
router.post("/login", async (req: express.Request, res: express.Response) => {

    //loginUserのemployeeCodeが空だったら
    if(req.body.account === "") {
        const mes = new resMessage("担当者コードが入力されていません");
        res.status(400).json(mes).end();
        return;
    }

    //loginUserのpasswordが空だったら
    if(req.body.password === undefined) {
        const mes = new resMessage("パスワードが入力されていません");
        res.status(400).json(mes).end();
        return;
    }

    //loginUser
    let loginUser: LoginUser;
    try {
        loginUser = new LoginUser(req.body.account, req.body.password);
        const user: User = await login(loginUser);
        res.status(200).json(user).end();
    } catch(e: any) {
        console.log(e.message);
        const mes = new resMessage(e.message);
        res.status(400).json(mes).end();
    } 
    
    res.end();
})

//クエリで受け取る
router.post("/register_pass", async(req: express.Request, res: express.Response) => {
    if (req.body.employeeCode === undefined) {
        const mes = new resMessage("担当者コードが入力されていません");
        res.status(400).json(mes).end();
        return;
    }
    
    try {
        await registerPass(req.body.employeeCode);
        res.status(200).end();
    } catch (e: any) {
        const mes = new resMessage(e.message);
        res.status(400).json(mes).end();
    }
     

})

router.post("/check_onetime", async(req: express.Request, res: express.Response) => {
    if (req.body.employeeCode === undefined) {
        const mes = new resMessage("担当者コードが入力されていません");
        res.status(400).json(mes).end();
        return;
    }
    if (req.body.onetimePass === undefined) {
        const mes = new resMessage("ワンタイムパスワードが入力されていません");
        res.status(400).json(mes).end();
        return;
    }

    try {
        await checkPass(req.body.employeeCode, req.body.onetimePass);
        res.status(200).end();
    } catch (e: any) {
        const mes = new resMessage(e.message);
        res.status(400).json(mes).end();
    }
    
})


export default router;