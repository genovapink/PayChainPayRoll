import { useState } from "react";
import { ethers } from "ethers";

const SendEthForm = () => {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const sendEth = async () => {
    try {
      if (!window.ethereum) {
        alert("Install MetaMask dulu ya!");
        return;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: address,
        value: ethers.parseEther(amount),
      });

      setStatus("Transaksi terkirim: " + tx.hash);
    } catch (err) {
      setStatus("Gagal kirim: " + err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-xl rounded-xl">
      <h1 className="text-3xl font-bold mb-6">Kirim ETH</h1>
      <input
        type="text"
        placeholder="Alamat tujuan"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <input
        type="text"
        placeholder="Jumlah ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <button
        onClick={sendEth}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Kirim
      </button>
      {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
    </div>
  );
};

export default SendEthForm;