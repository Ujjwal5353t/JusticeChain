// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract JusticeChain {
    struct FIR {
        uint id;
        string title;
        string description;
        uint severity;
        string ipfsHash; 
        uint timestamp;
    }

    FIR[] public firs;
    address public owner;

    event FIRCreated(
        uint id,
        string title,
        uint severity,
        string ipfsHash,
        uint timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createFIR(
        string memory _title,
        string memory _description,
        uint _severity,
        string memory _ipfsHash
    ) public onlyOwner {
        require(_severity >= 1 && _severity <= 5, "Invalid severity");

        FIR memory newFIR = FIR({
            id: firs.length,
            title: _title,
            description: _description,
            severity: _severity,
            ipfsHash: _ipfsHash,
            timestamp: block.timestamp
        });

        firs.push(newFIR);

        emit FIRCreated(
            newFIR.id,
            _title,
            _severity,
            _ipfsHash,
            newFIR.timestamp
        );
    }

    function getAllFIRs() public view returns (FIR[] memory) {
        return firs;
    }

    function getFIR(uint _id) public view returns (FIR memory) {
        require(_id < firs.length, "FIR does not exist");
        return firs[_id];
    }

    function getTotalFIRs() public view returns (uint) {
        return firs.length;
    }
}
