import type { ReactNode } from 'react';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductsManagement from './pages/admin/ProductsManagement';
import OrdersManagement from './pages/admin/OrdersManagement';
import UsersManagement from './pages/admin/UsersManagement';

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <Home />,
    visible: false,
  },
  {
    name: 'Product Detail',
    path: '/product/:id',
    element: <ProductDetail />,
    visible: false,
  },
  {
    name: 'Cart',
    path: '/cart',
    element: <Cart />,
    visible: false,
  },
  {
    name: 'Checkout',
    path: '/checkout',
    element: <Checkout />,
    visible: false,
  },
  {
    name: 'Payment Success',
    path: '/payment-success',
    element: <PaymentSuccess />,
    visible: false,
  },
  {
    name: 'My Orders',
    path: '/orders',
    element: <Orders />,
    visible: false,
  },
  {
    name: 'Login',
    path: '/login',
    element: <Login />,
    visible: false,
  },
  {
    name: 'Register',
    path: '/register',
    element: <Register />,
    visible: false,
  },
  {
    name: 'Admin Dashboard',
    path: '/admin',
    element: <AdminDashboard />,
    visible: false,
  },
  {
    name: 'Products Management',
    path: '/admin/products',
    element: <ProductsManagement />,
    visible: false,
  },
  {
    name: 'Orders Management',
    path: '/admin/orders',
    element: <OrdersManagement />,
    visible: false,
  },
  {
    name: 'Users Management',
    path: '/admin/users',
    element: <UsersManagement />,
    visible: false,
  },
];

export default routes;