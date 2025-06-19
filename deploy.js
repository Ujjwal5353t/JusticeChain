require("dotenv").config();

async function main() {
    const JusticeChain = await ethers.getContractFactory("JusticeChain");
    const justiceChain = await JusticeChain.deploy();

    await justiceChain.deployed();

    console.log("JusticeChain deployed to:", justiceChain.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
