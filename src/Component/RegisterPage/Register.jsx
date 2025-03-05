import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import "./Register.css";
import { auth, database } from "../../Firebase";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Usercontext } from "../../ContextProviders/UserProvider";
import { toast, ToastContainer } from "react-toastify";

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

  //Handled change on form
  const handlechange = (item) => {
    const { name, value } = item.target;
    
    //Control the input
    setRegisteruser((rstat) => ({
      ...rstat,
      [name]: value,
    }));

    //Set the error for different fields
    setError((preverror) => {
      let newerror = { ...preverror }; //Create copy of error using spread operator

      if (name === "password") { //Check the error for password

        const specialcharactercheck = /[!@#$%&*]/.test(value); //check if any special character include in password
        const capitalletter = /[A-Z]/.test(value);//check if any Capital letter include in password
        const letter8 = value.length >= 8;//check if password length is 8 in password

        if (letter8) {
          if (capitalletter) {
            if (specialcharactercheck) {
              delete newerror.password; //if all condition satisfied delete error for password
            } else {
              newerror.password = "* Password must be contain a special character.";//give error message for special character
            }
          }
          else {
            newerror.password = "* Password must contain at least 1 capital letter";//give error message forcapital letter
          }
        } else {
          newerror.password = "* Password should be 8 charcters or above";//give error message for length
        }
      }
      else if (name == "mobileno") { //Give error for mobile no
        let checklength = value.length >= 10; //check length of 10 characters

        if (checklength) delete newerror.mobileno; //delete if no error
        else newerror.mobileno = "* Mobile number should be equal to 10 characters";//give new message if error presist
      } else {
        if (value.trim() !== " ") {
          delete newerror[name]; //delete error for all feilds
        }
      }
      return newerror;
    })
  };


  //Add user to database 
  const savetodatabase = async (e) => {
    e.preventDefault(); //Prevent submission auto

    try {
      //Verify email
      const emailverify = user.allusers?.every(
        (itm) => itm.email !== registeruser.email
      );

      if (!emailverify) return alert("Email Already Exists! Please Use Different Email");
      //Toast message
      toast.success('✅ Registered succesfully!', {
                  position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: false,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                  });
       //Added user in firebase Authentication           
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
        //Add user in firestore
        await setDoc(
          doc(database, "Users", userdetail.user.uid),
          newuser1
        )
        auth.signOut(); //Signout from site beacuse firebase authentication auto log in when creating user
        navigate(`/login`);
      }

      //Clear user form after submission
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
              {error &&
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
              />
              {error &&
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
        <ToastContainer>

        </ToastContainer>
      </div>
    </>
  );
};

export default Register;
