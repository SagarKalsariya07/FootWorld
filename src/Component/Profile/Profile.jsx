import { useContext } from "react"
import Header from "../Header/Header"
import dummy from "../Images/dummy user.jpeg"
import { Usercontext } from "../../ContextProviders/UserProvider"
import { useNavigate } from "react-router-dom"

const Profile = () => {
  const user = useContext(Usercontext)
  const navigate = useNavigate();
  const navigatecart = () => {
    navigate(`/cart`);
  }
  const navigateorder = () => {
    navigate(`/orderhistory`);
  }
  const navigateUsers = () => {
    navigate(`/user`);
  }
  const navigateProduct = () => {
    navigate(`/addproducts`);
  }
  return (
    <>
      <div className="h-screen bg-gray-300  ">
        <Header />
        <div className="bg-white w-1/2 m-auto h-auto mt-5 rounded-2xl shadow-md shadow-black">
          <div className=" flex justify-center gap-40 pt-5 ">
            <div className="h-2/5  flex justify-center">
              <img src={dummy} alt="" className="h-[100%] w-[100%] rounded-full" />
            </div>
            <div className="flex  flex-col justify-cente">
              <p className="text-4xl"><b>{user.currentuserfulldetail?.name}</b></p>
              <p className="text-xl"><b>{user.currentuserfulldetail?.email}</b></p>
              <p><b>{user.currentuserfulldetail?.mobileno}</b></p>
              <p><b>Address:</b><br />{" "}{user.currentuserfulldetail?.address}</p>
              {user.currentuserfulldetail?.role === "user" &&
                <p className="cursor-pointer bg-blue-800 text-amber-50 p-1 rounded-md  text-center flex gap-2" onClick={navigatecart}>
                  <span className=""><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z" /></svg></span>
                  <span className="">
                    Cart
                  </span>
                </p>
              }
              {user.currentuserfulldetail?.role === "user" &&
                <p className="cursor-pointer bg-green-500 text-center text-white rounded-md p-1" onClick={navigateorder}>My Orders</p>
              }
              {user.currentuserfulldetail?.role === "admin" &&
                <p className="cursor-pointer bg-blue-600 text-center text-amber-50 rounded-md p-1 " onClick={navigateUsers}>Manage Users</p>
              }{user.currentuserfulldetail?.role === "admin" &&
                <p className="cursor-pointer bg-blue-600 text-amber-50 text-center rounded-md p-1" onClick={navigateProduct}>Manage Product</p>
              }
              <p className="bg-red-600 text-white text-center rounded-md p-1 cursor-pointer">Change password</p>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default Profile

