const {expect, assert} = require("chai")
const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const helpers = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const {ethers} = require("hardhat")

const forkingURL = 'https://rpc.mevblocker.io/fullprivacy'
const BorrowerOperationsABI = require('./ABIs/BorrowingOperations.json');
const BorrowerOperationAddress = '0x72c590349535AD52e6953744cb2A36B409542719'
const IERC20ABI = require('./ABIs/IERC20.json')
const stEthTroveManagerAddress = '0xBf6883a03FD2FCfa1B9fc588ad6193b3C3178F8F'
const stEthSortedTrovesABI = require('./ABIs/StEthSortedTroves.json')
const stEthSortedTrovesAddress = '0x9Ac1892f1f87D9a3A135Fb87C425098a9a720a42'
const hintABI = require('./ABIs/Hint.json')
const hintAddress = '0x3C5871D69C8d6503001e1A8f3bF7E5EbE447A9Cd'
const stEthTroveManagerABI = require('./ABIs/StEthTroveManager.json')
const stEthTokenAddress = '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0'
const usdcAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
const mkUSDAddress = '0x4591DBfF62656E7859Afe5e45f6f47D3669fBB28'

function parseUnit(number, power) {
    return number / BigInt(10 ** power);
}

describe("PrismaManageTest for stEth", function () {
    async function deployPrismaManageFixture() {
        const [owner, addr1, addr2] = await ethers.getSigners();
        const HintHelperFactory = await ethers.getContractFactory("HintHelper");
        const HintHelperInstance = await HintHelperFactory.deploy();
        await HintHelperInstance.waitForDeployment();
        const SwapHelperFactory = await ethers.getContractFactory("SwapHelper");
        const SwapHelperInstance = await SwapHelperFactory.deploy();
        await SwapHelperInstance.waitForDeployment();
        const prismaManageFactory = await ethers.getContractFactory("PrismaManage", {
            libraries: {
                HintHelper: HintHelperInstance,
                SwapHelper: SwapHelperInstance
            }
        });
        const prismaManageInstance = await prismaManageFactory.deploy();
        await prismaManageInstance.waitForDeployment();
        return {prismaManageInstance, HintHelperInstance, owner, addr1, addr2};
    }

    it("Should calculate some parameters correctly.", async () => {
        await helpers.reset(forkingURL, 18667678);
        const hint = await ethers.getContractAt(hintABI, hintAddress)
        const stEthSortedTroves = await ethers.getContractAt(stEthSortedTrovesABI, stEthSortedTrovesAddress)
        const stEthTroveManager = await ethers.getContractAt(stEthTroveManagerABI, stEthTroveManagerAddress)
        const mkUSD = await ethers.getContractAt(IERC20ABI, mkUSDAddress)
        const BorrowerOperations = await ethers.getContractAt(BorrowerOperationsABI, BorrowerOperationAddress);
        const impersonatedSigner = await ethers.getImpersonatedSigner("0xD28a4c5B3685e5948d8A57f124669eafB69F05Bb");
        const stEthToken = await ethers.getContractAt(IERC20ABI, stEthTokenAddress);
        const liquidationReserve = await stEthTroveManager.DEBT_GAS_COMPENSATION();
        const expectedFee = await stEthTroveManager.getBorrowingFeeWithDecay(BigInt(7470000000000000000000))
        const expectedDebt = BigInt(expectedFee + liquidationReserve + BigInt(7470000000000000000000))
        const debt = BigInt(7470000000000000000000);
        const NICR = ethers.parseUnits('5', 18 + 20) / expectedDebt
        const numberOfTroves = await stEthSortedTroves.getSize();
        const numberOfTrials = Number(numberOfTroves) * 15
        const {0: approxHint} = await hint.getApproxHint(stEthTroveManagerAddress, NICR, numberOfTrials, 50)
        const {0: upperHint, 1: lowerHint} = await stEthSortedTroves.findInsertPosition(NICR, approxHint, approxHint)
        const feePercentage = BigInt(10015425152739764)
        const collateralAmount = BigInt(5000000000000000000)
        await stEthToken.connect(impersonatedSigner).approve(BorrowerOperationAddress, ethers.parseUnits('5', 18));
        stEthToken.balanceOf(impersonatedSigner.getAddress()).then(result => {
            console.log("stEth balance before: " + parseUnit(result, 18))
        });
        let mkUSDBefore, mkUSDAfter;
        console.log(`mkUSD before: ${parseUnit(mkUSDBefore = await mkUSD.balanceOf(impersonatedSigner.getAddress()),18)}`);
        expect(await BorrowerOperations.connect(impersonatedSigner).openTrove(
            stEthTroveManagerAddress,
            impersonatedSigner.getAddress(),
            feePercentage,
            collateralAmount,
            debt,
            upperHint,
            lowerHint
        )).to.be.ok
        stEthToken.balanceOf(impersonatedSigner.getAddress()).then(result => {
            console.log("stEth balance after: " + parseUnit(result,18))
        });
        console.log(`mkUSD after: ${parseUnit(mkUSDAfter = await mkUSD.balanceOf(impersonatedSigner.getAddress()),18)}`);
        assert(mkUSDAfter - mkUSDBefore >= debt, "Not enough return");
    }).timeout(1200000)

    it("Should open a trove using the takeLoan function and pay it of using the payOff function", async () => {
        await helpers.reset(forkingURL, 18667678);
        const {prismaManageInstance} = await loadFixture(deployPrismaManageFixture);
        const stEthToken = await ethers.getContractAt(IERC20ABI, stEthTokenAddress);
        const mkUSD = await ethers.getContractAt(IERC20ABI, mkUSDAddress)
        const impersonatedSigner = await ethers.getImpersonatedSigner("0xD28a4c5B3685e5948d8A57f124669eafB69F05Bb");
        let mkUSDBeforeTakingLoan, mkUSDAfterTakingLoan;
        let stEthBeforePayingOff, stEthAfterPayingOff;
        let collateralAmount = ethers.parseUnits('4', 18);
        let requiredReceivingAmount = ethers.parseUnits('6000', 18);
        let maxFeePercentage = BigInt(10015425152739764);
        await stEthToken.connect(impersonatedSigner).transfer(prismaManageInstance.getAddress(), ethers.parseUnits('5', 18))
        console.log(`\n***Taking Loan:***\nmkUSD before taking loan: ${mkUSDBeforeTakingLoan = await mkUSD.balanceOf(prismaManageInstance.getAddress())}`);
        await prismaManageInstance.connect(impersonatedSigner).takeLoan(
            collateralAmount,
            requiredReceivingAmount,
            stEthTroveManagerAddress,
            stEthSortedTrovesAddress,
            stEthTokenAddress,
            17, //random seed
            maxFeePercentage
        );
        console.log(`mkUSD after taking loan: ${mkUSDAfterTakingLoan = parseUnit(await mkUSD.balanceOf(prismaManageInstance.getAddress()),18)}`);
        assert(mkUSDAfterTakingLoan - mkUSDBeforeTakingLoan >= ethers.parseUnits('6000', 0), "Not enough return");
        const mkUSDBigHolderSigner = await ethers.getImpersonatedSigner("0x03d03A026E71979BE3b08D44B01eAe4C5FF9da99");
        await mkUSD.connect(mkUSDBigHolderSigner).transfer(prismaManageInstance.getAddress(), ethers.parseUnits('1000', 18));
        console.log(`\n***Paying Off:***\nstEth before paying off: ${stEthBeforePayingOff = parseUnit(await stEthToken.balanceOf(prismaManageInstance.getAddress()), 18)}`);
        await prismaManageInstance.connect(impersonatedSigner).payOff(stEthTroveManagerAddress, mkUSDAfterTakingLoan);
        console.log(`stEth after paying off: ${stEthAfterPayingOff = parseUnit(await stEthToken.balanceOf(prismaManageInstance.getAddress()), 18)}\nstEth difference: ${stEthAfterPayingOff - stEthBeforePayingOff}`);
        assert(stEthAfterPayingOff - stEthBeforePayingOff >= ethers.parseUnits('4', 0), "Not enough return");
    }).timeout(1200000)
    it("Should receive usdc, change it for collateral, take a loan and then paying it off", async () => {
        await helpers.reset(forkingURL, 18782789);
        const {prismaManageInstance, owner} = await deployPrismaManageFixture();
        const stEthTroveManager = await ethers.getContractAt(stEthTroveManagerABI, stEthTroveManagerAddress)
        const mkUSD = await ethers.getContractAt(IERC20ABI, mkUSDAddress);
        const usdc = await ethers.getContractAt(IERC20ABI, usdcAddress);
        const impersonatedSigner = await ethers.getImpersonatedSigner("0x28C6c06298d514Db089934071355E5743bf21d60");
        const sendingUSDCAmount = ethers.parseUnits('1000000', 6);
        const USDCToStETHQuote = '0x4630a0d8ab80a8c3afcf8dd30a1f466c79cf247606d6d90db5c8d5e13523a41de7d5434300000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000ad6371dd7e9923d9968d63eb8b9858c700abd9d00000000000000000000000000000000000000000000001494675481f3a8ba400000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000000c707269736d616d616e6167650000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a30783030303030303030303030303030303030303030303030303030303030303030303030303030303000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000001111111254eeb25477b68fb85ed929f73a9605820000000000000000000000001111111254eeb25477b68fb85ed929f73a960582000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000007f39c581f595b53c5cb19bd0b3f8da6c935e2ca0000000000000000000000000000000000000000000000000000000e8d4a5100000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000076812aa3caf000000000000000000000000e37e799d5077682fa0a244d46e5649f71457bd09000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000007f39c581f595b53c5cb19bd0b3f8da6c935e2ca0000000000000000000000000e37e799d5077682fa0a244d46e5649f71457bd090000000000000000000000001231deb6f5749ef6ce6943a275a1d3e7486f4eae000000000000000000000000000000000000000000000000000000e8d4a5100000000000000000000000000000000000000000000000001494675481f3a8aea2000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005cb0000000000000000000000000000000000000005ad00057f00053500051b00a0c9e75c48000000000000000007030000000000000000000000000000000000000000000000000004ed0001bc00a007e5c0d200000000000000000000000000000000000000000000019800014900002e00a0a87a1ae8c9f93163c99695c6526b799ebca2207fdf7d61ada0b86991c6218b36c1d19d4a2e9eb0ce3606eb4800a0c9e75c48000000000000002805050000000000000000000000000000000000000000000000ed00009e00004f02a0000000000000000000000000000000000000000000000000b4c1aa77f612b0adee63c1e5006ca298d2983ab03aa1da7679389d955a4efee15cdac17f958d2ee523a2206206994597c13d831ec702a0000000000000000000000000000000000000000000000000b4cfa2d5ae9f67b2ee63c1e500c7bbec68d12a0d1830360f8ec58fa599ba1b0e9bdac17f958d2ee523a2206206994597c13d831ec702a0000000000000000000000000000000000000000000000005a64a72eb5cd1d2c8ee63c1e50011b815efb8f581194ae79006d24e0d814b7697f6dac17f958d2ee523a2206206994597c13d831ec702a0000000000000000000000000000000000000000000000006243dea6a421b41feee63c1e500109830a1aaad605bbf02a9dfa7b0b92ec2fb7daac02aaa39b223fe8d0a0e5c4f27ead9083c756cc200a007e5c0d200000000000000000000000000000000030d0002bd0002a30002070001cb00a0c9e75c4800000000000000001d1500000000000000000000000000000000000000000000000000019d00014e00a007e5c0d200000000000000000000000000000000000000000000000000012a0001105100d17b3c9784510e33cd5b87b490e79253bcd81e2ea0b86991c6218b36c1d19d4a2e9eb0ce3606eb48004458d30ac9000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006ec414d9e1e6c13e80000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e37e799d5077682fa0a244d46e5649f71457bd0900000000000000000000000000000000000000000000000000000000658141570020d6bdbf78c02aaa39b223fe8d0a0e5c4f27ead9083c756cc202a00000000000000000000000000000000000000000000000098f1ed7225bb04018ee63c1e50188e6a0c2ddd26feeb64f039a2c41296fcb3f5640a0b86991c6218b36c1d19d4a2e9eb0ce3606eb484101c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200042e1a7d4d00000000000000000000000000000000000000000000000000000000000000004160dc24316b9ae028f1497c275eb9192a3ea0f6702200443df021240000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000107c27034cd1194e3e0020d6bdbf78ae7ab96520de3a18e5e111b5eaab095312d7fe8451207f39c581f595b53c5cb19bd0b3f8da6c935e2ca0ae7ab96520de3a18e5e111b5eaab095312d7fe840004ea598cb000000000000000000000000000000000000000000000000000000000000000000020d6bdbf787f39c581f595b53c5cb19bd0b3f8da6c935e2ca000a0f2fa6b667f39c581f595b53c5cb19bd0b3f8da6c935e2ca0000000000000000000000000000000000000000000000014aee0c62368a987a200000000000000000006c528f32369aa80a06c4eca277f39c581f595b53c5cb19bd0b3f8da6c935e2ca01111111254eeb25477b68fb85ed929f73a9605820000000000000000000000000000000000000000002e9b3012000000000000000000000000000000000000000000000000';
        let mkUsdBeforeTakeLoan, mkUsdAfterTakeLoan, mkUsdBeforePayingOff, mkUsdAfterPayingOff;
        let UsdBeforeTakeLoan, UsdAfterTakeLoan, UsdcBeforePayingOff, UsdcAfterPayingOff;
        console.log(`\n***Taking Loan:***\nmkUSD before taking loan: ${mkUsdBeforeTakeLoan = parseUnit(await mkUSD.balanceOf(impersonatedSigner),18)}`);
        console.log(`usdc before taking loan: ${UsdBeforeTakeLoan = parseUnit(await usdc.balanceOf(impersonatedSigner),6)}`);
        const receivingMkUSDAmount = ethers.parseUnits('800000', 18);
        let maxFeePercentage = ethers.parseUnits('0.01', 18);
        await usdc.connect(impersonatedSigner).approve(prismaManageInstance.getAddress(), sendingUSDCAmount);
        expect(await prismaManageInstance.connect(impersonatedSigner).deposit(
            usdcAddress,
            stEthTroveManagerAddress,
            stEthSortedTrovesAddress,
            stEthTokenAddress,
            sendingUSDCAmount,
            receivingMkUSDAmount,
            17, //random seed number
            maxFeePercentage,
            '0x' + USDCToStETHQuote.slice(10)
        )).to.changeTokenBalance(mkUSD, impersonatedSigner, receivingMkUSDAmount)
        console.log(`mkUSD after taking loan: ${mkUsdAfterTakeLoan = parseUnit(await mkUSD.balanceOf(impersonatedSigner),18)}`);
        console.log(`usdc after taking loan: ${UsdAfterTakeLoan = parseUnit(await usdc.balanceOf(impersonatedSigner),6)}`);
        console.log(`usdc difference: ${UsdAfterTakeLoan - UsdBeforeTakeLoan}\nmkUsd difference: ${mkUsdAfterTakeLoan - mkUsdBeforeTakeLoan}`)
        const trove = await stEthTroveManager.Troves(prismaManageInstance.getAddress());
        const mkUSDBigHolderSigner = await ethers.getImpersonatedSigner("0x03d03A026E71979BE3b08D44B01eAe4C5FF9da99");
        await owner.sendTransaction({
            value: ethers.parseEther('10'),
            to: mkUSDBigHolderSigner.address
        })
        await mkUSD.connect(mkUSDBigHolderSigner).transfer(impersonatedSigner.getAddress(), ethers.parseUnits('10000', 18));
        await mkUSD.connect(impersonatedSigner).approve(prismaManageInstance, trove[0]);
        console.log(`\n***Paying Off:***\nmkUSD before paying off the loan: ${mkUsdBeforePayingOff = parseUnit(await mkUSD.balanceOf(impersonatedSigner),18)}`);
        console.log(`usdc before paying off the loan: ${UsdcBeforePayingOff = parseUnit(await usdc.balanceOf(impersonatedSigner),6)}`);
        const StEthToUSDCQuote = '0x4630a0d8526ebf39196bc7bbb93f42ce2d7d63ee3cb614576dd1adbc3a63b6089c666e2200000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000ad6371dd7e9923d9968d63eb8b9858c700abd9d000000000000000000000000000000000000000000000000000000e70ca470040000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000000c707269736d616d616e6167650000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a30783030303030303030303030303030303030303030303030303030303030303030303030303030303000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000001111111254eeb25477b68fb85ed929f73a9605820000000000000000000000001111111254eeb25477b68fb85ed929f73a9605820000000000000000000000007f39c581f595b53c5cb19bd0b3f8da6c935e2ca0000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000000014accc51e31b4fdda800000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000062812aa3caf000000000000000000000000e37e799d5077682fa0a244d46e5649f71457bd090000000000000000000000007f39c581f595b53c5cb19bd0b3f8da6c935e2ca0000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000e37e799d5077682fa0a244d46e5649f71457bd090000000000000000000000001231deb6f5749ef6ce6943a275a1d3e7486f4eae000000000000000000000000000000000000000000000014accc51e31b4fdda8000000000000000000000000000000000000000000000000000000e70ca47449000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004820000000000000000000000000000000000000004640004360003ec0003d200a0c9e75c48000000000000000008020000000000000000000000000000000000000000000000000003a40001a400a007e5c0d20000000000000000000000000000000000000000000000000001800000d0512237417b2238aa52d0dd2d6252d989e728e8f706e47f39c581f595b53c5cb19bd0b3f8da6c935e2ca00044a64833a00000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e37e799d5077682fa0a244d46e5649f71457bd0951204dece678ceceb27446b35c672dc7d61f30bad69ef939e0a03fb07f59a73314e73794be0e57ac1b4e00443df021240000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002dfc5f5ea100a007e5c0d20000000000000000000000000000000000000000000000000001dc00004f00a0fbb7cd060093d199263632a4ef4bb438f1feb99e57b4b5f0bd0000000000000000000005c27f39c581f595b53c5cb19bd0b3f8da6c935e2ca0c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200a0c9e75c4800000000000000001f1300000000000000000000000000000000000000000000000000015f00004f02a000000000000000000000000000000000000000000000000000000045dda52df0ee63c1e50088e6a0c2ddd26feeb64f039a2c41296fcb3f5640c02aaa39b223fe8d0a0e5c4f27ead9083c756cc25120d17b3c9784510e33cd5b87b490e79253bcd81e2ec02aaa39b223fe8d0a0e5c4f27ead9083c756cc2004458d30ac9000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000072096530740000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e37e799d5077682fa0a244d46e5649f71457bd0900000000000000000000000000000000000000000000000000000000658143090020d6bdbf78a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4800a0f2fa6b66a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000000000000000e835df2b8b000000000000000000000000004be35080a06c4eca27a0b86991c6218b36c1d19d4a2e9eb0ce3606eb481111111254eeb25477b68fb85ed929f73a9605820000000000000000000000000000000000000000000000000000000000002e9b3012000000000000000000000000000000000000000000000000'
        expect(await prismaManageInstance.connect(impersonatedSigner).withdraw(stEthTroveManagerAddress,
                                                                                stEthTokenAddress, trove[0], '0x' +
                                                                                StEthToUSDCQuote.slice(10))).to.
                                                                                changeTokenBalance(usdc, impersonatedSigner, 997336230795);
        console.log(`mkUSD after paying off the loan: ${mkUsdAfterPayingOff = parseUnit(await mkUSD.balanceOf(impersonatedSigner),18)}`);
        console.log(`usdc after paying off the loan: ${UsdcAfterPayingOff = parseUnit(await usdc.balanceOf(impersonatedSigner),6)}`);
        console.log(`usdc difference: ${(UsdcAfterPayingOff - UsdcBeforePayingOff)}\nmkUsd difference:  ${mkUsdAfterPayingOff - mkUsdBeforePayingOff}`)
    }).timeout(1200000)
})
