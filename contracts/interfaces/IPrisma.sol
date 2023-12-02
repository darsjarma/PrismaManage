// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./ITroveManager.sol";

interface IPrisma {
    //hint
    function getApproxHint(
        ITroveManager troveManager,
        uint256 _CR,
        uint256 _numTrials,
        uint256 _inputRandomSeed
    ) external view returns (address hintAddress, uint256 diff, uint256 latestRandomSeed);

    //TroveManage
    function DEBT_GAS_COMPENSATION() external view returns (uint256);
    function getBorrowingFeeWithDecay(uint256 _debt) external view returns (uint256);

    //SortedTroves
    function getSize() external view returns (uint256);
    function findInsertPosition(
        uint256 _NICR,
        address _prevId,
        address _nextId
    ) external view returns (address, address);

    //borrowerOperations
    function openTrove(
        ITroveManager troveManager,
        address account,
        uint256 _maxFeePercentage,
        uint256 _collateralAmount,
        uint256 _debtAmount,
        address _upperHint,
        address _lowerHint
    ) external;

    function closeTrove(ITroveManager troveManager, address account) external;
}
