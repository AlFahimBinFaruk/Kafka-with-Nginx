// scripts/populate.js
const { ethers } = require("hardhat");

async function main() {
  const [signer] = await ethers.getSigners();

  // Replace this with your deployed contract address:
  const registryAddress = "0x6e73B37Eaea71C0D378E181Be69e64a0761FDDA9";
  const Registry = await ethers.getContractFactory("SimpleRegistry");
  const registry = Registry.attach(registryAddress).connect(signer);

  console.log("Starting to populate contract events...");

  // 1. Create 14 entries
  const totalRegistrations = 14;
  for (let i = 3; i <= totalRegistrations; i++) {
    const tx = await registry.register(`metadata-${i}`);
    await tx.wait();
    console.log(`Registered entry #${i}`);
  }

  // 2. Update one of the entries (e.g., id = 7)
  const updateId = 7;
  const txUpdate = await registry.update(updateId, "metadata-updated-7");
  await txUpdate.wait();
  console.log(`Updated entry #${updateId}`);

  // Total events: 14 Registered + 1 Updated = 15 events
  console.log(`✅ Done: ${totalRegistrations + 1} events emitted`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error running populate script:", err);
    process.exit(1);
  });
