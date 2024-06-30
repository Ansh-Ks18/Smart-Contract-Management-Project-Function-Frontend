// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleBank {
    // Events
    event Deposit(address indexed account, uint256 amount);
    event Withdrawal(address indexed account, uint256 amount);
    event Transfer(address indexed from, address indexed to, uint256 amount);

    // Mapping to store balances
    mapping(address => uint256) private balances;

    // Function to deposit funds
    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value); // Emit the Deposit event
    }

    // Function to withdraw funds
    function withdraw(uint256 amount) public {
        require(amount <= balances[msg.sender], "Insufficient balance");
        balances[msg.sender] -= amount;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdrawal failed");
        emit Withdrawal(msg.sender, amount); // Emit the Withdrawal event
    }

    // Function to transfer funds to another address
    function transfer(address to, uint256 amount) public {
        require(to != address(0), "Invalid recipient address");
        require(amount <= balances[msg.sender], "Insufficient balance");
        require(to != msg.sender, "Cannot transfer to yourself");

        balances[msg.sender] -= amount;
        balances[to] += amount;
        
        emit Transfer(msg.sender, to, amount); // Emit the Transfer event
    }

    // Function to get the balance of the caller
    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }
}
