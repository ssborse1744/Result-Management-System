import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CheckResult from "./pages/checkResult";
import Result from "./pages/Result";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-login" element={<Login />} />
        <Route path = "/checkresult" element= {<CheckResult/>}/>
       <Route path="/result/:instituteId/:rollNumber" element={<Result />} />
       <Route path = "/admin-dashboard" element= {<AdminDashboard/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;