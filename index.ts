import express from 'express';
import usersRoute  from './src/routes/users';
import { PrismaClient } from "@prisma/client";
import mssql from "mssql";
import {config} from "./config";
import fs from "fs";
// const prisma = new PrismaClient();

const app: express.Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(5000, () => {
    console.log("start")
});

app.use("/users", usersRoute);

app.get("/", (req: express.Request, res: express.Response) => {
    res.send("hello world")
})

app.get("/test", async(req: express.Request,res: express.Response) => {
    try {
        const conn = await mssql.connect(config);

        const str = fs.readFileSync("./src/sql/test.sql", "utf-8")

        const res = await conn.request().query(str)
        console.log(res)
        
    } catch(e: any) {
        res.status(500).send(e.message)
    }

    res.end();
})