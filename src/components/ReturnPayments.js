// src/components/ReturnPayments.js
import React, { useState } from "react";
import Web3 from "web3";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../abi";

const ReturnPayments = () => {
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
        await contract.methods.returnPayments(fundId).send({ from: account });
        alert("Payments returned successfully");
      } catch (error) {
        alert("Error returning payments");
        console.error(error);
      }
    } else {
      alert("Please install MetaMask");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 p-6 rounded-lg shadow-lg"
    >
      <div className="mb-4">
        <label className="block text-sm font-medium">Fund ID:</label>
        <input
          type="number"
          value={fundId}
          onChange={(e) => setFundId(e.target.value)}
          className="w-full p-2 mt-2 mb-4 rounded bg-gray-700 text-white"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Return Payments
      </button>
    </form>
  );
};

export default ReturnPayments;
