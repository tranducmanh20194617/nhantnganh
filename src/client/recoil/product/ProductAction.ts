import {useState} from "react";
import {initialState, T_ProductState} from "@/client/recoil/product/ProductState";
import {E_SendingStatus} from "@/client/const/Types";
import {AxiosClient} from "@/client/repositories/AxiosClient";
import {App} from "@/client/const/App";
import {ProductModel} from "@/client/model/ProductModel";

export const ProductAction = () => {
    const [state, setState] = useState<T_ProductState>(initialState)

    const onGetProducts = () => {
        setState({
            ...state,
            isLoading: E_SendingStatus.loading
        })
        AxiosClient
            .get(`${App.ApiUrl}/admin.php?route=product/product_list&page=2 `)
            .then(r => {
                // console.log('r', r)
                if (r.success) {
                    if (r.items) {
                        setState({
                            ...state,
                            isLoading: E_SendingStatus.success,
                            //lưu dữ liệu vào state.items là 1 mảng là các phần từ có kiểu ProductModel
                            items: r.items.map((v: Record<string, any>) => new ProductModel(v))
                        })
                        console.log(state.items[3].raw)
                    }

                } else if (r.error) {
                    setState({
                        ...state,
                        isLoading: E_SendingStatus.error,
                        error: r.error
                    })
                }
            })
            .catch(e => {
                console.error(e)
            })
    }

    const onAddProduct = (data: Record<string, any>) => {
        //
    }

    const onEditProduct = (id: number, data: Record<string, any>) => {
        //
    }

    const onDeleteProduct = (id: number) => {
        //
    }

    return {
        vm: state,
        onGetProducts,
        onAddProduct,
        onEditProduct,
        onDeleteProduct
    }
}