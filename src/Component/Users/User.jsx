import { useContext, useState } from "react";
import Header from "../Header/Header";
import "./User.css";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { auth, database } from "../../Firebase";
import Footer from "../Footer/Footer";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Usercontext } from "../../ContextProviders/UserProvider";
import { Modal } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";

const User = () => {
    const [registeruser, setRegisteruser] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        mobileno: "",
    });
    const [visible, setVisible] = useState({
        showuser: true,
        adduser: false,
    });
    const [error, setError] = useState('')
    const navigate = useNavigate();
    const user = useContext(Usercontext)

    let filtereduser = []

    filtereduser = user.allusers?.filter((auser) => auser.email !== user.cuser.email)

    const deleteUser = async (delete1) => {
        await deleteDoc(doc(database, "Users", delete1.id));
    };


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
                toast.success('✅ User Added Succesfully!', {
                            position: "top-right",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: false,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                            });
            if (emailverify) {
                const userdetail = await createUserWithEmailAndPassword(
                    auth,
                    registeruser.email,
                    registeruser.password
                );
                const newuser1 = {
                    ...registeruser,
                    role: "user",
                    createdAt: new Date(),
                };

                if (userdetail) {
                    await setDoc(
                        doc(database, "Users", userdetail.user.uid),
                        newuser1
                    )
                    await auth.signOut();

                    await signInWithEmailAndPassword(auth,
                        user.cuser.email,
                        user.currentuserfulldetail.password
                    )
                    navigate(`/user`);
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

            setVisible((e) => ({
                ...e,
                showuser: !e.showuser,
                adduser: !e.adduser,
            }));
            alert("User Added")
        } catch (error) {
            console.error("Error in storing user", error);
        }
    };

    const Addnewuser = () => {
        setVisible((e) => ({
            ...e,
            adduser: true,
        }));
    };

    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <title>All Users</title>
                </Helmet>
            </HelmetProvider>
            <div className="alluser">
                <Header />
                {visible.showuser &&
                    <div className="usertable">
                        <table>
                            <thead>
                                <tr>
                                    <td colSpan="4" style={{ fontWeight: "bolder", fontSize: "40px" }}>All Users</td>
                                    <td colSpan="3"><button className="qntbutton addnewbutton" onClick={Addnewuser}>Add New User</button></td>
                                </tr>
                                <tr>
                                    <th>Sr.No</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Password</th>
                                    <th>Role</th>
                                    <th>Mobile No</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtereduser.map((itm, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{itm.name}</td>
                                        <td>{itm.email}</td>
                                        <td>{itm.password}</td>
                                        <td>{itm.role}</td>
                                        <td>{itm.mobileno}</td>
                                        <td>
                                            <button className="qntbutton deletebutton" onClick={() => deleteUser(itm)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>

                }

                <Modal show={visible.adduser} size="lg" onHide={() => setVisible((prev) => ({ ...prev, adduser: false }))}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="regform5">
                            <form>
                                <div className="card-header bg-primary text-white text-center">
                                    <h3>Add New User</h3>
                                </div><br />
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
                                        <p className="text-red-600 font-bold text-base">{error.password}</p>
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
                                    />
                                    {error && 
                                        <p className="text-red-600 font-bold text-base">{error.mobileno}</p>
                                    }
                                </div>
                                <div className="gap">
                                    <button
                                        type="submit"
                                        className="btn btn-primary "
                                        onClick={Addnewuser}
                                    >
                                        Cancel
                                    </button>{"  "}
                                    <button
                                        type="submit"
                                        className="btn btn-primary "
                                        onClick={savetodatabase}
                                    >
                                        Add
                                    </button>
                                </div>
                            </form>
                            <ToastContainer>

                            </ToastContainer>
                        </div>
                    </Modal.Body>
                </Modal>
                <Footer />
            </div>

        </>
    );
};

export default User;
