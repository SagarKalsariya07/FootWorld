import {  useNavigate } from "react-router-dom";
import "./PageNotFound.css"; 

const PageNotFound = () => {
    const navigate = useNavigate();

    const backtohomepage = () =>{
        navigate(`/home`)
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
        <p href="/home" className="notfound-link" onClick={backtohomepage} role="button"> 
          Go back to homepage
        </p>
      </div>
    </div>
    </>
  );
};

export default PageNotFound;
