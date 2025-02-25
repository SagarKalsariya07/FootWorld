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

    const user = useContext(Usercontext)
    const cart = useContext(Cartcontext);
    const productdetail = useContext(Productcontext)

    useEffect(() => {

        setData(() => ({
            products: productdetail.products,
            filterproduct: productdetail.products,
        }));


    }, []);

    const increment = (id) => {
        const newquantity = (quantity[id] || 1) + 1;

        setQuantity((abc) => {
            return {
                ...abc,
                [id]: newquantity,
            };
        });
    };

    const decrement = (id) => {
        const newquantity = (quantity[id] || 1) - 1;
        if (newquantity > 0) {
            setQuantity((abc) => {
                return {
                    ...abc,
                    [id]: newquantity,
                };
            });
        }
    };

    const allproduct = () => {
        setHeading("All Products");
        setData((xyz) => ({
            ...xyz,
            products: productdetail.products,
        }));
    };

    const mensproduct = () => {
        setHeading("Men's Products");
        const mens = productdetail.products?.filter((itm) => itm.category == "men");

        setData((xyz) => ({
            ...xyz,
            products: mens,
        }));
    };

    const womensproduct = () => {
        setHeading("Women's Products");
        const womens = productdetail.products?.filter((itm) => itm.category == "women");

        setData((xyz) => ({
            ...xyz,
            products: womens,
        }));
    };

    const sportproduct = () => {
        setHeading("Sport's Products");
        const sports = productdetail.products?.filter(
            (itm) => itm.category == "sports"
        );

        setData((xyz) => ({
            ...xyz,
            products: sports,
        }));
    };
    const addtocart = async (cart1) => {
        const newquantity = quantity[cart1.id] || 1;

        if (cart.cartitem?.length > 0) {
            const sameproduct = cart.cartitem?.find((item) => item.productid == cart1.id);
            if (sameproduct) {
                const updatecart = cart.cartitem?.map((itm) =>
                    itm.productid == cart1.id
                        ? { ...itm, quantity: (itm.quantity = newquantity) }
                        : itm
                );

                await updateDoc(doc(database, "Cart", user.cuser.uid), {
                    items: updatecart,
                });
                navigate(`/cart`);
            } else {
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
        } else {
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
