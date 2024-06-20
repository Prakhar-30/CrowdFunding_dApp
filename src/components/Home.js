import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../abi";
import { useNavigate } from "react-router-dom";
import Spline from "@splinetool/react-spline";

const Home = () => {
  const [manager, setManager] = useState("");
  const [account, setAccount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadManager = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const managerAddress = await contract.methods.manager().call();
        setManager(managerAddress);
        setAccount(accounts[0]);
      } else {
        setErrorMessage("Please install MetaMask");
      }
    };
    loadManager();
  }, []);

  const handleManagerClick = () => {
    if (account.toLowerCase() !== manager.toLowerCase()) {
      setErrorMessage("Only the manager can access this section");
    } else {
      navigate("/manager-portal");
    }
  };

  const handleUserClick = () => {
    navigate("/funds");
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <Spline
        className="absolute inset-0 z-0"
        scene="https://prod.spline.design/H2wIz9bYN44SQaOt/scene.splinecode"
      />
      <div className="space-y-20 w-full max-w-4xl z-10">
        <h1
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-center"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Crowdfunding DApp
        </h1>
        <div className="flex justify-between items-center w-full">
          <div
            onClick={handleManagerClick}
            className="cursor-pointer bg-gray-800 p-16 md:p-24 lg:p-32 rounded-lg shadow-lg hover:bg-gray-700 transform transition-all duration-300 hover:scale-105 flex items-center justify-center"
            style={{
              fontFamily: "'Poppins', sans-serif",
              boxShadow: "0 0 20px white",
              height: "200px",
              width: "50px",
              marginLeft: "0px",
              backgroundColor: "rgba(47, 47, 47, 0.9)", // 90% transparent black
            }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
              Manager
            </h2>
          </div>
          <div
            onClick={handleUserClick}
            className="cursor-pointer bg-gray-800 p-16 md:p-24 lg:p-32 rounded-lg shadow-lg hover:bg-gray-700 transform transition-all duration-300 hover:scale-105 flex items-center justify-center"
            style={{
              fontFamily: "'Poppins', sans-serif",
              boxShadow: "0 0 20px white",
              height: "200px",
              width: "50px",
              marginRight: "0px",
              backgroundColor: "rgba(47, 47, 47, 0.9)", // 90% transparent black
            }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
              Users
            </h2>
          </div>
        </div>
        {errorMessage && (
          <div className="bg-red-500 p-4 rounded-lg text-center">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
