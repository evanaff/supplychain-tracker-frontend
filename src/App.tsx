import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import ActorList from "./pages/admin/ActorList";
import AddActor from "./pages/admin/AddActor";
import CreateProduct from "./pages/admin/CreateProduct";
import ProductList from "./pages/admin/ProductList";
import ShipProductScan from "./pages/grower/ShipProductScan";
import ShipProductTraceEvent from "./pages/grower/ShipProductTraceEvent";
import DistributorDashboard from "./pages/distributor/DistributorDashboard";
import RetailerDashboard from "./pages/retailer/RetailerDashboard";
import ProductTracking from "./pages/product/ProductTracking";
import ProductHistory from "./pages/product/ProductHistory";
import VerifyEvent from "./pages/VerifyEvent";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import TraceProductList from "./pages/grower/TraceProductList";
import TraceProductDetails from "./pages/grower/TraceProductDetails";
import CreateTraceProduct from "./pages/grower/CreateTraceProduct";

function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>

        {/* ROOT */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* PUBLIC */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin/actors"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ActorList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/add-actor"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AddActor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <ProductList />
          </ProtectedRoute>
          }
        />

        <Route
          path="/admin/create-product"
          element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <CreateProduct />
          </ProtectedRoute>
          }
        />

        {/* GROWER */}
        <Route
          path="/grower/trace-products"
          element={
          <ProtectedRoute allowedRoles={["GROWER"]}>
            <TraceProductList />
          </ProtectedRoute>
          }
        />
        
        <Route
          path="/grower/trace-products/:traceProductId"
          element={
          <ProtectedRoute allowedRoles={["GROWER"]}>
            <TraceProductDetails />
          </ProtectedRoute>
          }
        />
        
        <Route
          path="/grower/add-trace-product"
          element={
          <ProtectedRoute allowedRoles={["GROWER"]}>
            <CreateTraceProduct />
          </ProtectedRoute>}
        />

        <Route
          path="/grower/shipping"
          element={
            <ProtectedRoute allowedRoles={["GROWER"]}>
              <ShipProductScan />
            </ProtectedRoute>
          }
        />

        <Route
          path="/grower/shipping/:traceProductId"
          element={
            <ProtectedRoute allowedRoles={["GROWER"]}>
              <ShipProductTraceEvent />
            </ProtectedRoute>
          }
        />

        {/* DISTRIBUTOR */}
        <Route
          path="/distributor"
          element={
            <ProtectedRoute allowedRoles={["DISTRIBUTOR"]}>
              <DistributorDashboard />
            </ProtectedRoute>
          }
        />

        {/* RETAILER */}
        <Route
          path="/retailer"
          element={
            <ProtectedRoute allowedRoles={["RETAILER"]}>
              <RetailerDashboard />
            </ProtectedRoute>
          }
        />

        {/* PUBLIC PRODUCT */}
        <Route path="/product/:id" element={<ProductTracking />} />
        <Route path="/product/:id/history" element={<ProductHistory />} />

        {/* VERIFY */}
        <Route
          path="/verify"
          element={
            <ProtectedRoute
              allowedRoles={[
                "GROWER",
                "DISTRIBUTOR",
                "RETAILER",
                "ADMIN",
              ]}
            >
              <VerifyEvent />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;