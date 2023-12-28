import express from 'express';
import { getAllMessages, getMessagesById } from '../controllers/messagesController';

const router = express.Router();

router.get("/", async(req: express.Request, res: express.Response) => {
    const result = await getAllMessages();

    res.send(result);
});

//トークルームのidから、メッセージを取得する
router.get("/:id", async(req: express.Request, res: express.Response) => {
    if (req.params.id === undefined) {
        res.send("idが入力されていません");
        return;
    }

    const result = await getMessagesById(Number(req.params.id));
    res.send(result);
})

router.get



export default router;