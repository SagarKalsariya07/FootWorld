import {  useNavigate } from "react-router-dom";
import "./PageNotFound.css"; 
import { useContext } from "react";
import { Usercontext } from "../../ContextProviders/UserProvider";

const PageNotFound = () => {
    const navigate = useNavigate();
    const user = useContext(Usercontext)
    const backtohomepage = () =>{
       if(user.cuser) navigate(`/home`)
        else  return;
    }
  return (
    <>
    <div className="notfound-container">
      <div className="notfound-content">
        <img
          src="https://cdn-icons-png.flaticon.com/512/136/136530.png"
          alt="404 Icon"
          className="notfound-icon"
        />
        <h1 className="notfound-title">404 - Page Not Found</h1>
        <p className="notfound-text">
          Oops! The page youre looking for doesnt exist.
        </p>
        <p href="/login" className="notfound-link" onClick={backtohomepage} role="button"> 
          Go back to homepage
        </p>
      </div>
    </div>
    </>
  );
};

export default PageNotFound;
