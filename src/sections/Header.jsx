import { DefaultUser, Logo } from "~/assets/images";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import path from "~/constants/path";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { userDropdown } from "~/constants/dropdown";
import Button from "~/components/Button";
import { userActions } from "~/store/slice/userSlice";
import { Toast } from "~/utils/alert";
function Header() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(userActions.logout());
    Toast.fire({
      icon: "success",
      title: "Logout successfully",
    });
  };
  useEffect(() => {}, []);
  return (
    <div className="main-container py-[35px]">
      <div className="flex justify-between items-center">
        <div className="">
          <Link to={`/${path.HOME}`}>
            <img src={Logo} alt="logo-digital" />
          </Link>
        </div>

        <div className="flex justify-center items-center">
          {/* phone */}
          <div className="max-lg:hidden text-[13px] px-[20px] border-r border-r-gray-300">
            <div className="flex justify-center items-center ">
              <FaPhoneAlt className="text-main mr-4 text-[10px]" />
              <span className="font-semibold">1800900</span>
            </div>
            <div className="text-[12px]">Mon-sat 9:00AMM - 6:00PM</div>
          </div>
          {/* mail */}
          <div className="max-lg:hidden text-[13px] px-[20px] border-r border-r-gray-300">
            <div className="flex justify-center items-center ">
              <MdEmail className="text-main mr-4" />
              <span className="font-semibold">abc.support@gmail.com</span>
            </div>
            <div className="text-[12px] text-center">Online support 24/7</div>
          </div>
          {/* wishlist */}
          <div className="px-[20px] border-r border-r-gray-300 flex h-[37.5px] items-center">
            <FaRegHeart className="text-main cursor-pointer" />
          </div>
          {/* cart */}
          <div className={`px-[20px] ${user.isLoggedIn && `border-r border-r-gray-300`} text-main cursor-pointer flex h-[37.5px] items-center`}>
            <FaShoppingCart />
          </div>
          {/* User */}
          {user.isLoggedIn && (
            <div className="pl-[20px]">
              <div className="w-[30px] h-[30px] rounded cursor-pointer">
                <div className="relative group">
                  <img
                    src={`${
                      user.userData?.avatar?.url
                        ? user.userData?.avatar?.url
                        : DefaultUser
                    }`}
                    alt="name"
                  />
                  <ul className="group-hover:block profile-dropdown py-2 px-1">
                    {userDropdown.map((item, i) => (
                      <li
                        key={item.title}
                        className={`hover:bg-gray-300 px-2 ${
                          i === userDropdown.length - 1
                            ? ""
                            : "border-gray-300 border-b"
                        }`}
                      >
                        <Button
                          to={item?.navigation}
                          className={
                            "flex justify-between items-center gap-5 !bg-transparent !text-black"
                          }
                          onClick={() => item?.onClick(handleLogout)}
                        >
                          {item.icon}
                          {item.title}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
