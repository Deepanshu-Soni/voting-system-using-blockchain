const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/ElectionFactory.json');

const provider = new HDWalletProvider(
    'charge real rare project today initial leopard cliff idle round ring twist',
    'https://rinkeby.infura.io/v3/78b1532a1f4c48deb702c0c2ccc93c89'
);

const web3 = new Web3(provider);

const deploy = async ()=>{
    const accounts = await web3.eth.getAccounts();
    // console.log('using account', accounts[0]);
    const result = await new web3.eth.Contract(JSON.parse(JSON.stringify(compiledFactory.abi)))
        .deploy({data: compiledFactory.evm.bytecode.object})
        .send({from: accounts[0], gas: '3000000'});

    console.log('Contract address',result.options.address);
}
deploy();
