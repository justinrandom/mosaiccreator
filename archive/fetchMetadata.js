import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

export const fetchMetadata = async (nftID) => {
  const response = await fcl
    .send([
      fcl.script`
      import MosaicCreatorV1 from 0xMosaicCreatorV1

      pub struct NFTDetails {
        pub let description: String
        pub let ownerAddress: Address
        pub let collectionPath: String
        pub let collectionCapabilityPath: String

        init(
          description: String,
          ownerAddress: Address,
          collectionPath: String,
          collectionCapabilityPath: String
        ) {
          self.description = description
          self.ownerAddress = ownerAddress
          self.collectionPath = collectionPath
          self.collectionCapabilityPath = collectionCapabilityPath
        }
      }

      pub fun main(nftID: UInt64): NFTDetails? {
        let nftData = MosaicCreatorV1.nftToData[nftID]
        
        if let data = nftData {
          return NFTDetails(
            description: data.description,
            ownerAddress: data.ownerAddress,
            collectionPath: data.collectionPath,
            collectionCapabilityPath: data.collectionCapabilityPath
          )
        } else {
          return nil
        }
      }
    `,
      fcl.args([fcl.arg(String(nftID), t.UInt64)]),
    ])
    .then(fcl.decode);

  return response;
};
