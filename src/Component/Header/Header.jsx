import { Link, useNavigate } from "react-router-dom";
import logo from "../Images/Sneaker.jpg";
import "./Header.css";
import { auth } from "../../Firebase";
import { useContext, useState } from "react";
import { Usercontext } from "../../ContextProviders/UserProvider";
import DarkModeToggle from "../Toggletheme/DarkModeToggle";


const Header = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const logout = () => {
    auth.signOut();
    navigate(`/login`);
  };

  const handlesave = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?Query=${search}`)
    }
  }

  const changehandler = (e) => {
    const value = e.target.value;
    setSearch(value);

    setTimeout(() => {
      if (value.trim()) {
        navigate(`/search?Query=${value}`)
      }
    }, 600)
  }

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
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className=" navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ulweight">
            <Link to="/home" className="nav-link" title="Go To Home">
              <li className="nav-item active">Home</li>
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
              <button className="btn btn-outline-success my-2 my-sm-0 searchbutton" type="submit">Search</button>
              <DarkModeToggle/>
            </form>
            
          </div>
        </div>
      </nav>
      
    </>
  );
};

export default Header;
