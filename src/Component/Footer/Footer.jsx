import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
    return (
        <>
            <div className="container5">
                <footer className="py-5">
                    <div className="row">
                        <div className="col-6 col-md-2 mb-3">
                            <h5 className="headerfont">Social World</h5>
                            <ul className="nav flex-column size">
                                <li className="nav-item mb-2"><Link href="#" className="nav-link p-0 text-muted"><i className="fa-brands fa-instagram"></i>{" "} <b>Instagram</b></Link></li>
                                <li className="nav-item mb-2"><Link href="#" className="nav-link p-0 text-muted"><i className="fa-brands fa-square-facebook"></i>{" "} <b>Facebook</b></Link></li>
                                <li className="nav-item mb-2"><Link href="#" className="nav-link p-0 text-muted"><i className="fa-brands fa-x-twitter"></i>{" "} <b>X(Twitter)</b></Link></li>
                                <li className="nav-item mb-2"><Link href="#" className="nav-link p-0 text-muted"><i className="fa-brands fa-whatsapp"></i>{" "} <b>Whatsapp</b></Link></li>
                            </ul>
                        </div>

                        <div className="col-6 col-md-2 mb-3">
                            <h5 className="headerfont">Quick Links</h5>
                            <ul className="nav flex-column">
                                <li className="nav-item mb-2"><Link href="#" className="nav-link p-0 text-muted">Your Account</Link></li>
                                <li className="nav-item mb-2"><Link to="/home" className="nav-link p-0 text-muted">Home</Link></li>
                                <li className="nav-item mb-2"><Link to="/about" className="nav-link p-0 text-muted">About Us</Link></li>
                                <li className="nav-item mb-2"><Link to="/allproducts" className="nav-link p-0 text-muted">Products</Link></li>
                                <li className="nav-item mb-2"><Link to="/home" className="nav-link p-0 text-muted">Connect With Us</Link></li>
                            </ul>
                        </div>

                        <div className="col-6 col-md-2 mb-3">   
                            <h5 className="headerfont">Contact Info</h5>
                            <ul className="nav flex-column">
                                <li className="nav-item mb-2"><Link href="#" className="nav-link p-0 text-muted">
                                    <i className="fa-solid fa-phone"></i>{"  "}
                                    <b>Phone:</b><br />{" "} 9685741235</Link></li>
                                <li className="nav-item mb-2"><Link href="#" className="nav-link p-0 text-muted">
                                    <i className="fa-solid fa-envelope"></i>{" "}
                                    <b>Email:</b>{" "} support@footworld.com</Link></li>
                                <li className="nav-item mb-2"><Link href="#" className="nav-link p-0 text-muted">
                                    <i className="fa-solid fa-location-dot"></i>{" "}
                                    <b>Address:</b><br />{" "}varal,Bhvanagar,<br />394260</Link></li>
                            </ul>
                        </div>

                        <div className="col-md-5 offset-md-1 mb-3">
                            <form>
                                <h5 className="headerfont">Connect With Us</h5>
                                <div className="d-flex flex-column flex-sm-row w-100 gap-2">
                                    <label htmlFor="newsletter1" className="visually-hidden">Email address</label>
                                    <input id="newsletter1" type="text" className="form-control" placeholder="Email address" />
                                    <button className="btn btn-primary" type="button">Send</button>
                                </div>
                            </form>
                        </div>
                    </div>


                    <div className="col-md-4 d-flex align-items-center" style={{ height: "5px" }}>
                        <Link href="/" className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
                            <svg className="bi" width="30" height="24"></svg>
                        </Link>
                        <span className="mb-3 mb-md-0 text-muted fonttext">© 2025 Footworld, Inc</span>
                    </div>


                </footer>
            </div>
        </>
    )
}

export default Footer
