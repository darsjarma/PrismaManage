//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./helpers/HintHelper.sol";
import "./helpers/Addresses.sol";
import "./helpers/SwapHelper.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "hardhat/console.sol";

contract PrismaManage {

    function submit(
        address _sendingTokenAddress,
        address _troveManagerAddress,
        address _sortedTrovesAddress,
        address _collateralTokenAddress,
        uint _sendingTokenAmount,
        uint _receivingMkUSDAmount,
        uint randomSeedNumber,
        uint maxFeePercentage,
        bytes calldata _swapData
    ) external {
        IERC20(_sendingTokenAddress).transferFrom(msg.sender, address(this), _sendingTokenAmount);
        uint receivedStEthAmount = SwapHelper.swapLifi(false, _sendingTokenAddress, _swapData);
//        console.log(receivedStEthAmount);
//        console.log(IERC20(0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0).balanceOf(address(this)));
        uint receivedMkUSDAmount = takeLoan(
            receivedStEthAmount,
            _receivingMkUSDAmount,
            _troveManagerAddress,
            _sortedTrovesAddress,
            _collateralTokenAddress,
            randomSeedNumber,
            maxFeePercentage
        );
        IERC20(Addresses.mkUSDAddress).transfer(msg.sender, receivedMkUSDAmount);
    }

    function withdraw(address troveManager, address collateralTokenAddress, uint mkUsdAmount, bytes calldata _swapData) external {
        IERC20(Addresses.mkUSDAddress).transferFrom(msg.sender, address(this), mkUsdAmount);
        payOff(troveManager, mkUsdAmount);
        console.log(IERC20(0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0).balanceOf(address(this)));
        uint receivedAmount = SwapHelper.swapLifi(false, collateralTokenAddress, _swapData);
        IERC20(Addresses.usdcAddress).transfer(msg.sender, receivedAmount);
    }

    function takeLoan(
        uint _collateralAmount,
        uint _receivingAmount,
        address _troveManagerAddress,
        address _sortedTrovesAddress,
        address _collateralTokenAddress,
        uint _randomSeedNumber,
        uint _maxFeePercentage
    ) public returns (uint receivedAmount){
        uint mkUASBefore;
        uint mkUSDAfter;
//        console.log("before getHints");
        (address upperHint, address lowerHint) = HintHelper.getHints(
            _collateralAmount,
            _receivingAmount,
            _troveManagerAddress,
            _sortedTrovesAddress,
            _randomSeedNumber
        );
//        console.log("before approve");
        IERC20(_collateralTokenAddress).approve(Addresses.borrowerOperationAddress, _collateralAmount);
        mkUASBefore = IERC20(Addresses.mkUSDAddress).balanceOf(address(this));
//        console.log(mkUASBefore);
        IPrisma(Addresses.borrowerOperationAddress).openTrove(
            ITroveManager(_troveManagerAddress),
            address(this),
            _maxFeePercentage,
            _collateralAmount,
            _receivingAmount,
            upperHint,
            lowerHint
        );
        mkUSDAfter = IERC20(Addresses.mkUSDAddress).balanceOf(address(this));
        return (mkUSDAfter - mkUASBefore);
    }

    function payOff(
        address _troveManager,
        uint _mkUsdAmount
    ) public {
        IERC20(Addresses.mkUSDAddress).approve(Addresses.borrowerOperationAddress, _mkUsdAmount);
        IPrisma(Addresses.borrowerOperationAddress).closeTrove(ITroveManager(_troveManager), address(this));
    }
}
