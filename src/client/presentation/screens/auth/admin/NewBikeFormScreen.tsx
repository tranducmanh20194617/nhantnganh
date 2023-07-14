import React, { useEffect, useState } from 'react';
import {Form, Input, Upload, Button, Select, message} from 'antd';
import { PlusCircleOutlined, CloseOutlined ,UploadOutlined} from '@ant-design/icons';
import {useNavigate} from "react-router-dom";
import {AxiosClient} from "@/client/repositories/AxiosClient";
import {App} from "@/client/const/App";
import { data } from 'autoprefixer';
const CreateBike = (data:any) =>{
    console.log(data)
    AxiosClient.post(`${App.ApiUrl}/create/bike`,data)
        .then(r=>{
            if (r.success){
                console.log(r)
                message.success('Success')
            }
            else {
                console.log(r.error)
                message.error('Error')
            }
        })
        .catch(e => {
            console.log(e)
            message.error('Error')
        })

}
const NewBikeFormScreen = () => {
    const navigate = useNavigate()
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    const [productName, setProductName] = useState('');
    const [brand, setBrand] = useState('');
    const [capacity, setCapacity] = useState('');
    const [tankCapacity, setTankCapacity] = useState('');
    const [consumption, setConsumption] = useState('');
    const [local, setLocal] = useState('');
    const [price, setPrice] = useState('');
    const [plateNum, setPlateNum] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState([]);

    // error
    const [priceError, setPriceError] = useState('');
    const [capacityError, setCapacityError] = useState('');
    const [tankCapacityError, setTankCapacityError] = useState('');
    const [consumptionError, setConsumptionError] = useState('');
    const handleSelectChange = (value: string) => {
        setSelectedValue(value);
    };
    //sua ham nay
    const handleCreateBike = async () => {
        const isFormValid = isEmptyForm();
        if (isFormValid) {
            const Data = {
                productName,
                brand,
                capacity,
                tankCapacity,
                consumption,
                selectedValue,
                local,
                price,
                uploadedFiles,
                plateNum,
            };
            const DataCopy = {
                bike_name:Data.productName,
                bike_brand:Data.brand,
                bike_capacity:Data.capacity,
                bike_tank:Data.tankCapacity,
                bike_consumption:Data.consumption,
                bike_address:Data.selectedValue,
                bike_price:Data.price,
                bike_local:Data.local,
                bike_classify:0,
                bike_images:Data.uploadedFiles,
                bike_plate_num:Data.plateNum,
            };
            console.log(DataCopy);
            await CreateBike(DataCopy);
            setTimeout(() => {
                navigate('/adminBikeList');
            }, 3000); // Chờ 1 giây trước khi chuyển hướng
        } else {
            message.error('完全な情報を入力してください。');
        }
    };
    const handleCancel = async () => {
        await  message.success('キャンセルしました').then()
        navigate('/adminBikeList')
    };
    const handleInputChange = (e: any, setter:any) => {
        setter(e.target.value);
    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        setUploadedFiles(e?.fileList.map((file: any) => file.originFileObj));
        return e?.fileList;
    };
    const invalidInputHandle = (e: any, setter: any) => {
        const value = e.target.value;
        setter(value);
        switch(e.target.name) {
            case 'capacity':
                if (isNaN(Number(value))) {
                    setCapacityError('数字を入力してください !');
                } else {
                    setCapacityError('');
                }
                break;
            case 'price':
                if (isNaN(Number(value))) {
                    setPriceError('数字を入力してください !');
                } else {
                    setPriceError('');
                }
                break;
            case 'tank_capacity':
                if (isNaN(Number(value))) {
                    setTankCapacityError('数字を入力してください !');
                } else {
                    setTankCapacityError('');
                }
                break;
            case 'consumption':
                if (isNaN(Number(value))) {
                    setConsumptionError('数字を入力してください !');
                } else {
                    setConsumptionError('');
                }
                break;
            default:
                return null
        }

    };

    // them ham nay
    const isEmptyForm = () => {
        let isValid = true;

        // Kiểm tra từng trường và đặt isValid thành false nếu trường nào chưa được nhập
        if (!productName || !brand || !capacity || !tankCapacity || !consumption || !selectedValue || !local || !price || uploadedFiles.length === 0) {
            isValid = false;
        }

        return isValid;
    };
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', margin: '10px', marginBottom: '20px', marginTop: '20px' }}>
            <div style={{ maxWidth: '1000px', backgroundColor: 'rgb(207, 183, 161)', padding: '30px', borderRadius: '5px', marginLeft: '30px', marginBottom: '20px' }}>
                <h2 style={{ display: 'flex', justifyContent: 'center', margin: 'auto auto 20px', border: 'solid', maxWidth: '180px' }}>
                    <strong>新しいバイク</strong>
                </h2>
                <Form labelCol={{ style: { width: '120px', fontWeight: 'bold' } }} wrapperCol={{ span: 14 }} layout="horizontal">
                    <Form.Item label="プロダクト名" colon={true} style={{ maxWidth: '90%' }}>
                        <Input
                            style={{ marginLeft: '20px' }}
                            placeholder="プロダクト名"
                            value={productName}
                            onChange={(e) => handleInputChange(e, setProductName)}
                        />
                    </Form.Item>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {/* bike_local */}
                        <Form.Item label="ナンバープレート" colon={true} style={{ maxWidth: '90%' }}>
                            <Input name="plate_num" style={{ marginLeft: '20px' }} placeholder="ナンバープレート" value={plateNum} onChange={(e) => handleInputChange(e, setPlateNum)} />
                        </Form.Item>
                        {/* bike_price */}
                        <Form.Item label="値段" colon={true} style={{ maxWidth: '90%' }}>
                            <Input name="price" style={{ marginLeft: '20px' }} placeholder="値段" value={price} onChange={(e) => {
                                handleInputChange(e, setPrice);
                                invalidInputHandle(e, setPriceError);
                            }} />
                            {priceError && <div style={{ color: 'red', marginLeft: '20px' }}>{priceError}</div>}
                        </Form.Item>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {/* bike_brand */}
                        <Form.Item label="ブランド" colon={true} style={{ maxWidth: '90%' }}>
                            <Input style={{ marginLeft: '20px' }} placeholder="ブランド" value={brand} onChange={(e) => handleInputChange(e, setBrand)} />
                        </Form.Item>
                        {/* bike_tank */}
                        <Form.Item label="容量" colon={true} style={{ maxWidth: '90%' }}>
                            <Input name='capacity' style={{ marginLeft: '20px' }} placeholder="容量" value={capacity} onChange={(e) => {
                                handleInputChange(e, setCapacity);
                                invalidInputHandle(e, setCapacityError);
                            }} />
                            {capacityError && <div style={{ color: 'red', marginLeft: '20px' }}>{capacityError}</div>}
                        </Form.Item>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {/* bike_capacity */}
                        <Form.Item label="ボンベ容量" colon={true} style={{ maxWidth: '90%' }}>
                            <Input name='tank_capacity' style={{ marginLeft: '20px' }} placeholder="ボンベ容量" value={tankCapacity} onChange={(e) => {
                                handleInputChange(e, setTankCapacity);
                                invalidInputHandle(e, setTankCapacityError);
                            }} />
                            {tankCapacityError && <div style={{ color: 'red', marginLeft: '20px' }}>{tankCapacityError}</div>}
                        </Form.Item>
                        {/* bike_consumption */}
                        <Form.Item label="燃費" colon={true} style={{ maxWidth: '90%' }}>
                            <Input name='consumption' style={{ marginLeft: '20px' }} placeholder="燃費" value={consumption} onChange={(e) => {
                                handleInputChange(e, setConsumption);
                                invalidInputHandle(e, setConsumptionError);
                            }} />
                            {consumptionError && <div style={{ color: 'red', marginLeft: '20px' }}>{consumptionError}</div>}
                        </Form.Item>
                    </div>
                    <Form.Item label="ローカル" colon={true} style={{ maxWidth: '90%' }}>
                        <Input name="local" style={{ marginLeft: '20px' }} placeholder="ローカル" value={local} onChange={(e) => handleInputChange(e, setLocal)} />
                    </Form.Item>
                    <Form.Item label="エリア" style={{ maxWidth: '90%' }}>
                        <Select style={{ marginLeft: '20px' }} placeholder="エリア" value={selectedValue} onChange={handleSelectChange}>
                            <Select.Option value="250 Minh Khai, Hai ba trung, Ha noi, Viet nam">250 Minh Khai, Hai ba trung, Ha noi, Viet nam</Select.Option>
                            <Select.Option value="03 Thuy Khue, Tay Ho, Ha Noi">03 Thuy Khue, Tay Ho, Ha Noi</Select.Option>
                            <Select.Option value="29 Gia Thuy, Long Bien, Ha Noi">29 Gia Thuy, Long Bien, Ha Noi</Select.Option>
                            <Select.Option value="28 Nguyen Dong Chi, Cau Dien, Nam Tu Liem, Ha Noi">28 Nguyen Dong Chi, Cau Dien, Nam Tu Liem, Ha Noi</Select.Option>
                            <Select.Option value="258 Thinh Liet, Hoang Mai, Ha Noi">258 Thinh Liet, Hoang Mai, Ha Noi</Select.Option>
                            <Select.Option value="57 Hang Ma, Hoan Kiem, Ha Noi">57 Hang Ma, Hoan Kiem, Ha Noi</Select.Option>
                            <Select.Option value="208 Hoang Quoc Viet, Co Nhue, Bac Tu Liem, Ha Noi">208 Hoang Quoc Viet, Co Nhue, Bac Tu Liem, Ha Noi</Select.Option>
                            <Select.Option value="55 Giap Nhat, Thuong Dinh, Thanh Xuan, Ha Noi">55 Giap Nhat, Thuong Dinh, Thanh Xuan, Ha Noi</Select.Option>
                            <Select.Option value="07 Dien Bien Phu, Dien Bien, Ba Dinh, Ha Noi">07 Dien Bien Phu, Dien Bien, Ba Dinh, Ha Noi</Select.Option>

                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="upload"
                        label="イメージ"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                    >
                        <Upload name="logo" action="/upload.do" listType="picture">
                            <Button icon={<UploadOutlined />}>画像をアップロード</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </div>
            <div style={{ maxWidth: '1000px', marginLeft: '40px' }}>
                <div style={{ width: '80%', backgroundColor: 'rgb(132, 115, 94)', padding: '30px', borderRadius: '5px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', margin: '20px' }}>
                        <PlusCircleOutlined style={{ fontSize: '50px', marginLeft: '30px' }} />
                        <Button
                            type="primary"
                            danger
                            onClick={handleCreateBike}
                            style={{ width: '250px', height: '50px', fontSize: '22px', padding: '10px', backgroundColor: '#60B95E', color: 'black', marginLeft: '35px' }}
                        >
                            <strong>新しいバイク</strong>
                        </Button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', margin: '50px 20px 20px' }}>
                        <CloseOutlined style={{ fontSize: '50px', marginLeft: '30px' }} />
                        <Button
                            type="primary"
                            danger
                            onClick={handleCancel}
                            style={{ width: '250px', height: '50px', fontSize: '22px', padding: '10px', backgroundColor: '#df6565', color: 'black', marginLeft: '35px' }}
                        >
                            <strong>キャンセル</strong>
                        </Button>
                    </div>
                </div>
                <div>
                    <img src="https://i.ibb.co/fk0sQKL/Screenshot-from-2023-07-04-00-08-00.png" style={{ width: '90%', margin: '10px' }} />
                </div>
            </div>
        </div>
    );
};

export default NewBikeFormScreen;
