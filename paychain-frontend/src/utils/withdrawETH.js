import { ethers } from "ethers";
import { connectWallet } from "./connectWallet";

const sendEthAddress = "0x7f37fb1882A33593A842748A71781Bf4Cea169DD";
const abi = [ "function withdraw() public" ];

export async function withdrawETH() {
  const { signer } = await connectWallet();
  const contract = new ethers.Contract(sendEthAddress, abi, signer);
  const tx = await contract.withdraw();
  await tx.wait();
}