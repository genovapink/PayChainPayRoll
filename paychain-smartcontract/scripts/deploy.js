const hre = require("hardhat");

async function main() {
  // Deploy SendETH
  const SendETH = await hre.ethers.getContractFactory("SendETH");
  const sendETH = await SendETH.deploy();
  await sendETH.deployed();
  console.log(`SendETH deployed to: ${sendETH.address}`);

  // Deploy PayChain
  const PayChain = await hre.ethers.getContractFactory("PayChain");
  const payChain = await PayChain.deploy();
  await payChain.deployed();
  console.log(`PayChain deployed to: ${payChain.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
