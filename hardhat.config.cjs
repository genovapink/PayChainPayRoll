require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.19",
  networks: {
    "pharos-devnet": {
      url: "https://devnet.dplabs-internal.com/",
      accounts: ["e7adbd072d3f93d1d525dc581b4a899da88e78b8a90fe9c6389dddc395e80199"]
    }
  }
};
