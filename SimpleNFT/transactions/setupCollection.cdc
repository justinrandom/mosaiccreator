import SimpleNFT from 0xf8d6e0586b0a20c7
import NonFungibleToken from 0xf8d6e0586b0a20c7

transaction {
    prepare(signer: AuthAccount) {
        // Check if the account already has a collection
        if signer.borrow<&SimpleNFT.Collection>(from: SimpleNFT.CollectionStoragePath) == nil {
            // Create a new NFT collection
            let collection <- SimpleNFT.createEmptyCollection()

            // Save the collection to the account's storage
            signer.save(<-collection, to: SimpleNFT.CollectionStoragePath)

            // Create a public capability for the collection
            signer.link<&SimpleNFT.Collection{NonFungibleToken.CollectionPublic, SimpleNFT.SimpleNFTCollectionPublic}>(
                SimpleNFT.CollectionPublicPath,
                target: SimpleNFT.CollectionStoragePath
            )
        }
    }

    execute {
        // This transaction does not need an execute block since all actions are performed in the prepare block
    }
}