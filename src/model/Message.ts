
export interface Message {
    roomId: number;
    employeeCode: number;
    text: string;
    date: Date;
}

export interface resMessage extends Message {
    message: string;
}