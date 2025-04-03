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
import { toast, ToastContainer } from "react-toastify";
import Slider_quant from "../Slider-Quantity/Slider_quant";


const Home = () => {
  const [quantity, setQuantity] = useState({});
  const [resetCount, setResetCount] = useState(0)
  const navigate = useNavigate();

  //Get the context values
  const user = useContext(Usercontext);
  const cart = useContext(Cartcontext)
  const product = useContext(Productcontext)

  const handlequantity = (productid,newquantity) => {
      setQuantity((e) => {
        return {
          ...e,
          [productid]: newquantity, //update quantity 
        };
      });
    
  };


  //add to cart funciton
  const addtocart = async (event) => {
    const quant = quantity[event.id] || 1;

    try {
      //ckeck for the product in cart  
      if (cart?.cartitem.length > 0) {
        const sameitem = cart.cartitem?.find((ev) => ev.productid == event.id);//if there is product in cart check if it is same that user want to add

        //if it si the  same product than only update its quantity
        if (sameitem) {
          const updatecart = cart.cartitem?.map((item) =>
            item.productid == event.id
              ? { ...item, quantity: (item.quantity = quant) }
              : item
          );
          //Upadte the database
          await updateDoc(doc(database, "Cart", user.cuser.uid), {
            items: updatecart,
          });
          //after submitting value quantity reset to 1
          setResetCount((prev)=> prev+1)
          toast.success(`${event.productname} Already Present In Cart`, {
            position: "top-left",
            autoClose: 1000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
      
          
        }
        //if its not same productt than add it to database
        else {
          const newproduct = {
            productid: event.id,
            quantity: quant,
            price: event.price,
            createdAt: new Date(),
          }
          //Add into the databse
          await updateDoc(doc(database, "Cart", user.cuser.uid), {
            items: arrayUnion(newproduct),
          });
          setResetCount((prev)=> prev+1)
          toast.success(`${event.productname} added to cart`, {
            position: "top-left",
            autoClose: 1000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          //Reset quanitty
          
        }
      }
      //Addi the first product to cart
      else {
        const firstproduct = {
          productid: event.id,
          quantity: quant,
          price: event.price,
          createdAt: new Date(),
        }
        await setDoc(doc(database, "Cart", user.cuser.uid), {
          items: [firstproduct],
        });
        setResetCount((prev)=> prev+1)
        toast.success(`${event.productname} added to cart`, {
          position: "top-left",
          autoClose: 1000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        //Reset Quantity
        
      }
    } catch (error) {
      console.error("Error in adding cart", error);
    }
  };

  //Edit product navigate to edit product page with state attribute of navigate
  const editproduct = (productdata) => {
    navigate(`/addproducts`, { state: { productfulldetail: productdata } });
  };

  //navigate to specific product productdetal
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
                      <Slider_quant productid={item.id} onQuantityChange={handlequantity} resetTrigger={resetCount}/>
                    </li>
                  )}
                  {user.currentuserfulldetail?.role == "user" && (
                    <li
                      role="button"
                      className="list-group-item addcart button"
                      onClick={() => addtocart(item)}
                      style={{ borderRadius: "0px 0px 15px 15px" }}
                    >
                      Add To Cart
                    </li>
                  )}
                  {user.currentuserfulldetail?.role == "admin" && (
                    <li className="list-group-item addcart button" onClick={() => editproduct(item)} style={{ borderRadius: "0px 0px 15px 15px" }} role="button">
                      Edit
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
          <Footer />
          <ToastContainer>

          </ToastContainer>
        </div>
      </div>



    </>
  );
};

export default Home;
