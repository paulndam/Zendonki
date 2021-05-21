import {
  Header,
  Label,
  Icon,
  Segment,
  Button,
  List,
  Image,
  Accordion,
} from "semantic-ui-react";
import { useRouter } from "next/router";
import formatDate from "../../utils/formatDate";

function AccountOrders({ orders }) {
  const router = useRouter();

  function mapOrders(orders) {
    return orders.map((o) => ({
      key: o._id,
      title: {
        content: <Label color="blue" content={formatDate(o.createdAt)} />,
      },
      content: {
        content: (
          <>
            <List.Header as="h3">
              Total: ${o.total}
              <Label
                content={o.email}
                icon="mail"
                basic
                horizontal
                style={{ marginLeft: "1em" }}
              />
            </List.Header>
            <List>
              {o.products.map((p) => (
                <List.Item key={p.product._id}>
                  <Image avatar src={p.product.mediaUrl} />
                  <List.Content>
                    <List.Header>{p.product.name}</List.Header>
                    <List.Description>
                      {p.quantity} . ${p.product.price}
                    </List.Description>
                  </List.Content>

                  <List.Content floated="right">
                    <Label tag color="red" size="tiny">
                      {p.product.sku}
                    </Label>
                  </List.Content>
                </List.Item>
              ))}
            </List>
          </>
        ),
      },
    }));
  }

  return (
    <>
      <Header as="h2">
        <Icon name="folder open" />
        Order History
      </Header>
      {orders.length === 0 ? (
        <Segment inverted tertiary color="grey" textAlign="center">
          <Header icon>
            <Icon name="copy outline" />
            No Past Orders
          </Header>
          <div>
            <Button onClick={router.push("/")} color="yellow">
              View Products
            </Button>
          </div>
        </Segment>
      ) : (
        <Accordion fluid styled exclusive={false} panels={mapOrders(orders)} />
      )}
    </>
  );
}

export default AccountOrders;
