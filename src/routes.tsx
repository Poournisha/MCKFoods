import type { ReactNode } from 'react';
import Home from './pages/Home.tsx';
import ProductDetail from './pages/ProductDetail.tsx';
import Cart from './pages/Cart.tsx';
import Wishlist from './pages/Wishlist.tsx';
import Checkout from './pages/Checkout.tsx';
import PaymentSuccess from './pages/PaymentSuccess.tsx';
import Orders from './pages/Orders.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import About from './pages/About.tsx';
import Contact from './pages/Contact.tsx';
import PolicyPageView from './pages/PolicyPage.tsx';
import AdminDashboard from './pages/admin/AdminDashboard.tsx';
import RevenueManagement from './pages/admin/RevenueManagement.tsx';
import ProductsManagement from './pages/admin/ProductsManagement.tsx';
import OrdersManagement from './pages/admin/OrdersManagement.tsx';
import UsersManagement from './pages/admin/UsersManagement.tsx';
import PoliciesManagement from './pages/admin/PoliciesManagement.tsx';
import AboutManagement from './pages/admin/AboutManagement.tsx';
import FAQManagement from './pages/admin/FAQManagement.tsx';
import ContactManagement from './pages/admin/ContactManagement.tsx';
import ShippingManagement from './pages/admin/ShippingManagement.tsx';
import ReviewsManagement from './pages/admin/ReviewsManagement.tsx';
import { RequireAdmin } from './components/auth/RequireAdmin.tsx';

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
    name: 'Wishlist',
    path: '/wishlist',
    element: <Wishlist />,
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
    name: 'About Us',
    path: '/about',
    element: <About />,
    visible: false,
  },
  {
    name: 'Contact',
    path: '/contact',
    element: <Contact />,
    visible: false,
  },
  {
    name: 'Policy Page',
    path: '/policy/:slug',
    element: <PolicyPageView />,
    visible: false,
  },
  {
    name: 'Admin Dashboard',
    path: '/admin',
    element: <RequireAdmin><AdminDashboard /></RequireAdmin>,
    visible: false,
  },
  {
    name: 'Revenue Management',
    path: '/admin/revenue',
    element: <RequireAdmin><RevenueManagement /></RequireAdmin>,
    visible: false,
  },
  {
    name: 'Products Management',
    path: '/admin/products',
    element: <RequireAdmin><ProductsManagement /></RequireAdmin>,
    visible: false,
  },
  {
    name: 'Orders Management',
    path: '/admin/orders',
    element: <RequireAdmin><OrdersManagement /></RequireAdmin>,
    visible: false,
  },
  {
    name: 'Users Management',
    path: '/admin/users',
    element: <RequireAdmin><UsersManagement /></RequireAdmin>,
    visible: false,
  },
  {
    name: 'Policies Management',
    path: '/admin/policies',
    element: <RequireAdmin><PoliciesManagement /></RequireAdmin>,
    visible: false,
  },
  {
    name: 'About Management',
    path: '/admin/about',
    element: <RequireAdmin><AboutManagement /></RequireAdmin>,
    visible: false,
  },
  {
    name: 'FAQ Management',
    path: '/admin/faq',
    element: <RequireAdmin><FAQManagement /></RequireAdmin>,
    visible: false,
  },
  {
    name: 'Contact Management',
    path: '/admin/contact',
    element: <RequireAdmin><ContactManagement /></RequireAdmin>,
    visible: false,
  },
  {
    name: 'Shipping Management',
    path: '/admin/shipping',
    element: <RequireAdmin><ShippingManagement /></RequireAdmin>,
    visible: false,
  },
  {
    name: 'Reviews Management',
    path: '/admin/reviews',
    element: <RequireAdmin><ReviewsManagement /></RequireAdmin>,
    visible: false,
  },
];

export default routes;
