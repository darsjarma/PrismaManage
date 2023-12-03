pragma solidity ^0.8.20;

import "./helpers/HintHelper.sol";
import "./helpers/Addresses.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PrismaManage {
    function takeLoan(
        uint _collateralAmount,
        uint _receivingAmount,
        address _troveManagerAddress,
        address _sortedTrovesAddress,
        address _collateralTokenAddress,
        uint _randomSeedNumber,
        uint _maxFeePercentage

    ) external {
        (address upperHint, address lowerHint) = HintHelper.getHints(
            _collateralAmount,
            _receivingAmount,
            _troveManagerAddress,
            _sortedTrovesAddress,
            _randomSeedNumber
        );
        IERC20(_collateralTokenAddress).approve(Addresses.borrowerOperationAddress, _collateralAmount);
        IPrisma(Addresses.borrowerOperationAddress).openTrove(
            ITroveManager(_troveManagerAddress),
            address(this),
            _maxFeePercentage,
            _collateralAmount,
            HintHelper.approximateDebtAmount(_troveManagerAddress, _receivingAmount),
            upperHint,
            lowerHint
        );
    }
   function payOff(
       address _troveManager,
       uint _mkUsdAmount
   ) external{
       IERC20(Addresses.mkUSDAddress).approve(Addresses.borrowerOperationAddress, _mkUsdAmount);
       IPrisma(Addresses.borrowerOperationAddress).closeTrove(ITroveManager(_troveManager), address(this));
   }
}