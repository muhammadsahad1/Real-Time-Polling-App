export interface ILoginRequest {
    userEmail: string,
    password: string
}

export interface ISignupRequest {
    userName: string,
    userEmail: string,
    password: string
}

export interface ILoginResponse {
    token: string,
    userId: number,
    userName: string,
    message : string
}

export interface ISignupResponse {
    userName: string,
    userEmail: string,
    password: string,
    message: string
}