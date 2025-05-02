import { ethers } from "ethers";
import contractABI from "./SendETH_ABI.json";

const CONTRACT_ADDRESS = "ALAMAT_KONTRAK_KAMU"; // Ganti dengan alamat kontrak kamu

const withdraw = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
  const tx = await contract.withdraw();
  await tx.wait();
};

export default withdraw;