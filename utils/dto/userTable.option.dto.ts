import type { User, UserModel } from "~/server/api/auth/user/user.model";


export interface UserTableOptionDTO{
    title?: string;
    subtitle?:string;
    columns : string[];
    users : User[];
    isLoading : boolean;
    sortList? : ISortItem[];
    actions? : []
}

interface ISortItem{
    id : string;
    name : string
}