import { useState } from "react";
import Header from "../Header/Header";

// import { database } from "../../Firebase";
// import newcontext from "../../context";
import Footer from "../Footer/Footer";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';

const Addtextfeild = () => {
    const [product, setProduct] = useState({
        productname: "",
        description: "",
        price: "",
        stock: "",
    });
    const [visible, setVisible] = useState({
        addproduct: false,
        editproduct: false,
        showproduct: true,
    });
    const [submittedData, setSubmittedData] = useState([]);

    // const productcontext = useContext(newcontext)

    const controladdproduct = () => {
        setVisible((e) => {
            return {
                addproduct: !e.addproduct,
                showproduct: !e.showproduct,
            };
        });
    };
    const changehandler = (item) => {
        setProduct({ ...product, [item.target.id]: item.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault(); 
        setSubmittedData((prev) =>[
            ...prev,
            product,
        ]);
        setVisible((e) => {
            return {
                addproduct: !e.addproduct,
                showproduct: !e.showproduct,
            };
        });        
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
                {visible.showproduct &&
                    <div className="productdata">
                        <table className="producttable">
                            <thead>
                                <tr className="allproducttext">
                                    <td colSpan="4">All Products</td>
                                    <td colSpan="3">
                                        <button className="addbutton" onClick={controladdproduct}>
                                            Add New
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <th >ProdcutId</th>
                                    <th >ProductName</th>
                                    <th >Description</th>
                                    <th >Category</th>
                                    <th >Price</th>
                                    <th >Stock</th>
                                    <th >Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submittedData?.map((event, index) => (
                                    <tr key={index}>
                                        {/* <th>{event.id}</th> */}
                                        <td>{event.productname} </td>
                                        <td>{event.description} </td>
                                        <td>{event.category}</td>
                                        <td>{event.price}</td>
                                        <td>{event.stock}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                }

                {visible.addproduct && (
                    <div className="form">
                        <div className="cancelbutton">
                            <button onClick={controladdproduct}>Cancel</button>
                        </div>
                        <Box
                            component="form"
                            sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
                            noValidate
                            autoComplete="off"
                            
                        />
                        <div>
                            <TextField
                                id="productname"
                                label="Multiline"
                                multiline
                                maxRows={4}
                                value={product.productname}
                                onChange={(e) => changehandler(e)}
                            />
                            <TextField
                                id="description"
                                label="Multiline Placeholder"
                                placeholder="Placeholder"
                                multiline
                                value={product.description}
                                onChange={(e) => changehandler(e)}
                            />
                        </div>
                        <div>
                            <TextField
                                id="price"
                                label="Multiline"
                                multiline
                                maxRows={4}
                                variant="filled"
                                value={product.price}
                                onChange={(e) => changehandler(e)}
                            />

                        </div>
                        <div>
                            <TextField
                                id="stock"
                                label="Multiline"
                                multiline
                                maxRows={4}
                                variant="standard"
                                value={product.stock}
                                onChange={(e) => changehandler(e)}
                            />

                        </div>
                        <Button type="submit" variant="contained" sx={{ m: 1 }} onClick={handleSubmit}>
                            Submit
                        </Button>
                    </div>
                )}
                ;

            </div>
            <Footer />
        </>
    );
};

export default Addtextfeild;
