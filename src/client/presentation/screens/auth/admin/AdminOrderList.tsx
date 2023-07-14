import {useNavigate} from "react-router";
import {Button, Col, Input, message, Pagination, PaginationProps, Row, Space} from "antd";
import React, {useEffect, useState} from "react";

import {AxiosClient} from "@/client/repositories/AxiosClient";
import {useParams} from "react-router-dom";
import {App} from "@/client/const/App";
import {SearchOutlined} from "@ant-design/icons";

const AdminOrderList = () => {
    const {userName, state} = useParams()
    const navigate = useNavigate()
    const [inputValue, setInputValue] = useState('');
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };
    const GetData = (opts?: {
        onSuccess?: (data: any) => void
        onError?: (data: any) => void
    }) => {
        if (userName === undefined && state === undefined) {
            AxiosClient
                .get(`${App.ApiUrl}/orders?limit=100`)
                .then(r => {
                    const dataCopy = {...r.items};
                    localStorage.setItem('adminOrderList', JSON.stringify(dataCopy))
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
        } else if (state === undefined && userName !== undefined) {
            AxiosClient
                .get(`${App.ApiUrl}/orders?limit=100&column_query=order_name,order_id,order_end,order_start,order_status&keyword=nt9&search_by=order_name&keyword=${userName}`)
                .then(r => {
                    const dataCopy = {...r.items};
                    localStorage.setItem('adminOrderList', JSON.stringify(dataCopy))
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
                    message.error('オーダー名がない\n!').then()
                    console.log(e)
                })
        } else if (state !== undefined && userName === 'none') {

            AxiosClient
                .get(`${App.ApiUrl}/orders?limit=100&search_by=order_status&keyword=${state}`)
                .then(r => {
                    const dataCopy = {...r.items};
                    localStorage.setItem('adminOrderList', JSON.stringify(dataCopy))
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
                    message.error('オーダー名がない\n!').then()
                    console.log(e)
                })
        } else if (state !== undefined && userName !== undefined) {
            AxiosClient
                .get(`${App.ApiUrl}/orders?limit=100&column_query=order_name,order_id,order_end,order_start,order_status&keyword=nt9&search_by=order_name&keyword=${userName}`)
                .then(r => {
                    const dataCopy = {...r.items};
                    localStorage.setItem('adminOrderList', JSON.stringify(dataCopy))
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
                    message.error('オーダー名がない\n!').then()
                    console.log(e)
                })
        }
    }
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };
    const [adminOrderList, setAdminOrderList] = useState(
        () => {
            try {
                const lsItem = localStorage.getItem('adminOrderList')
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
        {
            GetData({
                onSuccess: (data) => {
                    console.log('GetData:onSuccess', data)
                    setAdminOrderList(data)

                },
                onError: (data) => {
                    console.log('GetData:onError', data)
                }
            })
        }
        setCurrent(1)
        return () => {
            console.log('UNMOUNT: Admin Screen')
        }
    }, [userName, state])
    const itemsPerPage = 8;
    const startIndex = (current - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedItems = Object.values(adminOrderList).slice(startIndex, endIndex);
    const onChange: PaginationProps['onChange'] = (page) => {
        console.log(page);
        setCurrent(page);
    };

    const handleSubmit = () => {
        // Xử lý giá trị đã nhập ở đây, ví dụ:
        if (inputValue.length === 0) {
            message.error('オーダー名を入力してください!').then();
            navigate(`/adminOrderList`)
        } else {
            navigate(`/adminOrderList/${inputValue}`)

        }
    }
    useEffect(() => {
        const lsItem = localStorage.getItem('adminOrderList');
        if (lsItem) {
            setAdminOrderList(JSON.parse(lsItem));
        }
    }, []);
    const [display, setDisplay] = useState('block')
    const handleButtonClick = (e: any) => {
        let tempAdminOrderList = {...adminOrderList}; // Lưu trữ dữ liệu gốc từ localStorage vào biến tạm thời
        switch (e) {
            case 'オーダー':
                navigate('/adminOrderList/none/1')
                break;
            case '借りる':

                navigate('/adminOrderList/none/2')
                break;
            case '時代遅れ':

                navigate('/adminOrderList/none/3')


                break;
            case '完了':

                navigate('/adminOrderList/none/4')


                break;
            case 'キャンセル':
                navigate('/adminOrderList/none/5')


                break;
            default:
                break;
        }

        setAdminOrderList(tempAdminOrderList);
    };

    const handleOrderClick = (id: string) => {
        console.log(id)
        navigate(`/adminOrderDetail/${id}`)
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
            <div style={{marginTop: "10px",minHeight:'540px'}}>
                <div style={{border: '1px solid', borderRadius: '20px', padding: '10px', backgroundColor: '#84735e', textAlign: "center"}}>
                    <b style={{fontSize: '20px', color: 'white'}}>オーダーリスト</b>
                </div>

                <Space className="site-button-ghost-wrapper" wrap style={{marginTop: '10px', marginLeft: '0px'}}>
                    <Row>
                        <Col span={15} style={{marginLeft: '100px'}}>
                            <Button type="primary" style={{backgroundColor: '#70a8dc', color: 'black', marginRight: '10px', fontSize: '15px', borderRadius: '15px', border: '1px solid'}}
                                    onClick={() => handleButtonClick('オーダー')}
                            >
                                オーダー
                            </Button>
                            <Button type="primary" style={{backgroundColor: '#ffd966', color: 'black', marginRight: '10px', fontSize: '15px', borderRadius: '15px', border: '1px solid'}}
                                    onClick={() => handleButtonClick('借りる')}>
                                借りる
                            </Button>
                            <Button type="primary" style={{backgroundColor: '#93c47d', color: 'black', marginRight: '10px', fontSize: '15px', borderRadius: '15px', border: '1px solid'}}
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
                            <Input placeholder="imput here"
                                   style={{marginLeft: '10px', position: '-webkit-sticky', top: 0, border: '1px solid #C38154 ', height: '35px', width: '400px', borderRadius: '15px/15px'}}
                                   value={inputValue}
                                   onChange={handleInputChange}
                                   onKeyDown={handleKeyDown}
                                   prefix={<SearchOutlined />}
                            />
                        </Col>
                    </Row>
                </Space>
                <div style={{marginTop: '7px', backgroundColor: '#cfb7a1', borderRadius: '15px', marginBottom: '7px'}}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingBottom: '100px', paddingTop: '50px', minHeight: '400px'}}>
                        {Object.values(displayedItems).map((order: any) => (
                            <div key={order.order_id} style={{display: display}}>
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
                            <Pagination simple current={current} onChange={onChange} total={Object.values(adminOrderList).length} pageSize={itemsPerPage} style={{marginBottom: '20px'}}/>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}
export default AdminOrderList