import express from "express";

const router = express.Router();

router.get("/", (req: express.Request, res: express.Response) => {
    res.send("hello world");
})

router.post("/login", (req: express.Request, res: express.Response) => {
    res.send(req.body.name);
})

export default router;