// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SendETH {
    address public owner;

    event PaymentSent(address indexed from, address indexed to, uint256 amount, uint256 timestamp);

    constructor() {
        owner = msg.sender;
    }

    function sendETH(address payable _to) public payable {
        require(msg.value > 0, "Must send ETH");
        _to.transfer(msg.value);
        emit PaymentSent(msg.sender, _to, msg.value, block.timestamp);
    }

    function withdraw() public {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }

    receive() external payable {}
}