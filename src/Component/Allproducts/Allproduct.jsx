import {
    arrayUnion,
    doc,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { database } from "../../Firebase";
import image from "../Images/download.jpg";
import Header from "../Header/Header";
import "./Allproduct.css";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Cartcontext } from "../../ContextProviders/Cartprovider";
import { Usercontext } from "../../ContextProviders/UserProvider";
import { Productcontext } from "../../ContextProviders/Productprovider";
import { toast, ToastContainer } from "react-toastify";
import Slider_quant from "../Slider-Quantity/Slider_quant";

const Allproduct = () => {
    const [data, setData] = useState({
        products: [],
        filterproduct: [],
    });
    const [heading, setHeading] = useState("All Products");
    const [messageIndex, setMessageIndex] = useState(0)
    const [updatedQuantity, setUpdatedQuantity] = useState({})
    const [resetCount, setResetCount] = useState(0)
    const navigate = useNavigate();

    //Getting Context Value
    const user = useContext(Usercontext)
    const cart = useContext(Cartcontext);
    const productdetail = useContext(Productcontext)

    //Puting data into setdata state on first render or on first time page call
    useEffect(() => {        
        setData(() => ({
            products: productdetail?.products,
            filterproduct: productdetail?.products,
        }));
        
    }, [productdetail]); 


    //funtion for gtting all product after filtering
    const allproduct = () => {
        setHeading("All Products");
        setData((filteredData) => ({
            ...filteredData,
            products: productdetail.products,
        }));
    };

    //Function for filtering category of mens product
    const mensproduct = () => {
        setHeading("Men's Products");
        const mens = productdetail.products?.filter((itm) => itm.category == "men"); //finding mens category products from products doc

        setData((filteredData) => ({
            ...filteredData,
            products: mens,
        }));
    };

    //Function for filtering category of womens product
    const womensproduct = () => {
        setHeading("Women's Products");
        const womens = productdetail.products?.filter((itm) => itm.category == "women");//finding womens category products from products doc

        setData((filteredData) => ({
            ...filteredData,
            products: womens,
        }));
    };

    //Function for filtering category of sport product
    const sportproduct = () => {
        setHeading("Sport's Products");
        const sports = productdetail.products?.filter(
            (itm) => itm.category == "sports"      //finding sports category products from products doc
        );

        setData((filteredData) => ({
            ...filteredData,
            products: sports,
        }));
    };


    //Add to cart function
    const addtocart = async (cart1) => {
        const newquantity = updatedQuantity[cart1.id]||1; //Get the quantinty of clicked product 
        
        //Checking if there re any productts present or not in cart
        if (cart.cartitem?.length > 0) {
            const sameproduct = cart.cartitem?.find((item) => item.productid == cart1.id); //Checking condition for if there already this product is there in cart
            if (sameproduct) {
                //If the product is there then only product quantity should be updated
                const updatecart = cart.cartitem?.map((itm) =>
                    itm.productid === cart1.id
                        ? { ...itm, quantity: (itm.quantity = newquantity) }
                        : itm
                ); 

                //Updating Cart Document
                await updateDoc(doc(database, "Cart", user.cuser.uid), {
                    items: updatecart,
                });
                setResetCount((prev)=>prev+1)
                 toast.success(`${cart1.productname}'s Added To Cart`, {
                          position: "top-left", 
                          autoClose: 1000,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: "dark",
                        });
            } 
            // If there are products present in cart and not that user want 
            // right now than add this product in cart 
            else {  
                const newproduct = {
                    productid: cart1.id,
                    price: cart1.price,
                    quantity: newquantity,
                };
                await updateDoc(doc(database, "Cart", user.cuser?.uid), {
                    items: arrayUnion(newproduct),
                });
                setResetCount((prev)=>prev+1)
                toast.success(`${cart1.productname}'s Added To Cart`, {
                    position: "top-left", 
                    autoClose: 1000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                  });
            }
        } 
        //If there are no product in cart than clicked into cart 
        else {
            const firstproduct = {
                productid: cart1.id,
                price: cart1.price,
                quantity: newquantity,
            }
            try {
                await setDoc(doc(database, "Cart", user.cuser.uid), {
                    items: [firstproduct]
                });
                setResetCount((prev)=>prev+1)
                toast.success(`${cart1.productname}'s Added To Cart`, {
                    position: "top-left", 
                    autoClose: 1000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                  });
            } catch (error) {
                console.error(error);
            }
        }
    };

    const editproduct = () => {
        navigate(`/products`)
    }
    const messages = [
        "🚀 Get 10% OFF on your first order! Use code: WELCOME10",
        "🔥 Buy 2, Get 5% OFF | Buy 3, Get 10% OFF!",
        "⚡ Flash Sale! 20% OFF for the next 24 hours! Use code: FLASH20",
        "🎁 Free Shipping on orders above $50!"
      ];

      useEffect(()=>{
       const interval= setInterval(() => {
            setMessageIndex((prev)=>(prev+1) % messages.length)
        }, 3000);
        return () => clearInterval(interval);
      },[])

      const handlechangequantity = (productid,newQuantity) =>{
        setUpdatedQuantity((prev)=>({
            ...prev,
            [productid] : newQuantity,
        }))
      }
    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <title>All Products</title>
                </Helmet>
            </HelmetProvider>
            <div className="allpr">
                <Header />
                <div className="discount">
                    <h1 className="dis-text">{messages[messageIndex]}</h1>
                </div>
                <div className="filter my-4">
                    <div className="btn-group" role="group" aria-label="Category Filter">
                        <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={allproduct}
                        >
                            All
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={mensproduct}
                        >
                            Men
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={womensproduct}
                        >
                            Women
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={sportproduct}
                        >
                            Sports
                        </button>
                    </div>
                </div>
                <h1 className="heading">{heading}</h1>
                <div className="container">
                    {data.products?.map((item, idx) => (
                        <div key={idx} className="card cd1" style={{ width: "18rem" }}>
                            <div className="img5">
                                <img
                                    className="card-img-top img1"
                                    src={image}
                                    alt="Card image cap"
                                />
                            </div>
                            <div className="card-body cdbody">
                                <h5 className="card-title">{item?.productname} </h5>
                                <p className="card-text">{item?.description}</p>
                            </div>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">Category: {item?.category}</li>
                                <li className="list-group-item">Price: {item?.price}</li>
                                <li className="list-group-item">Stock: {item?.stock}</li>
                                {user.currentuserfulldetail?.role == "user" &&
                                    <li className="list-group-item quantity">
                                       <Slider_quant productid={item.id} onQuantityChange={handlechangequantity} resetTrigger={resetCount}/>
                                    </li>
                                }

                                {user.currentuserfulldetail?.role == "user" &&
                                    <li
                                        className="list-group-item addcart button"
                                        onClick={() => addtocart(item)}
                                        style={{ borderRadius: "0px 0px 15px 15px" }}
                                        role="button"
                                    >
                                        Add To Cart
                                    </li>
                                }
                                {user.currentuserfulldetail?.role == "admin" &&
                                    <li
                                        className="list-group-item addcart"
                                        onClick={editproduct}
                                        role="button"
                                    >

                                        Edit
                                    </li>
                                }
                            </ul>
                        </div>
                    ))}
                </div>
                <ToastContainer/>
                <Footer />

            </div>
        </>
    );
};

export default Allproduct;
