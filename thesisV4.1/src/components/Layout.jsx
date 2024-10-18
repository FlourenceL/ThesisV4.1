import { Outlet, Link } from "react-router-dom";

function Layout() {
  return (
    <>
      <nav>
        <ul></ul>
      </nav>

      <Outlet />
    </>
  );
}

export default Layout;
