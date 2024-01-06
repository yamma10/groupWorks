import { createRegisterMessageQuery, createSelectAllMessagesQuery, createSelectMessagesByRoomIdQuery } from "../components/createQuery"
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

export const registerMessage = async (roomId: number,employeeCode: number,message: string): Promise<any> => {
    const query = createRegisterMessageQuery(roomId, employeeCode, message);

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