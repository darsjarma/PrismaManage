const {ethers} = require("hardhat")

async function main(){
    const HintHelperFactory = await ethers.getContractFactory("HintHelper");
    const HintHelperInstance = await HintHelperFactory.deploy();
    await HintHelperInstance.waitForDeployment();
    const SwapHelperFactory = await ethers.getContractFactory("SwapHelper");
    const SwapHelperInstance = await SwapHelperFactory.deploy();
    await SwapHelperInstance.waitForDeployment();
    const prismaManageContractFactory = await ethers.getContractFactory("PrismaManage", {
        libraries: {
            HintHelper: HintHelperInstance,
            SwapHelper: SwapHelperInstance
        }
    });
    const prismaManageInstance = await prismaManageContractFactory.deploy()
    console.log(`
    Deployed prismaManage on: ${await prismaManageInstance.getAddress()}
    Deployed HintHelper on  : ${await HintHelperInstance.getAddress()}
    Deployed SwapHelper on  : ${await SwapHelperInstance.getAddress()}`)
}

main().then(()=>process.exit(0)).catch((error)=>{console.error(error);process.exit(0)})