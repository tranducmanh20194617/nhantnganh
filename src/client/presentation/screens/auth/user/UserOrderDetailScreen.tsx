import React, {useEffect, useState} from 'react';
import {TimePicker, DatePicker, message} from 'antd';
import dayjs from 'dayjs';

const format = 'HH:mm';
import { Col, Row ,Button} from 'antd';
import {CloseOutlined} from "@ant-design/icons";
import {useNavigate, useParams} from "react-router-dom";
import {AxiosClient} from "@/client/repositories/AxiosClient";
const contentStyle: React.CSSProperties = {
    marginLeft: 'auto',
    height: '330px',
    width: '420px',
    color: '#fff',
    background: 'rgb(132, 115, 94)',
    borderRadius: '10px',
    marginBottom:"50px"
};

const UserOrderDetailScreen = () =>{
    const {orderId} =useParams()
    const GetData =(opts?: {
        onSuccess?: (data: any,data2:any) => void
        onError?: (data: any,data2:any) => void
    }) => {
        AxiosClient
            .get(`http://127.0.0.1:8000/api/order/${orderId}`)
            .then(r => {
                localStorage.removeItem('bikeInOrder')
                const dataCopyOrder = {...r.item.order};
                const dataCopyBike = {...r.item.bikes}
                console.log(dataCopyBike)
                localStorage.setItem('userOrderDetailOrder', JSON.stringify(dataCopyOrder))
                localStorage.setItem('userOrderDetailBike', JSON.stringify(dataCopyBike))
                if (opts?.onSuccess) {
                    opts.onSuccess(dataCopyOrder,dataCopyBike)
                } else if (r.error) {
                    if (opts?.onError) {
                        opts.onError(r.error,r.error)
                    }
                }
            })
            .catch(e => {
                console.log(e)
            })
    }
        const navigate = useNavigate()
        const [userOrderBike,setUserOrderBike] =useState(() =>{
            try {
                const lsItem = localStorage.getItem('userOrderDetailBike')
                if (lsItem) {
                    return JSON.parse(lsItem)
                }
            } catch (e) {
                console.error(e)
            }
            return []
        })
    const [userOrderOrder,setUserOrderOrder] =useState(() =>{
        try {
            const lsItem = localStorage.getItem('userOrderDetailOrder')
            if (lsItem) {
                return JSON.parse(lsItem)
            }
        } catch (e) {
            console.error(e)
        }
        return []
    })
    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(dayjs(userOrderOrder.order_start));
    const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(dayjs(userOrderOrder.order_end));
    const [startTime, setStartTime] = useState<dayjs.Dayjs | null>(dayjs(userOrderOrder.order_start));
    const [endTime, setEndTime] = useState<dayjs.Dayjs | null>(dayjs(userOrderOrder.order_end));
    const [time, setTime] = useState<number>(0);
    useEffect(() => {
        setStartDate(dayjs(userOrderOrder.order_start));
        setEndDate(dayjs(userOrderOrder.order_end));
        setStartTime(dayjs(userOrderOrder.order_start));
        setEndTime(dayjs(userOrderOrder.order_end));
        calculateDiff(
            dayjs(userOrderOrder.order_start),
            dayjs(userOrderOrder.order_end),
            dayjs(userOrderOrder.order_start),
            dayjs(userOrderOrder.order_end)
        );
        // ...

    }, [orderId,userOrderOrder]);
        const onChangeDateStart = (date: dayjs.ConfigType) => {
            const start = dayjs(date);
            setStartDate(start);
            calculateDiff(start, endDate, startTime, endTime);
        };

        const onChangeDateEnd = (date: dayjs.ConfigType) => {
            const end = dayjs(date);
            setEndDate(end);
            calculateDiff(startDate, end, startTime, endTime);
        };

        const handleTimeChangeStart = (time: dayjs.Dayjs | null) => {
            setStartTime(time);
            calculateDiff(startDate, endDate, time, endTime);
        };

        const handleTimeChangeEnd = (time: dayjs.Dayjs | null) => {
            setEndTime(time);
            calculateDiff(startDate, endDate, startTime, time);
        };

    const calculateDiff = (
        start: dayjs.Dayjs | null,
        end: dayjs.Dayjs | null,
        startTime: dayjs.Dayjs | null,
        endTime: dayjs.Dayjs | null
    ) => {
        if (start && end && startTime && endTime) {
            const startDateTime = dayjs(start.format("YYYY-MM-DD") + " " + startTime.format("HH:mm"));
            const endDateTime = dayjs(end.format("YYYY-MM-DD") + " " + endTime.format("HH:mm"));
            const diff = endDateTime.diff(startDateTime, "hour");
            setTime(diff);
        } else {
            setTime(0);
        }
    };
    const  handleClickOrderCancel = async ()=>{
        await  message.success('キャンセルしました').then()
        // await localStorage.removeItem('userOrderDetailBike')
        // navigate('/bikeList')
    }
    const [reloadPage, setReloadPage] = useState(false);
    useEffect(() => {
        
        console.log('MOUNT: Admin Order Screen')
        { GetData({
            onSuccess: (data,data2) => {
                console.log('GetData:onSuccess', data,data2)
               setUserOrderBike(data2)
                setUserOrderOrder(data)
            },
            onError: (data,data2) => {
                console.log('GetData:onError', data,data2)
            }
        })}
        return () => {
            console.log('UNMOUNT: Admin Screen')
        }
    }, [orderId,userOrderOrder])


    const handleDeleteBike = async (itemId: number) => {
        const updatedOrderList = Object.values(userOrderBike).filter((item: any) => item.bike_id !== itemId);
         await setUserOrderBike(updatedOrderList);
         await localStorage.setItem('userOrderDetailBike', JSON.stringify(updatedOrderList));
    }

    let money: number = 0;
        Object.values(userOrderBike).forEach((item: any) => {
            money += parseInt(item.bike_price);
        });

     const [screen,setScreen] = useState(true)
   useEffect(()=>{
       if(userOrderBike.length===0)
       {
           setScreen(false)
       }
       console.log(screen)
   },[screen,userOrderBike])

    if (!screen) {
        return(
            <div style={{textAlign:"center",fontSize:'25px'}}>
            <p>オーダーに商品がありません.</p>
            </div>
    )
    }
    const bikePriceColors: Record<string, string> = {
        "5": "#df6565", // Color for order_status = "1"
        "1": "#70a8dc", // Color for order_status = "1"
        "2": "#ffd966", // Color for order_status = "2"
        "3": "#ff9900", // Color for order_status = "3"
        "4": "#93c47d", // Color for order_status = "3"
        // Add more key-value pairs as per your requirements
    };
    const bikePriceTexts: Record<string, string> = {
        "5": "キャンセル", // Text for bike_price = "1"
        "1": "オーダー", // Text for bike_price = "1"
        "2": "借りる", // Text for bike_price = "2"
        "3": "時代遅れ", // Text for bike_price = "3"
        "4": "完了", // Text for bike_price = "1"
        // Add more key-value pairs as per your requirements
    };
    const displayOrder:Record<string, string> ={
        "5":"none",
        "1":"block",
        "2":"none",
        "3":"none",
        "4":"none",

    }
    return(
        <>

            <Row style={{marginTop:'20px'}}>
                <Col style={{marginLeft:'150px'}}>
                    <div style={{ display: 'flex' }}>
                        <div
                            style={{
                                flex: 1,
                                overflowY: 'scroll',
                                marginBottom:'20px',
                                maxHeight: '300px', /* Adjust the height as needed */
                                overflowX: 'hidden',

                            }}
                        >
                            { Object.values(userOrderBike).map((item:any) => (

                                <div key={item.bike_id} style={{display:'flex',width:'90%'}}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={`/storage/app/public/bike_image/${item.bike_id}.1.jpg`} alt=""
                                         style={{width:'130px',border:'1px solid #C38154',marginRight:'10px',marginBottom:'10px'}}/>
                                    <div style={{width:"320px"}}>
                                        <b style={{fontSize:'18px',marginRight:'50px'}}>{ item.bike_name}</b>
                                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center',fontSize:'10px' ,border:'1px solid',width:'50%',borderRadius:'15px',backgroundColor:'#60B95E',color:"white"    }}>利用可能</div>
                                        <p style={{fontSize:'10px'}}>{item.bike_address}</p>
                                    </div>
                                    <CloseOutlined onClick={()=>handleDeleteBike(item.bike_id)} style={{float:"left",fontSize:'25px'}}/>
                                </div>
                            ))}
                        </div>


                    </div>
                    <hr
                        style={{
                            width: '100%',
                            border: 0,
                            borderTop: '2px solid #84735e',
                            margin: '20px 0',
                        }}
                    />
                    <div style={{fontSize:"20px", textAlign:"center"}}>
                        <div className="start" style={{marginBottom:'10px', display:"flex" }}>
                            <b style={{width:"80px"}}>スタート</b>
                            <DatePicker onChange={onChangeDateStart}
                                        style={{marginLeft:'10px',marginRight:'10px', width:"200px", pointerEvents: "none", opacity: 1 }}
                                        defaultValue={dayjs(startDate)}
                                        inputReadOnly
                            />
                            <TimePicker   style={{width:"200px",pointerEvents: "none", opacity: 1}} defaultValue={dayjs(startTime)}  format={format} inputReadOnly  onChange={handleTimeChangeStart}/>
                        </div>
                        <div className="end" style={{display:"flex"}}>
                            <b style={{width:"80px"}}>エンド</b>
                            <DatePicker onChange={onChangeDateEnd}
                                        style={{marginLeft:"10px" ,marginRight:'10px', width:"200px",pointerEvents: "none", opacity: 1}}
                                        defaultValue={dayjs(endDate)}
                                        inputReadOnly
                            />
                            <TimePicker style={{width:"200px",pointerEvents: "none", opacity: 1}}   defaultValue={dayjs(endTime)} format={format} inputReadOnly onChange={handleTimeChangeEnd} />
                        </div>
                        <div className="address" style={{display:"flex",marginTop:'15px',marginBottom:'30px'}}>
                            <b style={{width:"80px"}}>場所</b>
                            <div style={{marginLeft:'10px',border:'1px solid #C38154',padding:'5px 5px 5px 5px', maxWidth:"500px"}}>
                                {userOrderOrder.order_address}
                                {/*{userOrderBike[0].bike_address}*/}
                            </div>
                        </div>
                    </div>
                </Col>
                <Col style={{marginTop:'30px',marginLeft:'70px'}}>
                    <div style={contentStyle}>
                        <div style={{ textAlign: 'center', marginBottom:"20px" }}>
                            <b style={{ fontSize: '30px', fontWeight:"bold" }}>領収書</b>
                            <p style={{ textAlign: 'right',marginRight:'50px',fontSize:'24px' }}>¥{money}/時間</p>
                            <p style={{ textAlign: 'right',marginRight:'50px',fontSize:'24px' }}>{time} 時間</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop:"30px"}}>
                                <b style={{ marginLeft: '80px' ,fontSize:'30px'}}>合計:</b>
                                <b style={{ marginRight: '80px' ,fontSize:'30px'}}>¥{money*time}</b>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={{  color:'black',width: '96%' ,fontSize:'21px',backgroundColor: bikePriceColors[userOrderOrder.order_status] || 'white',borderRadius:'15px',textAlign:'center',paddingBottom:'6px',paddingTop:'5px'}}  >
                                {bikePriceTexts[userOrderOrder.order_status]}
                            </div>
                        </div>
                    </div>
                    <div style={{ marginBottom: '20px', marginLeft: '60px' ,display:displayOrder[userOrderOrder.order_status]}}>
                        <Button
                            type="primary"
                            danger
                            onClick={handleClickOrderCancel}
                            style={{

                                width: '300px',
                                fontSize: '20px',
                                paddingBottom: '35px',
                                backgroundColor: '#df6565',
                                color: 'black'
                            }}
                        >
                            キャンセル
                        </Button>
                    </div>
                </Col>

            </Row>
        </>
    )
}
export default UserOrderDetailScreen