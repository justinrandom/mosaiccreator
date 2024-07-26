import NonFungibleToken from 0xf8d6e0586b0a20c7
import MosaicCreator from 0xf8d6e0586b0a20c7

transaction(nftID: UInt64, newOwnerAddress: Address, newCollectionPath: String, newCollectionCapabilityPath: String) {

    let nftRef: &MosaicCreator.NFT

    prepare(signer: AuthAccount) {
        // Borrow a reference to the NFT collection in the signer's account
        let collection = signer.borrow<&MosaicCreator.Collection>(from: /storage/MosaicCollection)
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
