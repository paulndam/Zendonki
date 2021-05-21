import React, { useEffect, useState } from "react";
import { Input } from "semantic-ui-react";
import { useRouter } from "next/router";
import baseUrl from "../../utils/baseUrl";
import cookie from "js-cookie";
import axios from "axios";
import catchErrors from "../../utils/catchErrors";

function AddProductToCart({ user, productId }) {
  const [quantity, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let timeOut;
    if (success) {
      timeOut = setTimeout(() => setSuccess(false), 2500);
    }
    return () => {
      clearTimeout(timeOut);
    };
  }, [success]);

  async function addProductInCart() {
    try {
      setLoading(true);
      const url = `${baseUrl}/api/cart`;
      const payload = { quantity, productId };
      const token = cookie.get("token");
      const headers = { headers: { Authorization: token } };
      await axios.put(url, payload, headers);
      setSuccess(true);
    } catch (error) {
      console.log(error);
      catchErrors(error, window.alert);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Input
      type="number"
      min="1"
      placeholder="Quantity"
      value={quantity}
      onChange={(e) => setQty(Number(e.target.value))}
      action={
        user && success
          ? {
              color: "green",
              content: "item added 🤠",
              icon: "plus cart",
              disabled: true,
            }
          : user
          ? {
              color: "blue",
              content: "add to cart",
              icon: "plus cart",
              loading,
              disabled: loading,
              onClick: addProductInCart,
            }
          : {
              color: "yellow",
              icon: "signup",
              content: "signup to purchase",
              onClick: () => router.push("/signup"),
            }
      }
    />
  );
}

export default AddProductToCart;
