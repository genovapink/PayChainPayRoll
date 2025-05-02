// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PayChain {
    address public owner;

    event PaymentSent(address indexed from, address indexed to, uint256 amount, string message);

    constructor() {
        owner = msg.sender;
    }

    function pay(address payable to, string memory message) public payable {
        require(msg.value > 0, "Must send some ether");
        to.transfer(msg.value);
        emit PaymentSent(msg.sender, to, msg.value, message);
    }

    function withdraw() public {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }
}
