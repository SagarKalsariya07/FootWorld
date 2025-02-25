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

  const user = useContext(Usercontext);

  const handlechange = (item) => {
    setRegisteruser((rstat) => ({
      ...rstat,
      [item.target.name]: item.target.value,
    }));
  };


  const savetodatabase = async (e) => {
    e.preventDefault();

    try {
      if (registeruser.name !== "") {
        if (registeruser.email !== "") {
          if (registeruser.password !== "") {
            if (registeruser.role !== "") {
              if (registeruser.mobileno !== "") {
                if (registeruser.address !== "") {

                  const emailverify = user.allusers?.every(
                    (itm) => itm.email !== registeruser.email
                  );

                  if (emailverify) {
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
                  } else {
                    alert("Email Already Exists! Please Use Different Email");
                  }
                } else {
                  alert("Enter Your Address");
                }
              } else {
                alert("Enter Your Mobile No");
              }
            } else {
              alert("Select Your Role");
            }
          } else {
            alert("Enter Your Password");
          }
        } else {
          alert("Enter Your Email");
        }
      } else {
        alert("Enter Your Name");
      }
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
          <form >
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
              />
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
              />
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
              </select>
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
              />
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
              ></textarea>
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
              />
            </div>
            <div className="gap submitbutton">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={savetodatabase}
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
