import {E_SendingStatus} from "@/client/const/Types";
import {UserModel} from "@/client/model/UserModel";

export type T_LoginState = {
    isLoading: E_SendingStatus,
    item?: UserModel,
    error?: Record<string, any>
}

export const initialState: T_LoginState = {
    isLoading: E_SendingStatus.idle
}