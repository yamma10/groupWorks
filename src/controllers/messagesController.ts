import { createRegisterMessageQuery, createSelectAllMessagesQuery, createSelectMessagesByRoomIdQuery } from "../components/createQuery"
import mssql from "mssql";
import { config } from "../../config";
import { Message } from "../model/Message";

export const getAllMessages = async (): Promise<any> => {
    const query = createSelectAllMessagesQuery();

    try {
        const conn = await mssql.connect(config);
        const res = await conn.request().query(query);

        console.log("getAllMessages");
        if (res.rowsAffected[0] == 0) {
            return "false";
        }
        let messages: Message[] = [];
        res.recordset.forEach((record: any) => {
            let message = new Message(record.ルームNo, record.担当者コード, record.担当者名, record.メッセージ, record.日時);
            messages.push(message);
        })
        return messages;
    }
    catch (e: any) {
        console.log(e);
        return e.message;
    }
}

export const registerMessage = async (message: Message): Promise<any> => {
    const query = createRegisterMessageQuery(message);

    try {
        const conn = await mssql.connect(config);
        const res = await conn.request().query(query);

        console.log("registerMessage");
        if (res.rowsAffected[0] == 0) {
            return new Error("false");
        }
        let message = new Message(res.recordset[0].ルームNo, res.recordset[0].担当者コード, res.recordset[0].担当者名, res.recordset[0].メッセージ, res.recordset[0].日時);
        return message;
    }
    catch (e: any) {
        console.log(e);
        return new Error(e.message);
    }
}