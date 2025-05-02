import { ethers } from "ethers";
import { connectWallet } from "./connectWallet";

const payChainAddress = "0xB9F79F77d288A308089bb5c87008b0e81e56Ca34";
const abi = [ // ringkasan ABI
  "function sendPayroll(address to, uint256 amount) public",
  "event PaymentSent(address indexed to, uint256 amount)"
];

export async function sendPayroll(to, amount) {
  const { signer } = await connectWallet();
  const contract = new ethers.Contract(payChainAddress, abi, signer);
  const tx = await contract.sendPayroll(to, ethers.utils.parseEther(amount));
  await tx.wait();
}