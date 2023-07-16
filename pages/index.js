import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [walletBalance, setWalletBalance] = useState(undefined);
  const [isHovered, setIsHovered] = useState(false);
  const [ownerError, setOwnerError] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");


  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts && accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set, we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      const atmBalance = (await atm.getBalance()).toNumber();
      setBalance(atmBalance);

      if (account) {
        const provider = new ethers.providers.Web3Provider(ethWallet);
        const wallet = provider.getSigner(account);
        const walletBalance = ethers.utils.formatEther(await wallet.getBalance());
        setWalletBalance(walletBalance);
      }
    }
  };

  const deposit = async () => {
    if (atm && depositAmount) {
      let tx = await atm.deposit(depositAmount);
      await tx.wait();
      getBalance();
      setDepositAmount("");
    }
  };

  const withdraw = async () => {
    if (atm && withdrawAmount) {
      let tx = await atm.withdraw(withdrawAmount);
      await tx.wait();
      getBalance();
      setWithdrawAmount("");
    }
  };

  

  const transferOwnership = async (newOwner) => {
    if (atm && newOwner) {
      try {
        let tx = await atm.transferOwnership(newOwner);
        await tx.wait();
        alert(`Ownership transferred to ${newOwner}`);
      } catch (error) {
        setOwnerError(true);
        setTimeout(() => {
          setOwnerError(false);
        }, 5000);
      }
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  
  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask</p>;
    }

    
    if (!account) {
      
      return (
        
        <button onClick={connectAccount}>
          Press me to connect to big basket wallet
        </button>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your's-- Account: {account}</p>
        <hr></hr>
        <p>Balance: {balance} ETH</p>
        {walletBalance && <p>Wallet Balance: {walletBalance} ETH</p>}
        <p><h4>Add more fund to card or withdraw funds from card from buttons given below!</h4></p>
        <button
            style={{ width: "150px", marginBottom: "5px", fontSize: "20px" }}
            onClick={deposit}
          >
            Deposit ETH
          </button>
        <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="Enter deposit amount"
            style={{ width: "180px" }}
          />
        <br></br><br></br>
        <button
            style={{ width: "150px", marginBottom: "5px", fontSize: "20px" }}
            onClick={withdraw}
          >
            Withdraw ETH
          </button>
          <input
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            placeholder="Enter withdrawal amount"
            style={{ width: "180px" }}
          />
        <br></br><br></br>
        <button
          onClick={() => {
            const newOwner = prompt("Enter next owner address:");
            transferOwnership(newOwner);
          }}
        >
          Transfer Ownership
        </button>
        {ownerError && <p className="error">Error: Failed to transfer ownership</p>}
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main
      className={`container ${isHovered ? "hovered" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <header>
        <h1>Welcome to the Big Basket</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          border:solid;
          border-radius:500px;
          border-width:10px;
          display: flex;
          flex-direction: column;
          align-items: top;
          justify-content: center;
          height: 80vh;
          font-family: Arial, sans-serif;
          text-align: center;
          
        }

        

        .message {
          width:100px;
          font-size: 20px;
          margin-bottom: 25px;
        }

        hr {
          border: none;
          border-top: 1px dotted #f00;
          color: #fff;
          background-color: #fff;
          height: 1px;
          width: 50%;
        }

        .connect-btn {
          width:50px;
          padding: 10px 20px;
          background-color: #0000ff;
          color: blue;
          border: 5px solid red;
          border-radius: 10px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
          outline: none;
        }

        

        .connect-btn:active {
          transform: scale(0.98);
        }

        .user-section {
          margin-top: 45px;
          
        }

        

        .account {
          width:100px;
          font-size: 20px;
          margin-bottom: 10px;
          color: #fff;
        }

        .balance-container {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }

        .balance {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
          color: #fff;
        }

        .balance-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }

        .action-btn {
          
          padding: 10px 20px;
          color: #fff;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
          outline: none;
        }

        .action-btn.deposit {
          background-color: pink;
        }

        .action-btn.withdraw {
          background-color: #c0392b;
        }

        

        .action-btn.transfer {
          background-color: #d35400;
        }

        .action-btn:hover {
          opacity: 0.8;
        }

        .action-btn:active {
          transform: scale(0.98);
        }
      `}</style>
    </main>
  );
}
