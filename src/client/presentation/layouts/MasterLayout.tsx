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

} from '@ant-design/icons';
import {theme } from 'antd';
import {useParams} from "react-router-dom";
const menuItems = [
    {
        key: '1',
        label: 'ホーム',
    },
    {
        key: '2',
        label: 'オーダー',
    },

]
const loggedInMenuItems = [
    ...menuItems,
    {
        key: "3",
        label: "オーダー履歴",
    },
];
export const MasterLayout = () => {
    const location =useLocation()
    const {keyword } = useParams();
    let {keyword2,keyword3} = useParams();
    const {bikeId,orderId} =useParams()
    const navigate = useNavigate()
    const [session, setSession] = useSessionContext()
    const storeConfig = StoreConfig.getInstance()
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    // console.log(storeConfig.token)
    useEffect(() => {
        console.log(storeConfig.token)
        if (storeConfig.token !== undefined) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [storeConfig.token]);
    useEffect(()=>{
        if(location.pathname==='/bikeList')
        {
            setSelectedItem('1')
        }
            else if(location.pathname==='/userOrderCreate')
            {
                setSelectedItem('2')
            }
         if(location.pathname===`/searchBike/${keyword}`)
        {
            setSelectedItem('1')


        }
            if(location.pathname===`/searchBike/${keyword}/${keyword2}`)
            {
                setSelectedItem('1')

            }
            if(location.pathname===`/searchBike/${keyword}/${keyword2}/${keyword3}`)
            {
                setSelectedItem('1')

            }
            if(location.pathname===`/bikeDetail/${bikeId}`)
            {
                setSelectedItem('1')

            }
            if(location.pathname===`/userOrderList`)
            {
                setSelectedItem('3')

            }
            if(location.pathname===`/userOrderDetail/${orderId}`)
            {
                setSelectedItem('3')

            }
            if(location.pathname===`/`)
            {
                setSelectedItem('1')

            }
        }
    ,[location])
    useEffect(() => {
        const storedToken = localStorage.getItem('user');
        if (storedToken) {
            // Có token trong localStorage
            setIsLoggedIn(true);
        } else {
            // Không có token trong localStorage
            setIsLoggedIn(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
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
            navigate(`/bikeList`);
        }
        else if(key==='2')
        {
            setSelectedItem('2')
            navigate('/userOrderCreate')

        }
        else if(key==='3')
        {
            setSelectedItem('3')
            navigate('/userOrderList')

        }
    }
    // const handleClickHome =()=>{
    //     navigate(`/`);
    //     setSelectedItem('1')
    // }

    const [selectedItem, setSelectedItem] = useState('1');
    const menuItemsToRender = isLoggedIn ? loggedInMenuItems : menuItems;
    const menuItemClickStyle = {
        backgroundColor: '#cfb7a1',
        color: '#333',
    };

    const selectedMenuItemStyle = {
        ...menuItemClickStyle,
        backgroundColor: 'white',
        color: '#333',
    };
    const handleHome =()=>{
        navigate('/')
    }
    return (

        <>
            <div style = {{   backgroundColor : '#fdfaf5' }}>
           <Row style={{border:'1px solid',borderRadius: '20px',padding:'15px',backgroundColor:'#cfb7a1'}}>
               <Col md={21} style={{display:"inline-block"}}>
                   <div className="row-container" >
                       <div className="demo-logo" />
                       <MenuUnfoldOutlined style={{ padding: '5px', fontSize: '20px', verticalAlign: 'middle' }} onClick={handleHome} />
                       <span style={{ marginLeft: '25px', marginRight: '25px', display: 'inline-block', verticalAlign: 'middle' }}  ><b onClick={handleHome}>バイク 借り</b></span>
                       <Menu
                           theme="dark"
                           mode="horizontal"
                           items={menuItemsToRender.map(item => ({
                               key: item.key,
                               label: item.label,
                               style: selectedItem === item.key ? selectedMenuItemStyle : menuItemClickStyle,
                               onClick: () => onMenuClick(item.key)
                           }))}
                           style={{ backgroundColor: '#cfb7a1', color: '#333', display: 'inline-block',width:'83%' }}
                       >

                       </Menu>

                       </div>
               </Col>
            <Col md={3}>
                <Avatar size={"default"} icon={<UserOutlined/>} style={{marginRight:'10px'}}></Avatar>
                {isLoggedIn ? (
                    <Button onClick={onLogout} style={{ marginTop: "12px" }}>
                        サインアウト
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