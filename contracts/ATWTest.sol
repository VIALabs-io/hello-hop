// SPDX-License-Identifier: MIT
// (c)2023 Atlas (atlas@cryptolink.tech)
pragma solidity =0.8.17;

import "@cryptolink/contracts/bridge/MessageV3Client.sol";

contract ATWTest is MessageV3Client {
    event Go();
    event Completed(uint _startChainId, uint hops);
    event NextHop(uint startChainId, uint hops);

    /**
     * Kicks off the initial message, which will then be sent from chain to chain until
     * it ends up back at the original chain that sent the message.
     * 
     */
    function go(uint[] calldata _chainlist) external onlyOwner {
        // create cross chain message
        bytes memory _data = abi.encode(block.chainid, 0, _chainlist);

        // send message
        _sendMessage(_chainlist[_getNextChainIndex(_chainlist)], address(0), _data);

        emit Go();
    }

    /**
     * Called by the bridge, this is where we handle the received message from the source chain.
     * 
     */
    function messageProcess(uint, uint _sourceChainId, address, address, uint, bytes calldata _data) external override onlyActiveBridge(_sourceChainId) {
        // decode message
        (uint _startChainId, uint _hop, uint[] memory _chainlist) = abi.decode(_data, (uint, uint, uint[]));

        if(_hop >= _chainlist.length) {
            // if we are where the message started, we are done, we went around all of the chains!
            emit Completed(_startChainId, _hop);
        } else {
            // create cross chain message
            bytes memory _newData = abi.encode(_startChainId, _hop+1, _chainlist);

            // send message
            _sendMessage(_chainlist[_getNextChainIndex(_chainlist)], address(0), _newData);

            emit NextHop(_startChainId, _hop);
        }
    }

    function _getNextChainIndex(uint[] memory _chainlist) internal view returns (uint _index){
        for(uint x; x < _chainlist.length; x++) {
            if(_chainlist[x] == block.chainid) {
                _index = x;
                break;
            }
        }

        _index = _index + 1;
        if(_index > _chainlist.length-1) {
            _index = 0;
        }
        return _index;
    }
}