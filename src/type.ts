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
    findUser: {
        _id: string,
        name: string,
        email: string,
    },
    message: string
}

export interface ISignupResponse {
    userName: string,
    userEmail: string,
    password: string,
    message: string
    id: number
}