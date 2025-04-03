import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useContext, useState } from "react";
import { auth, database } from "../../Firebase";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { Helmet, HelmetProvider } from "react-helmet-async";
import './Login.css'
import { Usercontext } from "../../ContextProviders/UserProvider";
import { toast, ToastContainer } from "react-toastify";


const Login = () => {
  //state for getting value of user 
  const [loginuser, setLoginuser] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  //Context value
  const user1 = useContext(Usercontext);


  //Handle change of user form
  const handlechange = (item) => {
    setLoginuser((prev) => ({
      ...prev,
      [item.target.name]: item.target.value,
    }));
  };

  //function for loging in
  const logintosite = async (e) => {
    if (user1) {
      e.preventDefault();
      //check password
      const passwordverify = user1.allusers?.find((itm) => itm.email == loginuser.email && itm.password == loginuser.password)

      if (passwordverify) {
        toast.success('✅ Logged in succesfully!', {
          position: "top-left",
          autoClose: 1000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        //log in site using firbase authentication
        await signInWithEmailAndPassword(
          auth,
          loginuser.email,
          loginuser.password
        );
        navigate(`/home`);
      } else {
        toast.error('❌ Error in login!', {
          position: "top-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
      }

    }
  };

  const ragister = () => {
    navigate(`/register`);
  };

  //Log in using google 
  const provider = new GoogleAuthProvider(); //create googleauthprovide

  const loginwithgoogle = async () => {
    try {
      //log in using google
      const googleuser = await signInWithPopup(auth, provider);
      //create new user
      const newuser = {
        email: googleuser.user?.email,
        name: googleuser.user?.displayName,
        role: "user",
      };
      //check if user is not present in firestore
      const checkuser = user1.allusers?.find((auser) => auser.email !== googleuser.user?.email);
      //if yes then add it to users doc
      if (checkuser) {
        await setDoc(doc(database, "Users", googleuser?.user.uid), newuser);
      }
      navigate(`/home`);
    } catch (error) {
      console.error("Error in google login", error);
    }
  };
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Enter Your email & password</title>
        </Helmet>
      </HelmetProvider>
      <div className="main1">
        <div className="regform1">
          <form className="loginform" onSubmit={logintosite} >
            <div className="form-group gap">
              <label htmlFor="exampleInputEmail1">Email address</label>
              <input
                type="email"
                name="email"
                value={loginuser.email}
                className="form-control"
                id="exampleInputEmail"
                aria-describedby="emailHelp"
                placeholder="Enter Your email"
                onChange={(e) => handlechange(e)}
                required
              />
            </div>
            <div className="form-group gap">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input
                type="password"
                name="password"
                value={loginuser.password}
                className="form-control"
                id="exampleInputPassword"
                placeholder="Enter Your Password"
                onChange={(e) => handlechange(e)}
                required
              />
            </div>
            <div className="gap submitbutton1">
              <button
                type="submit"
                className="btn btn-primary "
              >
                Login
              </button>
              <br />
              <span>
                Not registred,
                <b>
                  <span onClick={ragister} style={{ cursor: "Pointer" }}>
                    Register{" "}
                  </span>
                </b>
                here or{" "}
              </span>
            </div>
            <div className="googlelogin">
              Login With{" "}
              <span style={{ cursor: "pointer" }} onClick={loginwithgoogle}>
                {" "}
                <b>Google</b>{" "}
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

export default Login;
