import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import Booking from "../pages/admin/Booking";
import BookingHistory from "../pages/admin/BookingHistory";
import AdminHome from "../pages/admin/Home";
import AdminOrders from "../pages/admin/Orders";
import Products from "../pages/admin/Products";
import { useAppSelector } from "../store/hooks";
import OrderHistory from "../pages/admin/OrderHistory";
import Tables from "../pages/admin/Tables";

const RequireAuth = ({ route }: { route: string }) => {
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  switch (route) {
    case "home":
      return <AdminHome />;
    case "products":
      return <Products />;
    case "orders":
      return <AdminOrders />;
    case "bookings":
      return <Booking />;
    case "tables":
      return <Tables />;
    case "order-history":
      return <OrderHistory />;
    case "booking-history":
      return <BookingHistory />;

    default:
      return null;
  }
};

export default RequireAuth;
