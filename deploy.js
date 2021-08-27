const fs = require('fs');
const Web3 = require('web3');

const GANACHE_HOST = 'http://localhost:8545';
const CONTRACT_NAME = 'Voting';
const CANDITATES = ['Jon', 'Sansa', 'Bran'];
const GAS = 1500000;
const GAS_PRICE = '0.00003';

const deploy = async () => {
  const web3 = new Web3(GANACHE_HOST);
  const accounts = await web3.eth.getAccounts();
  console.log('Available Ganache accounts:');
  console.log(accounts);
  const accountNumber = Math.floor(Math.random() * accounts.length);
  const account = accounts[accountNumber];
  process.stdout.write(`Using random account: ${account}\n`);
  const bytecode = fs.readFileSync(`${CONTRACT_NAME}_sol_${CONTRACT_NAME}.bin`).toString();
  const abi = JSON.parse(fs.readFileSync(`${CONTRACT_NAME}_sol_${CONTRACT_NAME}.abi`).toString());
  const deployedContract = new web3.eth.Contract(abi);
  process.stdout.write(`Deploying contract with candidates: ${CANDITATES}\n`);
  const newContract = await deployedContract.deploy({
    data: bytecode,
    arguments: [CANDITATES.map(name => web3.utils.asciiToHex(name))]
  }).send({
    from: account,
    gas: GAS,
    gasPrice: web3.utils.toWei(GAS_PRICE, 'ether')
  });
  process.stdout.write(`Success. Deployed contract address: ${newContract.options.address}\n`);
};

deploy();
