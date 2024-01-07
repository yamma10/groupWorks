
export class Message {
    constructor(roomId: number, employeeCode: number, employeeName: string,  text: string, date: Date) {
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

 