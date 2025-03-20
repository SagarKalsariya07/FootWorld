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
       
            if (user?.cuser)//check for login of user
            {
                setLoading(true)
                const docref =doc(database, "Cart", user.cuser?.uid);
                //get cart details of current user
                const crt = onSnapshot(docref,
                 (userdata) => {
                    if (userdata.exists()) {
                        const cart1 = userdata?.data()?.items;
                        setCartitem(cart1);
                    } else {
                        // Cart doc deleted, clear the cart items
                        setCartitem([]);
                    }
                    setLoading(false)
                    return () => crt(); //cleanup function
                },(error)=>{
                        console.error("Error in getting cart detail",error);
                        setCartitem([]);
                        setLoading(false)
                }
            );
            }else{
                setCartitem([]);
                setLoading(false)
            }
            
    }, [user])


    return (
        <>
            {loading ? (
                <div className="spinner">
                    <ClipLoader size={50} color={"black"} loading={loading} />
                </div>
            ) : (
                // Give cart items to context
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
