import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import {AxiosClient} from "@/client/repositories/AxiosClient";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const contentStyle: React.CSSProperties = {
    marginLeft: '5%',
    width: '40%',
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
const AdminBikeDetailScreen = () => {
    const { bikeId } = useParams();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const GetData = async (opts?: {
        onSuccess?: (data: any) => void
        onError?: (data: any) => void
    }) => {
        AxiosClient
            .get(`http://127.0.0.1:8000/bike/${bikeId}`)
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
       useEffect(()=> {
           console.log('MOUNT: Bike Detail Screen')
               GetData({
                   onSuccess: (data) => {
                       console.log('GetData:onSuccess', data)
                       setBike(data)
                   },
                   onError: (data) => {
                       console.log('GetData:onError', data)
                   }
               })
           // eslint-disable-next-line react-hooks/exhaustive-deps


           return () => {
               console.log('UNMOUNT: Bike Detail Screen')
           }

           // eslint-disable-next-line react-hooks/exhaustive-deps
       },[])
     const imagePath = `/storage/app/public/bike_image/${bikeId}.1.jpg`;
    const imagePath2 = `/storage/app/public/bike_image/${bikeId}.2.jpg`;
    const imagePath3 = `/storage/app/public/bike_image/${bikeId}.3.jpg`;
    return (
        <>
            <div style={{paddingTop:'30px',paddingBottom:'30px'}}>

            <div style={{display:'flex', marginTop:'20px'}}>
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
                        <p style={{marginLeft:'30px', fontSize:'35px', marginTop:'10px', width:'50%'}}><b>{bike.bike_price}￥/時間</b></p>
                    </div>

                    <div style={{...listType}}>
                        <p style={{}}>- 住所: <b>{bike.bike_address}</b></p>
                        <p style={{}}>- ブランド: <b>{bike.bike_brand}</b></p>
                        <p style={{}}>- 容量: <b>{bike.bike_tank}</b></p>
                        <p style={{}}>- 燃費: <b>{bike.bike_consumption}</b></p>
                        <p style={{}}>- ボンベ容量: <b>{bike.bike_capacity}cc</b></p>

                    </div>
                    {/*<div style={checkOut}>*/}
                    {/*    <button style={{marginLeft:'15%', background:'rgb(255, 107, 101)', fontSize:'20px', height:'50px', borderRadius:'10px'}}>カートを入れる</button>*/}
                    {/*    <button style={{marginLeft:'10%', background:'rgb(147, 196, 125)', fontSize:'20px', height:'50px', borderRadius:'10px'}}>すぐレンタル</button>*/}
                    {/*</div>*/}
                </div>
            </div>
            </div>
        </>
    );
};
export default AdminBikeDetailScreen