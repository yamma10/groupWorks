export class Room  {
    constructor(id: number, name: string) {   
        this.id = id;
        this.name = name;
    }
    id: number;
    name: string;
}

export class RoomMember {
    constructor(employeeCode: number, roomId: number) {
        this.employeeCode = employeeCode;
        this.roomId = roomId;
    }
    employeeCode: number;
    roomId: number;
}
