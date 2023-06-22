import {Outlet, useLocation, useNavigate} from "react-router";
import {Button, Col, Avatar, Row, Menu, message,} from "antd";
import React from "react";
import {useSessionContext} from "@/client/presentation/contexts/SessionContext";
import {StoreConfig} from "@/client/config/StoreConfig";
import {useState,useEffect} from "react";

import {
    MenuUnfoldOutlined,
    UserOutlined,
    FacebookOutlined,
    InstagramOutlined ,
    TwitterOutlined,
    SlackOutlined,
    CaretRightOutlined

} from '@ant-design/icons';
import {theme } from 'antd';
import {useParams} from "react-router-dom";
const menuItems = [

    {
        key: '1',
        label: 'バイクリスト',
    },
    {
        key: '2',
        label: 'オーダーリスト',
    },
]
export const AdminLayout = () => {
    const navigate = useNavigate()
    const [session, setSession] = useSessionContext()
    const storeConfig = StoreConfig.getInstance()
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const location =useLocation()

    // console.log(storeConfig.token)
    // useEffect(() => {
    //     if (storeConfig.token !== undefined) {
    //         setIsLoggedIn(true);
    //     } else {
    //         setIsLoggedIn(false);
    //     }
    // }, [storeConfig.token]);
    // useEffect(() => {
    //     const storedToken = localStorage.getItem('user');
    //
    //     if (storedToken) {
    //         // Có token trong localStorage
    //         storeConfig.token = storedToken;
    //         setIsLoggedIn(true);
    //     } else {
    //         // Không có token trong localStorage
    //         storeConfig.token = undefined;
    //         setIsLoggedIn(false);
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);
    const onLogout = () => {
        localStorage.removeItem('user')
        //set token
        storeConfig.token = undefined

        //set lại trạng
        setSession({
            isAuthenticated: false,
            redirectPath: '/',
            user: undefined
        })
        navigate('/')
        console.log('LogOut')
        setIsLoggedIn(false);

        message.success('ログアウトしました').then()
    }

    const onLogin =()=>{
        navigate('/login')
    }
    const [collapsed, setCollapsed] = useState(true);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const onMenuClick =(key:string) =>{
        if(key==='1')
        {
            setSelectedItem('1')
            navigate('/adminBikeList')
            console.log('click menu',key)
        }

        else if(key==='2')
        {
            setSelectedItem('2')
            console.log('click menu',key)
            navigate('/adminOrderList')
        }
    }
    const [selectedItem, setSelectedItem] = useState('1');
    const {adminOrderId} =useParams()
  useEffect(()=>{
      if(location.pathname==='/adminOrderList')
      { setSelectedItem('2')

      }
      else if(location.pathname===`/adminOrderDetail/${adminOrderId}`)
      {
          setSelectedItem('2')
      }
  },[])
    const menuItemClickStyle = {
        backgroundColor: '#cfb7a1',
        color: '#333',
    };

    const selectedMenuItemStyle = {
        ...menuItemClickStyle,
        backgroundColor: 'white',
        color: '#333',
    };
    return (

        <>
            <div style = {{   backgroundColor : '#fdfaf5' }}>
                <Row style={{border:'1px solid',borderRadius: '20px',padding:'15px',backgroundColor:'#cfb7a1'}}>
                    <Col md={20} style={{display:"inline-block"}}>
                        <div className="row-container" >
                            <div className="demo-logo" />
                            <MenuUnfoldOutlined style={{ padding: '5px', fontSize: '20px', verticalAlign: 'middle' }} />
                            <span style={{ marginLeft: '25px', marginRight: '25px', display: 'inline-block', verticalAlign: 'middle' }}  ><b >バイク 借り</b></span>
                            <Button style={{backgroundColor:'#cfb7a1',border:'2px solid',marginRight:'10px',paddingBottom:'33px',paddingTop:'10px',pointerEvents:'none'}}><b>アドミン</b></Button>
                            <CaretRightOutlined  style={{marginRight:'7px'}}/>
                            <Menu
                                theme="dark"
                                mode="horizontal"
                                items={menuItems.map(item => ({
                                    key: item.key,
                                    label: item.label,
                                    style: selectedItem === item.key ? selectedMenuItemStyle : menuItemClickStyle,
                                    onClick: () => onMenuClick(item.key)
                                }))}
                                style={{ backgroundColor: '#cfb7a1', color: '#333', display: 'inline-block',width:'70%' }}
                            >
                            </Menu>

                        </div>
                    </Col>
                    <Col md={4}>
                        <Avatar size={"default"} icon={<UserOutlined/>} style={{marginRight:'10px'}}></Avatar>
                        {isLoggedIn ? (
                            <Button onClick={onLogout} style={{ marginTop: "12px" }}>
                                ログアウト
                            </Button>
                        ) : (
                            <Button onClick={onLogin} style={{ marginTop: "12px" }}>
                                ログイン
                            </Button>
                        )}
                    </Col>
                </Row>

                <Outlet/>

                <Row style={{border:'1px solid',borderRadius: '20px',padding:'15px',backgroundColor:'#cfb7a1'}}>
                    <Col md={17}>
                        <p style={{marginLeft:'25px',marginRight:'25px',fontSize:'15px'}}>バイク 借り</p>
                    </Col>
                    <Col md={4} style={{fontSize:'25px',marginTop:'10px'}}>
                        <FacebookOutlined style={{marginRight:'15px'}}/>
                        <InstagramOutlined style={{marginRight:'15px'}}/>
                        <TwitterOutlined style={{marginRight:'15px'}}/>
                        <SlackOutlined style={{marginRight:'15px'}}/>
                    </Col>
                </Row>
            </div>
        </>
    );

}