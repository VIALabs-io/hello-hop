// SPDX-License-Identifier: MIT
// (c)2023 Atlas (atlas@cryptolink.tech)
pragma solidity =0.8.17;

import "./includes/MessageV3Client.sol";

contract ATWTest is MessageV3Client {
    uint[] public chainlist;

    event Go();
    event Completed(uint _startChainId, uint hops);
    event NextHop(uint startChainId, uint hops);

    constructor(uint[] memory _chainlist) {
        chainlist = _chainlist;
    }

    /**
     * Kicks off the initial message, which will then be sent from chain to chain until
     * it ends up back at the original chain that sent the message.
     * 
     */
    function go() external onlyOwner {
        // create cross chain message
        bytes memory _data = abi.encode(block.chainid, 0, "Hello World!");

        // send message
        _sendMessage(chainlist[_getNextChainIndex()], address(0), _data);

        emit Go();
    }

    /**
     * Called by the bridge, this is where we handle the received message from the source chain.
     * 
     */
    function messageProcess(uint, uint _sourceChainId, address, address, uint, bytes calldata _data) external override onlyActiveBridge(_sourceChainId) {
        // decode message
        (uint _startChainId, uint _hop, string memory _message) = abi.decode(_data, (uint, uint, string));

        if(_startChainId == block.chainid) {
            // if we are where the message started, we are done, we went around all of the chains!
            emit Completed(_startChainId, _hop);
        } else {
            // create cross chain message
            bytes memory _newData = abi.encode(_startChainId, _hop+1, _message);

            // send message
            _sendMessage(chainlist[_getNextChainIndex()], address(0), _newData);

            emit NextHop(_startChainId, _hop);
        }
    }

    function _getNextChainIndex() internal view returns (uint _index){
        for(uint x; x < chainlist.length; x++) {
            if(chainlist[x] == block.chainid) {
                _index = x;
                break;
            }
        }

        _index = _index + 1;
        if(_index > chainlist.length-1) {
            _index = 0;
        }
        return _index;
    }
}