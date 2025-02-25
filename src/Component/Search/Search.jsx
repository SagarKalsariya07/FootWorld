import { useEffect, useState } from 'react';
import Header from '../Header/Header';
import image from '../Images/image234.webp'
import "./Search.css";
import { useLocation } from 'react-router-dom';
import {  collection, getDocs, query, where } from 'firebase/firestore';
import { database } from '../../Firebase';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const Search = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState([]);
    const location = useLocation();

    const searchquery = new URLSearchParams(location.search).get("Query")

    useEffect(() => {

        const getSearch = async () => {
            try {
                setLoading(true)

                const q = query(collection(database, "Products"),
                                        where("productname", "<=", searchquery + "\uf8ff"),
                                        where("productname", ">=", searchquery ),
                                );
                const q1 = query(collection(database,"Products"),
                                    where("category","==",searchquery)
                                );

                const srh = await getDocs(q);            
                const srh2 = await getDocs(q1)
                const sear =[ 
                    ...(srh.docs? srh.docs.map((item) => ({ id: item.id, ...item.data()})):[]),
                    ...(srh2.docs ? srh2.docs.map((itn) => ({id:itn.id,...itn.data()})):[])
                ];
                                
                setResult(sear)
            } catch (error) {
                console.error("Errro in searh", error);

            } finally {
                setLoading(false)
            }
        }
        getSearch();
    }, [searchquery]);

  
    return (
        <>
        <HelmetProvider>
            <Helmet>
                <title>Search result</title>
            </Helmet>
        </HelmetProvider>
            <Header />
            {loading ? (
                <div>
                    <h1>Loading Your Search</h1>
                </div>
            ) : (
                result.length >0 ?
                <div className="search-results">
                    {result.map((res, index) => (
                        <div className="product-grid" key={index}>
                            <div className="product-card">
                                <div className="product-image-placeholder">
                                    <img src={image} alt="" />
                                </div>
                                <div className="product-details">
                                    <h3 className="product-name">{res.productname}</h3>
                                    <p className="product-category">
                                        <strong>Category:</strong> {res.category}
                                    </p>
                                    <p className="product-description">
                                        <strong>Description:</strong> {res.description}.
                                    </p>
                                    <p className="product-price">
                                        <strong>Price:</strong> ₹{res.price}
                                    </p>
                                    <p className="product-stock">
                                        <strong>Stock:</strong> {res.stock}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                : <div>
                    <h1>Searched Item Not Found</h1>
                </div>
            )}

        </>
    );
};

export default Search;
