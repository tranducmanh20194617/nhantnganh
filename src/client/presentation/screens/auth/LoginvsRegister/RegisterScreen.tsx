import {Button, Form, Input, message} from "antd";
import React, {useEffect} from "react";
import {LoginAction} from "@/client/recoil/auth/LoginAction";
import {E_SendingStatus} from "@/client/const/Types";
import {useNavigate} from "react-router";
import {useSessionContext} from "@/client/presentation/contexts/SessionContext";

const LoginScreen = () => {
    const navigate = useNavigate()
    const [session] = useSessionContext()

    const {
        vm,
        dispatchRegister
    } = LoginAction()

    useEffect(() => {
        console.log('MOUNT: Register Screen')

        return () => {
            console.log('UNMOUNT: Register Screen')
        }
    }, [])

    useEffect(() => {
        if (vm.isLoading === E_SendingStatus.success) {
            navigate(session.redirectPath)
            message.success("ログインしました");
        }

        // eslint-disable-next-line
    }, [vm.isLoading,navigate, session.redirectPath])


    const onFinish = (values: any) => {
        const { passwordcheck, ...data } = values;
        console.log(data)
        if(values.password!==values.passwordcheck)
        {
            message.error('パスワードが一致しません')
        }
        else {
            dispatchRegister(data)
        }
        console.log(vm)

    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('onFinishFailed:', errorInfo)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleErrorMessage = () => {
        if (vm.error?.warning) {
            message.error('メールまたはパスワードが間違っています');
        }

    };

    useEffect(() => {
        handleErrorMessage();
    }, [handleErrorMessage, vm.error]);
    const validateEmail = (_: any, value: string) => {
        // Kiểm tra định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || emailRegex.test(value)) {
            return Promise.resolve();
        }
        return Promise.reject('正しい電子メールを入力してください!');
    };
    return (
        <div>
            <div className="row-container" style={{border:'1px solid',borderRadius: '20px',padding:'15px',backgroundColor:'#cfb7a1'}} >
                <div className="demo-logo"  />
                <span style={{ marginLeft: '25px', marginRight: '25px', display: 'inline-block', verticalAlign: 'middle' }}  ><b >バイク 借り</b></span>

            </div>

            <div
                style={
                    {

                        width:"350px",
                        height:"500px",
                        backgroundColor:'#cfb7a1',
                        marginLeft:'38%',
                        marginRight:'36%',
                        marginTop:'65px',
                        flexDirection:'column',
                        borderRadius:"15px"
                    }
                }
            >
                {
                    // (vm.error?.warning) && (
                    //  message.error('sai')
                    // )
                }
                <div style={{
                    textAlign:'center',
                    paddingTop:'50px',
                    fontWeight:'bold',
                    letterSpacing:'2px',
                    fontSize:'20px'


                }}
                >サインアップ</div>

                <Form
                    name="basic"
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    style={{maxWidth: 600,marginTop:'20px',marginLeft:'30px'}}
                    initialValues={{remember: true}}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"

                >
                    <Form.Item
                        name="name"
                        rules={[{required: true, message: 'ユーザー名を入力してください'},]}
                        style={{width:'430px',height:'30px'}}

                    >
                        <Input placeholder="ユーザー名"></Input>
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[{required: true, message: 'メールを入力してください'},  { validator: validateEmail },]}
                        style={{width:'430px',height:'30px'}}


                    >
                        <Input placeholder="メールアドレス"></Input>
                    </Form.Item>


                    <Form.Item

                        name="password"
                        rules={[{required: true, message: 'パスワードを入力してください!'}]}
                        style={{width:'430px',height:'30px'}}
                    >
                        <Input.Password placeholder="パスワード"></Input.Password>
                    </Form.Item>

                    <Form.Item

                        name="passwordcheck"
                        rules={[{required: true, message: 'パスワードを入力してください!'}]}
                        style={{width:'430px',height:'30px'}}
                    >
                        <Input.Password placeholder="パスワードを認証する"></Input.Password>
                    </Form.Item>


                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={vm.isLoading === E_SendingStatus.loading}
                            style={{ backgroundColor:'white',color:'black',width:'200px',marginLeft:'43px',marginTop:'25px'}}

                        >
                            サインアップ
                        </Button>
                    </Form.Item>
                </Form>
                <div style={{ width:'80%',
                    height:'1px',backgroundColor:'black', marginLeft:'10%' , opacity:'0.1',marginTop:'20px'}}>
                </div>
                <p style={{textAlign:'center', lineHeight:'0px',  fontWeight:'bold', marginTop:'0px', fontSize:'10px'}}>または次の方法でサインインします</p>
                <Form.Item wrapperCol={{offset: 8, span: 16}} style={{float:'left',
                    placeItems: 'start',marginTop:'10px'}}>
                    <Button
                        style={{width:'140px', height:'35px',marginLeft:'-15px'}}

                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            alt="gg login"
                            src={`/storage/app/public/login/google.jpg`}
                            style={{width:'140px',height:'35px', marginTop:'-4px', marginLeft:'-16px', borderRadius:'5px'}}
                        />
                    </Button>
                </Form.Item>
                <Form.Item wrapperCol={{offset: 8, span: 16}} style={{marginRight:'65px',display: 'grid',
                    placeItems: 'end',marginTop:'20px'}}>
                    <Button
                        style={{width:'140px', height:'35px'}}

                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            alt="gg login"
                            src={`/storage/app/public/login/fb.jpg`}
                            style={{width:'140px',height:'35px', marginTop:'-4px', marginLeft:'-16px', borderRadius:'5px'}}
                        />
                    </Button>
                </Form.Item>

            </div>
            <div style={{width:'100%', height:'70px', borderRadius:'15px', backgroundColor:'#cfb7a1', marginRight:'5%', marginTop:'60px'}}>

            </div>
        </div>
    )
}

export default LoginScreen
