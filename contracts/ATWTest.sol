// SPDX-License-Identifier: MIT
// (c)2023 Atlas (atlas@cryptolink.tech)
pragma solidity =0.8.17;

import "./MessageV3Client.sol";

contract ATWTest is MessageV3Client {
    uint[] public chainlist;

    event Go();
    event Completed(uint _startChainId, uint hop);
    event NextHop(uint startChainId, uint hop);

    constructor(uint[] memory _chainlist) {
        chainlist = _chainlist;
    }

    function go() external onlyOwner {
        uint _myHop;
        for(uint x; x < chainlist.length; x++) {
            if(chainlist[x] == block.chainid) {
                _myHop = x;
                break;
            }
        }

        string memory _message = "Hello World!";
        bytes memory _newData = abi.encode(block.chainid, _myHop+1, _message);
        _sendMessage(chainlist[_myHop+1], address(0), _newData);
        emit Go();
    }

    function messageProcess(uint, uint _sourceChainId, address, address, uint, bytes calldata _data) external override onlyActiveBridge(_sourceChainId) {
        (uint _startChainId, uint _hop, string memory _message) = abi.decode(_data, (uint, uint, string));

        if(_startChainId == block.chainid) {
            emit Completed(_startChainId, _hop);
        } else {
            _hop = _hop + 1;
            if(_hop > chainlist.length-1) {
                _hop = 0;
            }

            bytes memory _newData = abi.encode(_startChainId, _hop, _message);
            _sendMessage(chainlist[_hop], address(0), _newData);
            emit NextHop(_startChainId, _hop);
        }
    }
}