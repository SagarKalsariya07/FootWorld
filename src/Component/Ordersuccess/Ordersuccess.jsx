import {  useLocation, useNavigate } from "react-router-dom"
import success from "../Images/check.png"
import Header from "../Header/Header"
import './Ordersuccess.css'
import { useEffect } from "react"

const Ordersuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(()=>{
      if(!location.state?.orderid){ // Open This page if this page get the state in location(URL)
        navigate(`/home`);
      }
  },[location.state,navigate])
     const home = () => {
        navigate(`/home`)
      }
    
      const orderhistory = () => {
        navigate(`/orderhistory`)
      }
  return (
    <>
    <Header/>
      <div className="order-success">
            <img
              src={success}
              alt="Order Success"
              className="order-success-icon"
            />
            <h1>Order Placed Successfully!</h1>
            <p>Thank you for shopping with us.</p>
            <div className="order-buttons">
              <button className="order-btn" onClick={home}>Go Back to Home</button>
              <button className="order-btn view-orders" onClick={orderhistory}>View Orders</button>
            </div>
          </div>
    </>
  )
}

export default Ordersuccess
