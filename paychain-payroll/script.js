import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.7.0/+esm";
import { abi } from "./abi.js";

const contractAddress = "0x4499FBAebF8eEa3A302cBc52BFeBd468fFf4c00B";
let provider, signer, contract;

document.getElementById("connectButton").onclick = async () => {
  if (!window.ethereum) return alert("Install MetaMask!");

  provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  contract = new ethers.Contract(contractAddress, abi, signer);

  const address = await signer.getAddress();
  document.getElementById("walletAddress").innerText = `Connected: ${address}`;

  const balance = await provider.getBalance(address);
  document.getElementById("balance").innerText = `Balance: ${ethers.formatEther(balance)} ETH`;
};

document.getElementById("sendButton").onclick = async () => {
  const recipient = document.getElementById("recipient").value;
  const amount = document.getElementById("amount").value;
  if (!recipient || !amount) return alert("Please fill all fields");

  const tx = await contract.send(recipient, ethers.parseEther(amount));
  await tx.wait();
  alert("Transaction sent!");
};

document.getElementById("withdrawButton").onclick = async () => {
  const tx = await contract.withdraw();
  await tx.wait();
  alert("Withdraw successful!");
};
