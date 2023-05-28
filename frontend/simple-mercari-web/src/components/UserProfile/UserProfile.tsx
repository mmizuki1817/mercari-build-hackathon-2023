import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import { MerComponent } from "../MerComponent";
import { toast } from "react-toastify";
import { ItemList } from "../ItemList";
import { fetcher } from "../../helper";

interface Item {
  id: number;
  name: string;
  price: number;
  category_name: string;
}

export const checkBalance = (e: React.ChangeEvent<HTMLInputElement>, balance: Number) => {
  const checkedResults: {
    balanceCheck: Number;
    input: Number;
  } = {
    balanceCheck: 0,
    input: 0
  };
  const addedbalance = Number(e.target.value);
  if (!Number(addedbalance)){
    checkedResults.balanceCheck = 3;
  }
  else if (addedbalance < 0) {
    checkedResults.balanceCheck = -1;
  } else if (addedbalance >= Number.MAX_SAFE_INTEGER) {
    // overflow
    checkedResults.balanceCheck = 1;
  } else if (addedbalance + Number(balance) >= Number.MAX_SAFE_INTEGER) {
    // overflow
    checkedResults.balanceCheck = 1;
  } 
  else if (!Number.isInteger(addedbalance)) {
    checkedResults.balanceCheck = 2;
  }
  else {
    checkedResults.balanceCheck = 0;
    checkedResults.input = Number(e.target.value);
  }
  return checkedResults;
};


export const UserProfile: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [balance, setBalance] = useState<number>();
  const [addedbalance, setAddedBalance] = useState<{
    balanceCheck: Number;
    input: Number;
  }>({
    balanceCheck: 0,
    input: 0
  });
  const [cookies] = useCookies(["token"]);
  const params = useParams();

  const fetchItems = () => {
    fetcher<Item[]>(`/users/${params.id}/items`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
    })
      .then((items) => setItems(items))
      .catch((err) => {
        console.log(`GET error:`, err);
        toast.error(err.message);
      });
  };

  const fetchUserBalance = () => {
    fetcher<{ balance: number }>(`/balance`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
    })
      .then((res) => {
        setBalance(res.balance);
      })
      .catch((err) => {
        console.log(`GET error:`, err);
        toast.error(err.message);
      });
  };

  useEffect(() => {
    fetchItems();
    fetchUserBalance();
  }, []);

  const onBalanceSubmit = () => {
    fetcher(`/balance`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
      body: JSON.stringify({
        balance: addedbalance.input,
      }),
    })
      .then((_) => window.location.reload())
      .catch((err) => {
        console.log(`POST error:`, err);
        toast.error(err.message);
      });
    };

  return (
    <MerComponent>
      <div className="UserProfile">
        <div>
          <div>
            <h2>
              <span>Balance: {balance}</span>
            </h2>
            <input
              type="number"
              name="balance"
              id="MerTextInput"
              placeholder="0"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setAddedBalance(checkBalance(e, Number(balance)));
              }}
              required
            />
            {addedbalance.balanceCheck !== 0 && (
              <p>Invalid value</p>
            )}
            <button disabled={addedbalance.balanceCheck !== 0} onClick={onBalanceSubmit} id="MerButton">
              Add balance
            </button>
          </div>

          <div>
            <h2>Item List</h2>
              {<ItemList items={items} />}
          </div>
        </div>
      </div>
    </MerComponent>
  );
};
