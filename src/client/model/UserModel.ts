export type T_UserLoginVO = {
    email: string
    password: string
}

export class UserModel {
    // id: string
    // username: string
    token: string

    constructor(data: Record<string, any>) {
        // this.id = data.user_id
        // this.username = data.name
        this.token = data.access_token
    }
}