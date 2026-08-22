"use client";

import { TopNavbar } from "./top-navbar";
import { SecondaryNavbar } from "./secondary-navbar";

export function Nav() {
  return (
    <div className="w-full flex flex-col">
      <TopNavbar />
      <SecondaryNavbar />
    </div>
  );
}

export default Nav;
