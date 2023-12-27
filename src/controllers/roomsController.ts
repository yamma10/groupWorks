import mssql from "mssql";
import { createRegisterRoomQuery,createRegisterRoomMemberQuery, createSelectAllRoomQuery, createSelectRoomByIdQuery, createSelectUsersByRoomIdQuery } from "../components/createQuery";
import {config} from "../../config";
import { Room, resRoom, resRoomMember } from "../model/Room";

export const getAllRooms = async(): Promise<any> => {
    //クエリの作成
    const query = createSelectAllRoomQuery();

    //sqlの実行
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

export const getRoomById = async(id: number): Promise<any> => {
    const query = createSelectRoomByIdQuery(id);

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

export const getUsersByRoomId = async(id: number): Promise<any> =>  {
    const query = createSelectUsersByRoomIdQuery(id)

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


export const registerRoom = async (roomName: string): Promise<resRoom> => {
    //クエリの作成
    const query = createRegisterRoomQuery(roomName);

    let resRoom : resRoom = {
        id: 0,
        name: "",
        message: "",
    };

    //sqlの実行
    try {
        const conn = await mssql.connect(config);
        const res = await conn.request().query(query);
        resRoom.id = res.recordset[0].ルームNo;
        resRoom.name = res.recordset[0].ルーム名;
        console.log(res);
        resRoom.message = "true";
    }
    catch (e: any) {
        console.log(e);
        resRoom.message = e.message;
    }

    return resRoom;
}

export const registerMember = async (employeeCode: number, id: number): Promise<resRoomMember> => {
    //クエリの作成
    const query = createRegisterRoomMemberQuery(id,employeeCode);
    console.log(query);

    let resRoomMember: resRoomMember = {
        employeeCode: 0,
        roomId: 0,
        message: "",
    };
    

    return resRoomMember;

}