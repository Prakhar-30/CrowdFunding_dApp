// src/components/Voting.js
import React, { useState } from "react";
import Web3 from "web3";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../abi";

const Voting = ({ fundId, closeModal }) => {
  const [vote, setVote] = useState(false);

  const handleVoteChange = (voteValue) => {
    setVote(voteValue);
  };

  const handleSubmit = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];

        await contract.methods.voting(fundId, vote).send({ from: account });
        alert("Vote submitted successfully");
        closeModal(); // Close the modal after successful vote
      } catch (error) {
        console.error("Error submitting vote:", error);
        alert("Error submitting vote");
      }
    } else {
      alert("Please install MetaMask");
    }
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-slate-800 rounded-lg p-8">
          <h2 className="text-xl font-bold mb-4">Cast Your Vote</h2>
          <div className="flex justify-center mb-4">
            <button
              className={`px-4 py-2 rounded-lg ${
                vote ? "bg-green-900 text-white" : "bg-green-500"
              } mr-4`}
              onClick={() => handleVoteChange(false)}
            >
              Send Fund
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                !vote ? "bg-orange-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => handleVoteChange(true)}
            >
              Refund
            </button>
          </div>
          <div className="flex justify-center">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={handleSubmit}
            >
              Submit Vote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Voting;
