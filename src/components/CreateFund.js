import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../abi";

const CreateFund = () => {
  const [fundName, setFundName] = useState("");
  const [target, setTarget] = useState("");
  const [deadlineDateTime, setDeadlineDateTime] = useState("");
  const [minContribution, setMinContribution] = useState("");
  const [fundLocation, setFundLocation] = useState("");
  const [managerAccount, setManagerAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          await window.ethereum.enable();
          const accounts = await web3.eth.getAccounts();
          const manager = accounts[0]; // Default to the first account
          setManagerAccount(manager);
          const contractInstance = new web3.eth.Contract(
            CONTRACT_ABI,
            CONTRACT_ADDRESS
          );
          setContract(contractInstance);
        } else {
          setErrorMessage(
            "MetaMask not detected. Please install MetaMask to use this DApp."
          );
        }
      } catch (error) {
        console.error("Error loading blockchain data:", error);
        setErrorMessage(
          "Error loading blockchain data. Check console for details."
        );
      }
    };
    loadBlockchainData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contract) {
      setErrorMessage(
        "Smart contract not loaded. Please reload the page and try again."
      );
      return;
    }

    try {
      if (
        !fundName ||
        !target ||
        !deadlineDateTime ||
        !minContribution ||
        !fundLocation ||
        !managerAccount
      ) {
        setErrorMessage("All fields are required.");
        return;
      }

      // Convert deadlineDateTime to epoch timestamp
      const deadlineTimestamp = Math.floor(
        new Date(deadlineDateTime).getTime() / 1000
      );
      const targetWei = Web3.utils.toWei(target.toString(), "ether");
      const minContributionWei = Web3.utils.toWei(
        minContribution.toString(),
        "ether"
      );

      const response = await contract.methods
        .createFund(
          fundLocation,
          fundName,
          targetWei,
          deadlineTimestamp,
          minContributionWei
        )
        .send({ from: managerAccount });

      console.log("Fund created successfully:", response);
      setSuccessMessage("Fund created successfully.");
      setErrorMessage("");
    } catch (error) {
      console.error("Error creating fund:", error);
      setErrorMessage(`Error creating fund: ${error.message || error}`);
    }
  };

  if (!managerAccount) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Loading MetaMask...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-700">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">
          Create Fund
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 bg-opacity-60 p-8 md:p-14 rounded-lg shadow-2xl"
          style={{
            boxShadow: "0 4px 30px rgba(0, 0, 0, 1)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            minWidth: "400px", // Adjusted minimum width for responsiveness
          }}
        >
          <div className="mb-2">
            <label className="block text-sm font-bold mb-2 text-white">
              Account Address (Funds Location)
            </label>
            <input
              type="text"
              value={fundLocation}
              onChange={(e) => setFundLocation(e.target.value)}
              className="w-full px-3 py-2 text-black bg-gray-700 rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-bold mb-2 text-white">
              Fund Name
            </label>
            <input
              type="text"
              value={fundName}
              onChange={(e) => setFundName(e.target.value)}
              className="w-full px-3 py-2 text-black bg-gray-700 rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-bold mb-2 text-white">
              Target (in ETH)
            </label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full px-3 py-2 text-black bg-gray-700 rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-bold mb-2 text-white">
              Deadline (Date and Time)
            </label>
            <input
              type="datetime-local"
              value={deadlineDateTime}
              onChange={(e) => setDeadlineDateTime(e.target.value)}
              className="w-full px-3 py-2 text-black bg-gray-700 rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-bold mb-2 text-white">
              Minimum Contribution (in ETH)
            </label>
            <input
              type="number"
              value={minContribution}
              onChange={(e) => setMinContribution(e.target.value)}
              className="w-full px-3 py-2 text-black bg-gray-700 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 py-3 rounded-lg hover:bg-blue-600 text-white font-bold transition duration-300 shadow-lg hover:shadow-xl"
          >
            Create Fund
          </button>
          {errorMessage && (
            <div className="bg-red-500 p-4 mt-4 rounded-lg text-center">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-500 p-4 mt-4 rounded-lg text-center">
              {successMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateFund;
