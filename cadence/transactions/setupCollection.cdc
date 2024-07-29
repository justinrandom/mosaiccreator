import MosaicCreatorV1 from 0xdbf7a2a1821c9ffa

transaction {
    prepare(signer: AuthAccount) {
        // Check if the account already has a collection
        if signer.borrow<&MosaicCreatorV1.Collection>(from: /storage/MosaicCollectionV1) == nil {
            // Create a new empty collection
            let collection <- MosaicCreatorV1.createEmptyCollection()
            
            // Save the collection to the account's storage
            signer.save(<-collection, to: /storage/MosaicCollectionV1)
            
            // Link the collection to the public path
            signer.link<&{MosaicCreatorV1.MosaicCollectionPublic}>(
                /public/MosaicCollectionV1,
                target: /storage/MosaicCollectionV1
            )
        }
    }

    execute {
    
    }
}
