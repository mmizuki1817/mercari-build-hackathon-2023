import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { fetcher } from "../../helper";

export const checkPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
  const checkedResults: {
    lengthCheck: boolean;
    input: string;
  } = {
    lengthCheck: true,
    input: "",
  };
  const length = e.target.value.length;
  if (length >= 0 && length < 8) {
    checkedResults.lengthCheck = false;
  } else {
    checkedResults.lengthCheck = true;
    checkedResults.input = e.target.value;
  }
  return checkedResults;
};

const moveToLogin = () => {
  const elementLogin = document.querySelector<HTMLElement>(".Login");
  const elementSignup = document.querySelector<HTMLElement>(".Signup");
  if (elementLogin && elementSignup) {
    elementLogin.style.display = "block";
    elementSignup.style.display = "none";
  }    
};

const display_none = () => {
  const elementSignup = document.querySelector<HTMLElement>(".Signup");
  const elementLogin = document.querySelector<HTMLElement>(".Login");
  if (elementLogin && elementSignup) {
    elementSignup.style.display = "none";
    elementLogin.style.display = "block";
  }    
};

export const Signup = () => {
  const [name, setName] = useState<string>();
  const [password, setPassword] = useState<{
    lengthCheck: boolean;
    input: string;
  }>({
    lengthCheck: true,
    input: "",
  });
  const [userID, setUserID] = useState<number>();
  const [_, setCookie] = useCookies(["userID"]);

  const navigate = useNavigate();
  const onSubmit = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    fetcher<{ id: number; name: string }>(`/register`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        password: password.input
      }),
    })
      .then((user) => {
        display_none();
        toast.success("New account is created!");
        console.log("POST success:", user.id);
        setCookie("userID", user.id);
        setUserID(user.id);
        navigate("/");
      })
      .catch((err) => {
        console.log(`POST error:`, err);
        toast.error("Failed to create account")
        //toast.error(err.message);
      });
  };

  return (
    <div>
      <div className="Signup">
        <p id="MerTitle">CREATE ACCOUNT</p>
        <label id="MerInputLabel">User Name</label>
        <input
          type="text"
          name="name"
          id="MerTextInput"
          placeholder="name"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setName(e.target.value);
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
            setPassword(checkPassword(e));
          }}
        />
        
        {password.lengthCheck === false && (
          <p>Your password must be at least 8 characters.</p>
        )}
        <button disabled={password.lengthCheck === false} onClick={onSubmit} id="MerButton">
          Signup
        </button>

      <p className="word">
        Already a member? <span id="Font" onClick={moveToLogin}>Login</span>
      </p>
      </div>
      {userID ? (
          <p>Use "{userID}" as UserID for Login</p>
        ) : null}
    </div>
  );
};
