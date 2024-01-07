import mssql from "mssql";
import { createRegisterRoomQuery,createRegisterRoomMemberQuery, createSelectAllRoomQuery, createSelectRoomByIdQuery, createSelectUsersByRoomIdQuery, createSelectMessagesByRoomIdQuery } from "../components/createQuery";
import {config} from "../../config";
import { Room, resRoom, resRoomMember } from "../model/Room";
import { User } from "../model/User";
import { Message } from "../model/Message";

export const getAllRooms = async(): Promise<any> => {
    //クエリの作成
    const query = createSelectAllRoomQuery();

    //sqlの実行
    try {
        const conn = await mssql.connect(config);
        const res = await conn.request().query(query);
        
        console.log("getAllRooms");
        if (res.rowsAffected[0] == 0) {
            return "false";
        }


        let rooms: Room[] = [];
        res.recordset.forEach((record: any) => {
            let room = new Room(record.ルームNo, record.ルーム名)
            rooms.push(room);
        })
        return rooms;
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
        
        console.log("getRoomById");

        if (res.rowsAffected[0] == 0) {
            return "false";
        }
        let room = new Room(res.recordset[0].ルームNo, res.recordset[0].ルーム名);
        return room;
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
        
        console.log("getUsersByRoomId");
        let users: User[] = [];
        res.recordset.forEach((record: any) => {
            let user = new User(record.担当者コード, record.担当者名, record.部署名, record.役職名, record.無効フラグ);
            users.push(user);
        })
        return users;
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

        console.log("getMessagesById");
        let messaeges: Message[] = [];
        res.recordset.forEach((record: any) => {
            let message = new Message(record.ルームNo, record.担当者コード, record.担当者名, record.メッセージ, record.日時);
            messaeges.push(message);
        })
        return messaeges;
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