import {Alert, Button, Checkbox, Form, Input} from "antd";
import {useEffect} from "react";
import {LoginAction} from "@/client/recoil/auth/LoginAction";
import {E_SendingStatus} from "@/client/const/Types";
import {useNavigate} from "react-router";
import {useSessionContext} from "@/client/presentation/contexts/SessionContext";

const LoginScreen = () => {
    const navigate = useNavigate()
    const [session] = useSessionContext()

    const {
        vm,
        dispatchLogin
    } = LoginAction()

    useEffect(() => {
        console.log('MOUNT: LoginScreen')

        return () => {
            console.log('UNMOUNT: LoginScreen')
        }
    }, [])

    useEffect(() => {
        if (vm.isLoading === E_SendingStatus.success) {
            navigate(session.redirectPath)
        }

        // eslint-disable-next-line
    }, [vm.isLoading])

    const onFinish = (values: any) => {
        console.log('onFinish:', values)
        dispatchLogin(values)

    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('onFinishFailed:', errorInfo)
    }

    return (
        <div>
            {
                (vm.error?.warning) && (
                    <Alert message={vm.error.warning} type="error" />
                )
            }
            <Form
                name="basic"
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                style={{maxWidth: 600}}
                initialValues={{remember: true}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Username"
                    name="email"
                    rules={[{required: true, message: 'Please input your username!'}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{required: true, message: 'Please input your password!'}]}
                >
                    <Input.Password/>
                </Form.Item>



                <Form.Item wrapperCol={{offset: 8, span: 16}}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={vm.isLoading === E_SendingStatus.loading}
                    >
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default LoginScreen