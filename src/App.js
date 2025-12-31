import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { OpenRoute } from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GroupPage from "./pages/GroupPage";
import GroupBalancePage from "./pages/GroupBalancePage";
import Settlements from "./pages/Settlements";
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={

          <OpenRoute><Login /></OpenRoute>
          } />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" />} />
        <Route path="/groups/:groupId" element={<GroupPage />} />
        <Route path="/groups/:groupId/balances" element={<GroupBalancePage />} />
<Route path="/settlements" element={<Settlements />} />

      </Routes>
      <ToastContainer position="top-right" autoClose={6000} />
    </BrowserRouter>
  );
}

export default App;
