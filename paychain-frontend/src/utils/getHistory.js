import { ethers } from "ethers";
import { connectWallet } from "./connectWallet";

const payChainAddress = "0xB9F79F77d288A308089bb5c87008b0e81e56Ca34";
const abi = [
  "event PaymentSent(address indexed to, uint256 amount)"
];

export async function getHistory() {
  const { provider } = await connectWallet();
  const contract = new ethers.Contract(payChainAddress, abi, provider);
  const events = await contract.queryFilter("PaymentSent");
  return events.map((e) => ({
    to: e.args.to,
    amount: ethers.utils.formatEther(e.args.amount),
    block: e.blockNumber,
  }));
}