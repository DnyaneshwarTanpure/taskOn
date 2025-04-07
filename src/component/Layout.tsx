import React from "react";
import { Outlet } from "react-router";
import Header from "./Header";

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
