export interface LoginUser {
    account: string;
    password: number;
}

export interface User extends LoginUser {
    employeeCode: number;
    phoneNumber: string;
    employeeName: string;
    //部署
    division: string;
    //役職
    position: string;
    //ユーザーが有効かどうか
    flag: number;
}

export interface ResponseUser  {
    employeeCode: number;
    employeeName: string;
    message: string;
}