import {T_UserLoginVO, T_UserRegisterVO, UserModel} from "@/client/model/UserModel";
import {useState} from "react";
import {initialState, T_LoginState} from "@/client/recoil/auth/LoginState";
import {E_SendingStatus} from "@/client/const/Types";
import {AxiosClient} from "@/client/repositories/AxiosClient";
import {App} from "@/client/const/App";
import {useSessionContext} from "@/client/presentation/contexts/SessionContext";
import {StoreConfig} from "@/client/config/StoreConfig";
import {message} from "antd";
import axios from 'axios';
import {useNavigate} from "react-router";
export const LoginAction = () => {
    const navigate = useNavigate()
    const [state, setState] = useState<T_LoginState>(initialState)

    const [session, setSession] = useSessionContext()

    const dispatchLogin = (data: T_UserLoginVO) => {
        setState({
            ...state,
            isLoading: E_SendingStatus.loading
        })

        AxiosClient
            .post(`${App.ApiUrl}/login`, data
                // .post(`http://222.252.10.203:30100/admin.php?route=auth/login`, data
            )
            .then(r => {
                if (r.data.success) {
                    const user = new UserModel(r)
                    setState({
                        ...state,
                        isLoading: E_SendingStatus.success,
                        item: user
                    })
                    if (r.data.classifical === '4') {

                        setSession({
                            ...session,
                            isAuthenticated: true,
                            user: user,
                            redirectPath: '/'
                        })
                    } else {
                        setSession({
                            ...session,
                            isAuthenticated: true,
                            user: user,
                            redirectPath: '/adminBikeList'
                        })

                    }
                    StoreConfig.getInstance().token = user.token
                    console.log(user.token)
                    console.log(r.data)
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
                message.error('メールまたはパスワードが間違っています')
            })
    }

    const dispatchResetState = () => {
        setState({
            ...initialState
        })
    }
    const dispatchRegister = (data: any) => {
        setState({
            ...state,
            isLoading: E_SendingStatus.loading
        })
        axios.post(`${App.ApiUrl}/register`, data)
            .then(res => {
                console.log(res);
                navigate('/login')
               message.success("正常に登録しました")

            })
            .catch(e => {
                console.log(e)
                setState({
                    ...state,
                    isLoading: E_SendingStatus.error
                })
                message.error('正常に登録しません');
                // message.error('メールまたはパスワードが間違っています')
            })
    }
        return {
            vm: state,
            dispatchLogin,
            dispatchRegister
        }
    }