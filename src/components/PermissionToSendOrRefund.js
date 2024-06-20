import React, { useState } from "react";
import Web3 from "web3";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../abi";

const PermissionToSendOrRefund = () => {
  const [fundId, setFundId] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];

      try {
        await contract.methods
          .permissionToSendOrRefund(fundId)
          .send({ from: account });
        alert("Permission granted successfully");
      } catch (error) {
        alert("Error granting permission");
        console.error(error);
      }
    } else {
      alert("Please install MetaMask");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-700">
      <div className="absolute top-0 left-0 right-0 text-center py-4 text-white text-5xl mt-4 font-bold">
        Confirm the Funds
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 bg-opacity-60 p-10 md:p-16 rounded-lg shadow-2xl"
        style={{
          boxShadow: "0 4px 30px rgba(0, 0, 0, 1)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          minWidth: "400px", // Adjusted minimum width for responsiveness
        }}
      >
        <div className="mb-6">
          <label className="block text-sm font-medium text-white">
            Fund ID:
          </label>
          <input
            type="number"
            value={fundId}
            onChange={(e) => setFundId(e.target.value)}
            className="w-full p-3 mt-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transform transition-transform duration-300 hover:scale-105 shadow-lg"
        >
          Grant Permission
        </button>
      </form>
    </div>
  );
};

export default PermissionToSendOrRefund;
