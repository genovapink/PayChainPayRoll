const provider = new ethers.BrowserProvider(window.ethereum);
let signer, userAddress;
let contract;

// Contract details
const contractAddress = "0x7f37fb1882A33593A842748A71781Bf4Cea169DD";
const abi = [
  "function sendEth(address recipient) payable",
  "function withdraw()",
  "event PaymentSent(address indexed from, address indexed to, uint amount)"
];

async function connectWallet() {
  const walletOptions = document.getElementById("walletOptions");
  walletOptions.classList.remove("hidden");
}

function selectWallet(option) {
  document.getElementById("walletOptions").classList.add("hidden");

  window.ethereum.request({ method: 'eth_requestAccounts' })
    .then(async (accounts) => {
      signer = await provider.getSigner();
      userAddress = accounts[0];
      contract = new ethers.Contract(contractAddress, abi, provider);

      document.getElementById("connectBtn").innerText = 'Connected: ' + userAddress.slice(0, 6) + '...' + userAddress.slice(-4);
      updateBalance();
      listenForEvents();
    })
    .catch((err) => {
      alert('Wallet connection failed!');
      console.error(err);
    });
}

async function sendETH() {
  const recipient = document.getElementById("recipient").value;
  const amount = document.getElementById("amount").value;
  if (!recipient || !amount) return alert("Fill both fields!");

  const tx = await contract.connect(signer).sendEth(recipient, { value: ethers.parseEther(amount) });
  await tx.wait();
  alert("✅ ETH Sent!");
  updateBalance();
}

async function updateBalance() {
  if (!signer) return;
  const balance = await provider.getBalance(userAddress);
  document.getElementById("balance").innerText = ethers.formatEther(balance) + " ETH";
}

async function withdraw() {
  document.getElementById("withdrawActions").classList.remove("hidden");
}

async function confirmWithdraw() {
  try {
    const tx = await contract.connect(signer).withdraw();
    await tx.wait();
    alert("✅ Withdraw successful!");
    updateBalance();
    document.getElementById("withdrawActions").classList.add("hidden");
  } catch (err) {
    alert("❌ Only owner can withdraw.");
    console.error(err);
  }
}

function cancelWithdraw() {
  document.getElementById("withdrawActions").classList.add("hidden");
}

function listenForEvents() {
  contract.on("PaymentSent", (from, to, amount) => {
    const li = document.createElement("li");
    li.innerText = `💸 ${from.slice(0, 6)}... → ${to.slice(0, 6)}... : ${ethers.formatEther(amount)} ETH`;
    document.getElementById("txHistory").prepend(li);
  });
}