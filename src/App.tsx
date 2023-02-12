import { ChakraProvider } from '@chakra-ui/react'
import {
  Routes,
  Route,
  createBrowserRouter,
  Link,
  RouterProvider,
} from 'react-router-dom'
import Sidebar from './components/UI/Sidebar'
import BookVisit from './pages/BookVisit'
import CallWaiter from './pages/CallWaiter'
import MyCart from './pages/MyCart'
import MyOrders from './pages/MyOrders'
import Info from './pages/Info'
import Home from './pages/Home'
import Login from './pages/admin/Login'
import SignUp from './pages/admin/SignUp'
import AdminHome from './pages/admin/Home'
import React from 'react'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Sidebar />,
    children: [
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'call-waiter',
        element: <CallWaiter />,
      },
      {
        path: 'book-visit',
        element: <BookVisit />,
      },
      {
        path: 'my-orders',
        element: <MyOrders />,
      },
      {
        path: 'my-cart',
        element: <MyCart />,
      },
      {
        path: 'info',
        element: <Info />,
      },
    ],
  },
  {
    path: '/admin',
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'signup',
        element: <SignUp />,
      },
      {
        path: 'home',
        element: <AdminHome />,
      },
    ],
  },
])

function App() {
  return (
    <ChakraProvider>
      <RouterProvider router={router} />
      {/* <Sidebar />
      <Routes>
        <Route path="/call-waiter" element={<CallWaiter />} />
        <Route path="/book-visit" element={<BookVisit />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/my-cart" element={<MyCart />} />
      </Routes> */}
    </ChakraProvider>
  )
}

export default App
