import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import CreateFund from "./components/CreateFund";
import Funds from "./components/Funds";
import Voting from "./components/Voting";
import PermissionToSendOrRefund from "./components/PermissionToSendOrRefund";
import ManagerPortal from "./components/ManagerPortal";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-fund" element={<CreateFund />} />
        <Route path="/funds" element={<Funds />} />
        <Route path="/voting" element={<Voting />} />
        <Route
          path="/permission-to-send-or-refund"
          element={<PermissionToSendOrRefund />}
        />
        <Route path="/manager-portal" element={<ManagerPortal />} />{" "}
        {/* Corrected closing tag */}
      </Routes>
    </Router>
  );
};

export default App;
