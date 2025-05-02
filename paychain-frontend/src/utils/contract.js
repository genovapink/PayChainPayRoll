import { ethers } from "ethers";
import PayChain from "../../../paychain-smartcontract/artifacts/contracts/PayChain.sol/PayChain.json";
import contractAddress from "../../../paychain-smartcontract/contractAddress.json";

export function getPayChainContract() {
  if (!window.ethereum) {
    throw new Error("No crypto wallet found. Please install Metamask.");
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  
  return new ethers.Contract(
    contractAddress.PayChain || "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
    PayChain.abi,
    signer
  );
}