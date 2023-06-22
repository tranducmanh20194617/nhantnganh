import React, {useEffect, useState} from "react";
import {Form, Input, message} from "antd";
import {useNavigate} from "react-router-dom";
import {AxiosClient} from "@/client/repositories/AxiosClient";

const HomeScreen = () => {
    const navigate = useNavigate();
    useEffect(() => {
        console.log('MOUNT: HomeScreen')

        return () => {
            console.log('UNMOUNT: HomeScreen')
        }

    }, [])
    const getData =(value:any) =>{
        AxiosClient
            .get(`http://127.0.0.1:8000/bikes?&local=${value}`)
            .then(r => {
                console.log(value)
                navigate(`/searchBike/${value}`)
            })
            .catch(e => {
                console.log(e)
                message.error('住所を入力してください').then()

            })
    }

    // const onGetMe = () => {
    //     AxiosClient
    //         .get(`${App.ApiUrl}/admin.php?route=account/me`)
    //         .then(r => {
    //             console.log('oke', r)
    //         })
    //         .catch(e => {
    //             console.log('err', e)
    //         })
    // }
    const [inputValue, setInputValue] = useState('');
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        // Xử lý giá trị đã nhập ở đây, ví dụ:
        if(inputValue.length===0)
        {
            message.error('住所を入力してください').then();
        }
        else {
            getData(inputValue)
        }}

    return (
        <div style = {{backgroundColor : '#fdfaf5'  , height : '720px' , width:'100%'}}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img style={{ imageRendering:'pixelated', height:'300px', float:'right', marginRight:'100px',marginTop:'130px' }} src="https://znews-photo.zadn.vn/w1024/Uploaded/lce_cjvcc/2019_04_27/DiPhuot_20.jpg" alt="xe may" />
            <h1 style={{ paddingTop: ' 130px' ,margin:'0px 150px 0px' , fontSize:'300%', color:'#7c4a15', lineHeight:'75px'}}>バイクを借りる<br/>
                旅行をする</h1>
            <h3 style={{ marginLeft:'150px' , fontSize:'150%^', color:'#7c4a15', lineHeight:'40px'}}>最寄りのエリアであなたの旅に最適<br/>なレンタルバイクを見つけます。</h3>

            <Input placeholder="住所を入力してください"
                   style={{marginLeft:'150px', position: '-webkit-sticky', top: 0,border: '1px solid #C38154 ',height:'40px' , width: '300px',  borderRadius:'15px/15px' }}
                   value={inputValue}
                   onChange={handleInputChange}
                   onKeyDown={handleKeyDown}
            />
        </div>

    )
}

export default HomeScreen