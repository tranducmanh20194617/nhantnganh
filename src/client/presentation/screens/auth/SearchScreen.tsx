import {useNavigate, useParams} from "react-router-dom";
import {AxiosClient} from "@/client/repositories/AxiosClient";
import React, {useEffect, useState} from "react";
import {Button, Card, Col, Divider, Dropdown, Input, List, MenuProps, message, Pagination, PaginationProps, Row, Space} from "antd";
import { DownOutlined } from '@ant-design/icons';
const SearchScreen =()=>{
    let {keyword } = useParams();
    let {keyword2,keyword3} = useParams();
    console.log(keyword2)
    const GetData = (opts?: {
        onSuccess?: (data: any) => void
        onError?: (data: any) => void
    }) => {
        if(keyword2===undefined) {
            AxiosClient
                .get(`http://127.0.0.1:8000/bikes?local=${keyword}`)
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
                    console.log(e)
                    message.error('住所を入力してください').then()

                })
        }
        else if(keyword3===undefined){
            AxiosClient
                .get(`http://127.0.0.1:8000/bikes?local=${keyword}&search_by=brand&keyword=${keyword2}`)
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
        else if(keyword2 === 'none')
        {
            AxiosClient
                .get(`http://127.0.0.1:8000/bikes?local=${keyword}&search_by=price&keyword=${keyword3}`)
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
        else {

        }
    }
    const navigate = useNavigate();
    const [Product,setProduct] = useState(() =>
        {
            try {
                const lsItem = localStorage.getItem('bikeSearch')
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
        console.log('MOUNT: Bike Search Screen')
        { GetData({
            onSuccess: (data) => {
                console.log('GetData:onSuccess', data)
                setProduct(data)
            },
            onError: (data) => {
                console.log('GetData:onError', data)
            }
        })}
        return () => {
            console.log('UNMOUNT: Bike Search Screen')
        }
    }, [keyword,keyword2,keyword3])
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
        console.log('click', key);
        if(keyword3===undefined)
        {
            navigate(`/searchBike/${keyword}/${key}`)
        }
        else {
            navigate(`/searchBike/${keyword}/${key}/${keyword3}`)
        }
    };
    const handleMenuClickPrice: MenuProps['onClick'] = (e) => {
        const { key } = e;
        console.log('click', key);
        if(keyword2===undefined)
        {
            navigate(`/searchBike/${keyword}/none/${key}`)
        }
        else {
            navigate(`/searchBike/${keyword}/${keyword2}/${key}`)
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
            message.error('住所を入力してください!').then();
        }
        else {
            navigate(`/searchBike/${inputValue}`);
        }}

    return (
        < >

            <div style={{marginTop:'10px',marginLeft:'10px',}}>
                <Row>
                    <Col span={19}>
                        <Input placeholder="住所を入力してください"
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
                                    style={{ marginBottom: '-22px', padding: '0',height:'200px' }}
                                >

                                </Card>
                                <Card
                                    style={{ border: '1px solid #C38154', borderRadius: 'unset', transform: 'scaleY(0.5)', marginBottom: '-20px' }}
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
export default SearchScreen