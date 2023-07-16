// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

//import "hardhat/console.sol";

contract Assessment {
    address payable public owner;
    uint256 public balance;
    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    


    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        balance += _amount;

        assert(balance == _previousBalance + _amount);

        emit Deposit(_amount);
    }

    
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
       
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        balance -= _withdrawAmount;

        assert(balance == (_previousBalance - _withdrawAmount));

        emit Withdraw(_withdrawAmount);
    }

    function checkOwner()public pure returns(string memory){
        string memory name="Dheeraj";
        return name;
    }
    
    function addition(uint a, uint b) public pure returns(uint){
        return a+b;
        
        
    }

    function substraction(uint a, uint b) public pure returns(uint){
        require(a>=b,"value of a should me greater than b");
        return a-b;
    }

    
    
}