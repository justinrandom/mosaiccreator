import MosaicCreatorV1 from "MosaicCreatorV1"

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
    // Get the NFT details from the global mapping
    let nftData = MosaicCreatorV1.nftToData[nftID] ?? panic("Could not find NFT data")

    return NFTDetails(
        id: nftID,
        description: nftData.description,
        ownerAddress: nftData.ownerAddress,
        collectionPath: nftData.collectionPath,
        collectionCapabilityPath: nftData.collectionCapabilityPath
    )
}
