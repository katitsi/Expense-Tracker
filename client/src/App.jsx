import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import Home from "./pages/Dashboard/Home.jsx";
import Income from "./pages/Dashboard/Income.jsx";
import Expense from "./pages/Dashboard/Expense.jsx";
import UserProvider from "./context/UserContext.jsx";
import { Toaster } from "react-hot-toast";
import Account from "./pages/Dashboard/Account.jsx";
import Budget from "./pages/Dashboard/Budget.jsx";

function App() {
  return (
    <UserProvider>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/income" element={<Income />} />
            <Route path="/expense" element={<Expense />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/me" element={<Account />} />
          </Routes>
        </BrowserRouter>
      </div>
      <Toaster
        toastOptions={{
          className: "",
          styles: {
            fontSize: "13px",
          },
        }}
      />
    </UserProvider>
  );
}

export default App;

//Check if the user has logged in.
const Root = () => {
  const isAuthenticated = localStorage.getItem("token");

  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};
