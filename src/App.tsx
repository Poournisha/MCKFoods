import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from '@/components/ui/toaster';
import TopBar from '@/components/common/TopBar';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import AdPopup from '@/components/common/AdPopup';
import ScrollToTop from '@/components/common/ScrollToTop';
import routes from './routes';

function App() {
  const publicPaths = ["/", "/product/*", "/cart", "/wishlist", "/login", "/register", "/payment-success", "/policy/*", "/about", "/contact"];

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <Toaster />
          {/* Advertisement Popup - Shows on every page load */}
          <AdPopup
            productId="2326e15a-9fb6-485c-83d7-6f143af0fcac"
            productName="Children Special Mix Combo"
            imageUrl="/products/children-combo.jpg"
          />
          <div className="flex flex-col min-h-screen">
            <TopBar />
            <Header />
            <main className="flex-grow">
              <Routes>
                {routes.map((route, index) => {
                  const isPublic = publicPaths.some((path) => {
                    if (path.endsWith("/*")) {
                      const basePath = path.slice(0, -2);
                      return route.path.startsWith(basePath);
                    }
                    return route.path === path;
                  });

                  return (
                    <Route
                      key={index}
                      path={route.path}
                      element={
                        isPublic ? (
                          route.element
                        ) : (
                          <RequireAuth>{route.element}</RequireAuth>
                        )
                      }
                    />
                  );
                })}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;