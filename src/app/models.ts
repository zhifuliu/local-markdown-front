export = models;

module models {
    export interface returnMsg {
        errCode: number,
        err: any | UserMsg
    }

    export interface UserMsg {
        user: string,
        nickname: string
    }
}
