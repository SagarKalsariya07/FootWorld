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
  const [visible, setVisible] = useState({
    editModal: false,
    showAddModal: false, // New state for controlling the add product modal
  });
  const [editedProduct, setEditedProduct] = useState({
    productname: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  const productcontext = useContext(Productcontext);

  const location = useLocation();

    useEffect(()=>{
      if(location?.state?.productid){
        setEditedProduct(location.state?.productid)
        setVisible((prev)=>({
          ...prev,
          editModal:true,
        }))
      }
    },[location.state])
  const changehandler = (item) => {
    setProduct((prev) => ({
      ...prev,
      [item.target.name]: item.target.value,
    }));
  };

  const addtodatabse = async (e) => {
    e.preventDefault();

    if (product.price > 0) {
      if (product.stock > 0) {
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
        setVisible((prev) => ({ ...prev, showAddModal: false }));
      } else {
        alert("Stock Can not be zero");
      }
    } else {
      alert("Price Cannot be zero or  less than zero");
    }

  };

  const handleedit = (items) => {
    setEditedProduct(items);
    setVisible((prev) => ({
      ...prev,
      editModal: true,
    }))
  };

  const handlechange = (ev) => {
    setEditedProduct((item) => ({
      ...item,
      [ev.target.name]: ev.target.value,
    }));
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    await updateDoc(doc(database, "Products", editedProduct.id), {
      ...editedProduct,
    });
    setVisible((prev) => ({
      ...prev,
      editModal: false,
    }))
  };

  const deleteproduct = async (itm) => {
    await deleteDoc(doc(database, "Products", itm.id));
  };

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
                    onClick={() => setVisible((prev) => ({ ...prev, showAddModal: true }))}
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

        {/* Add Product Modal */}
        <Modal show={visible.showAddModal} size="lg" onHide={() => setVisible((prev) => ({ ...prev, showAddModal: false }))}>
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
                <Button variant="secondary" className="cancelbutton controlbutton1" onClick={() => setVisible((prev) => ({ ...prev, showAddModal: false }))}>
                  Close
                </Button>
                <Button variant="primary" type="submit" className="subbutton">
                  Add Product
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>

        {/* Edit Product Modal */}
        <Modal show={visible.editModal} size="lg" onHide={() => setVisible((prev) => ({ ...prev, editModal: false }))}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form">
              <form onSubmit={saveEdit}>
                <div className="card-header bg-primary text-white text-center">
                  <h3>Edit Product</h3>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Product Name</label>
                  <input
                    name="producname"
                    value={editedProduct.productname}
                    type="text"
                    className="form-control"
                    id="exampleInputtextt"
                    placeholder="Enter Product name"
                    onChange={(e) => handlechange(e)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleFormControlTextarea1">Description</label>
                  <textarea
                    className="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                    name="description"
                    value={editedProduct.description}
                    onChange={(e) => handlechange(e)}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="typePhone">Price</label>
                  <input
                    type="number"
                    id="typePhone"
                    className="form-control"
                    name="price"
                    onChange={(e) => handlechange(e)}
                    value={editedProduct.price}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="typePhone">Category</label>
                  <select
                    className="form-control"
                    name="category"
                    value={editedProduct.category}
                    onChange={(e) => handlechange(e)}
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
                  <label htmlFor="typePhone">Stock</label>
                  <input
                    type="number"
                    id="typePhone"
                    className="form-control"
                    name="stock"
                    onChange={(e) => handlechange(e)}
                    value={editedProduct.stock}
                  />
                </div>

                <div>
                  <Button variant="secondary" className="cancelbutton controlbutton1" onClick={() => setVisible((prev) => ({ ...prev, editModal: false }))}>
                    Close
                  </Button>
                  <Button variant="primary" type="submit" className="subbutton">
                    Save Update
                  </Button>
                </div>
              </form>
            </div>
          </Modal.Body>
        </Modal>
      </div>

      <Footer />
    </>
  );
};

export default Addproduct;