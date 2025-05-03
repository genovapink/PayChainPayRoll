import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const contractAddress = "0x7f37fb1882A33593A842748A71781Bf4Cea169DD";
const contractABI = [
  "function sendPayment(address recipient) public payable",
  "function withdraw() public",
  "event PaymentSent(address indexed sender, address indexed recipient, uint amount)",
];

const UI = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState('');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (window.ethereum) {
      const init = async () => {
        const prov = new ethers.BrowserProvider(window.ethereum);
        const signer = await prov.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        setProvider(prov);
        setSigner(signer);
        setContract(contract);

        await updateBalance(prov);
        listenToEvents(contract);
      };
      init();
    }
  }, []);

  const updateBalance = async (prov) => {
    const bal = await prov.getBalance(contractAddress);
    setBalance(ethers.formatEther(bal));
  };

  const listenToEvents = (contract) => {
    contract.on("PaymentSent", (sender, recipient, amount) => {
      setLogs((prev) => [
        `From: ${sender}, To: ${recipient}, Amount: ${ethers.formatEther(amount)} ETH`,
        ...prev
      ]);
    });
  };

  const sendPayment = async (e) => {
    e.preventDefault();
    if (!recipient || !amount) return alert("Recipient and amount are required");

    try {
      const tx = await contract.sendPayment(recipient, {
        value: ethers.parseEther(amount)
      });
      await tx.wait();
      alert("Payment sent!");
      await updateBalance(provider);
    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    }
  };

  const withdrawFunds = async () => {
    try {
      const tx = await contract.withdraw();
      await tx.wait();
      alert("Withdraw successful");
      await updateBalance(provider);
    } catch (err) {
      console.error(err);
      alert("Withdraw failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-indigo-700 mb-4">PayChain Payroll</h1>

      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <p className="mb-4 text-gray-700">Contract Balance: <strong>{balance} ETH</strong></p>

        <form onSubmit={sendPayment} className="space-y-4">
          <input
            type="text"
            placeholder="Recipient address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            placeholder="Amount in ETH"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
          >
            Send Payment
          </button>
        </form>

        <button
          onClick={withdrawFunds}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 mt-4 rounded-lg"
        >
          Withdraw (Admin Only)
        </button>
      </div>

      <div className="mt-8 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-2">Transaction Logs</h2>
        <div className="bg-white p-4 rounded-xl shadow-sm h-64 overflow-auto text-sm">
          {logs.map((log, idx) => <p key={idx}>{log}</p>)}
        </div>
      </div>
    </div>
  );
};

export default UI;