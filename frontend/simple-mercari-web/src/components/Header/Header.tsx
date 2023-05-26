import { FaHome, FaCamera, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import "./Header.css";

export const Header: React.FC = () => {
  const [cookies, _, removeCookie] = useCookies(["userID", "token"]);
  //const [cookies2] = useCookies(["userID"]);
  const navigate = useNavigate();

  if (!cookies.userID) {
    return <></>;
  }

  const onLogout = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    removeCookie("userID");
    removeCookie("token");
  };

  return (
    <header>
      {/* <div className="inner_header"> */}
        <p className="logo">
          <b>Simple Mercari</b>
        </p>
        
        <nav>
          <div className="MerHeaderItem" onClick={() => navigate("/")}>
            <FaHome />
            <p>Home</p>
          </div>
          <div className="MerHeaderItem" onClick={() => navigate("/sell")}>
            <FaCamera />
            <p>Listing</p>
          </div>
          <div className="MerHeaderItem"
            onClick={() => navigate(`/user/${cookies.userID}`)}>
            <FaUser />
            <p>MyPage</p>
          </div>
        </nav>
          <div className="LogoutButtonContainer">
          <button onClick={onLogout} id="MerButton">
            Logout
          </button>
        </div>

        
        

      {/* </div> */}
    </header>
  );
}
