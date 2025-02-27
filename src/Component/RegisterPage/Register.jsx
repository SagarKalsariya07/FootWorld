import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import "./Register.css";
import { auth, database } from "../../Firebase";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Usercontext } from "../../ContextProviders/UserProvider";

const Register = () => {
  const [registeruser, setRegisteruser] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    address: "",
    mobileno: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState('')

  const user = useContext(Usercontext);

  const handlechange = (item) => {
    const { name, value } = item.target;

    setRegisteruser((rstat) => ({
      ...rstat,
      [name]: value,
    }));

    setError((preverror) => {
      let newerror = { ...preverror };

      if (name === "password") {

        const specialcharactercheck = /[!@#$%&*]/.test(value);
        const capitalletter = /[A-Z]/.test(value);
        const letter8 = value.length >= 8;

        if (letter8) {
          if (capitalletter) {
            if (specialcharactercheck) {
              delete newerror.password;
            } else {
              newerror.password = "* Password must be contain a special character.";
            }
          }
          else {
            newerror.password = "* Password must contain at least 1 capital letter";
          }
        } else {
          newerror.password = "* Password should be 8 charcters or above";
        }
      }
      else if (name == "mobileno") {
        let checklength = value.length >= 10;

        if (checklength) delete newerror.mobileno;
        else newerror.mobileno = "* Mobile number should be equal to 10 characters";
      } else {
        if (value.trim() !== " ") {
          delete newerror[name];
        }
      }
      return newerror;
    })
  };


  const savetodatabase = async (e) => {
    e.preventDefault();

    try {
      const emailverify = user.allusers?.every(
        (itm) => itm.email !== registeruser.email
      );

      if (!emailverify) return alert("Email Already Exists! Please Use Different Email");

      const userdetail = await createUserWithEmailAndPassword(
        auth,
        registeruser.email,
        registeruser.password
      );
      const newuser1 = {
        ...registeruser,
        createdAt: new Date(),
      };

      if (userdetail) {
        await setDoc(
          doc(database, "Users", userdetail.user.uid),
          newuser1
        )
        auth.signOut();
        navigate(`/login`);
      }

      setRegisteruser({
        name: "",
        email: "",
        role: "",
        password: "",
        address: "",
        mobileno: "",
      });
    } catch (error) {
      console.error("Error in storing user", error);
    }
  };


  const login = () => {
    navigate(`/login`);
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Register yourself</title>
        </Helmet>
      </HelmetProvider>
      <div className="main">
        <div className="regform">
          <form onSubmit={savetodatabase} >
            <div> <div className="card-header bg-primary text-white text-center">
              <h3>Register Here</h3>
            </div><br /></div>
            <div className="form-group gap">
              <label htmlFor="formGroupExampleInput">UserName</label>
              <input
                name="name"
                type="text"
                value={registeruser.name}
                className="form-control"
                id="formGroupExampleInput"
                placeholder="Enter Your Name"
                onChange={(e) => handlechange(e)}
                required
              />
              {error &&
                <div className="text-red-600 font-bold text-base">{error.name}</div>
              }
            </div>
            <div className="form-group gap">
              <label htmlFor="exampleInputEmail1">Email address</label>
              <input
                type="email"
                name="email"
                value={registeruser.email}
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter Your email"
                onChange={(e) => handlechange(e)}
                required
              />{error &&
                <div className="text-red-600 font-bold text-base">{error.email}</div>
              }
              <small id="emailHelp" className="form-text text-muted">
                Well never share your email with anyone else.
              </small>
            </div>
            <div className="dropdown">
              <select
                className="btn btn-secondary dropdown-toggle"
                type="button"
                name="role"
                value={registeruser.role}
                id="dropdownMenu2"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                onChange={(e) => handlechange(e)}
              >
                <option
                  className="dropdown-item"
                  type="button"
                  value=""
                  disabled
                >
                  --Select--
                </option>
                <option className="dropdown-item" value="admin" type="button">
                  admin
                </option>
                <option className="dropdown-item" value="user" type="button">
                  user
                </option>
              </select>{error &&
                <div className="text-red-600 font-bold text-base">{error.role}</div>
              }
            </div>
            <div className="form-group gap">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input
                type="password"
                name="password"
                value={registeruser.password}
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Enter Your Password"
                onChange={(e) => handlechange(e)}
                required
              />{error &&
                <div className="text-red-600 font-bold text-base">{error.password}</div>
              }
            </div>
            <div className="form-group gap">
              <label htmlFor="exampleFormControlTextarea1">Address</label>
              <textarea
                className="form-control"
                id="exampleFormControlTextarea1"
                rows="5"
                name="address"
                value={registeruser.address}
                onChange={(e) => handlechange(e)}
                required
              ></textarea>
              {error &&
                <div className="text-red-600 font-bold text-base">{error.address}</div>
              }
            </div>
            <div data-mdb-input-init className="form-outline gap">
              <label className="form-label" htmlFor="typePhone">
                Phone number
              </label>
              <input
                type="tel"
                id="typePhone"
                className="form-control"
                name="mobileno"
                value={registeruser.mobileno}
                onChange={(e) => handlechange(e)}
                required
              />{error &&
                <div className="text-red-600 font-bold text-base">{error.mobileno}</div>
              }
            </div>
            <div className="gap submitbutton">
              <button
                type="submit"
                className="btn btn-primary"
              >
                Register
              </button>
              <br />
              <span>
                Already Registered,{" "}
                <b>
                  <span onClick={login} style={{ cursor: "pointer", color: "black" }}>
                    Login
                  </span>
                </b>
                {" "} here
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
