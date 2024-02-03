import express from 'express';
import { getAllMessages, registerMessage } from '../controllers/messagesController';
import { Message, resMessage } from '../model/Message';

const router = express.Router();

router.get("/", async(req: express.Request, res: express.Response) => {
    try {
        const result:Message[] = await getAllMessages();
        res.status(200).json(result).end();
    } catch(e: any) {
        const mes = new resMessage(e.message);
        res.status(400).send(mes);
    }
});

router.post("/", async(req: express.Request, res: express.Response) => {
    if (req.body.id === undefined) {
        const mes = new resMessage("ルームIDが入力されていません")
        res.status(400).send(mes);
        return;
    }
    if (req.body.employeeCode === undefined) {
        const mes = new resMessage("担当者コードが入力されていません")
        res.status(400).send(mes);
        return;
    }
    if (req.body.employeeName === undefined) {
        const mes = new resMessage("担当者名が入力されていません")
        res.status(400).send(mes);
        return;
    }
    if (req.body.text === undefined) {
        const mes = new resMessage("メッセージが入力されていません")
        res.status(400).send(mes);
        return;
    }
    
    
    try {
        const message = new Message(req.body.id, req.body.employeeCode, req.body.employeeName, req.body.text);
        const result:Message = await registerMessage(message);
        res.status(200).json(result).end();
    } catch(e: any) {
        const mes = new resMessage(e.message);
        res.status(400).send(mes).end();
    }
});



export default router;