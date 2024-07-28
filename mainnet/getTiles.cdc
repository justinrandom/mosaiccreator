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

pub fun main(account: Address): [{UInt64: NFTDetails}] {
    let acct = getAccount(account)
    let collectionRef = acct.getCapability(/public/MosaicCollectionV1).borrow<&{MosaicCreatorV1.MosaicCollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")

    let nftIDs = collectionRef.getIDs()
    var results: [{UInt64: NFTDetails}] = []

    for id in nftIDs {
        let nftRef = collectionRef.borrowTile(id: id) ?? panic("Could not borrow a reference to the NFT")
        let nftData = MosaicCreatorV1.nftToData[id] ?? panic("Could not find NFT data")

        let details = NFTDetails(
            id: id,
            description: nftData.description,
            ownerAddress: nftData.ownerAddress,
            collectionPath: nftData.collectionPath,
            collectionCapabilityPath: nftData.collectionCapabilityPath
        )

        results.append({id: details})
    }

    return results
}
