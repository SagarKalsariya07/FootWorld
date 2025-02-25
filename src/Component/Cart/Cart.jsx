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


const Cart = () => {
  const navigate = useNavigate();
  const [totalprice, setTotalprice] = useState(0);
  const [cartfulldetail, setCartfulldetail] = useState([]);
  const [queryresult, setQueryresult] = useState([]);

  const cart = useContext(Cartcontext);
  const user = useContext(Usercontext)

  useEffect(() => {
    try {
      const cartids = cart.cartitem?.map((cartid) => cartid.productid) || [];
  
      if (cartids.length === 0) {
        setQueryresult([]); // Reset when no items in cart
        return;
      }
  
      const parts = [];
      for (let i = 0; i < cartids.length; i += 10) {
        parts.push(cartids.slice(i, i + 10));
      }
  
      let allProducts = []; // Temporary array to collect all product details
      const filter = parts.map((partone) => {
        const q = query(collection(database, "Products"), where(documentId(), "in", partone));
  
        return onSnapshot(q, (pritem) => {
          const combineproduct = pritem.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
  
          allProducts = [...allProducts, ...combineproduct];
          setQueryresult([...allProducts]); //  Ensure all products are included
        });
      });
  
      return () => filter.forEach((unsubscribe) => unsubscribe()); //  Proper cleanup
    } catch (error) {
      console.error("Error in getting full cart detail", error);
    }
  }, [cart.cartitem]); //  Depend on `cart.cartitem`, updates when a new product is added
  
  //  Update `cartfulldetail` after `queryresult` is updated
  useEffect(() => {
    if (queryresult.length > 0) {
      const withquantity = cart.cartitem.map((cart) => {
        const productdetail = queryresult.find((pid) => pid.id === cart.productid);
        return productdetail
          ? { ...productdetail, quantity: cart.quantity }
          : null;
      }); 
  
      setCartfulldetail(withquantity);
    }
  }, [queryresult]); //  Depend on `queryresult`, ensuring it's updated before computing `cartfulldetail`
  

  useEffect(() => {
    let price = 0;
    cartfulldetail?.map((event) => (price += event.quantity * event.price));
    setTotalprice(price);
  }, [cartfulldetail]);

  const addmore = () => {
    navigate(`/allproducts`);
  };

  const increment = async (cart1) => {

    const newquantity = cart1.quantity + 1;
    try {
      const updatequantity = cart.cartitem?.map((item) => {
        if (item.productid == cart1.id) {
          return { ...item, quantity: newquantity };
        }
        return item;
      });

      await updateDoc(doc(database, "Cart", user.cuser.uid), {
        items: updatequantity,
      });
    } catch (error) {
      console.error("Error in updating quantity", error);
    }
  };

  const decrement = async (cart1) => {
    const newquantity = cart1.quantity - 1;
    try {

      if (newquantity > 0) {
        const updatequantity = cart.cartitem?.map((item) => {
          if (item.productid == cart1.id) {
            return { ...item, quantity: newquantity };
          }
          return item;
        });

        await updateDoc(doc(database, "Cart", user.cuser.uid), {
          items: updatequantity,
        });
      }
    } catch (error) {
      console.error("Error in updating quantity", error);
    }
  };

  const removeitem = async (cart1) => {

    try {
      const remove = cart.cartitem?.find((e) => e.productid === cart1.id);
      await updateDoc(doc(database, "Cart", user.cuser.uid), {
        items: arrayRemove(remove),
      });
      alert(`${cart1.productname} Removed From Cart`);
    } catch (error) {
      console.error("Error in removing cart", error);
    }
  };

  const buyNow = async () => {
    const check = cartfulldetail?.every((abc) => abc.quantity <= abc.stock);


    if (check) {
      for (const cart1 of cartfulldetail) {

        const updatedstock = cart1.stock - cart1.quantity;

        await updateDoc(doc(database, "Products", cart1.id), {
          stock: updatedstock
        });

        await deleteDoc(doc(database, "Cart", user.cuser.uid));
      };
      const order =
      {
        cartitem: cart.cartitem,
        totalAmount: totalprice,
        createdAt: new Date(),
        orderStatus: "confirmed",
        Userid: user.cuser.uid,
      };
      const order1 = await addDoc(collection(database, "Orders"), order);
      setTotalprice(0);
      navigate(`/ordersuccess`, { state: { orderid: order1.id } });
    } else {
      console.log("Not");

      const data = cartfulldetail?.filter((item) => item.quantity > item.stock);

      const productdt = data.map((ev) => ev.productname);

      alert(`${productdt.join()}'s quantity not available`);
    }
  };

  const shopnow = () => {
    navigate(`/allproducts`);
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
                  <th colSpan="3" style={{ fontSize: "40px" }}>
                    Your Cart
                  </th>
                  <th colSpan="1">
                    Totalamount : {totalprice}
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
                    <td>
                      <span>
                        <button
                          className="qntbutton1"
                          onClick={() => decrement(itm)}
                        >
                          -
                        </button>
                      </span>{" "}
                      {itm.quantity}{" "}
                      <span>
                        <button
                          className="qntbutton1"
                          onClick={() => increment(itm)}
                        >
                          +
                        </button>
                      </span>
                    </td>
                    <td>
                      <button
                        className="qntbutton1"
                        onClick={() => removeitem(itm)}
                      >
                        Remove
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
    </>
  );
};

export default Cart;
