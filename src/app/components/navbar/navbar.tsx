"use client";

import { signOut } from "next-auth/react";
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
          <NavigationDropdownItem title="copies" href="/data/copies" />
          <NavigationDropdownItem title="clubs" href="/data/clubs" />
          <NavigationDropdownItem title="renters" href="/data/renters" />
          <NavigationDropdownItem title="board games" href="/data/board-games" />
          <NavigationDropdownItem title="rentals" href="/data/rentals" />
        </NavigationDropdown>
        <NavigationButton title="sign out" onClick={() => signOut()} />
      </div>
    </div>
  );
}

function NavigationButton({
  title,
  onClick,
}: {
  title: string;
  onClick: () => void;
}) {
  return (
    <div className="nav-dropdown">
      <button onClick={onClick} className="nav-dropdown-button">
        <span>{title}</span>
      </button>
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
