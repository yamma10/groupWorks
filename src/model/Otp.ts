export interface Otp {
    employeeCode: number;
    onetimePass: string;
}

export interface resOtp extends Otp {
    message: string;
}