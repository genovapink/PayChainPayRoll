import { ethers } from "ethers";
import contractABI from "./SendETH_ABI.json";

const CONTRACT_ADDRESS = "ALAMAT_KONTRAK_KAMU"; // Ganti juga

const getBalance = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
  const balance = await contract.getBalance();
  return ethers.utils.formatEther(balance);
};

export default getBalance;