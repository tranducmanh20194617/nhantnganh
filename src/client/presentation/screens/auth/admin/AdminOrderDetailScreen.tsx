import React, {useEffect, useState} from 'react';
import {CalendarOutlined, ClockCircleOutlined} from "@ant-design/icons";
import {Button} from 'antd';
import {useParams} from "react-router-dom";
import {AxiosClient} from "@/client/repositories/AxiosClient";
// du lieu gia dinh
// ma dao hien thi bike status
const bike_status:Record<string, any> = {
    0: {color: '#60B95E', classify: 'available'},
    1: {color: '#FF6347', classify: 'Unavailable'}
}
// ma dao hien thi theo order status
const order_status:Record<number, any> = {
    1: {button1:"flex", button2:"none", status_name:"オーダ", status_color:"rgb(109, 158, 235)", total_style:"none"},
    2: {button1:"none", button2:"block", status_name:"借りる", status_color:"rgb(255, 217, 102)", total_style:"none"},
    3: {button1:"none", button2:"block", status_name:"時代遅れ", status_color:"rgb(255, 107, 101)", total_style:"block"},
    4: {button1:"none", button2:"none", status_name:"完了", status_color:"#60B95E", total_style:"none"},
    5: {button1:"none", button2:"none", status_name:"キャンセル",status_color:"#FF6347", total_style:"none"},
}

const orderTotal: React.CSSProperties = {
    background:"#84735e",
    marginTop:"20px",
    borderRadius:"10px",
    width:"min(480px,100%)",
    color:"white",
    padding:"20px 0"
};

const AdminOrderDetailScreen =()=> {
    const {adminOrderId} =useParams()
    const GetData = async (opts?: {
        onSuccess?: (data: any,data2:any) => void
        onError?: (data: any,data2:any) => void
    }) => {
        AxiosClient
            .get(`http://127.0.0.1:8000/api/order/${adminOrderId}`)
            .then(r => {
                const dataCopyOrder = {...r.item.order};
                const dataCopyBike = {...r.item.bikes}
                console.log(dataCopyBike)
                localStorage.setItem('adminOrderDetailOrder', JSON.stringify(dataCopyOrder))
                localStorage.setItem('adminOrderDetailBike', JSON.stringify(dataCopyBike))
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
    const data ={
        order_status:1
    }
    const [adminOrderBike,setAdminOrderBike] =useState(() =>{
        try {
            const lsItem = localStorage.getItem('adminOrderDetailBike')
            if (lsItem) {
                return JSON.parse(lsItem)
            }
        } catch (e) {
            console.error(e)
        }
        return []
    })
    const [adminOrderDetailOrder,setAdminOrderDetailOrder] =useState(() =>{
        try {
            const lsItem = localStorage.getItem('adminOrderDetailOrder')
            if (lsItem) {
                return JSON.parse(lsItem)
            }
        } catch (e) {
            console.error(e)
        }
        return []
    })

    const [dataChange,setDataChange]=useState(() =>{
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
    const changeStatus = (data:any) =>{
        AxiosClient.post(`http://127.0.0.1:8000/api/update/order/${adminOrderId}`,data)
            .then( r=>{
                console.log(r)
            })
            .catch(e => {
            console.log(e)
        })
    }
    useEffect(() => {

        console.log('MOUNT: Admin Order Detail Screen')
        { GetData({
            onSuccess: (data,data2) => {
                console.log('GetData:onSuccess', data,data2)
                setAdminOrderDetailOrder(data)
                setAdminOrderBike(data2)
            },
            onError: (data,data2) => {
                console.log('GetData:onError', data,data2)
            }

        })}
        return () => {
            console.log('UNMOUNT: Admin Order Detail Screen')

        }
    }, [adminOrderId])

    const orderStart = new Date(adminOrderDetailOrder.order_start);
    const orderEnd = new Date(adminOrderDetailOrder.order_end);

    const handleAgreeOrder = async ()=>{
        const newData = {
            ...dataChange,
            order_status: 2
        };
        await setDataChange(newData);
       await changeStatus(newData)
        localStorage.setItem('dataStatusChange',JSON.stringify(newData))
        window.location.reload();
    }
    const handleRefuseOrder = async ()=>{
        const newData = {
            ...dataChange,
            order_status: 5
        };
        await setDataChange(newData);
         await changeStatus(newData)
        localStorage.setItem('dataStatusChange',JSON.stringify(newData))

        window.location.reload();
    }
    const handleCompleteOrder = async ()=>{
        //logic hoan thanh order
        const newData = {
            ...dataChange,
            order_status: 4
        };
        await setDataChange(newData);
        await changeStatus(newData)
        localStorage.setItem('dataStatusChange',JSON.stringify(newData))
        window.location.reload();

    }
    return(
        <div style={{marginTop:"15px", marginBottom:"15px"}}>
            <div style={{background:"rgb(132, 115, 94)", borderRadius:"5px", display:"flex", justifyContent:"space-between", padding:"15px"}}>
                <h2 style={{color:"white", margin:"auto"}}>{adminOrderDetailOrder.order_name}</h2>
                <div className="order-status" style={{float:"left", marginRight:"70px", background:order_status[adminOrderDetailOrder.order_status].status_color, width:"150px", lineHeight:"1rem", textAlign:"center", borderRadius:"20px"}}>
                    <h3 style={{}}>{order_status[adminOrderDetailOrder.order_status].status_name}</h3>
                </div>
            </div>
            <div style={{marginTop:"15px", marginLeft:"min(100px,10%)", display:"flex", flexWrap:"wrap"}}>
                <div
                    style={{
                        flex: 1,
                        overflowY: 'scroll',
                        marginBottom:'20px',
                        maxHeight: '400px',
                        paddingRight: '200px',
                        overflowX: 'hidden',
                        maxWidth: "min(30%,400px)",
                        borderBottom: "solid",
                    }}
                >

                    {Object.values(adminOrderBike).map((bike:any) => (
                        <div key={bike.bike_id} style={{display:'flex',width:'500px'}}>
                            <img src={`/storage/app/public/bike_image/${bike.bike_id}.1.jpg`} alt=""
                                 style={{height:'150px',border:'1px solid #C38154',marginRight:'10px',marginBottom:'10px'}}/>
                            <div style={{marginLeft:"40px"}}>
                                <div style={{fontSize:'20px', fontWeight:"bold", width:"220px"}}>{bike.bike_name}</div>
                                <div
                                    style={{display: 'flex', justifyContent: 'center', alignItems: 'center',fontSize:'10px' ,border:'1px solid',width:'100px',borderRadius:'15px',backgroundColor: bike_status[0].color,color:"white", padding:"5px"}}>
                                    利用可能
                                </div>
                                <p style={{fontSize:'10px'}}>{bike.bike_address}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{marginLeft:"100px", width:"min(480px, 50%)"}}>
                    <div className='start-time' style={{display:"flex"}}>
                        <h3 style={{width:"80px"}}>スタート</h3>
                        <div style={{ margin:"auto 50px", border:"solid 2px rgb(132, 115, 94)", padding:"10px", width:"120px"}}>
                            {orderStart.getDate() + "/" + orderStart.getMonth() + "/" + orderStart.getFullYear()}
                            <CalendarOutlined style={{marginLeft:"20px"}}/>
                        </div>
                        <div style={{ margin:"auto", border:"solid 2px rgb(132, 115, 94)", padding:"10px", width:"120px"}}>
                            {orderStart.getHours().toString().padStart(2, "0") + ":" + orderStart.getMinutes().toString().padStart(2, "0") + ":" + orderStart.getSeconds().toString().padStart(2, "0")}
                            <ClockCircleOutlined style={{marginLeft:"20px"}}/>
                        </div>
                    </div>
                    <div className='end-time' style={{display:"flex"}}>
                        <h3 style={{width:"80px"}}>エンド</h3>
                        <div style={{ margin:"auto 50px", border:"solid 2px rgb(132, 115, 94)", padding:"10px", width:"120px"}}>
                            {orderEnd.getDate() + "/" + orderEnd.getMonth() + "/" + orderEnd.getFullYear()}
                            <CalendarOutlined style={{marginLeft:"20px"}}/>
                        </div>
                        <div style={{ margin:"auto", border:"solid 2px rgb(132, 115, 94)", padding:"10px", width:"120px"}}>
                            {orderEnd.getHours().toString().padStart(2, "0") + ":" + orderEnd.getMinutes().toString().padStart(2, "0") + ":" + orderEnd.getSeconds().toString().padStart(2, "0")}
                            <ClockCircleOutlined style={{marginLeft:"20px"}}/>
                        </div>
                    </div>
                    <div className='order-address' style={{display:"flex"}}>
                        <h3 style={{width:"80px", marginRight:"50px"}}>場所</h3>
                        <div style={{ margin:"auto", border:"solid 2px rgb(132, 115, 94)", padding:"10px", width:"330px", lineHeight:"1.5rem"}}>
                            <p style={{fontSize:"14px"}}>{adminOrderDetailOrder.order_address}</p>
                        </div>
                    </div>
                    <div className='order-total' style={orderTotal}>
                        {/* tinh tien neu qua thoi gian order */}
                        <div style={{display:order_status[adminOrderDetailOrder.order_status].total_style}}>
                            <div style={{textAlign:"right", marginRight:"100px", fontSize:"30px", fontWeight:"bold"}}>¥{adminOrderDetailOrder.order_total}</div>
                            <div style={{textAlign:"right", marginRight:"200px", fontSize:"30px", fontWeight:"bold"}}>+</div>
                            <div style={{textAlign:"right", marginRight:"100px", fontSize:"30px", fontWeight:"bold"}}>¥500</div>
                            <hr
                                style={{
                                    alignItems:"center",
                                    width: '70%',
                                    border: 0,
                                    borderTop: '2px solid white',
                                    marginLeft: '15%',
                                }}
                            />
                        </div>

                        {/* thanh tien */}
                        <div style={{display:"flex", justifyContent:"space-between", marginLeft:"100px", marginRight:"100px"}}>
                            <h2 style={{ fontSize:"30px"}}>合計: </h2>
                            <h2 style={{ fontSize:"30px"}}>¥{adminOrderDetailOrder.order_total*adminOrderDetailOrder.order_time}</h2>
                        </div>

                    </div>
                </div>
            </div>
            {/* nut hien thi neu la trang thai order */}
            <div style={{display:order_status[adminOrderDetailOrder.order_status].button1, justifyContent:"center", margin:"auto"}}>
                <Button onClick={handleRefuseOrder} style={{ marginRight:"50px", width:"150px", background:"rgb(224, 102, 102)", borderRadius:"10px", height:"50px"}}>
                    <div style={{fontSize:"20px", fontWeight:"bold"}}>キャンセル</div>
                </Button>

                <Button onClick={handleAgreeOrder} style={{ marginLeft:"50px",width:"150px", background:"rgb(147, 196, 125)", borderRadius:"10px", height:"50px"}}>
                    <div style={{fontSize:"20px", fontWeight:"bold"}}>オーケー</div>
                </Button>
            </div>
            {/* nut hien thi neu la 2 trang thai con lai */}
            <div style={{display:order_status[adminOrderDetailOrder.order_status].button2, marginLeft:"15%", marginTop:"30px", marginBottom:"30px"}}>
                <Button onClick={handleCompleteOrder} style={{ marginRight:"50px", width:"300px", background:"rgb(147, 196, 125)", borderRadius:"10px", height:"50px"}}>
                    <div style={{fontSize:"20px", fontWeight:"bold"}}>コンプリート</div>
                </Button>
            </div>
        </div>
    )
}
export default AdminOrderDetailScreen