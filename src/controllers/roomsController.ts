import mssql from "mssql";
import { createRegisterRoomQuery,createRegisterRoomMemberQuery, createSelectAllRoomQuery, createSelectRoomByIdQuery, createSelectUsersByRoomIdQuery, createSelectMessagesByRoomIdQuery } from "../components/createQuery";
import {config} from "../../config";
import { Room, RoomMember } from "../model/Room";
import { User } from "../model/User";
import { Message } from "../model/Message";

export const getAllRooms = async(): Promise<Room[]> => {
    //クエリの作成
    const query = createSelectAllRoomQuery();

    //sqlの実行
    try {
        const conn = await mssql.connect(config);
        const res = await conn.request().query(query);
        
        console.log("getAllRooms");
        if (res.rowsAffected[0] == 0) {
            throw new Error("トークルームがありません");
        }


        let rooms: Room[] = [];
        res.recordset.forEach((record: any) => {
            let room = new Room(record.ルームNo, record.ルーム名)
            rooms.push(room);
        })
        return rooms;
    }
    catch (e: any) {
        throw new Error(e.message);
    }

}

export const getRoomById = async(id: number): Promise<Room> => {
    const query = createSelectRoomByIdQuery(id);

    try {
        const conn = await mssql.connect(config);
        const res = await conn.request().query(query);
        
        console.log("getRoomById");

        if (res.rowsAffected[0] == 0) {
            throw new Error("トークルームが存在しません");
        }
        let room = new Room(res.recordset[0].ルームNo, res.recordset[0].ルーム名);
        return room;
    }
    catch (e: any) {
        console.log(e);
        throw new Error(e.message)
    }
}

export const getUsersByRoomId = async(id: number): Promise<User[]> =>  {
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
        throw new Error(e.message);
    }
}
//ルームIDからすべてのメッセージを取得
export const getMessagesById = async (id: number): Promise<Message[]> => {
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
        throw new Error(e.message);
    }
}


export const registerRoom = async (roomName: string): Promise<Room> => {
    //クエリの作成
    const query = createRegisterRoomQuery(roomName)

    //sqlの実行
    try {
        const conn = await mssql.connect(config);
        const res = await conn.request().query(query);
        console.log("registerRoom")
        if (res.rowsAffected[0] == 0) {
            throw new Error("トークルームの登録に失敗しました");
        }
        let room = new Room(res.recordset[0].ルームNo, res.recordset[0].ルーム名);
        return room;
    }
    catch (e: any) {
        console.log(e.message);
        throw new Error(e.message);
    }

}

export const registerMember = async (employeeCode: number, id: number): Promise<RoomMember> => {
    //クエリの作成
    const query = createRegisterRoomMemberQuery(id,employeeCode);
    console.log(query);

    try {
        const conn = await mssql.connect(config);
        const res = await conn.request().query(query);
        console.log("registerMember")
        if (res.rowsAffected[0] == 0) {
            throw new Error("メンバーの登録に失敗しました");
        }
        const member = new RoomMember(res.recordset[0].ルームNo, res.recordset[0].担当者コード);
        return member;
    } catch(e: any) {
        console.log(e.message);
        throw new Error(e.message);
    }


}