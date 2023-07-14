import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {AxiosClient} from "@/client/repositories/AxiosClient";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Button, Space } from 'antd';
import {StoreConfig} from "@/client/config/StoreConfig";
import {message} from "antd";
import {App} from "@/client/const/App";
const contentStyle: React.CSSProperties = {
    marginLeft: '5%',
    width: '50%',
    height: '600px',
    color: '#fff',
    background: 'rgb(132, 115, 94)',
    borderRadius: '10px',
    marginRight:'5%',
};

const listType: React.CSSProperties = {
    listStyleType:'- ',
    marginLeft: '40px',
    fontSize:'20px',
};

const checkOut: React.CSSProperties = {
    display: 'flex',
    alignItems:'center',
    paddingBottom:'100px',
};
const BikeDetailScreen = () => {
    const { bikeId } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const GetData = async (opts?: {
        onSuccess?: (data: any) => void
        onError?: (data: any) => void
    }) => {
        AxiosClient
            .get(`${App.ApiUrl}/bike/${bikeId}`)
            .then(r => {
                console.log(r)
                const dataCopy ={...r.items}
                localStorage.setItem('bike', JSON.stringify(dataCopy))
                if (opts?.onSuccess) {
                    opts.onSuccess(dataCopy)

                } else if (r.error) {
                    if (opts?.onError) {
                        opts.onError(r.error)
                    }
                }

            })
            .catch(e => {
                console.log(e)
            })
    }

    const [bike,setBike] = useState(() =>
    {
        try {
            const lsItem = localStorage.getItem('bike')

            if (lsItem) {
                return JSON.parse(lsItem)
            }
        } catch (e) {
            console.error(e)
        }
        return []
    })

    const [user,setUser] = useState(() =>
    {
        try {
            const lsItem = localStorage.getItem('user')

            if (lsItem) {
                return JSON.parse(lsItem)
            }
        } catch (e) {
            console.error(e)
        }
        return []
    })
    let imagePath
    let imagePath2
    let imagePath3
    if(bike.length!==0)
    {
        imagePath = `${App.ApiUrl}${bike.bikeImage?.[0]?.bike_image}`;
        // eslint-disable-next-line react-hooks/exhaustive-deps
        imagePath2 = `${App.ApiUrl}${bike.bikeImage?.[1]?.bike_image}`;
        // eslint-disable-next-line react-hooks/exhaustive-deps
        imagePath3 = `${App.ApiUrl}${bike.bikeImage?.[2]?.bike_image}`;
    }
    useEffect(()=> {
           setIsLoading(true);
           console.log('MOUNT: Bike Detail Screen')
               GetData({
                   onSuccess: (data) => {
                       console.log('GetData:onSuccess', data)
                       setBike(data)
                       setIsLoading(false);

                   },
                   onError: (data) => {
                       console.log('GetData:onError', data)
                       setIsLoading(false);
                   }
               })
           // eslint-disable-next-line react-hooks/exhaustive-deps

           return () => {
               console.log('UNMOUNT: Bike Detail Screen')
           }

           // eslint-disable-next-line react-hooks/exhaustive-deps
       },[bikeId])

    const [userOrderList,setUserOrderList] =useState(() =>{
        try {
            const lsItem = localStorage.getItem('bikeInOrder')
            if (lsItem) {
                return JSON.parse(lsItem)
            }
        } catch (e) {
            console.error(e)
        }
        return []
    })
    const handleBack=()=>{
        navigate(-1)
    }
    const handleOrderDetail1 = async () =>{
        if(user.length!==0) {
            const isDuplicate = userOrderList.some((item: any) => item.bike_id === bike.bike_id);
            if (!isDuplicate) {
                const dataCopy = [...userOrderList, bike];
                await localStorage.setItem('bikeInOrder', JSON.stringify(dataCopy));
                message.success('データが保存されました')
            }

        }
        else {
            message.info('ログインしてください');
        }
    }
    const handleOrderDetail2 = async () =>{
      if(user.length!==0) {
              const isDuplicate = userOrderList.some((item: any) => item.bike_id === bike.bike_id);
             if (!isDuplicate) {
                 const dataCopy = [...userOrderList, bike];
                 await localStorage.setItem('bikeInOrder', JSON.stringify(dataCopy));
                 console.log(dataCopy);
                 message.success('データが保存されました')
             }

             navigate('/userOrderCreate')
      }
      else {
          message.info('ログインしてください');
      }
    }

    return (
        <>
            {isLoading ? (
                <div style={{
                    minHeight:'800px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems:'center',
                    height: '550px',
                    textAlign: 'center',
                    fontSize: '25px',
                    marginBottom: '100px'}}>
                    <p>Loading...</p>
                </div>
            ) : (
            <div style={{paddingTop:'30px',paddingBottom:'30px',display:'flex'}}>
            <div>
                <Button  style={{marginLeft:'20px',marginTop:'-20px',marginRight:'-60px'}} onClick={()=>handleBack()}>戻ってくる</Button>
            </div>
            <div style={{display:'flex', marginTop:'20px', minWidth:'1400px'}}>
                <div style={{marginLeft:'12%', width:'35%', height:'300px'}}>
                    <Carousel>
                        <div>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img

                                alt="example1"
                                src={imagePath}/>

                        </div>
                        <div >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                alt="example2"
                                src={imagePath2}/>
                        </div>
                        <div>
                            {/* eslint-disable-next-line jsx-a11y/alt-text,@next/next/no-img-element */}
                            <img
                                alt="example3"
                                src={imagePath3}/>
                        </div>
                    </Carousel>
                </div>

                <div style={contentStyle}>
                    <p style={{background:'rgb(0, 195, 177)', width:'100px', marginLeft:'20px', textAlign:'center', borderRadius:'10px', color:'black'}}>在庫あり</p>
                    <div style={{display:'flex', color:'white'}}>
                        <p style={{marginLeft:'30px', fontSize:'30px', marginTop:'15px', width:'50%'}}><b>{bike.bike_name}</b></p>
                        <p style={{marginLeft:'30px', fontSize:'35px', marginTop:'10px', width:'50%'}}><b>{bike.bike_price}VND/時間</b></p>
                    </div>

                    <div style={{...listType}}>
                        <p style={{}}>- 住所: <b>{bike.bike_address}</b></p>
                        <p style={{}}>- ブランド: <b>{bike.bike_brand}</b></p>
                        <p style={{}}>- 容量: <b>{bike.bike_tank}l</b></p>
                        <p style={{}}>- 燃費: <b>{bike.bike_consumption}</b></p>
                        <p style={{}}>- ボンベ容量: <b>{bike.bike_capacity}cc</b></p>

                    </div>
                    <div style={checkOut}>
                        <button onClick={handleOrderDetail1} style={{marginLeft:'25%', background:'rgb(255, 107, 101)', fontSize:'20px', height:'50px', borderRadius:'10px'}}>カートを入れる</button>
                        <button onClick={handleOrderDetail2} style={{marginLeft:'10%', background:'rgb(147, 196, 125)', fontSize:'20px', height:'50px', borderRadius:'10px'}}>すぐレンタル</button>
                    </div>
                </div>
            </div>
            </div>
            )}
        </>
    );
};
export default BikeDetailScreen