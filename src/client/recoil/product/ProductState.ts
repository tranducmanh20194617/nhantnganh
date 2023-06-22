import {E_SendingStatus} from "@/client/const/Types";
import {ProductModel} from "@/client/model/ProductModel";

export type T_ProductState = {
    isLoading: E_SendingStatus,
    items: ProductModel[],
    error?: Record<string, any>
}

export const initialState: T_ProductState = {
    isLoading: E_SendingStatus.idle,
    items: []
}