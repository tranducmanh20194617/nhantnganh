import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {AxiosClient} from "@/client/repositories/AxiosClient";
import {Carousel} from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {message, Modal,Form,Input,Button} from 'antd';
import {StoreConfig} from "@/client/config/StoreConfig";
import {App} from "@/client/const/App";
const contentStyle: React.CSSProperties = {
    marginLeft: '5%',
    width: '40%',
    height: '600px',
    color: '#fff',
    background: 'rgb(132, 115, 94)',
    borderRadius: '10px',
    marginRight: '5%',
};

const listType: React.CSSProperties = {
    listStyleType: '- ',
    marginLeft: '40px',
    fontSize: '20px',
};

const checkOut: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: '100px',
    marginTop: '60px'

};
const AdminBikeDetailScreen = () => {
    const {bikeId} = useParams();
    const nagivate = useNavigate()
    const storeConfig = StoreConfig.getInstance()
    const [isLoading, setIsLoading] = useState(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const GetData = async (opts?: {
        onSuccess?: (data: any) => void
        onError?: (data: any) => void
    }) => {
        AxiosClient
            .get(`${App.ApiUrl}/${bikeId}`)
            .then(r => {
                console.log(r)
                const dataCopy = {...r.items}
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


    const [bike, setBike] = useState(() => {
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

    useEffect(() => {
        setIsLoading(true);
        console.log('MOUNT: Bike Detail Screen')
        GetData({
            onSuccess: (data) => {
                console.log('GetData:onSuccess', data)
                setBike(data)
                setIsLoading(false);
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
    }, [])

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [isModalOpenChange, setIsModalOpenChange] = useState(false);
    const [selectForm, setSelectForm] = useState<boolean>(false)
    const [selectedBike, setSelectedBike] = useState(null);
    const [form] = Form.useForm();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setOpen(true);
    };
    const handleOk1 = () => {
        setIsModalOpen(false);
        setIsModalOpenChange(false)
        window.location.reload();
    }
    const handleCancel1 = () => {
        setIsModalOpen(false);
        setIsModalOpenChange(false)
    }
    const handleOk = () => {
        setConfirmLoading(true);
        DeleteBike(bikeId)
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
            message.success('はい、解消しました')
            setTimeout(() => {
                nagivate('/adminBikeList');
            }, 2000);
        }, 2000);


    };
    const DeleteBike = (id:any) =>{         //logic delete bike
        console.log(id)
        AxiosClient.get(`http://127.0.0.1:8000/delete/bike/${id}`)
            .then(r=>{
                console.log(r)

            })
            .catch(e => {
                console.log(e)
                message.error('')
            })
    }
 const onEditBike = (data :any,id:any) =>{
     console.log(data)
     console.log(id)
     AxiosClient.post(`http://127.0.0.1:8000/update/bike/${bike.bike_id}`,data)
         .then(r=>{
             if (r.success){
                 console.log(r)
                 message.success(' アップデートしました')
             }
             else {
                 console.log(r.error)
                 message.error('アップデートエラー')
             }
         })
         .catch(e => {
             console.log(e)
             message.error('Error')
         })
 }
    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };
    const ChangeForm = ()=>{
        const onFinish = async (values: any) => {
            console.log('onFinish:', values)
            const id = parseInt(values.bike_id)
            console.log(id)
            console.log(storeConfig.token)
            try {
                await onEditBike(values,id)

            } catch (error) {
                console.log(error);
            }

        }
        const onFinishFailed = (errorInfo: any) => {
            console.log('onFinishFailed:', errorInfo)
            message.error('Update failed!').then();
        }
        return (
            <div style={{display: "flex", justifyContent: "space-evenly"}}>
                <Form
                    name="basic"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 20 }}
                    style={{ maxWidth: 800, width: 500 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    form={form} // Pass the form variable to the form prop

                >
                    <Form.Item
                        label="バイクのID"
                        name="bike_id"
                        rules={[{required: true, message: 'Please input your name Product!'}]}
                    >
                        <Input disabled={true}/>
                    </Form.Item>
                    <Form.Item
                        label="ブランド"
                        name="bike_brand"
                        rules={[{required: true, message: 'Please input Price!'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="名前"
                        name="bike_name"
                        rules={[{required: true, message: 'Please input your name Product!'}]}

                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="住所"
                        name="bike_address"
                        rules={[{required: true, message: 'Please input Price!'}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="地元"
                        name="bike_local"
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="値段"
                        name="bike_price"
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="容量"
                        name="bike_tank"
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                    label="燃費"
                    name="bike_consumption"
                >
                    <Input/>
                </Form.Item>
                    <Form.Item
                        label="ボンベ容量"
                        name="bike_capacity"
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item wrapperCol={{offset: 11, span: 16}}>
                        <Button
                            htmlType="submit"
                        >
                            アップデート
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }

    const handleEdit = () => {
        setIsModalOpenChange(true);
        setSelectForm(true)
        form.setFieldsValue({
                        bike_id: bike.bike_id,
                        bike_name: bike.bike_name,
                        bike_address: bike.bike_address,
                        bike_brand: bike.bike_brand,
                        bike_capacity: bike.bike_capacity,
                        bike_local: bike.bike_local,
                        bike_price: bike.bike_price,
                        bike_tank: bike.bike_tank,
                        bike_consumption: bike.bike_consumption,
                        bike_classify: bike.bike_classify,
                    });

    };


    const imagePath = `/storage/app/public/bike_image/${bikeId}.1.jpg`;
    const imagePath2 = `/storage/app/public/bike_image/${bikeId}.2.jpg`;
    const imagePath3 = `/storage/app/public/bike_image/${bikeId}.3.jpg`;
    return (
        <>    {isLoading ? (
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
            <div style={{paddingTop: '30px', paddingBottom: '30px'}}>
                {
                    selectForm && (
                        <Modal title="バイクのアップデート" open={isModalOpenChange} onOk={handleOk1} onCancel={handleCancel1}>
                            <ChangeForm/>
                        </Modal>
                    )
                }
                <div style={{display: 'flex', marginTop: '20px'}}>
                    <div style={{marginLeft: '12%', width: '35%', height: '300px'}}>
                        <Carousel>
                            <div>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    alt="example1"
                                    src={imagePath}/>

                            </div>
                            <div>
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
                        <p style={{background: 'rgb(0, 195, 177)', width: '100px', marginLeft: '20px', textAlign: 'center', borderRadius: '10px', color: 'black'}}>在庫あり</p>
                        <div style={{display: 'flex', color: 'white'}}>
                            <p style={{marginLeft: '30px', fontSize: '30px', marginTop: '15px', width: '50%'}}><b>{bike.bike_name}</b></p>
                            <p style={{marginLeft: '30px', fontSize: '35px', marginTop: '10px', width: '50%'}}><b>{bike.bike_price}￥/時間</b></p>
                        </div>

                        <div style={{...listType}}>
                            <p style={{}}>- 住所: <b>{bike.bike_address}</b></p>
                            <p style={{}}>- ブランド: <b>{bike.bike_brand}</b></p>
                            <p style={{}}>- 容量: <b>{bike.bike_tank}</b></p>
                            <p style={{}}>- 燃費: <b>{bike.bike_consumption}</b></p>
                            <p style={{}}>- ボンベ容量: <b>{bike.bike_capacity}cc</b></p>

                        </div>
                        <div style={checkOut}>

                            <button onClick={() => handleEdit()} style={{marginLeft:'15%', background:'rgb(0, 195, 177)', fontSize:'20px', height:'50px', borderRadius:'10px'}}>アップデート</button>
                            <button onClick={showModal} style={{marginLeft:'10%', background:'rgb(255, 107, 101)', fontSize:'20px', height:'50px', borderRadius:'10px', width: '120px'}}>解消</button>

                            <Modal
                                title="確認します"
                                open={open}
                                onOk={handleOk}
                                confirmLoading={confirmLoading}
                                onCancel={handleCancel}
                            >
                                <p>このバイクを解消することを確認しますか❓</p>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </>
    );
};
export default AdminBikeDetailScreen