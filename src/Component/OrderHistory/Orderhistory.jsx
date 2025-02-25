import { arrayUnion, collection, deleteDoc, doc, documentId, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { database } from "../../Firebase";
import Header from "../Header/Header";
import './Orderhistory.css'
import { ClipLoader } from "react-spinners";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import emptyorder from "../Images/emptyorder.png"
import { Cartcontext } from "../../ContextProviders/Cartprovider";
import { Usercontext } from "../../ContextProviders/UserProvider";
import { Modal } from "react-bootstrap";

const Orderhistory = () => {
    const [orderhistory, setOrderhistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [details, setDetails] = useState({
        productdetails: [],
        orderid: {},
    });
    const [visible, setVisible] = useState({});

    const cartitem1 = useContext(Cartcontext);
    const user1 = useContext(Usercontext)
    const navigate = useNavigate();

    useEffect(() => {
        const getOrderDetail = async () => {
            try {
                setLoading(true);
                const userid = user1?.cuser?.uid;
                // const Order = [];
                const ord = await getDocs(query(collection(database, "Orders"), where("Userid", "==", userid)));


                const order = ord.docs?.map((item) => ({ id: item.id, ...item.data() }));


                setOrderhistory(order)
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        getOrderDetail();

    }, []);

    const moreinfo = async (order1) => {

        const orderids = order1.cartitem?.map((cart) => cart.productid);

        const fulldetail = await getDocs(query(collection(database, "Products"), where(documentId(), "in", orderids)));

        const orderproductfulldetail = fulldetail.docs?.map((item) => ({ id: item.id, ...item.data() }));

        const withquantity = orderproductfulldetail?.map((fdetail) => {
            const quant = order1.cartitem?.find((ord) => fdetail.id == ord.productid); {
                return {
                    ...fdetail,
                    quantity: quant.quantity
                }
            }
        })

        setDetails(() => {
            return {
                productdetails: withquantity,
                orderid: order1.id,
            }
        });
        setVisible((prevState) => ({
            [order1.id]: !prevState[order1.id],
        }));
    };

    const rebuyproduct = async (buyproduct) => {
        const docref = doc(database, "Cart", user1.cuser.uid)

        if (cartitem1.length > 0) {
            const sameproduct = cartitem1.cartitem?.map((cart) => cart.productid == buyproduct.id)
            if (sameproduct) {
                const updatecart = cartitem1.cartitem?.map((cart) =>
                    cart.productid == buyproduct.id ? { ...cart, quantity: cart.quantity = 1 } : cart
                )
                await updateDoc(docref, {
                    items: updatecart,
                })
                alert(`${buyproduct.productname} added to cart`)
            } else {
                await updateDoc(docref, {
                    items: arrayUnion({
                        productid: buyproduct.id,
                        price: buyproduct.price,
                        quantity: 1,
                        buyedAt: new Date(),
                    })
                });
                alert(`${buyproduct.productname} added to cart`)
            }
        } else {
            await setDoc(docref, {
                items: [
                    {
                        productid: buyproduct.id,
                        price: buyproduct.price,
                        quantity: 1,
                        buyedAt: new Date(),
                    }
                ]
            });
            alert(`${buyproduct.productname} added to cart`)
        }


    };

    const removefromhistory = async (remove) => {

        await deleteDoc(doc(database, "Orders", remove.id));

        const remaining = orderhistory?.filter((rem) => rem.id !== remove.id);

        setOrderhistory(remaining);

    }

    const shopnow = () => {
        navigate(`/allproducts`)
    }
    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <title>Order History</title>
                </Helmet>
            </HelmetProvider>
            <div className="orerall">
                <Header />
                {loading ? (
                    <div className="spinner">
                        <ClipLoader size={50} color={"black"} loading={loading} />
                    </div>
                ) : (
                    orderhistory.length > 0 ?
                        <div className="order1">
                            <h1 style={{ textAlign: "center", width: "80%", margin: "auto" }}>Order History</h1>

                            <table>
                                <thead>
                                    <tr>
                                        <th colSpan="6" className="yorder">Your Orders</th>
                                    </tr>
                                    <tr>
                                        <th>TotalPrice</th>
                                        <th>Date</th>
                                        <th>TotalProduct</th>
                                        <th>OrderStatus</th>
                                        <th>ShowMore</th>
                                        <th>Remove</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderhistory?.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.totalAmount}</td>
                                            <td>{new Date(item.createdAt.seconds * 1000).toLocaleString()}</td>
                                            <td>{item.cartitem.length}</td>
                                            <td>{item.orderStatus}</td>
                                            <td>
                                                <span
                                                    onClick={() => moreinfo(item)}
                                                    style={{ cursor: "pointer", color: "blue" }}
                                                >
                                                    More
                                                </span>
                                            </td>
                                            <td>
                                                <button className="qntbutton" onClick={() => removefromhistory(item)}>
                                                    Remove from History
                                                </button>
                                            </td>
                                        </tr>

                                    ))}
                                </tbody>
                            </table>
                        </div>
                        :
                        <div className="empty-order-history">
                            <img
                                src={emptyorder}
                                alt="No Orders"
                                className="empty-order-image"
                            />
                            <h2>No Orders Yet!</h2>
                            <p>You havent placed any orders. Start shopping now!</p>
                            <button className="shop-now-button" onClick={shopnow}>
                                Shop Now
                            </button>
                        </div>
                )}

                <Modal show={visible[details.orderid]} size="xl" onHide={() => setVisible(false)} className="madalview">
                    <Modal.Header closeButton>
                        <Modal.Title>ProductDetails</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="productdetail">
                            <table>
                                <thead>
                                    {/* <tr>
                                        <th colSpan="6" className="yorder">ProductDetails</th>
                                    </tr> */}
                                    <tr>
                                        <th>Productname</th>
                                        <th>Price</th>
                                        <th>Description</th>
                                        <th>Quantity</th>
                                        <th>Category</th>
                                        <th>Re-buy</th>
                                    </tr>

                                </thead>
                                <tbody>
                                    {details.productdetails?.map((product, idx) => (
                                        <tr key={idx}>
                                            <td>{product.productname}</td>
                                            <td>{product.price}</td>
                                            <td>{product.description}</td>
                                            <td>{product.quantity}</td>
                                            <td>{product.category}</td>
                                            <td><button className="qntbutton" onClick={() => rebuyproduct(product)}>Re-Buy</button> </td>
                                        </tr>

                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Modal.Body>
                </Modal>


            </div>




        </>
    );
};

export default Orderhistory;
