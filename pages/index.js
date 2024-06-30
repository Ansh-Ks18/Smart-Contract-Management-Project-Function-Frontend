import { useState, useEffect } from "react";
import { ethers } from "ethers";

const contractAddress = "0x144F2961a92acDFcD1359a002ccB8B192894a97B";
const contractABI = [
	{
		"inputs": [],
		"name": "deposit",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Deposit",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Withdrawal",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "getBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(null);
  const [account, setAccount] = useState(null);
  const [bankContract, setBankContract] = useState(null);
  const [balance, setBalance] = useState(null);
  const [transactionStatus, setTransactionStatus] = useState(null);

  // Function to initialize MetaMask wallet
  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        handleAccount(accounts);
      } catch (error) {
        console.error("Failed to get accounts:", error);
      }
    }
  };

  // Function to handle account connection
  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
      setAccount(null);
    }
  };

  // Function to connect MetaMask account
  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    try {
      const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
      handleAccount(accounts);
    } catch (error) {
      console.error("Failed to connect account:", error);
    }
  };

  // Function to get bank contract instance
  const getBankContract = () => {
    if (ethWallet) {
      const provider = new ethers.providers.Web3Provider(ethWallet);
      const signer = provider.getSigner();
      const bankContract = new ethers.Contract(contractAddress, contractABI, signer);
      setBankContract(bankContract);
    }
  };

 // Function to fetch user balance
const fetchBalance = async () => {
  if (account) {
    try {
      const balance = await ethWallet.request({ method: "eth_getBalance", params: [account, "latest"] });
      setBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  }
};
// Function to handle deposit
const deposit = async (amount) => {
  if (bankContract) {
    try {
      setTransactionStatus("Depositing...");
      const tx = await bankContract.deposit({ value: ethers.utils.parseEther(amount) });
      await tx.wait();
      await fetchBalance(); // Update balance after deposit
      setTransactionStatus(`Deposited ${amount} successfully. New balance: ${balance} Go`);
    } catch (error) {
      console.error("Deposit failed:", error);
      setTransactionStatus(`Deposit failed: ${error.message}`);
    }
  }
};


// Function to handle withdrawal
const withdraw = async (amount) => {
  if (bankContract) {
    try {
      setTransactionStatus("Withdrawing...");
      const tx = await bankContract.withdraw(ethers.utils.parseEther(amount));
      await tx.wait();
      await fetchBalance(); // Update balance after withdrawal
      setTransactionStatus(`Withdrawn ${amount} successfully. New balance: ${balance} Go`);
    } catch (error) {
      console.error("Withdrawal failed:", error);
      setTransactionStatus("Withdrawal failed. Please try again.");
    }
  }
};

// Function to handle transfer
const transfer = async (to, amount) => {
  if (bankContract) {
    try {
      setTransactionStatus("Transferring...");
      console.log(`Transferring ${amount} to ${to}`);
      const tx = await bankContract.transfer(to, ethers.utils.parseEther(amount));
      await tx.wait();
      await fetchBalance(); // Update balance after transfer
      setTransactionStatus(`Transferred ${amount} successfully. New balance: ${balance} Go`);
    } catch (error) {
      console.error("Transfer failed:", error);
      setTransactionStatus("Transfer failed. Please try again.");
    }
  }
};


  // Function to initialize user interface based on wallet and account status
  const initUser = () => {
    const styles = {
      
      container: {
        textAlign: 'center',
      },
      accountInfo: {
        fontWeight: 'bold',
        color: '#333',
      },
      balanceInfo: {
        fontStyle: 'italic',
        color: '#666',
      },
      actionButton: {
        margin: '10px',
        padding: '8px 16px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
      },
      actionButtonHover: {
        backgroundColor: '#45a049',
      },
      transactionStatus: {
        marginTop: '20px',
        fontStyle: 'italic',
        color: '#900',
      },
    };

    if (!ethWallet) {
      return <p>Please install MetaMask in order to use this bank.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount}>Please connect your MetaMask wallet</button>;
    }

    return (
      <div style={styles.container}>
        <p style={styles.accountInfo}>Your Account: {account}</p>
        <p style={styles.balanceInfo}>Your Balance: {balance !== null ? `${balance} Go` : "Loading..."}</p>
        <button
          style={styles.actionButton}
          onClick={() => deposit("1.0")}
          onMouseOver={(e) => e.target.style.backgroundColor = styles.actionButtonHover.backgroundColor}
          onMouseOut={(e) => e.target.style.backgroundColor = styles.actionButton.backgroundColor}
        >
          Deposit 1.0 Go
        </button>
        <button
          style={styles.actionButton}
          onClick={() => withdraw("1.0")}
          onMouseOver={(e) => e.target.style.backgroundColor = styles.actionButtonHover.backgroundColor}
          onMouseOut={(e) => e.target.style.backgroundColor = styles.actionButton.backgroundColor}
        >
          Withdraw 1.0 Go
        </button>
        <button
          style={styles.actionButton}
          onClick={() => transfer("0x6CA4e832CEA6a89Af118D5d72032Fea8b231a872", "1.0")}
          onMouseOver={(e) => e.target.style.backgroundColor = styles.actionButtonHover.backgroundColor}
          onMouseOut={(e) => e.target.style.backgroundColor = styles.actionButton.backgroundColor}
        >
          Transfer 1.0 Go
        </button>
        {transactionStatus && <p style={styles.transactionStatus}>{transactionStatus}</p>}
      </div>
    );
  };

  // Effect hook to initialize MetaMask wallet on component mount
  useEffect(() => {
    getWallet();
  }, []);

  // Effect hook to initialize bank contract instance when account is connected
  useEffect(() => {
    if (account) {
      getBankContract();
    }
  }, [account]);

  // Effect hook to fetch user balance when bank contract instance is set
  useEffect(() => {
    if (bankContract) {
      fetchBalance();
    }
  }, [bankContract]);
  

  return (
    <main className="container">
      <header>
        <h1 style={{ textAlign: 'center', fontSize: '36px', fontWeight: 'bold', marginBottom: '20px' ,backgroundColor:'#4CAF50', color: 'white'}}>
          Welcome to the Simple Bank
        </h1>
      </header>
      {initUser()}
    </main>
  );
}
