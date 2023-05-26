import { useCookies } from "react-cookie";
import "./Header.css";

export const Header: React.FC = () => {
  const [cookies, _, removeCookie] = useCookies(["userID", "token"]);

  const onLogout = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    removeCookie("userID");
    removeCookie("token");
  };

  return (
    <>
      <header>
        <p>
          <a href="https://jp.mercari.com">
            <img className="Logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Mercari_logo.svg/768px-Mercari_logo.svg.png" alt="logo"/>
          </a>
        </p>
        <div className="LogoutButtonContainer">
          <button onClick={onLogout} id="MerButton">
            Logout
          </button>
        </div>
      </header>
    </>
  );
}
