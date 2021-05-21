import {
  Header,
  Segment,
  Button,
  Icon,
  Item,
  Message,
} from "semantic-ui-react";
import { useRouter } from "next/router";

function CartItemList({ products, user, removeFromCart, success }) {
  const router = useRouter();

  function mapCartProductsToItem(products) {
    return products.map((p) => ({
      childKey: p.product._id,
      header: (
        <Item.Header
          as="a"
          onClick={() => router.push(`/product?_id=${p.product._id}`)}
        >
          {p.product.name}
        </Item.Header>
      ),
      image: p.product.mediaUrl,
      meta: `${p.quantity} x $${p.product.price}`,
      fluid: true,
      extra: (
        <Button
          basic
          icon="remove"
          floated="right"
          onClick={() => removeFromCart(p.product._id)}
        />
      ),
    }));
  }
  if (success) {
    return (
      <Message
        success
        header="success"
        content="payment accepted 🤠"
        icon="star outline"
      />
    );
  }

  if (products.length === 0) {
    return (
      <Segment secondary color="purple" inverted textAlign="center" placeholder>
        <Header icon>
          <Icon name="shopping basket" />
          No products in you cart so far. Get some 🤠
        </Header>
        <div>
          {user ? (
            <Button color="brown" onClick={() => router.push("/")}>
              View products
            </Button>
          ) : (
            <Button color="orange" onClick={() => router.push("/login")}>
              log in to add products
            </Button>
          )}
        </div>
      </Segment>
    );
  }
  return <Item.Group divided items={mapCartProductsToItem(products)} />;
}

export default CartItemList;
