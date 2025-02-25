import { collection, onSnapshot } from "firebase/firestore";
import { createContext, useEffect, useState } from "react"
import { ClipLoader } from "react-spinners";
import PropTypes from "prop-types";
import { database } from "../Firebase";

export const Productcontext = createContext();

const Productprovider = ({ children }) => {
    const [loading, setLoading] = useState();
    const [products, setProducts] = useState();


    useEffect(() => {

        try {
            setLoading(true)
            const pro = onSnapshot(collection(database, "Products"), (pritem) => {
                const prd = pritem.docs.map((doc1) => ({
                    id: doc1.id,
                    ...doc1.data(),
                }))
                setProducts(prd)
            });
            return () => pro();
        } catch (error) {
            console.error("Error in getting products", error);
        } finally {
            setLoading(false);
        }
    }, [])
    return (
        <>
            {loading ? (
                <div className="spinner">
                    <ClipLoader size={50} color={"black"} loading={loading} />
                </div>
            ) : (
                <Productcontext.Provider value={{ products, setProducts }}>
                    {children}
                </Productcontext.Provider>
            )}

        </>
    )
}

Productprovider.propTypes = {
    children: PropTypes.node.isRequired, // Add prop type validation for children
};

export default Productprovider
