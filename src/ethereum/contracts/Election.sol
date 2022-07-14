pragma solidity ^0.8.2;
pragma abicoder v2;

contract ElectionFactory{
    
    struct ElectionMeta{
        address add;
        string name;
        string manager;
    }
    
    ElectionMeta[] list;
    
    function createElection(string memory name, string memory manager, uint time) public{
        Election election = new Election(msg.sender, name, time);
        
        ElectionMeta memory obj = ElectionMeta({
            add: address(election),
            name: name,
            manager: manager
        });
        list.push(obj);
    }
    
    function getElections() public view returns(ElectionMeta[] memory) {
        return list;
    }
    
    
}

contract Election{

    uint public totalVotes;
    string public name;
    
    address public manager;
    mapping(uint => bool) voted;
    
    bool public isCompleted;
    bool public isStarted;

    uint public createdAt;
    uint public startedAt;
    uint public endAt;
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    constructor(address sender, string memory n, uint time){
        manager = sender;
        isCompleted = false;
        totalVotes = 0;
        isStarted = false;
        name = n;
        createdAt = time;
        startedAt = 0;
        endAt = 0;
    }

    struct Party{
        string name;
        string leaderName;
        uint membersCount;
        string region;
        string image;
    }
    
    Party[] parties;
    uint[] voteCount;
    
    function addParty(string memory partyName, string memory leaderName, uint membersCount, string memory region, string memory image) public restricted{
        require(!isStarted);
        Party memory party = Party({
            name: partyName,
            leaderName: leaderName,
            membersCount: membersCount,
            region: region,
            image: image
        });
        
        parties.push(party);
        voteCount.push(0);
    }
    
    function getParties() public view returns(Party[] memory){
        return parties;
    }
    
    function castVote(uint aadhaar, uint partyIndex) public {
        require(isStarted==true);
        require(voted[aadhaar]==false);
        require(isCompleted==false);
        
        voted[aadhaar]=true;
        voteCount[partyIndex]++;
        totalVotes++;
    }
    
    function getPartyDetails(uint partyIndex) public view returns(Party memory){
        Party storage party = parties[partyIndex];
        return party;
    }
    
    function getResults() public view returns(uint[] memory){
        require(isCompleted==true);
        return voteCount;
    }
    
    function endElection() public restricted {
        require(isStarted==true);
        isCompleted = true;
    }
    
    function startElection(uint time, uint willEndAt) public restricted {
        require(isCompleted==false);
        require(isStarted==false);
        isStarted = true;
        startedAt = time;
        endAt = willEndAt;
    }
}