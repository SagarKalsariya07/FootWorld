import { useEffect, useState } from "react"
import { auth, database } from "../Firebase";
import { collection,  onSnapshot } from "firebase/firestore";
import { ClipLoader } from "react-spinners";
import PropTypes from "prop-types";
import { createContext } from "react";

export const Usercontext = createContext();

const UserProvider = ({children}) => {
    const [loading, setLoading] = useState(true);
    const [cuser, setCuser] = useState(null);
    const [allusers, setAllusers] = useState([]);
    const [currentuserfulldetail, setCurrentuserfulldetail] = useState();

    useEffect(() => {
        try { 
            setLoading(true)
            const usr = auth.onAuthStateChanged((user) => {
                setCuser(user);
            });
                
            return () => usr();
        } catch (error) {
            console.error("Error in getting current userr", error);

        } finally {
            setLoading(false)
        }

    }, []);

    useEffect(() => {
    
            try {
                setLoading(true)

                const usr = onSnapshot(collection(database, "Users"),(item)=>{
                    const user = item.docs?.map((doc1)=>({
                        id:doc1.id,
                        ...doc1.data(),
                    }))
                    setAllusers(user)
                });

                return () => usr();
            } catch (error) {
                console.error("Error in getting users details", error);

            } finally{
                setLoading(false)
            }
 
       
    }, [cuser])

    useEffect(()=>{
        try {
            
            if (cuser) {

                if (allusers) {
                    const fulldetail = allusers?.find((abc) => abc.email === cuser.email);
                    setCurrentuserfulldetail(fulldetail)
                }
            };
        } catch (error) {
            console.error("Error in getting full detail of current user", error);

        };
    },[cuser,allusers])

    return (
        <>
            {loading ? (
                <div className="spinner">
                    <ClipLoader size={50} color={"black"} loading={loading} />
                </div>
            ) : (
                <Usercontext.Provider value={{ cuser,allusers, setAllusers,currentuserfulldetail }}>
                    {children}
                </Usercontext.Provider>
            )}
        </>
    )
}
UserProvider.propTypes = {
    children: PropTypes.node.isRequired, // Add prop type validation for children

};
export default UserProvider
