import NonFungibleToken from 0xf8d6e0586b0a20c7
import MosaicCreator from 0xf8d6e0586b0a20c7

transaction(nftID: UInt64, newDescription: String) {

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
        // Update the description field of the NFT
        self.nftRef.updateDescription(newDescription: newDescription)
    }
}
