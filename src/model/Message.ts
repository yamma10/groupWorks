
export class Message {
    constructor(roomId: number, employeeCode: number, employeeName: string,  text: string, date: Date = new Date()) {
        this.roomId = roomId;
        this.employeeCode = employeeCode;
        this.employeeName = employeeName;
        this.text = text;
        this.date = date;
    }
    roomId: number;
    employeeCode: number;
    employeeName: string;
    text: string;
    date: Date;
}

export class resMessage {
    constructor(message:string) {
        this.message = message;
    }
    message: string;
}
 