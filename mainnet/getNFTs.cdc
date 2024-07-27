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
