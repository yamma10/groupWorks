import express from 'express';
import { getAllMessages } from '../controllers/messagesController';

const router = express.Router();

router.get("/", async(req: express.Request, res: express.Response) => {
    const result = await getAllMessages();

    res.send(result);
});





export default router;