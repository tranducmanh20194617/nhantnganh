import {useSessionContext} from "@/client/presentation/contexts/SessionContext";
import {useEffect, useState} from "react";
import {Navigate, useLocation} from "react-router";
import {message} from "antd";

type _T_Props = {
    component: any
    props?: any
}

export const PrivateRouter = (props: _T_Props) => {
    const location = useLocation()
    const [session, setSession] = useSessionContext()

    const [isAuth, setIsAuth] = useState<boolean>()

    useEffect(() => {
        setIsAuth(session.isAuthenticated)

        if (!session.isAuthenticated) {
            setSession({
                ...session,
                redirectPath: location.pathname
            })
        }

        // eslint-disable-next-line
    }, [session.isAuthenticated])

    return (
        isAuth === undefined
            ? null
            : isAuth
                ? <props.component {...props.props} />

                :
                    <Navigate to={"/"}/>

    )
}
