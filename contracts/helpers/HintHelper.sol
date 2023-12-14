// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../interfaces/IPrisma.sol";
import "./Addresses.sol";
import "./Addresses.sol";

library HintHelper {
    function approximateDebtAmount(address _troveManager, uint _receivingAmount) public view returns(uint){
        uint liquidationReserve = IPrisma(_troveManager).DEBT_GAS_COMPENSATION();
        uint expectedFee = IPrisma(_troveManager).getBorrowingFeeWithDecay(_receivingAmount);
        return(_receivingAmount +expectedFee+liquidationReserve);
    }
    function getHints(
        uint _collateralAmount,
        uint _receivingAmount,
        address _troveManager,
        address _sortedTrovesAddress,
        uint randomSeedNumber
    ) public view returns(address, address){
        uint expectedDebt = approximateDebtAmount(_troveManager, _receivingAmount);
        uint _CR = _collateralAmount* 10**20 / expectedDebt;
        uint numberOfTroves =  IPrisma(_sortedTrovesAddress).getSize();
        uint numberOfTrials = 15 * numberOfTroves;
        (address hintAddress,,) = IPrisma(Addresses.multiCollateralHintHelperAddress).getApproxHint(
            ITroveManager(_troveManager),
            _CR,
            numberOfTrials,
            randomSeedNumber
        );
        (address upperHint, address lowerHint) = IPrisma(_sortedTrovesAddress).findInsertPosition(
            _CR, hintAddress, hintAddress
        );
    return  (upperHint, lowerHint);
    }
}
