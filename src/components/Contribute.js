import React, { useState } from "react";
import Web3 from "web3";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../abi";

const Contribute = ({ fundId, onContribute }) => {
  const [amount, setAmount] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isContributing, setIsContributing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (window.ethereum && !isContributing) {
      setIsContributing(true);
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];

      try {
        await contract.methods
          .contribute(fundId)
          .send({ from: account, value: web3.utils.toWei(amount, "ether") });
        setIsSuccess(true);
        setModalMessage("Contribution successful");
        setModalOpen(true);
        onContribute(fundId, amount); // Call parent component's function
        setAmount(""); // Reset amount input field
      } catch (error) {
        setIsSuccess(false);
        setModalMessage(`Error contributing: ${error.message || error}`);
        setModalOpen(true);
        console.error(error);
      } finally {
        setIsContributing(false);
      }
    } else {
      setModalMessage("Please install MetaMask");
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalMessage("");
    setIsSuccess(false);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium">Amount (in ETH):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 mt-2 mb-4 rounded bg-gray-700 text-white"
            disabled={isContributing}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={isContributing}
        >
          {isContributing ? "Contributing..." : "Contribute"}
        </button>
      </form>

      {/* Modal for success and error messages */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="bg-slate-700 p-8 rounded-lg shadow-lg max-w-lg mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-bold text-2xl mb-4">
              {isSuccess ? "Success" : "Error"}
            </p>
            <p className="text-lg">{modalMessage}</p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contribute;
