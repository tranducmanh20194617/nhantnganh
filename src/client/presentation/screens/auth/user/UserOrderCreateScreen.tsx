import React, {useEffect, useState} from 'react';
import {TimePicker, DatePicker, message,Select} from 'antd';
import dayjs from 'dayjs';
import {useRouter} from "next/navigation";
const { Option } = Select;
const format = 'HH:mm';
import { Col, Row ,Button} from 'antd';
import {CloseOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
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


const CreateOrder =(data:any) =>{
    AxiosClient.post('http://127.0.0.1:8000/api/create/order/',data)
        .then(r=>{
            if (r.success){
                console.log(r)
                message.success('オーダー作成が成功しました')
            }
            else {
                console.log(r.error)
                message.error('オーダー作成が成功しました')
            }
        })
        .catch(e => {
            console.log(e)
            message.error('Error')
        })
}
const UserOrderCreateScreen = () =>{
    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
    const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
    const [startTime, setStartTime] = useState<dayjs.Dayjs | null>(null);
    const [endTime, setEndTime] = useState<dayjs.Dayjs | null>(null);
    const [time, setTime] = useState<number>(0);
    const navigate = useNavigate()
    const [button,setButton] = useState(true)
    const [button2,setButton2] = useState(true)
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    const route = useRouter()
    const handleSelectChange = (value: string) => {
        setSelectedValue(value);
    };
    const  GetData = () => {
        let maxOrderId:number = 0
        AxiosClient
            .get('http://127.0.0.1:8000/api/orders?limit=100&column_query=order_name,order_id,order_end,order_status&user_id=4')
            .then(r => {
                const dataCopy = {...r.items};
                Object.values(dataCopy).forEach((order:any) => {
                    if (order.order_id > maxOrderId) {
                        maxOrderId = order.order_id;
                    }
                });
                 route.push(`/userOrderDetail/${maxOrderId}`)

            })
            .catch(e => {
                console.log(e)
            })

    }
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
        await localStorage.removeItem('bikeInOrder')
        navigate('/bikeList')
    }


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
    const handleDeleteBike = async (itemId: number) => {
        const updatedOrderList = userOrderList.filter((item: any) => item.bike_id !== itemId);
        await setUserOrderList(updatedOrderList);
        await localStorage.setItem('bikeInOrder', JSON.stringify(updatedOrderList));
    }
    let money: number = 0;
    userOrderList.forEach((item: any) => {
        money += parseInt(item.bike_price);
    });
    const [screen,setScreen] = useState(true)
    useEffect(()=>{
        if(userOrderList.length===0)
        {
            setScreen(false)
        }

    },[userOrderList])
    useEffect(()=>{
        userOrderList.map((item:any, index:any) =>{
                if(item.bike_classify==='1'){
                    setButton(false)
                }
            }
        )
    },[userOrderList])
    if (!screen) {
        return(
            <div style={{display: 'flex',
                justifyContent: 'center',
                alignItems:'center',
                height: '400px',
                textAlign: 'center',
                fontSize: '25px',
                marginBottom: '100px'}}>
                <p>オーダーに商品がありません.</p>
            </div>
        )
    }
    const bikeClassifyColors: Record<string, string> = {
        "0": "#60B95E", // Color for order_status = "1"
        "1": "#FF6347", // Color for order_status = "1"

        // Add more key-value pairs as per your requirements
    };
    const bikeClassifyTexts: Record<string, string> = {
        "0": "利用可能",
        "1": "利用不可",

        // Add more key-value pairs as per your requirements
    };

    const handleClickOrderSuccess =  async () => {
        const orderIds = userOrderList.map((order: any) => order.bike_id);
        const updateOrderList = Object.values(userOrderList).filter((order: any) => order.bike_classify === '1');
        console.log(userOrderList)
        console.log(updateOrderList)
        const orderIdsString = orderIds.join(',');
        const quality = Object.values(userOrderList).length;
        const bikeIds = Object.values(userOrderList).map((item: any) => item.bike_id);
        const formattedStartDate = startDate?.format("YYYY-MM-DD") || "";
        const formattedEndDate = endDate?.format("YYYY-MM-DD") || "";
        const formattedStartTime = startTime?.format("HH:mm:ss") || "";
        const formattedEndTime = endTime?.format("HH:mm:ss") || "";
        const currentTime = dayjs().format("YYYY-MM-DD");
        const data = {
            order_start: `${formattedStartDate} ${formattedStartTime}`,
            order_end: `${formattedEndDate} ${formattedEndTime}`,
            order_name: "thanhnt9_" + currentTime,
            order_total: money,
            order_time: time,
            user_id: 4, // Update with the correct user ID
            order_address: selectedValue, // Update with the correct address
            bikes: orderIdsString,
            bike_quantity: quality,
        };

            if (!button) {
                setButton2(false)
                await setUserOrderList(updateOrderList)
                await localStorage.setItem('bikeInOrder', JSON.stringify(updateOrderList))

            } else {
                setButton2(true)
                await CreateOrder(data)
                await GetData()


            }
            console.log(data)

        };

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
                            {userOrderList.map((item:any, index:any) => (

                                <div key={item.bike_id} style={{display:'flex',width:'90%'}}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={`/storage/app/public/bike_image/${item.bike_id}.1.jpg`} alt=""
                                         style={{width:'130px',border:'1px solid #C38154',marginRight:'10px',marginBottom:'10px'}}/>
                                    <div style={{width:"320px"}}>
                                        <b style={{fontSize:'18px',marginRight:'50px'}}>{ item.bike_name}</b>
                                        {button2?
                                            ( <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center',fontSize:'10px' ,border:'1px solid',width:'50%',borderRadius:'15px',backgroundColor:'#60B95E',color:"white"}}>利用可能</div>):(
                                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center',fontSize:'10px' ,border:'1px solid',width:'50%',borderRadius:'15px',backgroundColor:'#FF6347',color:"white"}}>利用不可</div>
                                            )}
                                        <p style={{fontSize:'15px'}}>{item.bike_address}</p>
                                    </div>
                                    <CloseOutlined onClick={()=>handleDeleteBike(item.bike_id)} style={{float:"left",fontSize:'25px',marginLeft:'4px'}}/>
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
                                        style={{marginLeft:'10px',marginRight:'10px', width:"200px"}}
                            />
                            <TimePicker style={{width:"200px"}} defaultValue={dayjs('00:00', format)} format={format}  onChange={handleTimeChangeStart}/>
                        </div>
                        <div className="end" style={{display:"flex"}}>
                            <b style={{width:"80px"}}>エンド</b>
                            <DatePicker onChange={onChangeDateEnd} style={{marginLeft:"10px" ,marginRight:'10px', width:"200px"}}/>
                            <TimePicker style={{width:"200px"}} defaultValue={dayjs('00:00', format)} format={format}  onChange={handleTimeChangeEnd} />
                        </div>
                        <div className="address" style={{display:"flex",marginTop:'15px',marginBottom:'30px'}}>
                            <b style={{width:"80px"}}>場所</b>
                            <div style={{marginLeft:'10px',border:'1px solid #C38154', maxWidth:"500px"}}>
                                <Select
                                    value={selectedValue}
                                    onChange={handleSelectChange}
                                    placeholder="住所を選択してください"
                                    style={{width:'400px',borderRadius:'0px'}}
                                >
                                    <Option value="250 Minh Khai, Hai ba trung, Ha noi, Viet nam">250 Minh Khai, Hai ba trung, Ha noi, Viet nam</Option>
                                    <Option value="03 Thuy Khue, Tay Ho, Ha Noi">03 Thuy Khue, Tay Ho, Ha Noi</Option>
                                    <Option value="29 Gia Thuy, Long Bien, Ha Noi">29 Gia Thuy, Long Bien, Ha Noi</Option>
                                    <Option value="28 Nguyen Dong Chi, Cau Dien, Nam Tu Liem, Ha Noi">28 Nguyen Dong Chi, Cau Dien, Nam Tu Liem, Ha Noi</Option>
                                </Select>
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
                        <div style={{marginBottom:'10px', display:"flex", justifyContent:"center", marginTop:"75px"}}>
                            <Button  type="primary" danger onClick={handleClickOrderCancel}
                                     style={{width: '150px' ,fontSize:'22px',paddingBottom:'30px',backgroundColor:'#df6565',color:'black'}}>
                                キャンセル</Button>
                            <Button  type="primary" danger onClick={handleClickOrderSuccess}
                                     style={{width: '150px' ,fontSize:'22px',paddingBottom:'30px',backgroundColor:'#60B95E',color:'black',marginLeft:'35px'}}>
                                オーダー</Button>
                        </div>

                    </div>
                    {button2 ?
                    null: (
                        <div>
                            <div style={{backgroundColor:'#FF6B65',maxWidth:'400px',textAlign:'center',borderRadius:'15px',marginLeft:'20px', marginBottom:"50px"}}>
                                <b style={{fontSize:'24px',color:"white"}}>現在、その場所には注文の車両がありません
                                </b>
                            </div>
                        </div>
                    )}
                </Col>
            </Row>
        </>
    )
}
export default UserOrderCreateScreen
