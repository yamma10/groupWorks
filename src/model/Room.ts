export interface Room  {
    id: number;
    name: string;
}

export interface resRoom extends Room {
    message: string;
}

export interface RoomMember {
    employeeCode: number;
    roomId: number;
}

export interface resRoomMember extends RoomMember {
    message: string;
}