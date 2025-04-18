import { Link, useNavigate } from "react-router-dom";
import logo from "../Images/Sneaker.jpg";
import "./Header.css";
import { auth } from "../../Firebase";
import { useContext, useState } from "react";
import { Usercontext } from "../../ContextProviders/UserProvider";


const Header = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  //Funtion for logout
  const logout = () => {
    auth.signOut(); //Using firebase authentication
    navigate(`/login`);
  };

  //Function for search bar 
  const handlesave = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?Query=${search}`) //pass the query in navbar to search page for showcase data
    }
  }

  //Control the value of search bar
  const changehandler = (e) => {
    const value = e.target.value;
    setSearch(value);

    setTimeout(() => {
      if (value.trim()) {
        navigate(`/search?Query=${value}`)
      }
    }, 600)
  }

  //get the context value
  const user = useContext(Usercontext);


  return (
    <>
      <nav className="navbar navbar-expand-lg sticky-top nav1">
        <Link to="/home" className="navbar-brand logo">
          <img src={logo} alt="" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" ></span>
        </button>
        <div className=" navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ulweight">
            <Link to="/home" className="nav-link" title="Go To Home">
              <li className="nav-item active">
                <svg xmlns="http://www.w3.org/2000/svg" height="27px" viewBox="0 -960 960 960" width="27px" fill="#000"><path d="M160-120v-480l320-240 320 240v480H560v-280H400v280H160Z" /></svg>
              </li>
            </Link>
            <Link to="/profile" className="nav-link" title="Go To Profile">
              <li className="nav-item">
                <svg xmlns="http://www.w3.org/2000/svg" height="27px" viewBox="0 -960 960 960" width="27px" fill="#01"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z" /></svg>
              </li>
            </Link>
            <Link to="/about" className="nav-link" title="Know Us">
              <li className="nav-item">About Us</li>
            </Link>
            {user.currentuserfulldetail?.role == "admin" && (
              <Link to="/addproducts" className="nav-link" title="Add New">
                <li className="nav-item">Add Product</li>
              </Link>
            )}
            {user.currentuserfulldetail?.role == "admin" && (
              <Link to="/user" className="nav-link" title="Check Users">
                <li className="nav-item">Users</li>
              </Link>
            )}
            {user.currentuserfulldetail?.role == "user" && (
              <Link to="/allproducts" className="nav-link " title="Shop Now">
                <li className="nav-item">AllProducts</li>
              </Link>
            )}
            {user.currentuserfulldetail?.role == "user" && (
              <Link to="/cart" className="nav-link" title="Cart">
                <li className="nav-item">Cart{" "}<i className="fa-solid fa-cart-plus"></i></li>
              </Link>
            )}
            {user.currentuserfulldetail?.role == "user" && (
              <Link to="/orderhistory" className="nav-link" title="See Your Order">
                <li className="nav-item">Orderhistory</li>
              </Link>
            )}
            <li className="nav-item" onClick={logout} title="Logout">
              <a className="nav-link " href="#">
                <i className="fa-solid fa-sign-out-alt"></i>{" "} Logout
              </a>
            </li>
          </ul>
          <div className="searchbar">
            <form className="form-inline my-2 my-lg-0 searchform" onSubmit={handlesave}>
              <input className="form-control mr-sm-2 searchbox" type="search" placeholder="Search" aria-label="Search" name="search" value={search} onChange={e => changehandler(e)} />
              <button className="btn  my-2 my-sm-0 searchbutton" type="submit">Search</button>
            </form>

          </div>
        </div>
      </nav>

    </>
  );
};

export default Header;
