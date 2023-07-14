import React, {useEffect, useState} from "react";
import {AxiosClient} from "@/client/repositories/AxiosClient";
import {useNavigate, useParams} from "react-router-dom";
import type {MenuProps, PaginationProps} from 'antd';
import {Button, Card, Col, Divider, Dropdown, Input, List, message, Pagination, Row, Space} from "antd";
import {DownOutlined} from '@ant-design/icons';
import {App} from "@/client/const/App";
import { SearchOutlined } from '@ant-design/icons';
const AdminBikeListScreen = () => {
    let {local, brand, price,price1} = useParams()
    const [isLoading, setIsLoading] = useState(true);
    const GetData = (opts?: {
        onSuccess?: (data: any) => void
        onError?: (data: any) => void
    }) => {
        if (local === undefined && brand === undefined && price === undefined && price1 === undefined) {
            AxiosClient
                .get(`${App.ApiUrl}/bikes?limit=100`)
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
        } else if (local !== undefined && brand === undefined && price === undefined && price1 === undefined) {
            AxiosClient
                .get(`${App.ApiUrl}/bikes?local=${local}`)
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
        } else if (local === 'none' && brand !== undefined && price === undefined && price1 === undefined) {
            AxiosClient
                .get(`${App.ApiUrl}/bikes?local=&search_by=brand&keyword=${brand}`)
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

        } else if (local !== undefined && brand !== undefined && price === undefined && price1 === undefined) {
            AxiosClient
                .get(`${App.ApiUrl}/bikes?local=${local}&search_by=brand&keyword=${brand}`)
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
        else if (local === 'none' && brand === 'none' && price !== undefined && price1 !== undefined) //trường hợp cả 1 trường không null
        {
            AxiosClient
                .get(`${App.ApiUrl}/bikes?min_price=${price}&max_price=${price1}`)
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
        else if (local !== undefined && brand === 'none' && price !== undefined && price1 !== undefined) //trường hợp cả 3 trường không null
        {
            AxiosClient
                .get(`${App.ApiUrl}/bikes?search_by=brand&local=${local}&min_price=${price}&max_price=${price1}`)
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
        else if (local === 'none' && brand !== undefined && price !== undefined&& price1 !== undefined) {
            AxiosClient
                .get(`${App.ApiUrl}/bikes?keyword=${brand}&search_by=brand&min_price=${price}&max_price=${price1}`)
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
        } else if (local !== undefined && brand !== undefined && price !== undefined&& price1 !== undefined) //trường hợp cả 3 trường không null
        {
            AxiosClient
                .get(`${App.ApiUrl}/bikes?keyword=${brand}&search_by=brand&local=${local}&min_price=${price}&max_price=${price1}`)
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
    }
    const navigate = useNavigate();
    const [Product, setProduct] = useState(() => {
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
        {
            GetData({
                onSuccess: (data) => {
                    console.log('GetData:onSuccess', data)
                    setProduct(data)
                },
                onError: (data) => {
                    console.log('GetData:onError', data)
                }
            })
        }
        setCurrent(1)
        return () => {
            console.log('UNMOUNT: Bike List Screen')
        }
    }, [local, brand, price])

    const itemsPerPage = 8;
    const startIndex = (current - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedItems = Object.values(Product).slice(startIndex, endIndex);

    const onChange: PaginationProps['onChange'] = (page) => {
        console.log(page);
        setCurrent(page);
    };
    const handleViewClick = (bikeId: string) => {
        navigate(`/bikeDetail/${bikeId}`);
    };

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        const {key} = e;
        setSelectedValue1(key);
        if (local === undefined) {
            navigate(`/bikeList/none/${key}`);
        } else if (price === undefined) {
            navigate(`/bikeList/${local}/${key}`);
        } else {
            navigate(`/bikeList/${local}/${key}/${price}/${price1}`);
        }

    };
    const [selectedValue, setSelectedValue] = useState<string | undefined>();
    const [selectedValue1, setSelectedValue1] = useState<string | undefined>();
    const handleMenuClickPrice: MenuProps['onClick'] = (e) => {
        const {key} = e;
        const mangPhanTu = key.split(' ');
        setSelectedValue(key);
        console.log(mangPhanTu)
        if (local === undefined) {
            if (brand === undefined) {
                navigate(`/bikeList/none/none/${mangPhanTu[0]}/${mangPhanTu[1]}`);
            } else {
                navigate(`/bikeList/none/${brand}/${mangPhanTu[0]}/${mangPhanTu[1]}`);
            }
        } else {

            if (brand === undefined) {
                navigate(`/bikeList/${local}/none/${mangPhanTu[0]}/${mangPhanTu[1]}`);
            } else {
                navigate(`/bikeList/${local}/${brand}/${mangPhanTu[0]}/${mangPhanTu[1]}`);
            }
        }

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

        }, {
            label: 'BWM',
            key: 'BWM',

        },
    ];
    const itemsPrice: MenuProps['items'] = [
        {
            label: '0-20000',
            key: '0 20000',

        },
        {
            label: '20000-30000',
            key: '20000 30000',

        },
        {
            label: '30000-40000',
            key: '30000 40000',
        },
        {
            label: '40000-80000',
            key: '40000 80000',
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
        setSelectedValue(undefined)
        setSelectedValue1(undefined)
        // Xử lý giá trị đã nhập ở đây, ví dụ:
        if (inputValue.length === 0) {
            message.error('住所を入力してください').then();
            navigate(`/bikeList`);
        } else {
            navigate(`/bikeList/${inputValue}`);
        }
    }

    return (
        < >
            {/*<div style={{marginTop:'10px',marginLeft:'1280px'}}>*/}

            {/*</div>*/}
            <div style={{marginTop: '30px', marginLeft: '10px',minHeight:'500px'}}>
                <Row>
                    <Col span={19}>
                        <Input placeholder="住所を入力してください!!"
                               style={{marginBottom: '15px', marginLeft: '10px', position: '-webkit-sticky', top: 0, border: '1px solid #C38154 ', height: '40px', width: '400px', borderRadius: '15px/15px'}}
                               value={inputValue}
                               onChange={handleInputChange}
                               onKeyDown={handleKeyDown}
                               prefix={<SearchOutlined />}
                        />
                    </Col>
                    <Col span={4} style={{display: 'flex'}}>
                        <Dropdown menu={menuProps}>
                            <Button style={{marginRight: '10px', border: '1.5px solid #C38154 ',}}>
                                <Space>
                                    {selectedValue1 ? selectedValue1 : ' ブランド'}
                                    <DownOutlined/>
                                </Space>
                            </Button>
                        </Dropdown>
                        <Dropdown menu={menuPropsPrice}>
                            <Button style={{marginRight: '10px', border: '1.5px solid #C38154 ',}}>
                                <Space>
                                    {selectedValue ? selectedValue : '値段'}
                                    <DownOutlined/>
                                </Space>
                            </Button>
                        </Dropdown>
                    </Col>

                </Row>
                <List
                    style={{margin: 0, padding: 0,marginTop:'20px'}}
                    grid={{gutter: 18, column: 4}}
                    dataSource={displayedItems}
                    renderItem={(item: any) => (
                        <>
                            <List.Item key={item.bike_id} style={{border: '2px solid #C38154',}}>
                                <Card
                                    hoverable
                                    onClick={() => handleViewClick(item.bike_id)}
                                    cover={
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            alt="example"
                                            src={`${App.ApiUrl}${item.bikeImage?.[0]?.bike_image}`}
                                        />
                                    }
                                    style={{marginBottom: '-22px', padding: '0', height: '200px'}}
                                >

                                </Card>
                                <Card
                                    style={{border: '1px solid #C38154', borderRadius: 'unset', transform: 'scaleY(0.5)', marginBottom: '-22px'}}
                                >
                                    <p style={{textAlign: "center", fontSize: '25px', transform: 'scaleY(1.5)', margin: '0', padding: '0'}}><b>{item.bike_local}</b></p>

                                </Card>
                                <Card style={{border: '0px solid #C38154', borderRadius: 'unset', margin: '0', padding: '0'}}>
                                    <p style={{textAlign: "center", fontSize: '21px', margin: '0', padding: '0'}}><b>値段: {item.bike_price}VND</b></p>
                                </Card>
                            </List.Item>

                            <Divider/>

                        </>
                    )}
                />

                <Row style={{marginTop:'50px',minHeight:'100px',display:'flex'}}>
                    <Col md={20}>

                    </Col>
                    <Col md={4}>
                        <Pagination simple current={current} onChange={onChange} total={Object.values(Product).length} pageSize={itemsPerPage} style={{marginBottom: '10px'}}/>
                    </Col>
                </Row>

            </div>
        </>
    )
}
export default AdminBikeListScreen