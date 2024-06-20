import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../abi";
import Contribute from "./Contribute";
import Voting from "./Voting";
import TimeLeft from "./TimeLeft";

const Funds = () => {
  const [funds, setFunds] = useState([]);
  const [selectedFund, setSelectedFund] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [votingOpen, setVotingOpen] = useState(false);

  // Function to load funds from the smart contract
  const loadFunds = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const contractInstance = new web3.eth.Contract(
        CONTRACT_ABI,
        CONTRACT_ADDRESS
      );
      const fundCount = await contractInstance.methods.FundID().call();
      const fundsList = [];

      for (let i = 0; i < fundCount; i++) {
        const fund = await contractInstance.methods.FundingFor(i).call();
        const targetInEther = web3.utils.fromWei(fund.target, "ether");
        const minContributionInEther = web3.utils.fromWei(
          fund.min_contri,
          "ether"
        );
        const collectedAmount = await contractInstance.methods
          .Collected_Amount(fund.fundsLocation)
          .call();
        const collectedAmountInEther = web3.utils.fromWei(
          collectedAmount,
          "ether"
        );

        fundsList.push({
          id: i,
          fundname: fund.fundname,
          target: targetInEther,
          deadline: fund.deadline,
          min_contri: minContributionInEther,
          fundsLocation: fund.fundsLocation,
          collectedAmount: collectedAmountInEther,
        });
      }

      setFunds(fundsList);
      setLoading(false);
      setErrorMessage("");
    } catch (error) {
      console.error("Error loading funds:", error);
      setErrorMessage(`Error loading funds: ${error.message || error}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFunds();
  }, []);

  const handleContribute = async (fundId, amount) => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];

        await contract.methods
          .contribute(fundId)
          .send({ from: account, value: web3.utils.toWei(amount, "ether") });

        alert("Contribution successful");
        loadFunds();
        setSelectedFund(null);
      } catch (error) {
        alert("Error contributing: " + (error.message || error));
        console.error("Error contributing:", error);
      }
    } else {
      alert("Please install MetaMask");
    }
  };

  const handleSelectFund = (fund) => {
    const isTimeUp =
      new Date(parseInt(fund.deadline) * 1000).getTime() < new Date().getTime();
    if (isTimeUp) {
      setSelectedFund(fund);
      setVotingOpen(true);
    } else {
      setSelectedFund(fund);
    }
  };

  const closeVotingModal = () => {
    setVotingOpen(false);
    setSelectedFund(null);
  };

  return (
    <div className="flex mt-8">
      <div className="w-3/4 pr-4">
        <h2 className="text-2xl font-bold mb-4 text-white">Funds</h2>
        {loading && <p>Loading...</p>}
        {errorMessage && (
          <div className="bg-red-500 p-4 mt-4 rounded-lg text-center text-white">
            {errorMessage}
          </div>
        )}
        <div className="grid grid-cols-3 gap-4">
          {funds.length === 0 && !loading && <p>No funds available</p>}
          {funds.map((fund) => {
            const isTimeUp =
              new Date(parseInt(fund.deadline) * 1000).getTime() <
              new Date().getTime();

            return (
              <div
                key={fund.id}
                className={`CardsDiv relative bg-black bg-opacity-80 pt-8 pl-0 border rounded-lg cursor-pointer shadow-md ${
                  selectedFund && selectedFund.id === fund.id
                    ? "bg-gray-800 bg-opacity-80"
                    : ""
                }`}
                onClick={() => handleSelectFund(fund)}
                style={{
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)",
                  minWidth: "304px", // Adjust minimum width as needed
                  maxWidth: "504px", // Adjust maximum width as needed
                  height: "350px",
                }}
              >
                {isTimeUp && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-green-300 font-bold text-4xl rotate-45">
                      Up for Voting
                    </span>
                  </div>
                )}

                <p className="font-bold text-white content-center ml-28 ">
                  Fund ID: {fund.id} - {fund.fundname}
                </p>
                <p className="text-white font-bold pt-4">
                  Target: <span className="font-thin">{fund.target} ETH</span>
                </p>
                <p className="text-white font-bold pt-4">
                  Deadline:{" "}
                  <span className="font-thin">
                    {new Date(Number(fund.deadline) * 1000).toLocaleString()}
                  </span>
                </p>
                <div className="font-bold pt-4">
                  <TimeLeft fund={fund} />
                </div>
                <p className="text-white font-bold pt-4">
                  Minimum Contribution:{" "}
                  <span className="font-thin">{fund.min_contri} ETH</span>
                </p>

                <p className="text-white  pt-4">
                  Fund Address: {fund.fundsLocation}
                </p>
                <p className="text-white  pt-4">
                  Collected Amount:{" "}
                  <span className="font-bold">{fund.collectedAmount} ETH</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-1/4 border-l pl-4">
        {selectedFund && !votingOpen && (
          <div
            className="bg-black bg-opacity-80 p-4 border rounded-lg"
            style={{
              backdropFilter: "blur(10px)",
              boxShadow: "0 0 20px rgba(0, 0, 0, 2)",
            }}
          >
            <h3 className="text-xl font-bold mb-4 text-white">
              Contribute to {selectedFund.fundname}
            </h3>
            <Contribute
              fundId={selectedFund.id}
              onContribute={handleContribute}
            />
          </div>
        )}
      </div>
      {votingOpen && selectedFund && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          style={{
            backdropFilter: "blur(10px)",
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)",
          }}
        >
          <Voting fundId={selectedFund.id} closeModal={closeVotingModal} />
        </div>
      )}
    </div>
  );
};

export default Funds;
