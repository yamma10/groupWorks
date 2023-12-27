import express from 'express';

const router = express.Router();

router.get("/", async(req: express.Request, res: express.Response) => {
    res.send("Hello World");
});

export default router;