import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Applications from "./pages/Applications";
import ColdEmail from "./pages/ColdEmail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/applications"
  element={
    <ProtectedRoute>
      <Applications />
    </ProtectedRoute>
  }
/>
    <Route
  path="/cold-email"
  element={
    <ProtectedRoute>
      <ColdEmail />
    </ProtectedRoute>
  }
/>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;