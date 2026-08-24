import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Landing from "@/pages/Landing";
import Cafeteria from "@/pages/Cafeteria";
import ShopDashboard from "@/pages/ShopDashboard";
import Mess from "@/pages/Mess";
import Report from "@/pages/Report";
import Login from "@/pages/Login";
import Admin from "@/pages/Admin";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/cafeteria" element={<Cafeteria />} />
          <Route path="/cafeteria/:shopId" element={<ShopDashboard />} />
          <Route path="/mess" element={<Mess />} />
          <Route path="/report" element={<Report />} />
          <Route path="/login/:role/:shopId?" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </div>
  );
}

export default App;
