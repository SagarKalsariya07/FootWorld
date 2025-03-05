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

const Allproduct = () => {
    const [data, setData] = useState({
        products: [],
        filterproduct: [],
    });
    const [quantity, setQuantity] = useState({});
    const [heading, setHeading] = useState("All Products");

    const navigate = useNavigate();

    //Getting Context Value
    const user = useContext(Usercontext)
    const cart = useContext(Cartcontext);
    const productdetail = useContext(Productcontext)

    //Puting data into setdata state on first render or on first time page call
    useEffect(() => {
        setData(() => ({
            products: productdetail.products,
            filterproduct: productdetail.products,
        }));
    }, []);

    //Function for incrementing value of clicked product
    const increment = (id) => {
        const newquantity = (quantity[id] || 1) + 1; //increment value by 1

        //Updating quantity of specidic product using it's id
        setQuantity((abc) => {
            return {
                ...abc,
                [id]: newquantity,
            };
        });
    };

    //Function for decrementing value of clicked product
    const decrement = (id) => {
        const newquantity = (quantity[id] || 1) - 1;
        if (newquantity > 0) {

            //Updating quantity of specidic product using it's id
            setQuantity((abc) => {
                return {
                    ...abc,
                    [id]: newquantity,
                };
            });
        }
    };

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
        const newquantity = quantity[cart1.id] || 1; //Get the quantinty of clicked product 
        
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
                navigate(`/cart`);
            } 
            // If there are products present in cart and not that user want 
            // right now than add this product in cart 
            else {  
                const newproduct = {
                    productid: cart1.id,
                    price: cart1.price,
                    quantity: newquantity,
                };
                await updateDoc(doc(database, "Cart", user.cuser.uid), {
                    items: arrayUnion(newproduct),
                });
                navigate(`/cart`);
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
                navigate(`/cart`);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const editproduct = () => {
        navigate(`/products`)
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
                                        <button
                                            className="qntbutton"
                                            onClick={() => decrement(item?.id)}
                                        >
                                            -
                                        </button>{" "}
                                        {quantity[item?.id] || 1}{" "}
                                        <button
                                            className="qntbutton"
                                            onClick={() => increment(item?.id)}
                                        >
                                            +
                                        </button>
                                    </li>
                                }

                                {user.currentuserfulldetail?.role == "user" &&
                                    <li
                                        className="list-group-item addcart"
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
                <Footer />

            </div>
        </>
    );
};

export default Allproduct;
