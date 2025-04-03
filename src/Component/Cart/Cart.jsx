import { useContext, useEffect } from "react";
import Header from "../Header/Header";
import "./Cart.css";
import {
  addDoc,
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  documentId,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { database } from "../../Firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import emptyCartImage from "../Images/cart.png"
import { Cartcontext } from "../../ContextProviders/Cartprovider";
import { Usercontext } from "../../ContextProviders/UserProvider";
import { toast, ToastContainer } from "react-toastify";
import Slider_quant from "../Slider-Quantity/Slider_quant";


const Cart = () => {
  const navigate = useNavigate();
  const [totalprice, setTotalprice] = useState(0);
  const [cartfulldetail, setCartfulldetail] = useState([]);
  const [queryresult, setQueryresult] = useState([]);
  const [resetCount, setResetCount] = useState(0)
  //Used Context of cart and user
  const cart = useContext(Cartcontext);
  const user = useContext(Usercontext)

  useEffect(() => {
    try {
      //Getting cartids of product that are in cart
      const cartids = cart.cartitem?.map((cartid) => cartid.productid) || [];

      if (cartids.length === 0) {
        setQueryresult([]); // Reset when no items in cart
        return;
      }

      //Creating Parts of cartIds
      const parts = [];
      for (let i = 0; i < cartids.length; i += 10) {
        parts.push(cartids.slice(i, i + 10));
      }

      //Getting cartitem detail from product document from firestore
      const filter = parts.map((partone) => {
        const q = query(collection(database, "Products"), where(documentId(), "in", partone)); //create query for getting product detail

        //Running query for getting productdetail
        return onSnapshot(q, (pritem) => {
          const productdetail = pritem.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setQueryresult([...productdetail]); //  Ensure all products are included in queryresult        
        });
      });

      return () => filter.forEach((unsubscribe) => unsubscribe()); //  Proper cleanup after completion of query 
    } catch (error) {
      console.error("Error in getting full cart detail", error);
    }
  }, [cart.cartitem]); //  Depend on `cart.cartitem`, updates when a new product is added

  //  Update `cartfulldetail` after `queryresult` is updated
  useEffect(() => {
    if (queryresult.length > 0) {
      const productdata_Withquantity = cart?.cartitem.map((cart) => {
        const productdetail = queryresult.find((pid) => pid.id === cart.productid); //comparing queryresult id with cartitemid for getting cart  quantity from cartitem
        if (productdetail) {
          return { ...productdetail, quantity: cart.quantity }; //return quantity if id is found
        }
      });
      setCartfulldetail(productdata_Withquantity); //Giving detail to cartdeatil for showing in ui
    }
  }, [queryresult]); //  Depend on `queryresult`, ensuring it's updated before computing `cartfulldetail`


  //calculating total price
  useEffect(() => {
    let price = 0;
    cartfulldetail?.map((cfdetail) => (price += cfdetail.quantity * cfdetail.price));
    setTotalprice(price);
  }, [cartfulldetail]);

  const addmore = () => {
    navigate(`/allproducts`);
  };

  //remove product from cart function
  const removeitem = async (cart1) => {

    try {
      const remove = cart.cartitem?.find((e) => e.productid === cart1.id); //Getting id of clicked product
      //Updating cart doc
      await updateDoc(doc(database, "Cart", user.cuser.uid), {
        items: arrayRemove(remove),
      });
      toast.success(`${cart1.productname} Removed from cart`, {
        position: "top-left", 
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (error) {
      console.error("Error in removing cart", error);
    }
  };

  //Buy Now function
  const buyNow = async () => {
    try {
      const check = cartfulldetail?.every((abc) => abc.quantity <= abc.stock);//check for availability of product through checking stock of an item
      if (check) {
        for (const cart1 of cartfulldetail) {

          const updatedstock = cart1.stock - cart1.quantity; //Updating the stock

          await updateDoc(doc(database, "Products", cart1.id), { //updating cart doc
            stock: updatedstock
          });
          
          await deleteDoc(doc(database, "Cart", user?.cuser.uid));//updating cart doc
        };
        const order =
        {
          cartitem: cart.cartitem,
          totalAmount: totalprice,
          createdAt: new Date(),
          orderStatus: "confirmed",
          Userid: user.cuser.uid,
        };
        const order1 = await addDoc(collection(database, "Orders"), order);//Adding Order detail to order document in firestore
        setTotalprice(0);
        setResetCount((prev)=> prev+1)
        navigate(`/ordersuccess`, { state: { orderid: order1.id } }); //navigate to order success page
      } else {
        const data = cartfulldetail?.filter((item) => item.quantity > item.stock); //Finding the products that are not in stock

        const productdt = data.map((ev) => ev.productname);//creating object of product name with 0 stock

        toast.success(`${productdt.join()}'s quantity not available`, {
          position: "top-left", 
          autoClose: 1000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        }); //Joing them and displaying through Toast
      }
    } catch (error) {
      console.error("Error in Buy Order", error);
    }

  };

  const shopnow = () => {
    navigate(`/allproducts`);
  }

const handlequantity = async(productid,newQuantity) =>{
  const updatequantity = cart.cartitem?.map((item) => {
    return item.productid === productid ? { ...item, quantity: newQuantity } : item  //updating quantity after getting desired product id
  });
  //Updating the cart doc with inrcremented quantity
  await updateDoc(doc(database, "Cart", user.cuser.uid), {
    items: updatequantity,
  });
}

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Cart</title>
        </Helmet>
      </HelmetProvider>
      <div className="allcart">
        <Header />
        {cart?.cartitem?.length > 0 ? (
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th colSpan="2" style={{ fontSize: "40px" }}>
                    Your Cart
                  </th>
                  <th colSpan="2">
                    Total amount :  <br />  ₹ {totalprice}
                  </th>
                  <th style={{ width: "120px" }}>
                    <button className="qntbutton1" onClick={addmore}>
                      Shop more
                    </button>
                  </th>
                  <th style={{ width: "120px" }}>
                    <button className="qntbutton1" onClick={buyNow}>
                      Buy Now
                    </button>
                  </th>
                </tr>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartfulldetail?.map((itm, index) => (
                  <tr key={index}>
                    <th>{itm.productname}</th>
                    <td>{itm.description}</td>
                    <td>{itm.category}</td>
                    <td>{itm.price}</td>
                    <td className="slide">
                      <Slider_quant 
                        productid = {itm.id}
                        onQuantityChange = {handlequantity}
                        intialquantity = {itm.quantity}
                        resetTrigger={resetCount}
                      />
                    </td>
                    <td>
                      <button
                        title="Delete from cart" 
                        className=""
                        onClick={() => removeitem(itm)}
                      >
                       <svg className="deletesvg" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#ff0000"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-cart">
            <img src={emptyCartImage} alt="Empty Cart" className="empty-cart-image" />
            <h1>Your Cart is Empty</h1>
            <p>Looks like you havent added anything to your cart yet.</p>
            <button className="shop-now-button" onClick={shopnow}>
              Shop Now
            </button>

          </div>
        )}

      </div>
      <ToastContainer>
        
      </ToastContainer>
    </>
  );
};

export default Cart;
