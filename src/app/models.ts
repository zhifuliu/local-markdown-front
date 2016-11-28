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

    export interface projectList {
        list: Array<projectItem>
    }
    export interface projectItem {
        name: string,
        url: string,
        lastUpdateTime: string
    }
}
