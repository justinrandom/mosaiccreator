import NonFungibleToken from 0x1d7e57aa55817448
import MosaicCreatorV1 from 0xdbf7a2a1821c9ffa

transaction(nftID: UInt64, newOwnerAddress: Address, newCollectionPath: String, newCollectionCapabilityPath: String) {

    let nftRef: &MosaicCreatorV1.NFT

    prepare(signer: AuthAccount) {
        // Borrow a reference to the NFT collection in the signer's account
        let collection = signer.borrow<&MosaicCreatorV1.Collection>(from: /storage/MosaicCollectionV1)
            ?? panic("Could not borrow reference to the NFT collection")

        // Borrow a reference to the NFT itself
        self.nftRef = collection.borrowTile(id: nftID)
            ?? panic("Could not borrow reference to the NFT")
    }

    execute {
        // Update the metadata fields of the NFT
        self.nftRef.updateMetadata(
            newOwnerAddress: newOwnerAddress,
            newCollectionPath: newCollectionPath,
            newCollectionCapabilityPath: newCollectionCapabilityPath
        )
    }
}
