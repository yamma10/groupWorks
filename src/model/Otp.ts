export class Otp {
    constructor(employeeCode: number, onetimePass: string) {
        this.employeeCode = employeeCode;
        this.onetimePass = onetimePass;
    }
    employeeCode: number;
    onetimePass: string;
}

