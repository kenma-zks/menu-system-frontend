import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Sidebar from "./components/UI/Sidebar";
import BookVisit from "./pages/BookVisit";
import CallWaiter from "./pages/CallWaiter";
import MyCart from "./pages/MyCart";
import MyOrders from "./pages/MyOrders";
import Info from "./pages/Info";
import Home from "./pages/Home";
import Login from "./pages/admin/Login";
import SignUp from "./pages/admin/SignUp";
import RequireAuth from "./routes/requireAuth";
import AdminSidebar from "./components/UI/AdminSidebar";
import ForgotPassword from "./pages/admin/ForgotPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Sidebar />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "call-waiter",
        element: <CallWaiter />,
      },
      {
        path: "book-visit",
        element: <BookVisit />,
      },
      {
        path: "my-orders",
        element: <MyOrders />,
      },
      {
        path: "my-cart",
        element: <MyCart />,
      },
      {
        path: "info",
        element: <Info />,
      },
    ],
  },

  {
    path: "/admin",
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        element: <AdminSidebar />,
        children: [
          {
            path: "home",
            element: <RequireAuth route="home" />,
          },
          {
            path: "products",
            element: <RequireAuth route="products" />,
          },
          {
            path: "orders",
            element: <RequireAuth route="orders" />,
          },
          {
            path: "bookings",
            element: <RequireAuth route="bookings" />,
          },
          {
            path: "order-history",
            element: <RequireAuth route="order-history" />,
          },
          {
            path: "booking-history",
            element: <RequireAuth route="booking-history" />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  );
}

export default App;
