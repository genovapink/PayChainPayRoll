import { ethers } from "ethers";

const sendETH = async (to, amountInEth) => {
  if (!window.ethereum) throw new Error("MetaMask not found!");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const tx = await signer.sendTransaction({
    to,
    value: ethers.utils.parseEther(amountInEth),
  });

  await tx.wait();
};

export default sendETH;