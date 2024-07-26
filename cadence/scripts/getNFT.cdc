import MosaicCreator from "MosaicCreator"

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

pub fun main(account: Address, nftID: UInt64): NFTDetails {
    // Get the account's public collection capability
    let collectionRef = getAccount(account).getCapability(/public/MosaicCollection).borrow<&{MosaicCreator.MosaicCollectionPublic}>()
        ?? panic("Could not borrow a reference to the collection")

    // Debug statement to confirm collectionRef is not nil
    log("Successfully borrowed collection reference")

    // Borrow a reference to the NFT using borrowTile and safely unwrap it
    let nftRef = collectionRef.borrowTile(id: nftID) ?? panic("Could not borrow a reference to the NFT")

    // Debug statement to confirm nftRef is not nil
    log("Successfully borrowed NFT reference")

    // Get the NFT details from the global mapping
    let nftData = MosaicCreator.nftToData[nftID] ?? panic("Could not find NFT data")

    return NFTDetails(
        id: nftID,
        description: nftData.description,
        ownerAddress: nftData.ownerAddress,
        collectionPath: nftData.collectionPath,
        collectionCapabilityPath: nftData.collectionCapabilityPath
    )
}
