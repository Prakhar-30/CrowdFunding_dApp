import React from "react";
import { useNavigate } from "react-router-dom";
import Spline from "@splinetool/react-spline";

const ManagerPortal = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/8dMo2lBb3D2mHpJz/scene.splinecode" />
      </div>
      <div className="relative z-10 space-y-8 w-full max-w-4xl text-white mb-8">
        <h1 className="text-4xl font-bold mt-0 mb-44 text-center">
          Manager Portal
        </h1>
        <div className="flex justify-between">
          <button
            onClick={() => handleNavigation("/create-fund")}
            className="cursor-pointer bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg hover:bg-gray-700 transform transition-all duration-300 hover:scale-105"
            style={{
              fontFamily: "'Poppins', sans-serif",
              boxShadow: "0 0 20px white",
              height: "400px",
              width: "300px",
            }}
          >
            <h2 className="text-2xl font-bold text-center">Create Fund</h2>
          </button>
          <button
            onClick={() => handleNavigation("/permission-to-send-or-refund")}
            className="cursor-pointer bg-gray-800 bg-opacity-90 p-2 rounded-lg shadow-lg hover:bg-gray-700 transform transition-all duration-300 hover:scale-105"
            style={{
              fontFamily: "'Poppins', sans-serif",
              boxShadow: "0 0 20px white",
              height: "400px",
            }}
          >
            <h2 className="text-2xl font-bold text-center">
              Permission to Send/Refund
            </h2>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerPortal;
