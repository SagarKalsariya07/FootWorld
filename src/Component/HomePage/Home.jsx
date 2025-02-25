import { useContext, useState } from "react";
import Header from "../Header/Header";
import image from "../Images/download.jpg";
import "./Home.css";
import {
  arrayUnion,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { database } from "../../Firebase";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Usercontext } from "../../ContextProviders/UserProvider";
import { Cartcontext } from "../../ContextProviders/Cartprovider";
import { Productcontext } from "../../ContextProviders/Productprovider";


const Home = () => {
  const [quantity, setQuantity] = useState({});
  const navigate = useNavigate();

  const user = useContext(Usercontext);

  const cart = useContext(Cartcontext)

  const product = useContext(Productcontext)

  const decrement = (id) => {
    const newquantity = (quantity[id] || 1) - 1;
    if (newquantity > 0) {
      setQuantity((e) => {
        return {
          ...e,
          [id]: newquantity,
        };
      });
    }
  };

  const increment = (id) => {
    const newquantity = (quantity[id] || 1) + 1;
    setQuantity((e) => {
      return {
        ...e,
        [id]: newquantity,
      };
    });
  };

  const addtocart = async (event) => {
    const quant = quantity[event.id] || 1;

    try {
      if (cart.cartitem.length > 0) {
        const sameitem = cart.cartitem?.find((ev) => ev.productid == event.id);

        if (sameitem) {
          const updatecart = cart.cartitem?.map((item) =>
            item.productid == event.id
              ? { ...item, quantity: (item.quantity = quant) }
              : item
          );
          await updateDoc(doc(database, "Cart", user.cuser.uid), {
            items: updatecart,
          });
          alert(`${event.productname} added to cart`);
        } else {
          const newproduct = {
            productid: event.id,
            quantity: quant,
            price: event.price,
            createdAt: new Date(),
          }
          await updateDoc(doc(database, "Cart", user.cuser.uid), {
            items: arrayUnion(newproduct),
          });
          cart.setCartitem([...cart.cartitem, newproduct]);
          alert(`${event.productname} added to cart`);
        }
      } else {
        const firstproduct = {
          productid: event.id,
          quantity: quant,
          price: event.price,
          createdAt: new Date(),
        }
        await setDoc(doc(database, "Cart", user.cuser.uid), {
          items: [firstproduct],
        });
        cart.setCartitem([firstproduct]);
        alert(`${event.productname} added to cart`);
      }
    } catch (error) {
      console.error("Error in adding cart", error);
    }
  };

  const editproduct = (productdata) => {
    navigate(`/addproducts`, { state: { productid: productdata } });
  };

  const productdetail = (id) => {
    navigate(`/productdetail/${id}`);
  };

  const allproduct = () => {
    navigate(`/allproducts`)
  }
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Welvome to footworld</title>
        </Helmet>
      </HelmetProvider>
      <div className="page">
          <Header />

        <div className="backimage">
          <div className="welcomemessage">
            <h1>Welcome To World Of Footwear</h1>
            {user.currentuserfulldetail?.role == "user" &&
              <h5>Start Your Journey!!<span><button className="welcomebutton" onClick={allproduct}>Shop now</button></span> </h5>
            }
          </div>
        </div>

        <div className="cardcontainer">
          <div className="alltext"><h1>Newly Added Products</h1></div>
          <div className="container">

            {product.products?.slice(0, 4).map((item, idx) => (
              <div key={idx} className="card cd1" style={{ width: "18rem" }}>
                <div className="img5">
                  <img
                    className="card-img-top img1"
                    src={image}
                    alt="Card image cap"
                    onClick={() => productdetail(item.id)}
                  />
                </div>
                <div className="card-body cdbody">
                  <h5 className="card-title">{item.productname} </h5>
                  <p className="card-text">{item.description}</p>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Category: {item.category}</li>
                  <li className="list-group-item">Price: {item.price}</li>
                  <li className="list-group-item">Stock: {item.stock}</li>
                  {user.currentuserfulldetail?.role == "user" && (
                    <li className="list-group-item quantity">
                      <button
                        className="qntbutton"
                        onClick={() => decrement(item.id)}
                      >
                        -
                      </button>{" "}
                      {quantity[item.id] || 1}{" "}
                      <button
                        className="qntbutton"
                        onClick={() => increment(item.id)}
                      >
                        +
                      </button>
                    </li>
                  )}
                  {user.currentuserfulldetail?.role == "user" && (
                    <li
                      role="button"
                      className="list-group-item addcart"
                      onClick={() => addtocart(item)}
                      style={{ borderRadius: "0px 0px 15px 15px" }}
                    >
                      Add To Cart
                    </li>
                  )}
                  {user.currentuserfulldetail?.role == "admin" && (

                    <li className="list-group-item addcart" onClick={() => editproduct(item)} style={{ borderRadius: "0px 0px 15px 15px" }} role="button">
                      Edit
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
          <Footer />

        </div>
      </div>



    </>
  );
};

export default Home;
