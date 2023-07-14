import {useNavigate} from "react-router";
import {Button, Col, Pagination, PaginationProps, Row, Space} from "antd";
import React, {useEffect, useState} from "react";
import {AxiosClient} from "@/client/repositories/AxiosClient";
import {useParams} from "react-router-dom";
import {App} from "@/client/const/App";

const UserOrderListScreen = () => {
    const navigate = useNavigate()
    const {orderState} = useParams()
    const [user, setUser] = useState(() => {
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

    const GetData = async (opts?: {
        onSuccess?: (data: any) => void
        onError?: (data: any) => void
    }) => {
        console.log(user)
        if (orderState === undefined) {
            AxiosClient
                .get(`${App.ApiUrl}/orders?limit=100&column_query=order_name,order_id,order_end,order_status&user_id=${user.data.id}`)
                .then(r => {
                    const dataCopy = {...r.items};
                    localStorage.setItem('userOrderList', JSON.stringify(dataCopy))
                    if (opts?.onSuccess) {
                        opts.onSuccess(dataCopy)
                    } else if (r.error) {
                        if (opts?.onError) {
                            opts.onError(r.error)
                        }
                    }
                    console.log(r)
                })
                .catch(e => {
                    console.log(e)
                })
        } else {
            AxiosClient
                .get(`${App.ApiUrl}/orders?limit=100&search_by=order_status&keyword=${orderState}&user_id=${user.data.id}`)
                .then(r => {
                    const dataCopy = {...r.items};
                    localStorage.setItem('userOrderList', JSON.stringify(dataCopy))
                    if (opts?.onSuccess) {
                        opts.onSuccess(dataCopy)

                    } else if (r.error) {
                        if (opts?.onError) {
                            opts.onError(r.error)
                        }
                    }
                    console.log(r)
                })
                .catch(e => {
                    console.log(e)
                })
        }

    }
    const [userOrderList, setUserOrderList] = useState(
        () => {
            try {
                const lsItem = localStorage.getItem('userOrderList')
                if (lsItem) {
                    return JSON.parse(lsItem)
                }
            } catch (e) {
                console.error(e)
            }
            return []
        }
    )
    const [current, setCurrent] = useState(1);
    useEffect(() => {
        console.log('MOUNT: Admin Order Screen')
        GetData({
            onSuccess: (data) => {
                console.log('GetData:onSuccess', data)
                setUserOrderList(data)

            },
            onError: (data) => {
                console.log('GetData:onError', data)
            }
        })
        setCurrent(1)
        return () => {
            console.log('UNMOUNT: Admin Screen')
        }
    }, [orderState])
    const itemsPerPage = 8;
    const startIndex = (current - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedItems = Object.values(userOrderList).slice(startIndex, endIndex);
    const onChange: PaginationProps['onChange'] = (page) => {
        console.log(page);
        setCurrent(page);
    };
    const handleButtonClick = (buttonName: string) => {
        // Xử lý sự kiện tương ứng với từng nút
        switch (buttonName) {
            case 'オーダー':
                navigate('/userOrderList/1')
                break;
            case '借りる':
                navigate('/userOrderList/2')
                break;
            case '完了':
                navigate('/userOrderList/4')
                break;
            case 'キャンセル':
                navigate('/userOrderList/5')
                break;
            case '時代遅れ':
                navigate('/userOrderList/3')
                break;
            default:
                break;
        }
    };

    const handleOrderClick = (id: string) => {
        console.log(id)
        navigate(`/userOrderDetail/${id}`)
        // có vẻ sẽ tạo thêm 1 file mới
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
    return (
        <>
            <div style={{marginTop: "5px"}}>
                <Space className="site-button-ghost-wrapper" wrap style={{marginTop: '10px', marginLeft: '0px'}}>
                    <Row>
                        <Col span={22} style={{marginLeft: '100px'}}>
                            <Button type="primary" style={{backgroundColor: '#70a8dc', color: 'black', marginRight: '10px', fontSize: '15px', borderRadius: '15px', border: '1px solid'}}
                                    onClick={() => handleButtonClick('オーダー')}
                            >
                                オーダー
                            </Button>
                            <Button type="primary" style={{backgroundColor: '#ffd966', color: 'black', marginRight: '10px', fontSize: '15px', borderRadius: '15px', border: '1px solid'}}
                                    onClick={() => handleButtonClick('借りる')}>
                                借りる
                            </Button>
                            <Button type="primary" style={{backgroundColor: '#93c47d', color: 'black', marginRight: '10px', fontSize: '15px', borderRadius: '15px', border: '1px solid', paddingRight: '30px', paddingLeft: '30px'}}
                                    onClick={() => handleButtonClick('完了')}>
                                完了
                            </Button>
                            <Button type="primary" style={{backgroundColor: '#df6565', color: 'black', marginRight: '10px', fontSize: '15px', borderRadius: '15px', border: '1px solid'}}
                                    onClick={() => handleButtonClick('キャンセル')}>
                                キャンセル
                            </Button>
                            <Button type="primary" style={{backgroundColor: '#ff9900', color: 'black', fontSize: '15px', borderRadius: '15px', border: '1px solid'}}
                                    onClick={() => handleButtonClick('時代遅れ')}>
                                時代遅れ
                            </Button>
                        </Col>
                        <Col span={2}>

                        </Col>
                    </Row>
                </Space>
                <div style={{backgroundColor: '#cfb7a1', marginTop: '7px', borderRadius: '15px', marginBottom: '7px'}}>
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingBottom: '100px', paddingTop: '50px', minHeight: '400px'}}>
                        {Object.values(displayedItems).map((order: any) => (
                            <div key={order.order_id}>
                                <div style={{marginLeft: '-20px', marginTop: '10px', display: 'flex', fontSize: '20px'}}>
                                    <div style={{backgroundColor: bikePriceColors[order.order_status] || 'white', width: '200px', position: 'absolute', marginLeft: '570px', textAlign: 'right', borderRadius: '15px', paddingRight: '10px'}}>
                                        {bikePriceTexts[order.order_status]}
                                    </div>
                                    <div style={{backgroundColor: 'white', width: '650px', position: 'relative', textAlign: 'center', borderRadius: '15px'}}>
                                        {order.order_name}
                                    </div>
                                    <Button
                                        style={{marginLeft: '220px'}}
                                        onClick={() => handleOrderClick(order.order_id)}//xử lí view order
                                    >
                                        ショー
                                    </Button>
                                </div>

                            </div>
                        ))}
                    </div>
                    <Row>
                        <Col md={20}>

                        </Col>
                        <Col md={4}>
                            <Pagination simple current={current} onChange={onChange} total={Object.values(userOrderList).length} pageSize={itemsPerPage} style={{marginBottom: '20px'}}/>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}
export default UserOrderListScreen