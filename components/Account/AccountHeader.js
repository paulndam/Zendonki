import { Header, Icon, Label, Segment } from "semantic-ui-react";
import formatDate from "../../utils/formatDate";

function AccountHeader({ role, email, name, createdAt }) {
  return (
    <>
      {role === "root" || role === "admin" ? (
        <Segment secondary inverted color="black">
          <Label
            color="green"
            size="large"
            ribbon
            icon="privacy"
            style={{ textTransform: "capitalize" }}
            content={role}
          />
          <Header inverted textAlign="center" as="h1" icon>
            <Icon name="user" />
            {name}
            <Header.Subheader>{email}</Header.Subheader>
            <Header.Subheader>
              Joined On {formatDate(createdAt)}
            </Header.Subheader>
          </Header>
        </Segment>
      ) : (
        <Segment secondary inverted color="brown">
          <Label
            color="green"
            size="large"
            ribbon
            icon="privacy"
            style={{ textTransform: "capitalize" }}
            content={role}
          />
          <Header inverted textAlign="center" as="h1" icon>
            <Icon name="user" />
            {name}
            <Header.Subheader>{email}</Header.Subheader>
            <Header.Subheader>
              Joined On {formatDate(createdAt)}
            </Header.Subheader>
          </Header>
        </Segment>
      )}
    </>
  );
}

// function AccountHeader() {
//   return <>AccountHeader</>;
// }

export default AccountHeader;
