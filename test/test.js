const {expect} = require("chai")
const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers")
const {ethers} = require("hardhat")

const BorrowerOperationsABI = [{"inputs":[{"internalType":"address","name":"_prismaCore","type":"address"},{"internalType":"address","name":"_debtTokenAddress","type":"address"},{"internalType":"address","name":"_factory","type":"address"},{"internalType":"uint256","name":"_minNetDebt","type":"uint256"},{"internalType":"uint256","name":"_gasCompensation","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"borrower","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"BorrowingFeePaid","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract ITroveManager","name":"troveManager","type":"address"},{"indexed":false,"internalType":"contract IERC20","name":"collateralToken","type":"address"}],"name":"CollateralConfigured","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_borrower","type":"address"},{"indexed":false,"internalType":"uint256","name":"arrayIndex","type":"uint256"}],"name":"TroveCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract ITroveManager","name":"troveManager","type":"address"}],"name":"TroveManagerRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_borrower","type":"address"},{"indexed":false,"internalType":"uint256","name":"_debt","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_coll","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"stake","type":"uint256"},{"indexed":false,"internalType":"enum BorrowerOperations.BorrowerOperation","name":"operation","type":"uint8"}],"name":"TroveUpdated","type":"event"},{"inputs":[],"name":"CCR","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DEBT_GAS_COMPENSATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DECIMAL_PRECISION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PERCENT_DIVISOR","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PRISMA_CORE","outputs":[{"internalType":"contract IPrismaCore","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract ITroveManager","name":"troveManager","type":"address"},{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"_collateralAmount","type":"uint256"},{"internalType":"address","name":"_upperHint","type":"address"},{"internalType":"address","name":"_lowerHint","type":"address"}],"name":"addColl","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ITroveManager","name":"troveManager","type":"address"},{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"_maxFeePercentage","type":"uint256"},{"internalType":"uint256","name":"_collDeposit","type":"uint256"},{"internalType":"uint256","name":"_collWithdrawal","type":"uint256"},{"internalType":"uint256","name":"_debtChange","type":"uint256"},{"internalType":"bool","name":"_isDebtIncrease","type":"bool"},{"internalType":"address","name":"_upperHint","type":"address"},{"internalType":"address","name":"_lowerHint","type":"address"}],"name":"adjustTrove","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"TCR","type":"uint256"}],"name":"checkRecoveryMode","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"contract ITroveManager","name":"troveManager","type":"address"},{"internalType":"address","name":"account","type":"address"}],"name":"closeTrove","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ITroveManager","name":"troveManager","type":"address"},{"internalType":"contract IERC20","name":"collateralToken","type":"address"}],"name":"configureCollateral","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"debtToken","outputs":[{"internalType":"contract IDebtToken","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fetchBalances","outputs":[{"components":[{"internalType":"uint256[]","name":"collaterals","type":"uint256[]"},{"internalType":"uint256[]","name":"debts","type":"uint256[]"},{"internalType":"uint256[]","name":"prices","type":"uint256[]"}],"internalType":"struct BorrowerOperations.SystemBalances","name":"balances","type":"tuple"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_debt","type":"uint256"}],"name":"getCompositeDebt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getGlobalSystemBalances","outputs":[{"internalType":"uint256","name":"totalPricedCollateral","type":"uint256"},{"internalType":"uint256","name":"totalDebt","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getTCR","outputs":[{"internalType":"uint256","name":"globalTotalCollateralRatio","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"guardian","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"caller","type":"address"}],"name":"isApprovedDelegate","outputs":[{"internalType":"bool","name":"isApproved","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minNetDebt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract ITroveManager","name":"troveManager","type":"address"},{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"_maxFeePercentage","type":"uint256"},{"internalType":"uint256","name":"_collateralAmount","type":"uint256"},{"internalType":"uint256","name":"_debtAmount","type":"uint256"},{"internalType":"address","name":"_upperHint","type":"address"},{"internalType":"address","name":"_lowerHint","type":"address"}],"name":"openTrove","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract ITroveManager","name":"troveManager","type":"address"}],"name":"removeTroveManager","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ITroveManager","name":"troveManager","type":"address"},{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"_debtAmount","type":"uint256"},{"internalType":"address","name":"_upperHint","type":"address"},{"internalType":"address","name":"_lowerHint","type":"address"}],"name":"repayDebt","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_delegate","type":"address"},{"internalType":"bool","name":"_isApproved","type":"bool"}],"name":"setDelegateApproval","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_minNetDebt","type":"uint256"}],"name":"setMinNetDebt","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ITroveManager","name":"","type":"address"}],"name":"troveManagersData","outputs":[{"internalType":"contract IERC20","name":"collateralToken","type":"address"},{"internalType":"uint16","name":"index","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract ITroveManager","name":"troveManager","type":"address"},{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"_collWithdrawal","type":"uint256"},{"internalType":"address","name":"_upperHint","type":"address"},{"internalType":"address","name":"_lowerHint","type":"address"}],"name":"withdrawColl","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ITroveManager","name":"troveManager","type":"address"},{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"_maxFeePercentage","type":"uint256"},{"internalType":"uint256","name":"_debtAmount","type":"uint256"},{"internalType":"address","name":"_upperHint","type":"address"},{"internalType":"address","name":"_lowerHint","type":"address"}],"name":"withdrawDebt","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const BorrowerOperationAddress = '0x72c590349535AD52e6953744cb2A36B409542719'

const mkUSDABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]
const mkUSDAddress = '0x4591DBfF62656E7859Afe5e45f6f47D3669fBB28'

const stEthTroveManagerABI = [{"inputs":[{"internalType":"address","name":"_prismaCore","type":"address"},{"internalType":"address","name":"_gasPoolAddress","type":"address"},{"internalType":"address","name":"_debtTokenAddress","type":"address"},{"internalType":"address","name":"_borrowerOperationsAddress","type":"address"},{"internalType":"address","name":"_vault","type":"address"},{"internalType":"address","name":"_liquidationManager","type":"address"},{"internalType":"uint256","name":"_gasCompensation","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_baseRate","type":"uint256"}],"name":"BaseRateUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_to","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"CollateralSent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_L_collateral","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_L_debt","type":"uint256"}],"name":"LTermsUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_lastFeeOpTime","type":"uint256"}],"name":"LastFeeOpTimeUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_attemptedDebtAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_actualDebtAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_collateralSent","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_collateralFee","type":"uint256"}],"name":"Redemption","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"recipient","type":"address"},{"indexed":false,"internalType":"uint256","name":"claimed","type":"uint256"}],"name":"RewardClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_totalStakesSnapshot","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_totalCollateralSnapshot","type":"uint256"}],"name":"SystemSnapshotsUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_newTotalStakes","type":"uint256"}],"name":"TotalStakesUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_borrower","type":"address"},{"indexed":false,"internalType":"uint256","name":"_newIndex","type":"uint256"}],"name":"TroveIndexUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_L_collateral","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_L_debt","type":"uint256"}],"name":"TroveSnapshotsUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_borrower","type":"address"},{"indexed":false,"internalType":"uint256","name":"_debt","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_coll","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_stake","type":"uint256"},{"indexed":false,"internalType":"enum TroveManager.TroveManagerOperation","name":"_operation","type":"uint8"}],"name":"TroveUpdated","type":"event"},{"inputs":[],"name":"BOOTSTRAP_PERIOD","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"CCR","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DEBT_GAS_COMPENSATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DECIMAL_PRECISION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"L_collateral","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"L_debt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_INTEREST_RATE_IN_BPS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MCR","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PERCENT_DIVISOR","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PRISMA_CORE","outputs":[{"internalType":"contract IPrismaCore","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"SUNSETTING_INTEREST_RATE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"Troves","outputs":[{"internalType":"uint256","name":"debt","type":"uint256"},{"internalType":"uint256","name":"coll","type":"uint256"},{"internalType":"uint256","name":"stake","type":"uint256"},{"internalType":"enum TroveManager.Status","name":"status","type":"uint8"},{"internalType":"uint128","name":"arrayIndex","type":"uint128"},{"internalType":"uint256","name":"activeInterestIndex","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"accountLatestMint","outputs":[{"internalType":"uint32","name":"amount","type":"uint32"},{"internalType":"uint32","name":"week","type":"uint32"},{"internalType":"uint32","name":"day","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"activeInterestIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"borrower","type":"address"},{"internalType":"uint256","name":"collSurplus","type":"uint256"}],"name":"addCollateralSurplus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_borrower","type":"address"}],"name":"applyPendingRewards","outputs":[{"internalType":"uint256","name":"coll","type":"uint256"},{"internalType":"uint256","name":"debt","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"baseRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"borrowerOperationsAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"borrowingFeeFloor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_receiver","type":"address"}],"name":"claimCollateral","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"claimReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"claimableReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_borrower","type":"address"},{"internalType":"address","name":"_receiver","type":"address"},{"internalType":"uint256","name":"collAmount","type":"uint256"},{"internalType":"uint256","name":"debtAmount","type":"uint256"}],"name":"closeTrove","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_borrower","type":"address"}],"name":"closeTroveByLiquidation","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"collateralToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"collectInterests","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"dailyMintReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"debtToken","outputs":[{"internalType":"contract IDebtToken","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_debt","type":"uint256"}],"name":"decayBaseRateAndGetBorrowingFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"debt","type":"uint256"},{"internalType":"uint256","name":"coll","type":"uint256"}],"name":"decreaseDebtAndSendCollateral","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"defaultedCollateral","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"defaultedDebt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"emissionId","outputs":[{"internalType":"uint16","name":"debt","type":"uint16"},{"internalType":"uint16","name":"minting","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fetchPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_liquidator","type":"address"},{"internalType":"uint256","name":"_debt","type":"uint256"},{"internalType":"uint256","name":"_coll","type":"uint256"},{"internalType":"uint256","name":"_collSurplus","type":"uint256"},{"internalType":"uint256","name":"_debtGasComp","type":"uint256"},{"internalType":"uint256","name":"_collGasComp","type":"uint256"}],"name":"finalizeLiquidation","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_debt","type":"uint256"}],"name":"getBorrowingFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_debt","type":"uint256"}],"name":"getBorrowingFeeWithDecay","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getBorrowingRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getBorrowingRateWithDecay","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_borrower","type":"address"},{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"getCurrentICR","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_borrower","type":"address"}],"name":"getEntireDebtAndColl","outputs":[{"internalType":"uint256","name":"debt","type":"uint256"},{"internalType":"uint256","name":"coll","type":"uint256"},{"internalType":"uint256","name":"pendingDebtReward","type":"uint256"},{"internalType":"uint256","name":"pendingCollateralReward","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getEntireSystemBalances","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getEntireSystemColl","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getEntireSystemDebt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_borrower","type":"address"}],"name":"getNominalICR","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_borrower","type":"address"}],"name":"getPendingCollAndDebtRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_collateralDrawn","type":"uint256"}],"name":"getRedemptionFeeWithDecay","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRedemptionRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRedemptionRateWithDecay","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTotalActiveCollateral","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTotalActiveDebt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"week","type":"uint256"}],"name":"getTotalMints","outputs":[{"internalType":"uint32[7]","name":"","type":"uint32[7]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_borrower","type":"address"}],"name":"getTroveCollAndDebt","outputs":[{"internalType":"uint256","name":"coll","type":"uint256"},{"internalType":"uint256","name":"debt","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getTroveFromTroveOwnersArray","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTroveOwnersCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_borrower","type":"address"}],"name":"getTroveStake","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_borrower","type":"address"}],"name":"getTroveStatus","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getWeek","outputs":[{"internalType":"uint256","name":"week","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getWeekAndDay","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"guardian","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_borrower","type":"address"}],"name":"hasPendingRewards","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"interestPayable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"interestRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastActiveIndexUpdate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastCollateralError_Redistribution","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastDebtError_Redistribution","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastFeeOperationTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastUpdate","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"liquidationManager","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxBorrowingFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxRedemptionFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxSystemDebt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minuteDecayFactor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_debt","type":"uint256"},{"internalType":"uint256","name":"_collateral","type":"uint256"}],"name":"movePendingTroveRewardsToActiveBalances","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"_assignedIds","type":"uint256[]"}],"name":"notifyRegisteredId","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_borrower","type":"address"},{"internalType":"uint256","name":"_collateralAmount","type":"uint256"},{"internalType":"uint256","name":"_compositeDebt","type":"uint256"},{"internalType":"uint256","name":"NICR","type":"uint256"},{"internalType":"address","name":"_upperHint","type":"address"},{"internalType":"address","name":"_lowerHint","type":"address"},{"internalType":"bool","name":"_isRecoveryMode","type":"bool"}],"name":"openTrove","outputs":[{"internalType":"uint256","name":"stake","type":"uint256"},{"internalType":"uint256","name":"arrayIndex","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"periodFinish","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"priceFeed","outputs":[{"internalType":"contract IPriceFeed","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_debtAmount","type":"uint256"},{"internalType":"address","name":"_firstRedemptionHint","type":"address"},{"internalType":"address","name":"_upperPartialRedemptionHint","type":"address"},{"internalType":"address","name":"_lowerPartialRedemptionHint","type":"address"},{"internalType":"uint256","name":"_partialRedemptionHintNICR","type":"uint256"},{"internalType":"uint256","name":"_maxIterations","type":"uint256"},{"internalType":"uint256","name":"_maxFeePercentage","type":"uint256"}],"name":"redeemCollateral","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"redemptionFeeFloor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rewardIntegral","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"rewardIntegralFor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rewardRate","outputs":[{"internalType":"uint128","name":"","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"rewardSnapshots","outputs":[{"internalType":"uint256","name":"collateral","type":"uint256"},{"internalType":"uint256","name":"debt","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_priceFeedAddress","type":"address"},{"internalType":"address","name":"_sortedTrovesAddress","type":"address"},{"internalType":"address","name":"_collateralToken","type":"address"}],"name":"setAddresses","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_minuteDecayFactor","type":"uint256"},{"internalType":"uint256","name":"_redemptionFeeFloor","type":"uint256"},{"internalType":"uint256","name":"_maxRedemptionFee","type":"uint256"},{"internalType":"uint256","name":"_borrowingFeeFloor","type":"uint256"},{"internalType":"uint256","name":"_maxBorrowingFee","type":"uint256"},{"internalType":"uint256","name":"_interestRateInBPS","type":"uint256"},{"internalType":"uint256","name":"_maxSystemDebt","type":"uint256"},{"internalType":"uint256","name":"_MCR","type":"uint256"}],"name":"setParameters","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_paused","type":"bool"}],"name":"setPaused","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_priceFeedAddress","type":"address"}],"name":"setPriceFeed","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"sortedTroves","outputs":[{"internalType":"contract ISortedTroves","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"startSunset","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"sunsetting","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"surplusBalances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"systemDeploymentTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalCollateralSnapshot","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalStakes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalStakesSnapshot","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"updateBalances","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_isRecoveryMode","type":"bool"},{"internalType":"bool","name":"_isDebtIncrease","type":"bool"},{"internalType":"uint256","name":"_debtChange","type":"uint256"},{"internalType":"uint256","name":"_netDebtChange","type":"uint256"},{"internalType":"bool","name":"_isCollIncrease","type":"bool"},{"internalType":"uint256","name":"_collChange","type":"uint256"},{"internalType":"address","name":"_upperHint","type":"address"},{"internalType":"address","name":"_lowerHint","type":"address"},{"internalType":"address","name":"_borrower","type":"address"},{"internalType":"address","name":"_receiver","type":"address"}],"name":"updateTroveFromAdjustment","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vault","outputs":[{"internalType":"contract IPrismaVault","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"claimant","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"vaultClaimReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"}]
const stEthTroveManagerAddress = '0x63Cc74334F4b1119276667cf0079AC0c8a96CFb2'

const stEthSortedTrovesABI = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_id","type":"address"},{"indexed":false,"internalType":"uint256","name":"_NICR","type":"uint256"}],"name":"NodeAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_id","type":"address"}],"name":"NodeRemoved","type":"event"},{"inputs":[{"internalType":"address","name":"_id","type":"address"}],"name":"contains","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"data","outputs":[{"internalType":"address","name":"head","type":"address"},{"internalType":"address","name":"tail","type":"address"},{"internalType":"uint256","name":"size","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_NICR","type":"uint256"},{"internalType":"address","name":"_prevId","type":"address"},{"internalType":"address","name":"_nextId","type":"address"}],"name":"findInsertPosition","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getFirst","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLast","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_id","type":"address"}],"name":"getNext","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_id","type":"address"}],"name":"getPrev","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getSize","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_id","type":"address"},{"internalType":"uint256","name":"_NICR","type":"uint256"},{"internalType":"address","name":"_prevId","type":"address"},{"internalType":"address","name":"_nextId","type":"address"}],"name":"insert","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"isEmpty","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_id","type":"address"},{"internalType":"uint256","name":"_newNICR","type":"uint256"},{"internalType":"address","name":"_prevId","type":"address"},{"internalType":"address","name":"_nextId","type":"address"}],"name":"reInsert","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_id","type":"address"}],"name":"remove","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_troveManagerAddress","type":"address"}],"name":"setAddresses","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"troveManager","outputs":[{"internalType":"contract ITroveManager","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_NICR","type":"uint256"},{"internalType":"address","name":"_prevId","type":"address"},{"internalType":"address","name":"_nextId","type":"address"}],"name":"validInsertPosition","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]
const stEthSortedTrovesAddress = '0x9Ac1892f1f87D9a3A135Fb87C425098a9a720a42'

const hintABI = [{"inputs":[{"internalType":"address","name":"_borrowerOperationsAddress","type":"address"},{"internalType":"uint256","name":"_gasCompensation","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"CCR","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DEBT_GAS_COMPENSATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DECIMAL_PRECISION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PERCENT_DIVISOR","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"borrowerOperations","outputs":[{"internalType":"contract IBorrowerOperations","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_coll","type":"uint256"},{"internalType":"uint256","name":"_debt","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"computeCR","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"_coll","type":"uint256"},{"internalType":"uint256","name":"_debt","type":"uint256"}],"name":"computeNominalCR","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"contract ITroveManager","name":"troveManager","type":"address"},{"internalType":"uint256","name":"_CR","type":"uint256"},{"internalType":"uint256","name":"_numTrials","type":"uint256"},{"internalType":"uint256","name":"_inputRandomSeed","type":"uint256"}],"name":"getApproxHint","outputs":[{"internalType":"address","name":"hintAddress","type":"address"},{"internalType":"uint256","name":"diff","type":"uint256"},{"internalType":"uint256","name":"latestRandomSeed","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract ITroveManager","name":"troveManager","type":"address"},{"internalType":"uint256","name":"_debtAmount","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"},{"internalType":"uint256","name":"_maxIterations","type":"uint256"}],"name":"getRedemptionHints","outputs":[{"internalType":"address","name":"firstRedemptionHint","type":"address"},{"internalType":"uint256","name":"partialRedemptionHintNICR","type":"uint256"},{"internalType":"uint256","name":"truncatedDebtAmount","type":"uint256"}],"stateMutability":"view","type":"function"}]
const hintAddress = '0x3C5871D69C8d6503001e1A8f3bF7E5EbE447A9Cd'
describe("test", function(){
    async function deployPrismaManageFixture(){
        const [owner, addr1, addr2] = await ethers.getSigners();
        const HintHelperFactory = await ethers.getContractFactory("HintHelper");
        const HintHelperInstance = await HintHelperFactory.deploy();
        await HintHelperInstance.waitForDeployment();
        const prismaManageFactory = await ethers.getContractFactory("PrismaManage", {
            libraries: {HintHelper: HintHelperInstance}
        });
        const prismaManageInstance = await prismaManageFactory.deploy();
        await prismaManageInstance.waitForDeployment();
        return{prismaManageInstance,HintHelperInstance, owner, addr1, addr2};
    }
    it("open a trove", async()=>{
        const hint = await ethers.getContractAt(hintABI, hintAddress)
        const stEthSortedTroves = await ethers.getContractAt(stEthSortedTrovesABI, stEthSortedTrovesAddress)
        const stEthTroveManager = await ethers.getContractAt(stEthTroveManagerABI, stEthTroveManagerAddress)
        const mkUSD = await ethers.getContractAt(mkUSDABI, mkUSDAddress)
        const BorrowerOperations = await ethers.getContractAt(BorrowerOperationsABI, BorrowerOperationAddress);
        const impersonatedSigner = await ethers.getImpersonatedSigner("0xD28a4c5B3685e5948d8A57f124669eafB69F05Bb");

        const liquidationReserve = await stEthTroveManager.DEBT_GAS_COMPENSATION();
        const expectedFee = await stEthTroveManager.getBorrowingFeeWithDecay(7470000000)

        const expectedDebt = 7470000000+Number(expectedFee)+Number(liquidationReserve)
        const NICR = String(5000000000000000000 * 10**20 / expectedDebt)

        const numberOfTroves = await stEthSortedTroves.getSize();
        const numberOfTrials = Number(numberOfTroves)*15
        const {0: approxHint} = await hint.getApproxHint(stEthTroveManagerAddress, NICR, numberOfTrials, 50)
        const {0: upperHint, 1:lowerHint} = await stEthSortedTroves.findInsertPosition(NICR, approxHint, approxHint)
        const feePercentage = 10015425152739764
        expect(BorrowerOperations.connect(impersonatedSigner).openTrove(
            stEthSortedTrovesAddress,
            impersonatedSigner.getAddress(),
            feePercentage,
            5000000000000000000,
            expectedDebt,
            upperHint,
            lowerHint,
        )).to.changeTokenBalance(mkUSD, impersonatedSigner, 23624420000)
    }).timeout(2000000)
    it("open a trove2", async()=>{
        const {prismaManageInstance, HintHelperInstance} = await loadFixture(deployPrismaManageFixture);
        const mkUSD = await ethers.getContractAt(mkUSDABI, mkUSDAddress)
        const impersonatedSigner = await ethers.getImpersonatedSigner("0xD28a4c5B3685e5948d8A57f124669eafB69F05Bb");
        const expectedDebt = HintHelperInstance.approximateDebtAmount(stEthTroveManagerAddress, 7470000000);
        expect(prismaManageInstance.connect(impersonatedSigner).takeLoan(
            5000000000000000000,
            expectedDebt,
            stEthTroveManagerAddress,
            stEthSortedTrovesAddress,
            impersonatedSigner.getAddress(),
            17,
            10015425152739764
        )).to.changeTokenBalance(mkUSD, impersonatedSigner, 23624420000)
    }).timeout(2000000)
})
