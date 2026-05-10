import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import ActorList from "./pages/admin/ActorList";
import AddActor from "./pages/admin/AddActor";
import CreateProduct from "./pages/grower/CreateProduct";
import ShippingProduct from "./pages/grower/ShippingProduct";
import DistributorDashboard from "./pages/distributor/DistributorDashboard";
import RetailerDashboard from "./pages/retailer/RetailerDashboard";
import ProductTracking from "./pages/product/ProductTracking";
import ProductHistory from "./pages/product/ProductHistory";
import VerifyEvent from "./pages/VerifyEvent";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";

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

        {/* GROWER */}
        <Route
          path="/grower/create"
          element={
            <ProtectedRoute allowedRoles={["GROWER"]}>
              <CreateProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/grower/shipping"
          element={
            <ProtectedRoute allowedRoles={["GROWER"]}>
              <ShippingProduct />
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