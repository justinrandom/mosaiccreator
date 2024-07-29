import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

export const mintAndTransferNFT = async (
  description,
  collectionPath,
  collectionCapabilityPath
) => {
  const transactionId = await fcl
    .send([
      fcl.transaction`
      import MosaicCreatorV1 from 0xMosaicCreatorV1

      transaction(description: String, collectionPath: String, collectionCapabilityPath: String) {
        let admin: &MosaicCreatorV1.Admin
        let recipient: &{MosaicCreatorV1.MosaicCollectionPublic}
        let ownerAddress: Address

        prepare(signer: AuthAccount) {
          // Borrow a reference to the Admin resource in storage
          self.admin = signer.borrow<&MosaicCreatorV1.Admin>(from: /storage/MosaicAdminV1)
            ?? panic("Could not borrow a reference to the Admin resource")

          // Use the signer's address as the owner address
          self.ownerAddress = signer.address

          // Get the public account object for the signer
          self.recipient = signer
            .getCapability(/public/MosaicCollectionV1)
            .borrow<&{MosaicCreatorV1.MosaicCollectionPublic}>()
            ?? panic("Could not borrow a reference to the recipient's collection")
        }

        execute {
          // Mint a new NFT and deposit it into the recipient's collection
          self.admin.mintNFT(
            description: description,
            recipient: self.recipient,
            ownerAddress: self.ownerAddress,
            collectionPath: collectionPath,
            collectionCapabilityPath: collectionCapabilityPath
          )
        }
      }
    `,
      fcl.args([
        fcl.arg(description, t.String),
        fcl.arg(collectionPath, t.String),
        fcl.arg(collectionCapabilityPath, t.String),
      ]),
      fcl.payer(fcl.authz),
      fcl.proposer(fcl.authz),
      fcl.authorizations([fcl.authz]),
      fcl.limit(100),
    ])
    .then(fcl.decode);

  console.log("Transaction Id", transactionId);
  return transactionId;
};
