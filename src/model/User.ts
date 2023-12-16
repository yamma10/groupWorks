export interface LoginUser {
    employeeCode: string;
    password: number;
}

interface User extends LoginUser {
    phoneNumber: string;
    employeeName: string;
    //部署
    division: string;
    //役職
    position: string;
    //ユーザーが有効かどうか
    flag: number;
}