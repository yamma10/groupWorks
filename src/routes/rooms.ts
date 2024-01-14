import express from 'express';
import { register } from 'ts-node';
import { registerRoom, registerMember, getAllRooms, getRoomById, getUsersByRoomId, getMessagesById } from '../controllers/roomsController';
import { Room, RoomMember } from '../model/Room';
import { Message, resMessage } from '../model/Message';

const router = express.Router();

router.get("/", async(req: express.Request, res: express.Response) => {
    try {
        const result:Room[] = await getAllRooms();
        res.status(200).json(result).end();
    } catch(e: any) {
        const mes = new resMessage(e.message);
        res.status(400).json(mes).end();
    }
    
});

//ルームのidから、ルームを取得する
router.get("/:id", async(req: express.Request, res: express.Response) => {
    if (req.params.id === undefined) {
        const mes = new resMessage("idが入力されていません");
        res.status(400).json(mes).end();
        return;
    }
    try {
        const result = await getRoomById(Number(req.params.id));
        res.status(200).json(result).end();
    } catch(e: any) {
        const mes = new resMessage(e.message);
        res.status(400).json(mes).end();
    }
})

//ルームのidから、加入しているメンバーを取得する
router.get("/:id/users", async(req: express.Request, res: express.Response) =>  {
    if (req.params.id === undefined) {
        const mes = new resMessage("idが入力されていません");
        res.status(400).json(mes).end();
        return;
    }

    try {
        const result = await getUsersByRoomId(Number(req.params.id));
        res.status(200).json(result).end();
    } catch(e: any) {
        const mes = new resMessage(e.message);
        res.status(400).json(mes).end();
    }
})

router.get("/:id/messages", async(req: express.Request, res: express.Response) => {
    if (req.params.id === undefined) {
        const mes = new resMessage("idが入力されていません");
        res.status(400).json(mes).end();
        return;
    }

    try {
        const result:Message[] = await getMessagesById(Number(req.params.id));
        res.status(200).json(result).end();
    } catch(e: any) {
        const mes = new resMessage(e.message);
        res.status(400).json(mes).end();
    }

})

//トークルームの登録
router.post("/", async(req: express.Request, res: express.Response) => { 
    
    if (req.body.name === undefined) {
        const mes = new resMessage("ルーム名が入力されていません");
        res.status(400).json(mes).end();
        return;
    }

    //#region トークルームの登録
    try {
        const resR: Room = await registerRoom(req.body.name);
        res.status(200).json(resR).end();
    } catch(e: any) {
        const mes = new resMessage(e.message);
        res.status(400).json(mes).end();
    }
    //#endregion
})

//ルームメンバーの登録
router.post("/members", async (req: express.Request, res: express.Response) => {
    
    if (req.body.id === undefined) {
        const mes = new resMessage("ルームIDが入力されていません");
        res.status(400).json(mes).end();
        return;
    }
    if (req.body.employeeCode1 === undefined) {
        const mes = new resMessage("担当者コードが入力されていません");
        res.status(400).json(mes).end();
        return;
    }

    try {
        // RoomMember型の配列の定義
        let roomMembers: RoomMember[] = [];
        //req.bodyから値を取り出す
        for( const key in req.body) {
            if (Object.hasOwnProperty.call(req.body, key)) {
                if (key === "roomId") continue;
                if (!key.includes("employeeCode")) continue;
                const value = req.body[key];
                console.log(`${key}: ${value}`);
                const member:RoomMember = await registerMember(value, req.body.id);
                roomMembers.push(member);
            }
        }
        res.status(200).json(roomMembers).end();
    } catch (e: any) {
        res.status(400).send(e.message).end();
    }
    res.end();
})

export default router ;