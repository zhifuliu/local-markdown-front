export = models;

module models {
    export interface returnMsg {
        errCode: number,
        errMsg: string,
        data?: UserMsg
    }

    export interface UserMsg {
        user: string,
        nickname: string
    }
}
