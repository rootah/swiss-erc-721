const hre = require("hardhat");
const { encryptDataField } = require("@swisstronik/utils");

const sendShieldedTransaction = async (signer, destination, data) => {
  const rpclink = hre.network.config.url;
  const [encryptedData] = await encryptDataField(rpclink, data);
  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value: 0,
  });
};

async function main() {
  const contractAddress = "0xe6d3fEC898d996Fc5DDEe6f3DD3966eA5beA0014";
  const [signer] = await hre.ethers.getSigners();

  console.log("Signer address:", signer.address);

  const RTH721 = await hre.ethers.getContractFactory("RTH721");
  const contract = RTH721.attach(contractAddress);

  // Выполняем минтинг
  console.log("Minting a new token...");
  try {
    const mintData = contract.interface.encodeFunctionData("mint", [signer.address]);
    const mintTx = await sendShieldedTransaction(signer, contractAddress, mintData);
    await mintTx.wait();
    console.log("Token minted successfully. Transaction hash:", mintTx.hash);
  } catch (error) {
    console.error("Error during minting:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });