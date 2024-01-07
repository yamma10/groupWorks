import express from 'express';
import { getAllMessages, registerMessage } from '../controllers/messagesController';
import { Message, resMessage } from '../model/Message';

const router = express.Router();

router.get("/", async(req: express.Request, res: express.Response) => {
    const result = await getAllMessages();

    res.send(result);
});

router.post("/", async(req: express.Request, res: express.Response) => {
    if (req.body.id === undefined) {
        res.send("ルームIDが入力されていません");
        return;
    }
    if (req.body.employeeCode === undefined) {
        res.send("担当者コードが入力されていません");
        return;
    }
    if (req.body.employeeName === undefined) {
        res.send("担当者名が入力されていません");
        return;
    }
    if (req.body.text === undefined) {
        res.send("メッセージが入力されていません");
        return;
    }
    
    let message: Message;
    let result: any;
    try {
        message = new Message(req.body.id, req.body.employeeCode, req.body.employeeName, req.body.text);
        result = await registerMessage(message);
    } catch(e: any) {
        const mes = new resMessage(e.message);
        result = mes;
    }
    
    

    res.send(result);
});



export default router;