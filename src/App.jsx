import { Route, Routes } from "react-router-dom";
import "./App.css";
import Register from "./Component/RegisterPage/Register";
import Login from "./Component/LoginPage/Login";
import Home from "./Component/HomePage/Home";
import Cart from "./Component/Cart/Cart";
import { useContext } from "react";
import Productdetail from "./Component/Productdetail/Productdetail";
import Aboutus from "./Component/AboutUs/Aboutus";
import User from "./Component/Users/User";
import Allproduct from "./Component/Allproducts/Allproduct";
import Orderhistory from "./Component/OrderHistory/Orderhistory";
import Addroduct from "./Component/AddProduct/Addproduct";
import Search from "./Component/Search/Search";
import Ordersuccess from "./Component/Ordersuccess/Ordersuccess";
import { Usercontext } from "./ContextProviders/UserProvider";
import Pracice from "./Component/AddProduct/Pracice";
import PageNotFound from "./Component/404/PageNotFound";
import Profile from "./Component/Profile/Profile";

function App() {


  const user = useContext(Usercontext);


  return (
    <Routes>
      {/* Route for the no page found */}
      <Route path="/nopagefound" element={<PageNotFound />} />
      {/* A routes thats makes availabe on user log in */}
      {user?.cuser ? (
        <>
          {/* A routes that available only for admin */}
          {user?.currentuserfulldetail?.role == "admin" ? (
            <>
              <Route path="/home" element={<Home />} />
              <Route path="/user" element={<User />} />
              <Route path="/addproducts" element={<Addroduct />} />
              <Route path="/about" element={<Aboutus />} />
              <Route path="/allproducts" element={<Allproduct />} />
              <Route path="/productdetail/:id" element={<Productdetail />} />
              <Route path="/search" element={<Search />} />
              <Route path="/addtextfeild" element={<Pracice />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/" element={<Home />} />
              <Route path="*" element={<PageNotFound />} />
            </>
          )
            :
            // A routes for users
            (<>
              <Route path="/search" element={<Search />} />
              <Route path="/home" element={<Home />} />
              <Route path="/about" element={<Aboutus />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/ordersuccess" element={<Ordersuccess />} />
              <Route path="/productdetail/:id" element={<Productdetail />} />
              <Route path="/allproducts" element={<Allproduct />} />
              <Route path="/orderhistory" element={<Orderhistory />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/" element={<Home />} />
              <Route path="*" element={<PageNotFound />} />
            </>
            )}

        </>
      ) : (
        <>
          {/* A routes for before login */}
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </>
      )}
    </Routes>
  );
}

export default App;
