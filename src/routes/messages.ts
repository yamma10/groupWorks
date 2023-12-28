import express from 'express';
import { getAllMessages, registerMessage } from '../controllers/messagesController';

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
    if (req.body.message === undefined) {
        res.send("メッセージが入力されていません");
        return;
    }
    const result = await registerMessage(req.body.message, req.body.employeeCode, req.body.id);

    res.send(result);
});



export default router;