import { createSelectAllMessagesQuery, createSelectMessagesByRoomIdQuery } from "../components/createQuery"
import mssql from "mssql";
import { config } from "../../config";

export const getAllMessages = async (): Promise<any> => {
    const query = createSelectAllMessagesQuery();

    try {
        const conn = await mssql.connect(config);
        const res = await conn.request().query(query);

        console.log(res.recordset);
        return res.recordset;
    }
    catch (e: any) {
        console.log(e);
        return e.message;
    }
}

export const getMessagesById = async (id: number) => {
    const query = createSelectMessagesByRoomIdQuery(id);

    try {
        const conn = await mssql.connect(config);
        const res = await conn.request().query(query);

        console.log(res.recordset);
        return res.recordset;
    }
    catch (e: any) {
        console.log(e);
        return e.message;
    }
}