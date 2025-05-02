const hre = require("hardhat");

async function main() {
  const PayChain = await hre.ethers.getContractFactory("PayChain");
  const payChain = await PayChain.deploy();

  await payChain.deployed();

  console.log(`PayChain deployed to: ${payChain.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
