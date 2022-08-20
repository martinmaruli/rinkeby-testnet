require("dotenv").config();
const Web3 = require('web3');
const Provider = require('@truffle/hdwallet-provider');
const MyContract = require('./build/contracts/MyContract.json');
const address = process.env.ADDRESS;
const privateKey = process.env.PRIVATE_KEY;
const infuraUrl = process.env.PROVIDER_KEY; 

const init1 = async () => {
  const web3 = new Web3(infuraUrl);
  const networkId = await web3.eth.net.getId();
  const myContract = new web3.eth.Contract(
    MyContract.abi,
    MyContract.networks[networkId].address
  );

  const tx = myContract.methods.setData(1);
  const gas = await tx.estimateGas({from: address});
  const gasPrice = await web3.eth.getGasPrice();
  const data = tx.encodeABI();
  const nonce = await web3.eth.getTransactionCount(address);

  const signedTx = await web3.eth.accounts.signTransaction(
    {
      to: myContract.options.address, 
      data,
      gas,
      gasPrice,
      nonce, 
      chainId: networkId
    },
    privateKey
  );
  console.log(`Old data value: ${await myContract.methods.data().call()}`);
  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log(`Transaction hash: ${receipt.transactionHash}`);
  console.log(`New data value: ${await myContract.methods.data().call()}`);
}
init1();
