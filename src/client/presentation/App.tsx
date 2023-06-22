import {Route, Routes} from "react-router-dom";
import LoginScreen from "@/client/presentation/screens/auth/LoginScreen";
import Error404 from "@/client/presentation/screens/error/404";
import RegisterScreen from "@/client/presentation/screens/auth/RegisterScreen";
import HomeScreen from "@/client/presentation/screens/common/HomeScreen";
import {PrivateRouter} from "@/client/presentation/layouts/PrivateRouter";
import {MasterLayout} from "@/client/presentation/layouts/MasterLayout";
import BikeListScreen from "@/client/presentation/screens/auth/BikeListScreen";
import BikeDetailScreen from "@/client/presentation/screens/auth/BikeDetailScreen";
import SearchScreen from "@/client/presentation/screens/auth/SearchScreen";
import {AdminLayout} from "@/client/presentation/layouts/AdminLayout";
import AdminOrderList from "@/client/presentation/screens/auth/admin/AdminOrderList";
import AdminBikeListScreen from "@/client/presentation/screens/auth/admin/AdminBikeListScreen";
import AdminBikeDetailScreen from "@/client/presentation/screens/auth/admin/AdminBikeDetailScreen";
import OrderDetailScreen from "@/client/presentation/screens/auth/admin/AdminOrderDetailScreen";
import AdminOrderDetailScreen from "@/client/presentation/screens/auth/admin/AdminOrderDetailScreen";
import UserOrderDetailScreen from "@/client/presentation/screens/auth/user/UserOrderDetailScreen";
import UserOrderListScreen from "@/client/presentation/screens/auth/user/UserOrderListScreen";
import UserOrderCreate from "@/client/presentation/screens/auth/user/UserOrderCreateScreen";
import UserOrderCreateScreen from "@/client/presentation/screens/auth/user/UserOrderCreateScreen";
export const App = () => {
    return (
        <Routes>
            <Route key={"*"} path={"*"} element={<Error404/>}/>
            <Route key={"login"} path={"/login"} element={<LoginScreen/>}/>
            <Route key={"register"} path={"/register"} element={<RegisterScreen/>}/>
            <Route element={<MasterLayout/>}>
                <Route key={"home"} path={"/"} element={<HomeScreen/>}/>
                <Route key={"productList"} path={"/bikeList/:local?/:brand?/:price?"} element={<BikeListScreen/>}/>
                <Route key={"bikeDetail"} path={"/bikeDetail/:bikeId"} element={<BikeDetailScreen/>}/>
                <Route key={"bikeSearch"} path={"/searchBike/:keyword?/:keyword2?/:keyword3?"} element={<SearchScreen/>}/>
                <Route key={"userOrderDetail"} path={"/userOrderDetail/:orderId?"} element={<UserOrderDetailScreen/>}/>
                <Route key={"userOrderDetail"} path={"/userOrderCreate"} element={<UserOrderCreateScreen/>}/>
                <Route key={"userOrderList"} path={"/userOrderList/:orderState?"} element={<UserOrderListScreen/>}/>
            </Route>
            <Route element={<AdminLayout/>}>
                <Route key={"adminOrderList"} path={"/adminOrderList/:userName?/:state?"} element={<AdminOrderList/>}/>
                <Route key={"adminBikeList"} path={"/adminBikeList/:local?/:brand?/:price?"} element={<AdminBikeListScreen/>}/>
                <Route key={"bikeDetail"} path={"/adminBikeDetail/:bikeId"} element={<AdminBikeDetailScreen/>}/>
                <Route key={"OrderDetail"} path={"/adminOrderDetail/:adminOrderId"} element={<AdminOrderDetailScreen/>}/>
            </Route>
        </Routes>
    )
}
