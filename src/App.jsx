import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';
import './App.css';

const CONTRACT_ADDRESS = "0x4499FBAebF8eEa3A302cBc52BFeBd468fFf4c00Bcd";
const ABI = [
  "function sendETH(address _to) payable",
  "function withdraw()",
  "function owner() view returns (address)",
  "function getBalance() view returns (uint)",
  "event PaymentSent(address indexed from, address indexed to, uint amount)"
];

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [owner, setOwner] = useState("");
  const [balance, setBalance] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [history, setHistory] = useState([]);

  // Connect Wallet
  const connectWallet = async () => {
    if (!window.ethereum) return toast.error("Install MetaMask!");
    const _provider = new ethers.providers.Web3Provider(window.ethereum);
    await _provider.send("eth_requestAccounts", []);
    const _signer = _provider.getSigner();
    const _account = await _signer.getAddress();
    const _contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, _signer);
    setProvider(_provider);
    setSigner(_signer);
    setAccount(_account);
    setContract(_contract);
    toast.success("Wallet connected!");
  };

  // Load Owner & Balance
  const loadInfo = async () => {
    if (!contract) return;
    const _owner = await contract.owner();
    const _bal = await contract.getBalance();
    setOwner(_owner);
    setBalance(ethers.utils.formatEther(_bal));
  };

  // Fetch Payment History
  const loadHistory = async () => {
    if (!provider) return;
    const _contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    const filter = _contract.filters.PaymentSent();
    const events = await _contract.queryFilter(filter);
    const parsed = events.map(e => ({
      from: e.args.from,
      to: e.args.to,
      amount: ethers.utils.formatEther(e.args.amount)
    }));
    setHistory(parsed.reverse());
  };

  // Send ETH
  const sendETH = async () => {
    try {
      if (!to || !amount) return toast.error("Lengkapi data!");
      const tx = await contract.sendETH(to, {
        value: ethers.utils.parseEther(amount)
      });
      await tx.wait();
      toast.success("ETH berhasil dikirim!");
      setTo("");
      setAmount("");
      loadInfo();
      loadHistory();
    } catch (err) {
      toast.error("Gagal mengirim ETH");
    }
  };

  // Withdraw
  const withdraw = async () => {
    try {
      const tx = await contract.withdraw();
      await tx.wait();
      toast.success("Withdraw sukses!");
      loadInfo();
      loadHistory();
    } catch (err) {
      toast.error("Gagal withdraw (mungkin bukan owner)");
    }
  };

  useEffect(() => {
    if (contract) {
      loadInfo();
      loadHistory();
    }
  }, [contract]);

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center p-8">
      <Toaster />
      <h1 className="text-4xl font-extrabold text-yellow-400 mb-6">PayChain Payroll</h1>

      {!account ? (
        <button
          onClick={connectWallet}
          className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 px-8 py-3 rounded-xl transition-all ease-in-out transform hover:scale-105"
        >
          Connect Wallet
        </button>
      ) : (
        <p className="mb-4 text-lg text-green-400">Connected: {account}</p>
      )}

      <div className="bg-gray-700 p-8 rounded-3xl w-full max-w-md shadow-xl mt-8">
        <p className="text-lg mb-2 text-gray-300">Owner: <span className="text-yellow-300">{owner || "..."}</span></p>
        <p className="text-lg mb-4 text-gray-300">Balance: <span className="text-yellow-300">{balance} ETH</span></p>

        <input
          type="text"
          placeholder="Recipient address"
          className="w-full px-4 py-3 mb-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          value={to} onChange={e => setTo(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount in ETH"
          className="w-full px-4 py-3 mb-4 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          value={amount} onChange={e => setAmount(e.target.value)}
        />

        <button
          onClick={sendETH}
          className="bg-yellow-500 hover:bg-yellow-600 w-full py-3 mb-3 rounded-xl transition-all hover:scale-105"
        >
          Send ETH
        </button>

        <button
          onClick={withdraw}
          className="bg-red-500 hover:bg-red-600 w-full py-3 rounded-xl transition-all hover:scale-105"
        >
          Withdraw (Owner)
        </button>
      </div>

      <div className="mt-10 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-yellow-300">Transaction History</h2>
        {history.length === 0 ? (
          <p className="text-gray-400">No transactions yet.</p>
        ) : (
          history.map((h, i) => (
            <div key={i} className="mb-4 bg-gray-600 p-4 rounded-lg shadow-sm">
              <p className="text-sm">From: {h.from}</p>
              <p className="text-sm">To: {h.to}</p>
              <p className="text-sm text-green-300 font-semibold">Amount: {h.amount} ETH</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;