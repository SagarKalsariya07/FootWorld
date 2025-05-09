import { useNavigate, useParams } from "react-router-dom";
import Header from "../Header/Header";
import image from "../Images/download.jpg";
import "./Productdetail.css";
import { useContext, useEffect, useState } from "react";
import {
  arrayUnion,
  collection,
  doc,
  documentId,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { database } from "../../Firebase";
import Footer from "../Footer/Footer";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Cartcontext } from "../../ContextProviders/Cartprovider";
import { Usercontext } from "../../ContextProviders/UserProvider";

const Productdetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [filteredproduct,setFilteredproduct] = useState();

  //Get the ID from the URL using useparams
  const { id } = useParams();

  const navigate = useNavigate();

  //Context Value
  const cart1 = useContext(Cartcontext);
  const user1 = useContext(Usercontext);

  useEffect(()=>{
        try{
          //Get the Product detail Using the id we are getting from URL
            const q = query(collection(database,"Products"),where(documentId(),"==",id));
            const prd = onSnapshot(q,(items)=>{
              const product = items.docs?.map((doc1)=>({
                id:items.id,
                ...doc1.data(),
              }))
              setFilteredproduct(product)
            });

            return () => prd();
        }catch(error){
          console.error("Error in accesing data",error);
          
        }
  
  },[])

  //Increment quantity
  const increment = () => {
    const newquantity = quantity + 1 || 1;

    setQuantity(newquantity);
  };

  //Decrement Quantity
  const decrement = () => {
    const newquantity = quantity - 1 || 1;
    if (newquantity > 0) {
      setQuantity(newquantity);
    }
  };

  // Add to cart
  const addtocart = async (cart) => {

    if (cart1.cartitem.length > 0) {//check the cart

      const sameitem = cart1.cartitem?.find((abc) => abc.productid == cart.id);//find if same product is sended to cart

      if (sameitem) {
        const updatecart = cart1.cartitem?.map((xyz) =>
          xyz.productid == cart.id
            ? { ...xyz, quantity: (xyz.quantity = quantity) }
            : xyz
        );//if same product is sended than only quantity shoul be upadated

        await updateDoc(doc(database, "Cart", user1.cuser.uid), {
          items: updatecart,
        });
        navigate(`/cart`);
      } 
      //Add product if different product is added
      else {
        await updateDoc(doc(database, "Cart", user1.cuser.uid), {
          items: arrayUnion({
            productid: cart.id,
            price: cart.price,
            quantity: quantity,
            createdAt: new Date(),
          }),
        });
        navigate(`/cart`);
      }
    } 
    //Add the firt product
    else {
      await setDoc(doc(database, "Cart", user1.cuser.uid), {
        items: [
          {
            productid: cart.id,
            price: cart.price,
            quantity: quantity,
            createdAt: new Date(),
          },
        ],
      });
      navigate(`/cart`);
    }
  };

  const edit = (data) => {
    navigate(`/addproducts`,{ state : { productfulldetail:data }});
  };

  return (
    <>

      <Header />
      <div className="cnt">
        <div className="img">
          <img src={image} alt="" />
        </div>
        {filteredproduct?.map((event, idx) => (
          <div key={idx} className="detail1">
            <HelmetProvider>
              <Helmet>
                <title>{event.productname} Detail</title>
              </Helmet>
            </HelmetProvider>
            <h1>{event.productname}</h1>
            <h5>{event.description}</h5>
            <h5>
              Available items:{""} {event.stock}
            </h5>
            <h5>
              Price:{""} {event.price}
            </h5>
            <h5>
              Category:{""} {event.category}
            </h5>
            <p>
              <button className="qntbutton" onClick={decrement}>
                -
              </button>{" "}
              {quantity || 1}{" "}
              <button className="qntbutton" onClick={increment}>
                +
              </button>
            </p>
            {user1.currentuserfulldetail?.role == "user" && (
              <p>
                <button className="qntbutton" onClick={() => addtocart(event)}>
                  Add to cart
                </button>
              </p>
            )}
            {user1.currentuserfulldetail?.role == "admin" && (
              <p>
                <button className="qntbutton" onClick={() => edit(event)}>
                  Edit
                </button>
              </p>
            )}
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
};

export default Productdetail;
