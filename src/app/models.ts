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
        lastUpdateTime: string,
        isGit: boolean
    }
    export interface projectData {
        errCode: number,
        errMsg: string,
        data?: Array<treeItem>
    }
    export interface treeItem {
        path: string,
        file?: string,
        children?: Array<treeItem>
    }
    export interface treeItemObservable {
        path?: KnockoutObservable<string>,
        file?: KnockoutObservable<string>,
        children?: Array<treeItemObservable>
    }
}
