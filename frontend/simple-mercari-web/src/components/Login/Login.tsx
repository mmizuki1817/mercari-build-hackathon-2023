import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { fetcher } from "../../helper";
import { error } from "console";

export const Login = () => {
  const [userID, setUserID] = useState<number>();
  const [password, setPassword] = useState<string>();
  const [_, setCookie] = useCookies(["userID", "token"]);

  const navigate = useNavigate();

  const onSubmit = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    fetcher<{ id: number; name: string; token: string }>(`/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userID,
        password: password,
      }),
    })
      .then((user) => {
        toast.success("Signed in!");
        console.log("POST success:", user.id);
        setCookie("userID", user.id);
        setCookie("token", user.token);
        navigate("/");
      })
      .catch((err) => {
        console.log(`POST error:`, err);
        if (err instanceof Response) {
          toast.error("Invalid ID or Password");
        }
      });
  };

  const moveToSignUp = () => {
    const elementLogin = document.querySelector<HTMLElement>(".Login");
    const elementSignup = document.querySelector<HTMLElement>(".Signup");
    if (elementLogin && elementSignup) {
      elementLogin.style.display = "none";
      elementSignup.style.display = "block";
    }    
  };

  return (
    <div>
      <div className="Login">
        <p id="MerTitle">LOG IN</p>
        <label id="MerInputLabel">User ID</label>
        <input
          type="number"
          name="userID"
          id="MerTextInput"
          placeholder="UserID"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setUserID(Number(e.target.value));
          }}
          required
        />

        <label id="MerInputLabel">Password</label>
        <input
          type="password"
          name="password"
          id="MerTextInput"
          placeholder="password"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(e.target.value);
          }}
        />
        <button onClick={onSubmit} id="MerButton">
          Login
        </button>
        <p>
        Don't have account? <span id="Font" onClick={moveToSignUp} color="blue">  Sign Up</span>
        </p>
      </div>
    </div>
  );
};
