import {T_UserLoginVO, UserModel} from "@/client/model/UserModel";
import {useState} from "react";
import {initialState, T_LoginState} from "@/client/recoil/auth/LoginState";
import {E_SendingStatus} from "@/client/const/Types";
import {AxiosClient} from "@/client/repositories/AxiosClient";
import {App} from "@/client/const/App";
import {useSessionContext} from "@/client/presentation/contexts/SessionContext";

export const LoginAction = () => {
    const [state, setState] = useState<T_LoginState>(initialState)

    const [session, setSession] = useSessionContext()

    const dispatchLogin = (data: T_UserLoginVO) => {
        setState({
            ...state,
            isLoading: E_SendingStatus.loading
        })
        AxiosClient
            .post(`${App.ApiUrl}/login`, data

            )
            .then(r => {
                if (r.success) {
                    const user = new UserModel(r)
                    setState({
                        ...state,
                        isLoading: E_SendingStatus.success,
                        item: user
                    })
                    setSession({
                        ...session,
                        isAuthenticated: true,
                        user: user,
                        redirectPath:'/'
                    })

                    localStorage.setItem('user', JSON.stringify(r))
                } else {
                    setState({
                        ...state,
                        isLoading: E_SendingStatus.error,
                        error: r.error
                    })
                }
            })
            .catch(e => {
                console.log(e)

                setState({
                    ...state,
                    isLoading: E_SendingStatus.error
                })
            })
    }

    const dispatchResetState = () => {
        setState({
            ...initialState
        })
    }

    return {
        vm: state,
        dispatchLogin
    }
}