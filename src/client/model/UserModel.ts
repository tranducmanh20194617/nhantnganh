export type T_UserLoginVO = {
    email: string
    password: string
}
export type T_UserRegisterVO = {
    email: string
    password: string
    name:string
}

export class UserModel {
    id: string
    username: string
    token: string

    constructor(data: Record<string, any>) {
        this.id = data.data.user_id
        this.username = data.data.name
        this.token = data.data.api_token
    }
}