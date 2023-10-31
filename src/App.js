import React, { useState,useEffect } from "react";
import "./App.css"; // Import the CSS file
import passportInstance from "./config.js";
import { Provider } from "@imtbl/sdk";
import web3 from "web3";

function App() {
  const [passportConnected, setPassportConnected] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userAddress, setUserAddress] = useState("")
  const [accessToken, setAccessToken] = useState("");
  const [idToken, setIdToken] = useState("");
  const [userNickname, setUserNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactionHash,setTransactionHash] = useState("");


  const handleConnectPassport = async () => {
    if (loading) return;

    setLoading(true);

         const provider = passportInstance.connectEvm();
         const accounts = await provider.request({ method: "eth_requestAccounts" });
         const personAddress = accounts[0] 
         setUserAddress(personAddress)
         console.log("Nikkk");
      
         const userInfo  = await passportInstance.getUserInfo()
         const email = userInfo.email
         setUserEmail(email)

         const nickname = userInfo.nickname
         setUserNickname(nickname)

         const accessToken = await passportInstance.getAccessToken();
         const accessTokenValue = accessToken;
         setAccessToken(accessTokenValue)

         const idToken  = await passportInstance.getIdToken();
         const idTokenValue = idToken;
         setIdToken(idTokenValue)

         //sanity check
         console.log({email})
         console.log({personAddress})
         console.log({nickname})
         console.log({idTokenValue})
         console.log({accessTokenValue})
         setLoading(false);
      
  };

  const handleLogout =async () => {
    await passportInstance.logout();
    setPassportConnected(false);
    setUserEmail("");
    setUserAddress("");
    setAccessToken("");
    setIdToken("");
    setUserNickname("");
  };

  return (
    <div className="passport-info-container">
      <button
        className={`connect-button ${loading ? "loading" : ""}`}
        onClick={passportConnected ? handleLogout : handleConnectPassport}
      >
        {loading ? "Loading..." : passportConnected ? "Logout" : "Connect Passport"}
      </button>
      <button 
      className="connect-button"
      onClick={async()=>{
        const provider = passportInstance.connectEvm();
 const accounts = await provider.request({ method: "eth_requestAccounts" });
 const datavalue ='0x'
 const transactionHash = await provider.request({
   method: 'eth_sendTransaction',
   params: [
     {
       to: 'valid immutable addresss',
       data: web3.utils.asciiToHex(datavalue),
     }
   ]
 });
 const transactionHashValue = transactionHash;
 setTransactionHash(transactionHashValue)
      } }>Transact</button>

      {passportConnected && (
        <div className="user-info-box">
          <p>User Email: {userEmail}</p>
          <p>User Address: {userAddress}</p>
          <p>Access Token: {accessToken}</p>
          <p>ID Token: {idToken}</p>
          <p>User Nickname: {userNickname}</p>
        </div>
      )}
    </div>
  );
}

export default App;
