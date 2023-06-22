
import React, {useEffect, useState} from "react";
import {AxiosClient} from "@/client/repositories/AxiosClient";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Card, Col, Divider, Input, List, message, Row, Space,Dropdown} from "antd";
import type { PaginationProps } from 'antd';
import { Pagination } from 'antd';
import type { MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';
const AdminBikeListScreen =()=>{
    let {local,brand,price} = useParams()
    console.log(local)
    const GetData = (opts?: {
        onSuccess?: (data: any) => void
        onError?: (data: any) => void
    }) => {
        if (local===undefined&&brand===undefined&&price===undefined)
        {
            AxiosClient
                .get(`http://127.0.0.1:8000/bikes?limit=100`)
                .then(r => {
                    const dataCopy = {...r.items};
                    localStorage.setItem('DataBike', JSON.stringify(dataCopy))
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
        else if (local!==undefined&&brand===undefined&&price===undefined)
        {
            AxiosClient
                .get(`http://127.0.0.1:8000/bikes?local=${local}`)
                .then(r => {
                    const dataCopy = {...r.items};
                    localStorage.setItem('DataBike', JSON.stringify(dataCopy))
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
                    message.error('住所を入力してください')
                    console.log(e)
                })
        }

        else if (local==='none'&&brand!==undefined&&price===undefined)
        {
            AxiosClient
                .get(`http://127.0.0.1:8000/bikes?local=&search_by=brand&keyword=${brand}`)
                .then(r => {
                    const dataCopy = {...r.items};
                    localStorage.setItem('bikeSearch', JSON.stringify(dataCopy))
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
                    message.error('該当バイクはありませんでした')
                    console.log(e)
                })
        }
        else if (local!==undefined&&brand!==undefined&&price===undefined)
        {
            AxiosClient
                .get(`http://127.0.0.1:8000/bikes?local=${local}&search_by=brand&keyword=${brand}`)
                .then(r => {
                    const dataCopy = {...r.items};
                    localStorage.setItem('bikeSearch', JSON.stringify(dataCopy))
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
                    message.error('該当バイクはありませんでした')
                    console.log(e)
                })
        }
        else if (local!==undefined&&brand!==undefined&&price!==undefined) //trường hợp cả 3 trường không null
        {
            // AxiosClient
            //     .get(`http://127.0.0.1:8000/bikes?local=${local}&search_by=brand&keyword=${brand}`)
            //     .then(r => {
            //         const dataCopy = {...r.items};
            //         localStorage.setItem('bikeSearch', JSON.stringify(dataCopy))
            //         if (opts?.onSuccess) {
            //             opts.onSuccess(dataCopy)
            //
            //         } else if (r.error) {
            //             if (opts?.onError) {
            //                 opts.onError(r.error)
            //             }
            //         }
            //         console.log(r)
            //     })
            //     .catch(e => {
            //         message.error('該当バイクはありませんでした')
            //         console.log(e)
            //     })
        }
    }

    const navigate = useNavigate();
    const [Product,setProduct] = useState(() =>
        {
            try {
                const lsItem = localStorage.getItem('DataBike')
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
        console.log('MOUNT: Bike List Screen')
        { GetData({
            onSuccess: (data) => {
                console.log('GetData:onSuccess', data)
                setProduct(data)
            },
            onError: (data) => {
                console.log('GetData:onError', data)
            }
        })}
        setCurrent(1)
        return () => {
            console.log('UNMOUNT: Bike List Screen')
        }
    }, [local,brand,price])
    const itemsPerPage = 8;
    const startIndex = (current - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedItems = Object.values(Product).slice(startIndex, endIndex);

    const onChange: PaginationProps['onChange'] = (page) => {
        console.log(page);
        setCurrent(page);
    };
    const handleViewClick = (bikeId:string) => {
        navigate(`/bikeDetail/${bikeId}`);
    };

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        const { key } = e;
        if (local === undefined) {
            navigate(`/bikeList/none/${key}`);
        } else if(price === undefined) {
            navigate(`/bikeList/${local}/${key}`);
        }
        else {
            navigate(`/bikeList/${local}/${key}/${price}`);
        }

    };
    const handleMenuClickPrice: MenuProps['onClick'] = (e) => {
        const { key } = e;

    };
    const items: MenuProps['items'] = [
        {
            label: 'Honda',
            key: 'Honda',

        },
        {
            label: 'Yamaha',
            key: 'Yamaha',

        },
        {
            label: 'Suzuki',
            key: 'Suzuki',
        },
        {
            label: 'Kawasaki',
            key: 'Kawasaki',
        },
        {
            label: 'Benelli',
            key: 'Benelli',

        },
        {
            label: 'Harley',
            key: 'Harley',

        },{
            label: 'BWM',
            key: 'BWM',

        },
    ];
    const itemsPrice: MenuProps['items'] = [
        {
            label: '100',
            key: '100',

        },
        {
            label: '200',
            key: '200',

        },
        {
            label: '300',
            key: '300',
        },
        {
            label: '400',
            key: '400',
        },
    ];
    const menuProps = {
        items,
        onClick: handleMenuClick,
    };
    const menuPropsPrice = {
        items: itemsPrice,
        onClick: handleMenuClickPrice,
    };
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
            navigate(`/bikeList`);
        }
        else {
            navigate(`/bikeList/${inputValue}`);
        }}

    return (
        < >
            {/*<div style={{marginTop:'10px',marginLeft:'1280px'}}>*/}

            {/*</div>*/}
            <div style={{marginTop:'10px',marginLeft:'10px',}}>
                <Row>
                    <Col span={19}>
                        <Input placeholder="住所を入力してください!!"
                               style={{marginBottom: '15px',marginLeft:'10px', position: '-webkit-sticky', top: 0,border: '1px solid #C38154 ',height:'40px' , width: '400px',  borderRadius:'15px/15px' }}
                               value={inputValue}
                               onChange={handleInputChange}
                               onKeyDown={handleKeyDown}
                        />
                    </Col>
                    <Col span={4} style={{ display: 'flex' }}>
                        <Dropdown menu={menuProps} >
                            <Button style={{marginRight:'10px',border: '1.5px solid #C38154 ',}}>
                                <Space>
                                    ブランド
                                    <DownOutlined />
                                </Space>
                            </Button>
                        </Dropdown>
                        <Dropdown menu={menuPropsPrice}>
                            <Button style={{marginRight:'10px',border: '1.5px solid #C38154 ',}}>
                                <Space>
                                    値段
                                    <DownOutlined />
                                </Space>
                            </Button>
                        </Dropdown>
                    </Col>

                </Row>
                <List
                    style={{ margin: 0, padding: 0 }}
                    grid={{gutter: 18, column: 4}}
                    dataSource={displayedItems}
                    renderItem={(item: any) => (
                        <>
                            <List.Item key={item.bike_id} style={{ border: '2px solid #C38154',}}>
                                <Card
                                    hoverable
                                    onClick={() => handleViewClick(item.bike_id)}
                                    cover={
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            alt="example"
                                            src={`/storage/app/public/bike_image/${item.bike_id}.1.jpg`}
                                        />
                                    }
                                    style={{ marginBottom: '-22px', padding: '0',height: '200px' }}
                                >

                                </Card>
                                <Card
                                    style={{ border: '1px solid #C38154', borderRadius: 'unset', transform: 'scaleY(0.5)', marginBottom: '-22px' }}
                                >
                                    <p style={{ textAlign: "center", fontSize: '25px', transform: 'scaleY(1.5)', margin: '0', padding: '0' }}><b>{item.bike_local}</b></p>

                                </Card>
                                <Card style={{ border: '0px solid #C38154', borderRadius: 'unset', margin: '0', padding: '0' }}>
                                    <p style={{ textAlign: "center", fontSize: '21px', margin: '0', padding: '0' }}><b>値段: {item.bike_price}￥</b></p>
                                </Card>
                            </List.Item>

                            <Divider/>

                        </>
                    )}
                />

                <Row>
                    <Col md={20}>

                    </Col>
                    <Col md={4}>
                        <Pagination simple current={current} onChange={onChange} total={Object.values(Product).length} pageSize={itemsPerPage} style={{marginBottom:'20px'}} />
                    </Col>
                </Row>

            </div>
        </>
    )
}
export default AdminBikeListScreen