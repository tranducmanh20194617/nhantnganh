import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {UserModel} from "@/client/model/UserModel";
import {StoreConfig} from "@/client/config/StoreConfig";

type _T_SessionState = {
    isAuthenticated?: boolean
    redirectPath: string
    user?: UserModel
}

export const initialSession: _T_SessionState = {
    redirectPath: '/'
}
export const SessionContent = createContext<[_T_SessionState, (session: _T_SessionState) => void]>([initialSession, () => {
    //
}])

export const useSessionContext = () => useContext(SessionContent)

export const SessionContextProvider = (props: {
    children: ReactNode
}) => {
    const [sessionState, setSessionState] = useState<_T_SessionState>(initialSession)
    const defaultSessionContext: [_T_SessionState, typeof setSessionState] = [sessionState, setSessionState]

    useEffect(() => {
        const lsUser = localStorage.getItem('user')

        if (lsUser) {
            const user = new UserModel(JSON.parse(lsUser))
            setSessionState({
                ...sessionState,
                isAuthenticated: true,
                user: user,
                redirectPath: '/'
            })

            StoreConfig.getInstance().token = user.token
            console.log(StoreConfig.getInstance().token)

        } else {
            setSessionState({
                ...sessionState,
                isAuthenticated: false
            })
        }

        // eslint-disable-next-line
    }, [])

    return (
        <SessionContent.Provider value={defaultSessionContext}>
            {props.children}
        </SessionContent.Provider>
    )
}