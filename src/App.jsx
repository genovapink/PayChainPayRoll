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
      if (!to || !amount) return toast.error("Please complete the data!");
      const tx = await contract.sendETH(to, {
        value: ethers.utils.parseEther(amount)
      });
      await tx.wait();
      toast.success("ETH sent successfully!");
      setTo("");
      setAmount("");
      loadInfo();
      loadHistory();
    } catch (err) {
      toast.error("Failed to send ETH");
    }
  };

  // Withdraw
  const withdraw = async () => {
    try {
      const tx = await contract.withdraw();
      await tx.wait();
      toast.success("Withdraw successful!");
      loadInfo();
      loadHistory();
    } catch (err) {
      toast.error("Failed to withdraw (maybe not owner)");
    }
  };

  useEffect(() => {
    if (contract) {
      loadInfo();
      loadHistory();
    }
  }, [contract]);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col items-center p-8">
      <Toaster />
      
      {/* Logo and Title Section */}
      <div className="text-center mb-12">
        <div className="text-6xl font-bold text-[#FFA500] mb-4">PC</div>
        <h1 className="text-3xl font-bold text-[#FFA500] mb-2">PayChainPayRoll</h1>
        <p className="text-gray-400 text-sm">Smart payroll system on blockchain — send & receive PTT with full control</p>
      </div>

      {/* Connect Wallet Button */}
      {!account ? (
        <button
          onClick={connectWallet}
          className="bg-[#FFA500] text-black font-semibold px-8 py-3 rounded-lg mb-8 hover:bg-[#FFB733] transition-all"
        >
          Connect Wallet
        </button>
      ) : (
        <p className="mb-8 text-green-400">Connected: {account}</p>
      )}

      {/* Send Pharos Section */}
      <div className="bg-[#2a2a2a] p-6 rounded-lg w-full max-w-md shadow-lg mb-8">
        <h2 className="text-[#FFA500] text-xl font-semibold mb-4">Send Pharos</h2>
        <input
          type="text"
          placeholder="Recipient address"
          className="w-full px-4 py-3 mb-4 rounded-lg bg-[#3a3a3a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
          value={to}
          onChange={e => setTo(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          className="w-full px-4 py-3 mb-4 rounded-lg bg-[#3a3a3a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <button
          onClick={sendETH}
          className="bg-[#FFA500] text-black font-semibold w-full py-3 rounded-lg hover:bg-[#FFB733] transition-all flex items-center justify-center gap-2"
        >
          <span>Send</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* History Section */}
      <div className="bg-[#2a2a2a] p-6 rounded-lg w-full max-w-md shadow-lg mb-8">
        <h2 className="text-[#FFA500] text-xl font-semibold mb-4">History</h2>
        {history.length === 0 ? (
          <p className="text-gray-400">No transactions yet.</p>
        ) : (
          history.map((h, i) => (
            <div key={i} className="mb-4 bg-[#3a3a3a] p-4 rounded-lg">
              <p className="text-sm text-gray-300">From: {h.from}</p>
              <p className="text-sm text-gray-300">To: {h.to}</p>
              <p className="text-sm text-[#FFA500] font-semibold">Amount: {h.amount} ETH</p>
            </div>
          ))
        )}
      </div>

      {/* Wallet Balance Section */}
      <div className="bg-[#2a2a2a] p-6 rounded-lg w-full max-w-md shadow-lg mb-8">
        <h2 className="text-[#FFA500] text-xl font-semibold mb-4">Wallet Balance</h2>
        <p className="text-3xl font-bold text-white">{balance} ETH</p>
      </div>

      {/* Owner Withdraw Section */}
      <div className="bg-[#2a2a2a] p-6 rounded-lg w-full max-w-md shadow-lg mb-8">
        <h2 className="text-[#FFA500] text-xl font-semibold mb-4">Owner Withdraw</h2>
        <button
          onClick={withdraw}
          className="bg-red-500 hover:bg-red-600 w-full py-3 rounded-lg transition-all"
        >
          Owner Withdraw
        </button>
      </div>

      {/* Footer */}
      <footer className="text-gray-500 text-xs mt-8">
        © 2025 PayChain. Built with Web3 ❤️
      </footer>
    </div>
  );
}

export default App;