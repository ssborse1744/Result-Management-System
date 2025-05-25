import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CheckResult from "./pages/checkResult";
import Result from "./pages/Result";
import AdminDashboard from "./pages/AdminDashboard";
import BulkUpload from "./pages/BulkUpload";
import ResultCRUD from "./pages/ResultCRUD";
import StudentManagement from "./pages/StudentManagement";
import ClassConfig from "./pages/ClassConfig";
import DataExport from "./pages/DataExport";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-login" element={<Login />} />
        <Route path = "/checkresult" element= {<CheckResult/>}/>
       <Route path="/result/:instituteId/:rollNumber" element={<Result />} />
       <Route path = "/admin-dashboard" element= {<AdminDashboard/>}/>
       <Route path = "/admin-dashboard/bulk-upload" element= {<BulkUpload/>}/>
       <Route path = "/admin-dashboard/results" element= {<ResultCRUD/>}/>
       <Route path = "/admin-dashboard/students" element= {<StudentManagement/>}/>
       <Route path = "/admin-dashboard/classes" element= {<ClassConfig/>}/>
       <Route path = "/admin-dashboard/exports" element= {<DataExport/>}/>
       <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;