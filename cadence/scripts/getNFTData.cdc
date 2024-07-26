import MosaicCreator from 0xf8d6e0586b0a20c7

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
    let nftData = MosaicCreator.nftToData[nftID]
    
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
