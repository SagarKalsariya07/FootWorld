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


const Login = () => {
  const [loginuser, setLoginuser] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const user1 = useContext(Usercontext);


  const handlechange = (item) => {
    setLoginuser((prev) => ({
      ...prev,
      [item.target.name]: item.target.value,
    }));
  };

  const logintosite = async (e) => {
    if (user1) {
      e.preventDefault();
      if (loginuser.email !== "") {
        if (loginuser.password !== "") {

          const passwordverify = user1.allusers?.find((itm) => itm.email == loginuser.email && itm.password == loginuser.password)

          if (passwordverify) {
            await signInWithEmailAndPassword(
              auth,
              loginuser.email,
              loginuser.password
            );
            navigate(`/home`);
          } else {
            alert("User Not Found!!Check Your Password Or Check your Email Or Register Yourself");
          }
        } else {
          alert("Enter Your Password");
        }
      } else {
        alert("Enter Your Email");
      }
    }
  };

  const ragister = () => {
    navigate(`/register`);
  };

  const provider = new GoogleAuthProvider();
  const loginwithgoogle = async () => {
    try {
      const googleuser = await signInWithPopup(auth, provider);

      const newuser = {
        email: googleuser.user?.email,
        name: googleuser.user?.displayName,
        role: "user",
      };
      const checkuser = user1.allusers?.find((auser) => auser.email !== googleuser.user?.email);
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
          <form className="loginform">
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
              />
            </div>
            <div className="gap submitbutton1">
              <button
                type="submit"
                className="btn btn-primary "
                onClick={logintosite}
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
      </div>
    </>
  );
};

export default Login;
