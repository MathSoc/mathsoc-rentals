import Link from "next/link";
import "./navbar.scss";

export function Navigation() {
  return (
    <div className="nav-container">
      <Link href="/" className="logo-container">
        <span className="site-title">mathsoc rentals</span>
      </Link>
      <div className="left">
        <NavigationDropdown title="data">
          <NavigationDropdownItem title="items" href="/data/items" />
        </NavigationDropdown>
      </div>
    </div>
  );
}

function NavigationDropdown({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="nav-dropdown">
      <div className="nav-dropdown-button">
        <span>{title}</span>
      </div>
      <div className="nav-dropdown-children">{children}</div>
    </div>
  );
}

function NavigationDropdownItem({
  title,
  href,
}: {
  title: string;
  href: string;
}) {
  return (
    <div className="nav-dropdown-item">
      <Link href={href}>
        <span>{title}</span>
      </Link>
    </div>
  );
}
