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


