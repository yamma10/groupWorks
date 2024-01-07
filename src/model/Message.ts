
export class Message {
    constructor(roomId: number, employeeCode: number, text: string, date: Date) {
        this.roomId = roomId;
        this.employeeCode = employeeCode;
        this.text = text;
        this.date = date;
    }
    roomId: number;
    employeeCode: number;
    text: string;
    date: Date;
}

 