import type { UserModel } from "~/server/api/user/model/user.model";


export interface UserTableOptionDTO{
    title?: string;
    subtitle?:string;
    columns : string[];
    users : UserModel[];
    isLoading : boolean;
    sortList? : ISortItem[];
    actions? : []
}

interface ISortItem{
    id : string;
    name : string
}