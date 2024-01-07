export class Room  {
    constructor(id: number, name: string) {   
        this.id = id;
        this.name = name;
    }
    id: number;
    name: string;
}

export class resRoom extends Room {
    constructor(id: number, name: string, message: string) {
        super(id, name);
        this.message = message;
    }
    message: string;
}

export class RoomMember {
    constructor(employeeCode: number, roomId: number) {
        this.employeeCode = employeeCode;
        this.roomId = roomId;
    }
    employeeCode: number;
    roomId: number;
}

export class resRoomMember extends RoomMember {
    constructor(employeeCode: number, roomId: number, message: string) {
        super(employeeCode, roomId);
        this.message = message;
    }
    message: string;
}