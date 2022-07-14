const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../build/ElectionFactory.json');
const compiledElection = require('../build/Election.json');


describe('Election', () => {
    it('deploy', async ()=>{
        const accounts = await web3.eth.getAccounts();

        const result = await new web3.eth.Contract(JSON.parse(JSON.stringify(compiledFactory.abi)))
            .deploy({data: compiledFactory.evm.bytecode.object})
            .send({from: accounts[0], gas: '3000000'});

        console.log('Contract address',result.options.address);

        const factoryAddress = result.options.address;

        const contract = new web3.eth.Contract(
            JSON.parse(JSON.stringify(compiledFactory.abi)),
            factoryAddress
        );

        await contract.methods.createElection("A", "Dhruv").send({
            from: accounts[0],
            gas: '3000000'
        });

        await contract.methods.createElection("B","Manager2").send({
            from: accounts[0],
            gas: '3000000'
        });

        await contract.methods.createElection("C", "Manager3").send({
            from: accounts[0],
            gas: '3000000'
        });

        const elections = await contract.methods.getElections().call();
        console.log(elections);
        
        const electionAddress = elections[0].add;
        const election = new web3.eth.Contract(
            JSON.parse(JSON.stringify(compiledElection.abi)),
            electionAddress
        );

        await election.methods.addParty("Party1", "Leader1", 10, "Region1").send({
            from: accounts[0],
            gas: '3000000'
        });

        await election.methods.addParty("Party2", "Leader2", 10, "Region2").send({
            from: accounts[0],
            gas: '3000000'
        });

        const parties = await election.methods.getParties().call();
        console.log(parties);

        await election.methods.startElection().send({
            from: accounts[0],
            gas: '3000000'
        });

        try{
            await election.methods.addParty("Party3", "Leader3", 10, "Region3").send({
                from: accounts[0],
                gas: '3000000'
            });
            const parties = await election.methods.getParties().call();
            console.log(parties);
        }catch(err){
            console.log('election started ');
            assert(err);
        }

        for(let i=0;i<5;++i){
            await election.methods.castVote(i,1).send({
                from: accounts[i],
                gas: '3000000'
            });
        }
        await election.methods.castVote(5,0).send({
            from: accounts[5],
            gas: '3000000'
        });await election.methods.castVote(6,0).send({
            from: accounts[6],
            gas: '3000000'
        });

        try{
            await election.methods.castVote(1,0).send({
                from: accounts[0],
                gas: '3000000'
            });
        }catch(err){
            console.log('cannot vote again');
        }

        await election.methods.endElection().send({
            from: accounts[0],
            gas: '3000000'
        });

        try{
            await election.methods.castVote(10,0).send({
                from: accounts[2],
                gas: '3000000'
            });

        }catch(err){
            console.log('election ended')
        }

        const results = await election.methods.getResults().call();
        console.log(results);

        var max=0;
        var winningPartyIndex=-1;
        for(let i=0;i<results.length;++i){
            if(results[i]-'0'>max){
                max = results[i]-'0';
                winningPartyIndex = i;
            }
        }

        const winningParty = await election.methods.getPartyDetails(winningPartyIndex).call();
        console.log('winning party: '+winningParty);
        
        assert.ok(true);
    }).timeout(10000)
})