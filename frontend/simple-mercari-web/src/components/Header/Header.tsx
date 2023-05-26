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
      <p>
        <a href="https://jp.mercari.com">
          <img className="Logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Mercari_logo.svg/768px-Mercari_logo.svg.png" alt="logo"/>
        </a>
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
    </header>
  );
}
