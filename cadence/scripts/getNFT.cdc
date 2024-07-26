import MosaicCreator from "MosaicCreator"

pub struct NFTDetails {
    pub let id: UInt64
    pub let collection: String

    init(id: UInt64, collection: String) {
        self.id = id
        self.collection = collection
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

    let id = nftRef.id
    let collection = nftRef.data.collection

    return NFTDetails(
        id: id,
        collection: collection
    )
}