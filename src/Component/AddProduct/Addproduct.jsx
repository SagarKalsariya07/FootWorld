import { useContext, useEffect, useState } from "react";
import "./Product.css";
import Header from "../Header/Header";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { database } from "../../Firebase";
import Footer from "../Footer/Footer";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Productcontext } from "../../ContextProviders/Productprovider";
import { Modal, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const Addproduct = () => {
  const [product, setProduct] = useState({
    productname: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  const [visible, setVisible] = useState(false);

  const [editedProduct, setEditedProduct] = useState({});

  const [error, setError] = useState({})

  const productcontext = useContext(Productcontext);

  const location = useLocation();

  //useeffect for getting edit call from home page 
  useEffect(() => {
    if (location.state?.productfulldetail) { //check using location if any state is present 
      setVisible(true) // Open the Edit modal
      setEditedProduct(location.state?.productfulldetail) //Give value to productfulldetail state
    }
  }, [location.state])

  //open modal for adding the new product
  const openmodal = () => setVisible(true);

  //function for handling(control) the value of form 
  const changehandler = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));

    //Defining error for form validation
    setError((preverror) => {
      let newerror = { ...preverror }

      if (name === "price") {
        let checkzero = value > 0;
        if (checkzero) delete newerror.price;
        else newerror.price = "* Price  can not be zero";
      }else {
        if (value !== " ") {
          delete newerror[name];
        }
      }
      return newerror
    }
    )
  };

  //give data to editedproduct state on edit button click
  const handleedit = (items) => {
    setEditedProduct(items);
    setVisible(true)
  };

  //Assign data into form after getting data from edit button
  useEffect(() => {
    editedProduct && setProduct(
      {
        productname: editedProduct.productname || "",
        description: editedProduct.description || "",
        price: editedProduct.price || "",
        category: editedProduct.category || "",
        stock: editedProduct.stock || "",
      }
    );
  }, [editedProduct]) //call only when edit button is clicked and assign data to editproduct state

  //Check if there are data in editedproduct state
  const iseditproductpresent = Object.keys(editedProduct).length > 0;

  //Function for closing the modal 
  const closemodal = () => {
    setVisible(false) //make modal invisible
    setProduct({
      productname: "",
      description: "",
      price: "",
      category: "",
      stock: "",
    })//clear the form
    setEditedProduct({})//clear the editedproduct state
  }

  //Function for submitting product to database
  const addtodatabse = async (e) => {
    e.preventDefault(); //Prevent auto  submission after clicking submit

    const action = e.nativeEvent.submitter.value; //get the value of submit function wheather to add or edit product
    //Code for Adding new product to database
    if (action === "Add Product") {
      //Added to Products doc in database(firestore)
      await addDoc(collection(database, "Products"), {
        ...product,
        createdAt: new Date(),
      });

      //Clear form after submission
      setProduct({
        productname: "",
        description: "",
        price: "",
        category: "",
        stock: "",
      });

      // Close the modal
      setVisible(false);

    } 
    //Code For Edit the product
    else if (action === "Save Edit") {
      //Update the product in database
      await updateDoc(doc(database, "Products", editedProduct.id), {
        ...product,
      });

      setVisible(false);// close the modal
      setEditedProduct({});//Clear edit product state 
    }
  };

  //Delete the  product
  const deleteproduct = async (itm) => await deleteDoc(doc(database, "Products", itm.id));

  


  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Add/Edit Product</title>
        </Helmet>
      </HelmetProvider>
      <div className="fullpage">
        <Header />
        <div className="productdata">
          <table className="producttable">
            <thead>
              <tr className="allproducttext">
                <td colSpan="4">All Products</td>
                <td colSpan="3">
                  <Button
                    className="addbutton"
                    variant="primary"
                    onClick={openmodal}
                  >
                    Add New Product
                  </Button>
                </td>
              </tr>
              <tr>
                <th>Sr.No</th>
                <th>ProductName</th>
                <th>Description</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {productcontext.products?.map((event, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{event.productname} </td>
                  <td>{event.description} </td>
                  <td>{event.category}</td>
                  <td>{event.price}</td>
                  <td>{event.stock}</td>
                  <td style={{ width: "15%" }}>
                    <Button
                      className="controlbutton"
                      variant="primary"
                      onClick={() => handleedit(event)}
                    >
                      Edit
                    </Button>
                    <button
                      className="controlbutton1"
                      onClick={() => deleteproduct(event)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/*Product Modal */}
        <Modal show={visible} size="lg" onHide={closemodal}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={addtodatabse}>
              <div className="card-header bg-primary text-white text-center">
                <h3>Add New Product</h3>
              </div><br />
              <div className="form-group">
                <label htmlFor="Productname">Product Name</label>
                <input
                  type="text"
                  id="Product Name"
                  className="form-control"
                  name="productname"
                  placeholder="Enter Price of your product"
                  onChange={(e) => changehandler(e)}
                  value={product.productname}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  className="form-control"
                  id="description"
                  rows="3"
                  name="description"
                  placeholder="Enter Description"
                  value={product.description}
                  onChange={(e) => changehandler(e)}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="Price">Price</label>
                <input
                  type="number"
                  id="price"
                  className="form-control"
                  name="price"
                  placeholder="Enter Price of your product"
                  onChange={(e) => changehandler(e)}
                  value={product.price}
                  required
                />
                {error &&
                  <p className="text-red-600 text-md ">{error.price}</p>
                }
              </div>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  className="form-control"
                  name="category"
                  value={product.category || " "}
                  onChange={(e) => changehandler(e)}
                  required
                >
                  <option disabled value=" ">--Select--</option>
                  <option value="all">All</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="sports">Sports</option>
                  <option value="formal">Formal</option>
                </select>
                {error &&
                  <p className="text-red-600 text-md ">{error.category}</p>
                }
              </div>
              <div className="form-group">
                <label htmlFor="stock">Stock</label>
                <input
                  type="number"
                  id="stock"
                  className="form-control"
                  name="stock"
                  placeholder="Enter Available products count"
                  onChange={(e) => changehandler(e)}
                  value={product.stock}
                  required
                />
              </div>
              <div>
                <Button variant="secondary" className="cancelbutton controlbutton1" onClick={closemodal}>
                  Close
                </Button>
                <Button variant="primary" type="submit" className="subbutton" value={iseditproductpresent ? "Save Edit" : "Add Product"}>
                  {iseditproductpresent ? "Save Edit" : "Add Product"}
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </div>

      <Footer />
    </>
  );
};

export default Addproduct;