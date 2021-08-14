// reactstrap components
import { Container, Nav, NavItem, NavLink } from "reactstrap";

function Footer() {
  return (
    <footer className="footer">
      <Container fluid>
        <Nav>
          <NavItem>
            <NavLink href="https://www.fixant.com">
              Fixant
            </NavLink>
          </NavItem>
         
        </Nav>
        <div className="copyright">
          © {new Date().getFullYear()} made by{" "}
          <a
            href="https://www.fixant.com"
            target="_blank"
            rel="noreferrer"
          >
            Fixant
          </a>{" "}
          for a better accounting system.
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
