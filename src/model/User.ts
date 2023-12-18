export interface LoginUser {
    account: string;
    password: number;
}

interface User extends LoginUser {
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

interface ResponseUser extends LoginUser {
    employeeCode: number;
    employeeName: string;
    ontimePass: string;
}