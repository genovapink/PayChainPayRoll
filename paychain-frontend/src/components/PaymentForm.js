import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import PayChainABI from '../contracts/PayChainABI'; // Impor ABI smart contract

const PaymentForm = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [payChainAddress, setPayChainAddress] = useState('');
  const [sendETHAddress, setSendETHAddress] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [payChain, setPayChain] = useState(null);

  useEffect(() => {
    const initializeEthers = async () => {
      if (window.ethereum) {
        const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
        const ethSigner = ethProvider.getSigner();
        setProvider(ethProvider);
        setSigner(ethSigner);

        // Ganti dengan alamat kontrak yang benar
        const contractAddress = '0xYourContractAddress';
        const payChainContract = new ethers.Contract(contractAddress, PayChainABI, ethSigner);
        setPayChain(payChainContract);

        // Dapatkan alamat kontrak PayChain dan SendETH
        const payChainAddr = await payChainContract.getPayChainAddress();
        const sendETHAddr = await payChainContract.getSendETHAddress();
        setPayChainAddress(payChainAddr);
        setSendETHAddress(sendETHAddr);
      } else {
        alert('Please install MetaMask');
      }
    };

    initializeEthers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!payChain || !recipient || !amount) return;

    try {
      const sendETHContract = new ethers.Contract(sendETHAddress, PayChainABI, signer);
      const tx = await sendETHContract.sendETH(recipient, ethers.utils.parseEther(amount));
      await tx.wait();
      alert('Payment sent successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to send payment');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Pay Chain Payroll</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">Recipient Address</label>
          <input
            type="text"
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            placeholder="0x..."
          />
        </div>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (ETH)</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            placeholder="Amount to send"
          />
        </div>
        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Send Payment
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;