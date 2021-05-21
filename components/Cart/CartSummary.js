import React, { useEffect, useState } from "react";
import StripeCheckOut from "react-stripe-checkout";
import { Button, Segment, Divider } from "semantic-ui-react";
import calculateTotal from "../../utils/calculateCartTotal";

function CartSummary({ products, checkOut, success }) {
  const [cartAmount, setCartAmount] = useState(0);
  const [stripeAmount, setStripeAmount] = useState(0);

  const [isCartEmpty, setIsCartEmpty] = useState(false);

  useEffect(() => {
    const { cartTotal, stripeTotal } = calculateTotal(products);
    setCartAmount(cartTotal);
    setStripeAmount(stripeTotal);
    setIsCartEmpty(products.length === 0);
  }, [products]);

  return (
    <>
      <Divider />
      <Segment clearing size="large">
        <strong>subtotal :</strong> ${cartAmount}
        <StripeCheckOut
          name="Zendonki"
          amount={stripeAmount}
          image={products.length > 0 ? products[0].product.mediaUrl : ""}
          currency="USD"
          shippingAddress={true}
          billingAddress={true}
          zipCode={true}
          token={checkOut}
          triggerEvent="onClick"
          stripeKey="pk_test_51IRFj6IznkxfOVO4ned0nxvpxf76v0popRSmthppnIcTlnAT3AN6RR5EVuzhGNlZDjWrsZOpnlLpHw3JXHbXsB2I00FZTgSosk"
        >
          <Button
            disabled={isCartEmpty || success}
            icon="cart"
            color="purple"
            floated="right"
            content="checkout"
          />
        </StripeCheckOut>
      </Segment>
    </>
  );
}

export default CartSummary;
