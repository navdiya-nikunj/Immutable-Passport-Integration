It's teaching guide to show how to integrate immutable passport in your application

## Introuduction

### What is immutable passport?
Immutable Passport is like a special online ID that helps you smoothly navigate through Web3 games and apps. It's your digital passport for this new online world, making your experience consistent and easy.

One of the remarkable things about Immutable Passport is its in-built non-custodial wallet. Every user gets one, and it offers a transaction experience just as good as what you'd find on regular websites (web2). With this wallet, you can safely handle your digital stuff and do blockchain transactions without middlemen.

As you continue reading, you'll learn how to easily add Immutable Passport to your apps. This lets your users enjoy all the benefits of Web3 while also using the identity and wallet system from Immutable Passport. It's time to explore the exciting world of blockchain-powered experiences together!

### What is covered in this guide?

- **Setting Up Your Environment**: We'll ensure you have the necessary tools and prerequisites to get started on this journey.

- **Creating a Simple Application**: Whether you're building an app from scratch or using a sample repository, we'll help you set up the foundation.

- **Registering the Application**: You'll learn how to establish a connection with the Immutable Developer Hub, acquiring the credentials vital for your application's functionality.

- **Installing and Initializing the Passport Client:** We'll guide you through the process of installing the Immutable Passport client library and initializing it with your application's credentials.

- **Logging in a User with Passport**: You'll implement user authentication with Immutable Passport, ensuring a secure and smooth login experience.

- **Displaying User Information**: Learn how to access and present user-specific data, including the ID token, access token, and the user's nickname within your application.

- **Logging Out a User**: We'll demonstrate how to implement a user logout feature to enhance user control.

- **Initiating a Transaction from Passport**: You'll gain insight into initiating transactions via Passport, a fundamental part of the Web3 experience.


## Steps of Integration with Immutable Passport

### Step 1: Register your application

- Get Immutable Passport credentials (client ID)
  - Get it by registering your application from [the Immutable Developer Hub](https://hub.immutable.com/).

### Step 2 : Get sample application

- Have a basic React application ready. (You can clone this repo to get sample application)
    - Clone this repo by running following command.
        - ```
          git clone https://github.com/navdiya-nikunj/Immutable-Passport-Integration.git
          ```
        - ```
          npm install
          ```

### Step 3 : Install dependencies

- Install the Immutable SDK
    - ```
      npm install -D @imtbl/sdk
      ```
- Install Dependencies
    - ```
      npm install -D typescript ts-node
      ```
### Step 4 : Initialise Passport
 we first have to get the Passport client ready. To make it work, we'll need an ImmutableConfiguration instance, which holds settings shared by all Immutable modules, like the environment. Create a new JavaScript file for this code.Just remember to switch out `YOUR_CLIENT_ID`, `redirectUri`, and `logoutRedirectUri` with the same values you used when you registered your app!
 Here is the file `config.js`:
 
```Javascript
import { config, passport  } from '@imtbl/sdk';
const passportInstance = new passport.Passport({
  baseConfig: new config.ImmutableConfiguration({
    environment: config.Environment.SANDBOX,
  }),
  clientId: '<YOUR_CLIENT_ID>',
  redirectUri: 'https://example.com',
  logoutRedirectUri: 'https://example.com/logout',
  audience: 'platform_api',
  scope: 'openid offline_access email transact'
});
```

For troubleshoot visit [Immutable docs](https://docs.immutable.com/docs/zkEVM/products/passport/setup)

### Step 5 :Enable User Identity 

To start up the passport provider, we'll follow the Ethereum EIP-1193 standard. By adopting this standard, we can apply the same principles for engaging with a user's Passport wallet as we would with any regular Ethereum wallet. As I'm structuring this guide around a React application, I'll also need to get `react-dom` and `react-router-dom` to ensure smooth navigation to the Callback URL.

After installing both lubraries add routes in `index.js`:

```Javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Login from './Login'
import reportWebVitals from './reportWebVitals';
import {BrowserRouter as Router,Routes, Route} from 'react-router-dom'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/connect" element={<Connect />} />

  </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
```

After Adding routes we will add `connect.js` file to handle our login and add the following code into it:

```Javascript
import { useEffect } from 'react';
import passportInstance from './config.js'

export default function Connect() {
  useEffect(() => {
    async function handleLoginCallback() {
      if (!passportInstance) {
        return
      }
    try {
        await passportInstance.loginCallback();
    }
    catch (err) {
        console.error("login callback error", err);
    }
    }
    handleLoginCallback()
  }, []);

  return (
    <div/>
  );
}
```

### Step 6: get User Information

Add the following code logic to your connect passport button onclick event:

```Javascript
const provider = passportInstance.connectEvm();
const accounts = await provider.request({ method: "eth_requestAccounts" });
const personAddress = accounts[0] 
setUserAddress(personAddress)

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
```

To get the explaination how login works [Click here](https://docs.immutable.com/docs/zkEVM/products/passport/identity/login)
To get the explaination how user infor works [Click here](https://docs.immutable.com/docs/zkEVM/products/passport/identity/user-info)

### Troubleshooting the errors

Install the following libraries 

- assert
- crypto-browserify
- stream-browserify
- buffer

After installing add fallback to `node-modules` --> `react-scripts` --> `config` --> `webpack.config.js`--> `resolve`
```
fallback:{
      "crypto": require.resolve("crypto-browserify"),	
      "stream": require.resolve("stream-browserify"),
    }
```
### Step 7:Loging out

Add the following logic to your logout button onclick event:

``` const handleLogout = () => {
    await passportInstance.logout();
    setPassportConnected(false);
    setUserEmail("");
    setUserAddress("");
    setAccessToken("");
    setIdToken("");
    setUserNickname("");
  };
```

### Step 8: Transaction

For transaction we will use eth_sendTransaction RPC method which has following parameter: 

- Transaction: Object. A standard Ethereum transaction object. Only the following properties will be referenced:
    - to: string. The destination address of the message.
    - data: string (optional). Either a byte string containing the associated data of the message, or in the case of a contract-creation transaction, the initialisation code.
    - value: string (optional). The value transferred for the transaction in wei, encoded as a hex string.

This method does not support the gas, gasPrice, maxPriorityFeePerGas, or maxFeePerGas properties as the relayer abstracts these away from the user. Additionally, the from property is not supported as the user's Passport wallet address is used instead.

To work transetcion we will add one button `Transection` in our code and add following logic in it:

```Javascript\
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
```

More detail on transation [Click here](https://docs.immutable.com/docs/zkEVM/products/passport/wallet/rpc-methods/eth_sendTransaction)

### Conclusion

Congratulations! You've successfully completed the journey of integrating Immutable Passport into your application. This marks an exciting milestone in your quest to provide your users with a cutting-edge and seamless Web3 experience. 

By integrating Immutable Passport into your application, you've embraced the future of blockchain technology and have empowered your users with a remarkable Web3 experience. As you move forward, may your applications thrive in the decentralized world and deliver outstanding user experiences. Best of luck on your Web3 adventure!
