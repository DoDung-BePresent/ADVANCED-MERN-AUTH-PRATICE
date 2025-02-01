import { Outlet } from "react-router-dom";

const BaseLayout = () => {
  return (
    <div className="flex items-center justify-center mx-auto h-screen">
      <Outlet />
    </div>
  );
};

export default BaseLayout;
