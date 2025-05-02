import { useState } from 'react';

function App() {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');

  const sendEth = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const from = accounts[0];

      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from,
            to: address,
            value: (parseFloat(amount) * 1e18).toString(16),
          },
        ],
      });

      alert('Transaction sent!');
    } catch (err) {
      console.error(err);
      alert('Transaction failed!');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Kirim ETH</h1>
      <input
        type="text"
        placeholder="Alamat tujuan"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={{ padding: '0.5rem', marginBottom: '1rem', width: '300px' }}
      />
      <br />
      <input
        type="number"
        placeholder="Jumlah ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ padding: '0.5rem', marginBottom: '1rem', width: '300px' }}
      />
      <br />
      <button onClick={sendEth} style={{ padding: '0.5rem 1rem' }}>
        Kirim
      </button>
    </div>
  );
}

export default App;