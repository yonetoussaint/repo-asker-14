import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { RedirectAuthProvider } from "./context/RedirectAuthContext";
import { HomepageProvider } from "./context/HomepageContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import Index from "./pages/Index";
import ForYou from "./pages/ForYou";
import BooksHomepage from "./pages/BooksHomepage";
import ConditionalHomepage from "./components/layout/ConditionalHomepage";
import SearchPage from "./pages/SearchPage";
import ProductDetail from "./pages/ProductDetail";
import SingleProductDetail from "./pages/SingleProductDetail";
import ProductDescriptionPage from "./pages/ProductDescriptionPage";
import ProductCheckout from "./pages/ProductCheckout";

import Videos from "./pages/Videos";
import Reels from "./pages/Reels";
import Trending from "./pages/Trending";
import Wallet from "./pages/Wallet";
import ProfilePage from "./pages/ProfilePage";
import MoreMenu from "./pages/MoreMenu";
import SimpleAuthPage from "./pages/SimpleAuthPage";
import AuthPage from "./pages/AuthPage";
import CategoriesPage from "./pages/CategoriesPage";
import FashionPage from "./pages/FashionPage";
import ElectronicsPage from "./pages/ElectronicsPage";
import HomeLivingPage from "./pages/HomeLivingPage";
import SportsOutdoorsPage from "./pages/SportsOutdoorsPage";
import AutomotivePage from "./pages/AutomotivePage";
import KidsHobbiesPage from "./pages/KidsHobbiesPage";
import EntertainmentPage from "./pages/EntertainmentPage";
import AdminPanel from "./pages/AdminPanel";
import SellerPage from "./pages/SellerPage";
import Checkout from "./pages/Checkout";
import PayPalCheckout from "./pages/PayPalCheckout";
import PayPalHostedCheckout from "./pages/PayPalHostedCheckout";
import PayPalPayment from "./pages/PayPalPayment";
import DynamicPayPalCheckout from "./pages/DynamicPayPalCheckout";
import PayPalDepositPage from "./pages/PayPalDepositPage";
import DepositPage from "./pages/DepositPage";
import NFTPaymentPage from "./pages/NFTPaymentPage";
import TopUpPage from "./pages/TopUpPage";
import NetflixPage from "./pages/NetflixPage";
import TransferPage from "./pages/TransferPage";
import TransferHomePage from "./pages/TransferHomePage";
import MultiStepTransferPage from "./pages/MultiStepTransferPage";
import MultiStepTransferSheetPage from "./pages/MultiStepTransferSheetPage";
import ProductCommentsPage from "./pages/ProductCommentsPage";
import ProductReviewsPage from "./pages/ProductReviewsPage";
import ProductQAPage from "./pages/ProductQAPage";
import AskQuestionPage from "./pages/AskQuestionPage";
import ProductEditPage from "./pages/ProductEditPage";
import ProductEditNavigationPage from "./pages/ProductEditNavigationPage";
import ProductEditBasicPage from "./pages/ProductEditBasicPage";
import ProductEditCategoryPage from "./pages/ProductEditCategoryPage";
import ProductEditMediaPage from "./pages/ProductEditMediaPage";
import ProductEditShippingPage from "./pages/ProductEditShippingPage";
import ProductEditDealsPage from "./pages/ProductEditDealsPage";
import ProductEditSpecsPage from "./pages/ProductEditSpecsPage";
import ProductEditVariantsPage from "./pages/ProductEditVariantsPage";
import ProductEditNewVariantPage from "./pages/ProductEditNewVariantPage";

import ProductEditDetailsPage from "./pages/ProductEditDetailsPage";
import ProductEditDescriptionPage from "./pages/ProductEditDescriptionPage";
import ComponentTestPage from "./pages/ComponentTestPage";
import SellerDashboard from "./pages/SellerDashboard";

import NotFound from "./pages/NotFound";
import MainLayout from "./components/layout/MainLayout";
import { AuthOverlayProvider } from "./context/AuthOverlayContext";
import { ScreenOverlayProvider } from "./context/ScreenOverlayContext"; // SINGLE IMPORT
import { AuthProvider } from "./contexts/auth/AuthContext";

import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <TooltipProvider>
          <CurrencyProvider>
            <Router>
              <RedirectAuthProvider>
                <HomepageProvider>
                  <AuthProvider>
                    <AuthOverlayProvider>
                      <ScreenOverlayProvider> {/* SINGLE PROVIDER WRAP */}
                        <div className="App min-h-screen bg-background text-foreground">
                          <Routes>
                            <Route path="/" element={<MainLayout />}>
                              <Route index element={<ConditionalHomepage />} />
                              <Route path="for-you" element={<ConditionalHomepage />} />
                              <Route path="index" element={<Index />} />
                              <Route path="search" element={<SearchPage />} />
                              <Route path="product/:id" element={<ProductDetail />} />
                              <Route path="product/:id/description" element={<ProductDescriptionPage />} />
                              <Route path="product/:id/comments" element={<ProductCommentsPage />} />
                              <Route path="product/:id/reviews" element={<ProductReviewsPage />} />
                              <Route path="product/:id/qa" element={<ProductQAPage />} />
                              <Route path="product/:id/ask-question" element={<AskQuestionPage />} />
                              <Route path="single-product/:id" element={<SingleProductDetail />} />
                              <Route path="single-product/:id/comments" element={<ProductCommentsPage />} />
                              <Route path="single-product/:id/ask-question" element={<AskQuestionPage />} />
                              <Route path="posts" element={<CategoriesPage />} />
                              <Route path="videos" element={<Videos />} />
                              <Route path="reels" element={<Reels />} />
                              <Route path="reels/:mode" element={<Reels />} />
                              <Route path="trending" element={<Trending />} />
                              <Route path="wallet" element={<Wallet />} />
                              <Route path="profile" element={<ProfilePage />} />
                              <Route path="more" element={<MoreMenu />} />
                              <Route path="more-menu" element={<MoreMenu />} />
                              <Route path="auth" element={<SimpleAuthPage />} />
                              <Route path="signin" element={<AuthPage />} />
                              <Route path="categories" element={<CategoriesPage />} />
                              <Route path="categories/fashion" element={<FashionPage />} />
                              <Route path="categories/electronics" element={<ElectronicsPage />} />
                              <Route path="categories/home-living" element={<HomeLivingPage />} />
                              <Route path="categories/sports-outdoors" element={<SportsOutdoorsPage />} />
                              <Route path="categories/automotive" element={<AutomotivePage />} />
                              <Route path="categories/kids-hobbies" element={<KidsHobbiesPage />} />
                              <Route path="categories/entertainment" element={<EntertainmentPage />} />
                              <Route path="admin" element={<AdminPanel />} />
                              <Route path="seller/:sellerId" element={<SellerPage />} />
                              <Route path="product/:productId/edit" element={<ProductEditNavigationPage />} />
                              <Route path="product/:productId/edit/basic" element={<ProductEditBasicPage />} />
                              <Route path="product/:productId/edit/category" element={<ProductEditCategoryPage />} />
                              <Route path="product/:productId/edit/media" element={<ProductEditMediaPage />} />
                              <Route path="product/:productId/edit/shipping" element={<ProductEditShippingPage />} />
                              <Route path="product/:productId/edit/deals" element={<ProductEditDealsPage />} />
                              <Route path="product/:productId/edit/specifications" element={<ProductEditSpecsPage />} />
                              <Route path="product/:productId/edit/variants" element={<ProductEditVariantsPage />} />
                              <Route path="product/:productId/edit/variants/new" element={<ProductEditNewVariantPage />} />

                              <Route path="product/:productId/edit/details" element={<ProductEditDetailsPage />} />
                              <Route path="product/:productId/edit/description" element={<ProductEditDescriptionPage />} />
                              <Route path="checkout" element={<Checkout />} />
                              <Route path="product-checkout" element={<ProductCheckout />} />
                              <Route path="paypal-checkout" element={<PayPalCheckout />} />
                              <Route path="paypal-hosted-checkout" element={<PayPalHostedCheckout />} />
                              <Route path="paypal-payment" element={<PayPalPayment />} />
                              <Route path="dynamic-paypal-checkout" element={<DynamicPayPalCheckout />} />
                              <Route path="paypal-deposit" element={<PayPalDepositPage />} />
                              <Route path="deposit" element={<DepositPage />} />
                              <Route path="nft-payment" element={<NFTPaymentPage />} />
                              <Route path="topup" element={<TopUpPage />} />
                              <Route path="netflix" element={<NetflixPage />} />
                              <Route path="transfer-old" element={<TransferPage />} />
                              <Route path="transfer" element={<TransferHomePage />} />
                              <Route path="multi-step-transfer" element={<MultiStepTransferPage />} />
                              <Route path="multi-step-transfer-page" element={<MultiStepTransferSheetPage />} />
                              <Route path="component-test" element={<ComponentTestPage />} />
                              <Route path="signup" element={<SimpleAuthPage />} />
                              <Route path="auth/callback" element={<ForYou />} />
                              <Route path="seller-dashboard/*" element={<SellerDashboard />} />
                              <Route path="*" element={<NotFound />} />
                            </Route>
                          </Routes>
                          <Toaster />
                          <Sonner />
                        </div>
                      </ScreenOverlayProvider>
                    </AuthOverlayProvider>
                  </AuthProvider>
                </HomepageProvider>
              </RedirectAuthProvider>
            </Router>
          </CurrencyProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;