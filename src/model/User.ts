export class LoginUser {
    constructor(account: string, password: number) {
        this.account = account;
        this.password = password;
    }
    account: string;
    password: number;
}

export class User  {
    constructor(employeeCode: number, employeeName: string, division: string, position: string, flag: number) {   
        this.employeeCode = employeeCode;
        this.employeeName = employeeName;
        this.division = division;
        this.position = position;
        this.flag = flag;
    }
    employeeCode: number;
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