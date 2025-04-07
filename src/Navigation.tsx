import { Route, BrowserRouter as Router, Routes } from "react-router";
import DashBoard from "./pages/DashBoard";
export default function Navigation() {
  return (
    <Router>
      <Routes>
        <Route element={<DashBoard />} path="/"></Route>
      </Routes>
    </Router>
  );
}
