import * as fcl from "@onflow/fcl";

export async function getSingleNFTDetail(nftID) {
  const script = `
    import MosaicCreatorV1 from 0xdbf7a2a1821c9ffa

    pub struct NFTDetails {
        pub let id: UInt64
        pub let description: String
        pub let ownerAddress: Address
        pub let collectionPath: String
        pub let collectionCapabilityPath: String

        init(
            id: UInt64,
            description: String,
            ownerAddress: Address,
            collectionPath: String,
            collectionCapabilityPath: String
        ) {
            self.id = id
            self.description = description
            self.ownerAddress = ownerAddress
            self.collectionPath = collectionPath
            self.collectionCapabilityPath = collectionCapabilityPath
        }
    }

    pub fun main(nftID: UInt64): NFTDetails {
        let nftData = MosaicCreatorV1.nftToData[nftID] ?? panic("Could not find NFT data")

        return NFTDetails(
            id: nftID,
            description: nftData.description,
            ownerAddress: nftData.ownerAddress,
            collectionPath: nftData.collectionPath,
            collectionCapabilityPath: nftData.collectionCapabilityPath
        )
    }
  `;

  const response = await fcl
    .send([
      fcl.script(script),
      fcl.args([fcl.arg(nftID.toString(), fcl.t.UInt64)]),
    ])
    .then(fcl.decode);

  return response;
}

export async function getBatchNFTDetails(nftIDs) {
  const script = `
    import MosaicCreatorV1 from 0xdbf7a2a1821c9ffa

    pub struct NFTDetails {
        pub let id: UInt64
        pub let description: String
        pub let ownerAddress: Address
        pub let collectionPath: String
        pub let collectionCapabilityPath: String

        init(
            id: UInt64,
            description: String,
            ownerAddress: Address,
            collectionPath: String,
            collectionCapabilityPath: String
        ) {
            self.id = id
            self.description = description
            self.ownerAddress = ownerAddress
            self.collectionPath = collectionPath
            self.collectionCapabilityPath = collectionCapabilityPath
        }
    }

    pub fun main(nftIDs: [UInt64]): {UInt64: NFTDetails} {
        let results: {UInt64: NFTDetails} = {}

        for id in nftIDs {
            if let nftData = MosaicCreatorV1.nftToData[id] {
                let details = NFTDetails(
                    id: id,
                    description: nftData.description,
                    ownerAddress: nftData.ownerAddress,
                    collectionPath: nftData.collectionPath,
                    collectionCapabilityPath: nftData.collectionCapabilityPath
                )

                results[id] = details
            } else {
                // Handle missing NFT data by creating a default NFTDetails
                let defaultDetails = NFTDetails(
                    id: id,
                    description: "N/A",
                    ownerAddress: 0x0,
                    collectionPath: "N/A",
                    collectionCapabilityPath: "N/A"
                )

                results[id] = defaultDetails
            }
        }

        return results
    }
  `;

  const response = await fcl
    .send([
      fcl.script(script),
      fcl.args([fcl.arg(nftIDs.map(String), fcl.t.Array(fcl.t.UInt64))]),
    ])
    .then(fcl.decode);

  return response;
}

export async function getMosaicDetails(mosaicID) {
  const script = `
    import MosaicCreatorV1 from 0xdbf7a2a1821c9ffa

    pub struct MosaicDetails {
        pub let mosaicID: UInt32
        pub let collection: String
        pub let size: UInt64
        pub let locked: Bool

        init(mosaicID: UInt32, collection: String, size: UInt64, locked: Bool) {
            self.mosaicID = mosaicID
            self.collection = collection
            self.size = size
            self.locked = locked
        }
    }

    pub fun main(mosaicID: UInt32): MosaicDetails {
        let mosaic = MosaicCreatorV1.borrowMosaicPublic(mosaicID: mosaicID)
            ?? panic("Mosaic with the specified ID does not exist")
        
        return MosaicDetails(
            mosaicID: mosaic.mosaicID,
            collection: mosaic.collection,
            size: mosaic.size,
            locked: mosaic.locked
        )
    }
  `;

  const response = await fcl
    .send([
      fcl.script(script),
      fcl.args([fcl.arg(mosaicID.toString(), fcl.t.UInt32)]),
    ])
    .then(fcl.decode);

  return response;
}
