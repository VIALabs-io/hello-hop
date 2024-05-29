// SPDX-License-Identifier: MIT
// (c)2023 Atlas (atlas@vialabs.io)
pragma solidity =0.8.17;

import "@vialabs-io/contracts/message/MessageClient.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HelloHOP is MessageClient, Ownable {
    event Go();
    event Completed(uint _startChainId, uint hops);
    event NextHop(uint startChainId, uint hops);

    /**
     * Kicks off the initial message, which will then be sent from chain to chain, following
     * the path set in _chainlist which is a comma seperated list of chain ids
     * 
     */
    function go(uint[] calldata _chainlist) external onlyOwner {
        // create cross chain message
        bytes memory _data = abi.encode(block.chainid, 1, _chainlist);

        // send message
        _sendMessage(_chainlist[0], _data);

        emit Go();
    }

    /**
     * This is where we handle the received message from the sending chain, and if there
     * are still more hops to follow, execute another message to the next chain.
     * 
     */
    function messageProcess(uint, uint _sourceChainId, address _sender, address, uint, bytes calldata _data) external override onlySelf(_sender, _sourceChainId) {
        // decode message
        (uint _startChainId, uint _hop, uint[] memory _chainlist) = abi.decode(_data, (uint, uint, uint[]));

        if(_hop >= _chainlist.length) {
            emit Completed(_startChainId, _hop);
        } else {
            // create cross chain message
            bytes memory _newData = abi.encode(_startChainId, _hop+1, _chainlist);

            // send message
            _sendMessage(_chainlist[_hop], _newData);

            emit NextHop(_startChainId, _hop+1);
        }
    }
}