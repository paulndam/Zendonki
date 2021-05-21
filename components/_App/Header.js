import { Menu, Container, Image, Icon } from "semantic-ui-react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import NProgres from "nprogress";
import { logOut } from "../../utils/auth";

Router.onRouteChangeStart = () => NProgres.start();
Router.onRouteChangeComplete = () => NProgres.done();
Router.onRouteChangeError = () => NProgres.done();

function Header({ user }) {
  console.log(user);
  const router = useRouter();
  const isRoot = user && user.role === "root";
  const isAdmin = user && user.role === "admin";
  const isRootOrAdmin = isRoot || isAdmin;

  const isActive = (route) => {
    return route === router.pathname;
  };

  return (
    <Menu stackable fluid id="menu" inverted>
      <Container text>
        <Link href="/">
          <Menu.Item header active={isActive("/")}>
            <Image
              size="mini"
              src="/static/logo.svg"
              style={{ marginRight: "1em" }}
            />
            Zendonki
          </Menu.Item>
        </Link>

        <Link href="/cart">
          <Menu.Item header active={isActive("/cart")}>
            <Icon name="cart" size="large"></Icon>
            Cart
          </Menu.Item>
        </Link>

        {/* if user exist then show this */}

        {isRootOrAdmin && (
          <Link href="/create">
            <Menu.Item header active={isActive("/create")}>
              <Icon name="add square" size="large" />
              Create
            </Menu.Item>
          </Link>
        )}

        {user ? (
          <>
            <Link href="/account">
              <Menu.Item header active={isActive("/account")}>
                <Icon name="user" size="large" />
                {user.name}
              </Menu.Item>
            </Link>

            <Menu.Item header onClick={logOut}>
              <Icon name="sign out" size="large" />
              log-Out
            </Menu.Item>
          </>
        ) : (
          <>
            <Link href="/login">
              <Menu.Item header active={isActive("/login")}>
                <Icon name="sign in" size="large" />
                log-in
              </Menu.Item>
            </Link>

            <Link href="/signup">
              <Menu.Item header active={isActive("/signup")}>
                <Icon name="signup" size="large" />
                sign-up
              </Menu.Item>
            </Link>
          </>
        )}
      </Container>
    </Menu>
  );
}

export default Header;
