import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

export const updateMetadata = async (
  nftID,
  newOwnerAddress,
  newCollectionPath,
  newCollectionCapabilityPath
) => {
  const transactionId = await fcl
    .send([
      fcl.transaction`
      import MosaicCreatorV1 from 0xdbf7a2a1821c9ffa

      transaction(nftID: UInt64, newOwnerAddress: Address, newCollectionPath: String, newCollectionCapabilityPath: String) {
        let collectionRef: &MosaicCreatorV1.NFT

        prepare(signer: AuthAccount) {
          let collection = signer.borrow<&MosaicCreatorV1.Collection>(from: /storage/MosaicCollectionV1)
            ?? panic("Could not borrow reference to the NFT collection")
          self.collectionRef = collection.borrowTile(id: nftID)
            ?? panic("Could not borrow reference to the NFT")
        }

        execute {
          self.collectionRef.updateMetadata(
            newOwnerAddress: newOwnerAddress,
            newCollectionPath: newCollectionPath,
            newCollectionCapabilityPath: newCollectionCapabilityPath
          )
        }
      }
    `,
      fcl.args([
        fcl.arg(nftID, t.UInt64),
        fcl.arg(newOwnerAddress, t.Address),
        fcl.arg(newCollectionPath, t.String),
        fcl.arg(newCollectionCapabilityPath, t.String),
      ]),
      fcl.payer(fcl.authz),
      fcl.proposer(fcl.authz),
      fcl.authorizations([fcl.authz]),
      fcl.limit(100),
    ])
    .then(fcl.decode);

  console.log("Transaction Id", transactionId);
};
