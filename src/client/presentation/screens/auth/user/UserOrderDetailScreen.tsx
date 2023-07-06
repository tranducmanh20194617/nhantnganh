import React, {useEffect, useLayoutEffect, useState} from 'react';
import dayjs from 'dayjs';
import {CalendarOutlined, ClockCircleOutlined, CloseOutlined} from "@ant-design/icons";
import {Button, Col, Row} from 'antd';
import {useNavigate, useParams} from "react-router-dom";
import {AxiosClient} from "@/client/repositories/AxiosClient";
import {AxiosResponse} from "axios";
import {StoreConfig} from "@/client/config/StoreConfig";
import {App} from "@/client/const/App";
const format = 'HH:mm';
const storeConfig = StoreConfig.getInstance()

interface Order {
    order_start: string;
    order_end: string;
    order_address: string;
    order_total: number;
    order_time: number;
    order_status: number;
}

interface Bike {
    bike_id: number;
    bike_name: string;
    bike_price: number;
    bike_address: string;
}

const order_status: Record<number, any> = {
    1: {button1: "flex", button2: "none", status_name: "オーダ", status_color: "rgb(109, 158, 235)", total_style: "none"},
    2: {button1: "none", button2: "block", status_name: "借りる", status_color: "rgb(255, 217, 102)", total_style: "none"},
    3: {button1: "none", button2: "block", status_name: "時代遅れ", status_color: "rgb(255, 107, 101)", total_style: "block"},
    4: {button1: "none", button2: "none", status_name: "完了", status_color: "#60B95E", total_style: "none"},
    5: {button1: "none", button2: "none", status_name: "キャンセル", status_color: "#FF6347", total_style: "none"},
}
const orderTotal: React.CSSProperties = {
    background: "#84735e",
    marginTop: "20px",
    borderRadius: "10px",
    width: "min(480px,100%)",
    color: "white",
    padding: "20px 0"
};
const contentStyle: React.CSSProperties = {
    marginLeft: 'auto',
    height: '330px',
    width: '420px',
    color: '#fff',
    background: 'rgb(132, 115, 94)',
    borderRadius: '10px',
    marginBottom: "50px"
};
const GetData = (
    orderId: any,
    opts?: {
        onSuccess?: (data: any, data2: any) => void
        onError?: (data: any, data2: any) => void
    }) => {
    AxiosClient
        .get(`${App.ApiUrl}/order/${orderId}`)
        .then(r => {
            console.log(r)
            localStorage.removeItem('bikeInOrder')
            const dataCopyOrder = {...r.item.order};
            const dataCopyBike = {...r.item.bikes}
            localStorage.setItem('userOrderDetailOrder', JSON.stringify(dataCopyOrder))
            localStorage.setItem('userOrderDetailBike', JSON.stringify(dataCopyBike))
            if (opts?.onSuccess) {
                opts.onSuccess(dataCopyOrder, dataCopyBike)
            } else if (r.error) {
                if (opts?.onError) {
                    opts.onError(r.error, r.error)
                }
            }

        })
        .catch(e => {
            console.log(e)
        })
}
const UserOrderDetailScreen = () => {
    const [isLoading, setIsLoading] = useState(true);
    let {orderId} = useParams()

    const navigate = useNavigate()
    const [userOrderBike, setUserOrderBike] = useState<Bike[]>(() => {
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
    const [userOrderOrder, setUserOrderOrder] = useState<Order>(() => {
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
    useLayoutEffect(() => {
        {setIsLoading(true);
            GetData(orderId, {
                onSuccess: (data, data2) => {
                    // console.log('GetData:onSuccess', data,data2)
                    setUserOrderBike(data2)
                    setUserOrderOrder(data)
                    setIsLoading(false);
                },
                onError: (data, data2) => {
                    // console.log('GetData:onError', data,data2)
                }
            })
        }
    }, [orderId])
    const orderStart = new Date(userOrderOrder.order_start);
    const orderEnd = new Date(userOrderOrder.order_end);
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
    }, [orderId]);
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
    const data = {
        order_status: 1
    }
    const [dataChange, setDataChange] = useState(() => {
        try {
            const lsItem = localStorage.getItem('dataStatusChange')
            if (lsItem) {
                return JSON.parse(lsItem)
            }
        } catch (e) {
            console.error(e)
        }
        return data
    })
    const changeStatus = async (data: any) => {
        console.log(123)
        try {
            const response: AxiosResponse<any> = await AxiosClient.post(`${App.ApiUrl}/update/order/${orderId}`, data);
            console.log('success', response);
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    const handleClickOrderCancel = async () => {
        const newData = {
            ...dataChange,
            order_status: 5
        };
        await setDataChange(newData);
        try {
            await changeStatus(newData);
            localStorage.setItem('dataStatusChange', JSON.stringify(newData));
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteBike = async (itemId: number) => {
        const updatedOrderList = Object.values(userOrderBike).filter((item: any) => item.bike_id !== itemId);
        await setUserOrderBike(updatedOrderList);
        await localStorage.setItem('userOrderDetailBike', JSON.stringify(updatedOrderList));
    }

    let money: number = 0;
    Object.values(userOrderBike).forEach((item: any) => {
        money += parseInt(item.bike_price);
    });




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
    const displayOrder: Record<string, string> = {
        "5": "none",
        "1": "block",
        "2": "none",
        "3": "none",
        "4": "none",

    }
    const displayOrderStatus1: Record<string, string> = {
        "5": "none",
        "1": "none",
        "2": "none",
        "3": "block",
        "4": "none",

    }
    const displayOrderStatus2: Record<string, string> = {
        "5": "block",
        "1": "block",
        "2": "block",
        "3": "none",
        "4": "block",

    }
    return (

        <>
            {isLoading ? (
                <div style={{display: 'flex',
                    justifyContent: 'center',
                    alignItems:'center',
                    height: '550px',
                    textAlign: 'center',
                    fontSize: '25px',
                    marginBottom: '100px'}}>
                    <p>Loading...</p>
                </div>
            ) : (
                <Row style={{marginTop: '50px', height: '550px'}}>
                    <Col style={{marginLeft: '250px'}}>
                        <div style={{display: 'flex'}}>
                            <div
                                style={{
                                    flex: 1,
                                    overflowY: 'scroll',
                                    marginBottom: '20px',
                                    maxHeight: '200px', /* Adjust the height as needed */
                                    overflowX: 'hidden',

                                }}
                            >
                                {Object.values(userOrderBike).map((item: any) => (

                                    <div key={item.bike_id} style={{display: 'flex', width: '90%'}}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={`/storage/app/public/bike_image/${item.bike_id}.1.jpg`} alt=""
                                             style={{width: '130px', border: '1px solid #C38154', marginRight: '10px', marginBottom: '10px'}}/>
                                        <div style={{width: "320px"}}>
                                            <b style={{fontSize: '18px', marginRight: '50px'}}>{item.bike_name}</b>
                                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px', border: '1px solid', width: '50%', borderRadius: '15px', backgroundColor: '#60B95E', color: "white"}}>利用可能</div>
                                            <p style={{fontSize: '15px'}}>{item.bike_address}</p>
                                        </div>
                                        <CloseOutlined onClick={() => handleDeleteBike(item.bike_id)} style={{float: "left", fontSize: '25px', display: 'none'}}/>
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
                        <div style={{fontSize: "20px", textAlign: "center"}}>
                            <div className='start-time' style={{display: "flex"}}>
                                <h3 style={{width: "100px"}}>スタート</h3>
                                <div style={{margin: "auto 20px", border: "solid 2px rgb(132, 115, 94)", padding: "10px", width: "160px"}}>
                                    {orderStart.getDate() + "/" + (orderStart.getMonth() + 1) + "/" + orderStart.getFullYear()}
                                    <CalendarOutlined style={{marginLeft: "20px"}}/>
                                </div>
                                <div style={{margin: "auto", border: "solid 2px rgb(132, 115, 94)", padding: "10px", width: "120px"}}>
                                    {orderStart.getHours().toString().padStart(2, "0") + ":" + orderStart.getMinutes().toString().padStart(2, "0") + ":" + orderStart.getSeconds().toString().padStart(2, "0")}
                                    <ClockCircleOutlined style={{marginLeft: "20px"}}/>
                                </div>
                            </div>
                            <div className='end-time' style={{display: "flex"}}>
                                <h3 style={{width: "100px"}}>エンド</h3>
                                <div style={{margin: "auto 20px", border: "solid 2px rgb(132, 115, 94)", padding: "10px", width: "160px"}}>
                                    {orderEnd.getDate() + "/" + (orderStart.getMonth() + 1) + "/" + orderEnd.getFullYear()}
                                    <CalendarOutlined style={{marginLeft: "20px"}}/>
                                </div>
                                <div style={{margin: "auto", border: "solid 2px rgb(132, 115, 94)", padding: "10px", width: "120px"}}>
                                    {orderEnd.getHours().toString().padStart(2, "0") + ":" + orderEnd.getMinutes().toString().padStart(2, "0") + ":" + orderEnd.getSeconds().toString().padStart(2, "0")}
                                    <ClockCircleOutlined style={{marginLeft: "20px"}}/>
                                </div>
                            </div>
                            <div className="address" style={{display: "flex", marginTop: '15px', marginBottom: '30px'}}>
                                <b style={{width: "80px"}}>場所</b>
                                <div style={{marginLeft: '10px', border: '1px solid #C38154', padding: '5px 5px 5px 5px', maxWidth: "500px"}}>
                                    {userOrderOrder.order_address}
                                    {/*{userOrderBike[0].bike_address}*/}
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col style={{marginTop: '30px', marginLeft: '70px'}}>
                        <div style={{marginLeft: 'auto',
                            height: '330px',
                            width: '420px',
                            color: '#fff',
                            background: 'rgb(132, 115, 94)',
                            borderRadius: '10px',
                            marginBottom: "50px",
                            display:displayOrderStatus2[userOrderOrder.order_status]
                        }}>
                            <div style={{ textAlign: 'center', marginBottom:"20px" }}>
                                <b style={{ fontSize: '30px', fontWeight:"bold" }}>領収書</b>
                                <p style={{ textAlign: 'right',marginRight:'50px',fontSize:'24px' }}>¥{userOrderOrder.order_total}/時間</p>
                                <p style={{ textAlign: 'right',marginRight:'50px',fontSize:'24px' }}>{userOrderOrder.order_time} 時間</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop:"30px"}}>
                                    <b style={{ marginLeft: '80px' ,fontSize:'30px'}}>合計:</b>
                                    <b style={{ marginRight: '80px' ,fontSize:'30px'}}>¥{userOrderOrder.order_total*userOrderOrder.order_time}</b>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <div style={{  color:'black',width: '96%' ,fontSize:'21px',backgroundColor: bikePriceColors[userOrderOrder.order_status] || 'white',borderRadius:'15px',textAlign:'center',paddingBottom:'6px',paddingTop:'5px'}}  >
                                    {bikePriceTexts[userOrderOrder.order_status]}
                                </div>
                            </div>
                        </div>
                        <div style={{marginLeft: 'auto',
                            height: '330px',
                            width: '420px',
                            color: '#fff',
                            background: 'rgb(132, 115, 94)',
                            borderRadius: '10px',
                            marginBottom: "50px",
                            display:displayOrderStatus1[userOrderOrder.order_status]}}>
                            <div style={{ textAlign: 'center', marginBottom:"20px" }}>
                                <b style={{ fontSize: '30px', fontWeight:"bold" }}>領収書</b>
                                <p style={{ textAlign: 'right',marginRight:'50px',fontSize:'24px' }}>¥{userOrderOrder.order_total}+¥50/時間</p>
                                <p style={{ textAlign: 'right',marginRight:'50px',fontSize:'24px' }}>{userOrderOrder.order_time} 時間</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop:"30px"}}>
                                    <b style={{ marginLeft: '80px' ,fontSize:'30px'}}>合計:</b>
                                    <b style={{ marginRight: '80px' ,fontSize:'30px'}}>¥{(userOrderOrder.order_total+50)*userOrderOrder.order_time}</b>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <div style={{  color:'black',width: '96%' ,fontSize:'21px',backgroundColor: bikePriceColors[userOrderOrder.order_status] || 'white',borderRadius:'15px',textAlign:'center',paddingBottom:'6px',paddingTop:'5px'}}  >
                                    {bikePriceTexts[userOrderOrder.order_status]}
                                </div>
                            </div>
                        </div>

                        <div style={{marginBottom: '20px', marginLeft: '60px', display: displayOrder[userOrderOrder.order_status]}}>
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

                </Row> )}
        </>

    )
}
export default UserOrderDetailScreen