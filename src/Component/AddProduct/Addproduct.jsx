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

  const productcontext = useContext(Productcontext);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.productfulldetail) {
      setEditedProduct(location.state?.productfulldetail)
      setVisible(true)
    }
  }, [location.state])

  const changehandler = (item) => {
    setProduct((prev) => ({
      ...prev,
      [item.target.name]: item.target.value,
    }));
  };

  const addtodatabse = async (e) => {
    e.preventDefault();

    const action = e.nativeEvent.submitter.value;
    if (action === "Add Product") {
          await addDoc(collection(database, "Products"), {
            ...product,
            createdAt: new Date(),
          });
          setProduct({
            productname: "",
            description: "",
            price: "",
            category: "",
            stock: "",
          });

          // Close the modal
          setVisible(false);
       
    } else if (action === "Save Edit") {
      await updateDoc(doc(database, "Products", editedProduct.id), {
        ...product,
      });

      setVisible(false);
      setEditedProduct({})
    }
  };

  const handleedit = (items) => {
    setEditedProduct(items);
    setVisible(true)
  };

  useEffect(() => {
    editedProduct && setProduct(
      {
        productname: editedProduct.productname || " ",
        description: editedProduct.description || " ",
        price: editedProduct.price || " ",
        category: editedProduct.category || " ",
        stock: editedProduct.stock || " ",
      }
    );
  }, [editedProduct])


  const closemodal = () => {
    setVisible(false)
    setEditedProduct({})
  }

  const deleteproduct = async (itm) => await deleteDoc(doc(database, "Products", itm.id));

  const iseditproduct = Object.keys(editedProduct).length > 0;

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
                    onClick={() => setVisible(true)}
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
            <form onSubmit={addtodatabse} method="post">
              <div className="card-header bg-primary text-white text-center">
                <h3>Add New Product</h3>
              </div><br />
              <div className="form-group">
                <label htmlFor="Productname">Product Name</label>
                <input
                  name="productname"
                  value={product.productname}
                  type="text"
                  className="form-control"
                  id="exampleInputtextt"
                  placeholder="Enter Product name"
                  onChange={(e) => changehandler(e)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  name="description"
                  value={product.description}
                  onChange={(e) => changehandler(e)}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="Price">Price</label>
                <input
                  type="number"
                  id="typePhone"
                  className="form-control"
                  name="price"
                  onChange={(e) => changehandler(e)}
                  value={product.price}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  className="form-control"
                  name="category"
                  value={product.category}
                  onChange={(e) => changehandler(e)}
                  required
                >
                  <option disabled value="">--Select--</option>
                  <option value="all">All</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="sports">Sports</option>
                  <option value="formal">Formal</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="stock">Stock</label>
                <input
                  type="number"
                  id="typePhone"
                  className="form-control"
                  name="stock"
                  onChange={(e) => changehandler(e)}
                  value={product.stock}
                  required
                />
              </div>
              <div>
                <Button variant="secondary" className="cancelbutton controlbutton1" onClick={closemodal}>
                  Close
                </Button>
                <Button variant="primary" type="submit" className="subbutton" value={iseditproduct ? "Save Edit" : "Add Product"}>
                  {iseditproduct ? "Save Edit" : "Add Product"}
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