pragma solidity ^0.8.19;

import "./helpers/HintHelper.sol";
import "./helpers/Addresses.sol";
contract PrismaManage {
    function takeLoan(
        uint _collateralAmount,
        uint _receivingAmount,
        address _troveManagerAddress,
        address _sortedTrovesAddress,
        address _account,
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
        IPrisma(Addresses.borrowerOperationAddress).openTrove(
            ITroveManager(_troveManagerAddress),
            _account,
            _maxFeePercentage,
            _collateralAmount,
            HintHelper.approximateDebtAmount(_troveManagerAddress, _receivingAmount),
            upperHint,
            lowerHint
        );
    }
//    function payOff();
}