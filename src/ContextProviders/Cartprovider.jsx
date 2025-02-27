import { doc, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react"
import { database } from "../Firebase";
import PropTypes from 'prop-types';
import { ClipLoader } from "react-spinners";
import { Usercontext } from "./UserProvider";

export const Cartcontext = createContext();

const Cartprovider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [cartitem, setCartitem] = useState([]);


    const user = useContext(Usercontext);
    useEffect(() => {

        try {
            if (user?.cuser) {
                setLoading(true)
                const crt = onSnapshot(doc(database, "Cart", user.cuser?.uid), (userdata) => {
                    if (userdata.exists()) {
                        const cart1 = userdata?.data()?.items;
                        setCartitem(cart1);
                    }
                });

                return () => crt();
            }




        } catch (error) {
            console.error("Error in getting cart details", error)
        } finally {
            setLoading(false)
        };


    }, [user])


    return (
        <>
            {loading ? (
                <div className="spinner">
                    <ClipLoader size={50} color={"black"} loading={loading} />
                </div>
            ) : (
                <Cartcontext.Provider value={{ cartitem, setCartitem }}>
                    {children}
                </Cartcontext.Provider>
            )}

        </>
    )
};

Cartprovider.propTypes = {
    children: PropTypes.node.isRequired, // Add prop type validation for children
};

export default Cartprovider;
