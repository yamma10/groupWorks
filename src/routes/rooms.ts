import express from 'express';
import { register } from 'ts-node';
import { registerRoom, registerMember, getAllRooms, getRoomById, getUsersByRoomId } from '../controllers/roomsController';
import { resRoom } from '../model/Room';
import { createSelectAllRoomQuery } from '../components/createQuery';

const router = express.Router();

router.get("/", async(req: express.Request, res: express.Response) => {
    const result = await getAllRooms();
    res.send(result);
    res.end();
});

router.get("/:id", async(req: express.Request, res: express.Response) => {
    if (req.params.id === undefined) {
        res.send("idが入力されていません");
        return;
    }

    const result = await getRoomById(Number(req.params.id));
    res.send(result);
})

//ルームのidから、加入しているメンバーを取得する
router.get("/:id/users", async(req: express.Request, res: express.Response) =>  {
    if (req.params.id === undefined) {
        res.send("idが入力されていません");
        return;
    }

    
    const result = await getUsersByRoomId(Number(req.params.id));
    res.send(result);
    res.end();
})

//トークルームの登録
router.post("/", async(req: express.Request, res: express.Response) => { 
    let resMessage = {
        message: ""
    }
    if (req.body.name === undefined) {
        resMessage.message = "トークルーム名が入力されていません";
        res.send(resMessage);
        res.end();
    }

    //#region トークルームの登録
    const resR: resRoom = await registerRoom(req.body.name);
    //#endregion

    res.send(resR);

    res.end();
})

//ルームメンバーの登録
router.post("/members", (req: express.Request, res: express.Response) => {
    let resMessage = {
        message: ""
    }
    if (req.body.id === undefined) {
        resMessage.message = "ルームIDが入力されていません";
        res.send(resMessage);
        res.end();
    }
    if (req.body.employeeCode1 === undefined) {
        resMessage.message = "担当者コードが入力されていません";
        res.send(resMessage);
        res.end();
    }

    //req.bodyから値を取り出す
    for( const key in req.body) {
        if (Object.hasOwnProperty.call(req.body, key)) {
            if (key === "roomId") continue;
            const value = req.body[key];
            console.log(`${key}: ${value}`);
            registerMember(value, req.body.id);
        }
    }



    res.end();
})

export default router ;