import MosaicCreatorV1 from 0xdbf7a2a1821c9ffa

transaction(tileID: UInt64, recipientAddress: Address) {
    let senderCollection: &MosaicCreatorV1.Collection
    let recipientCollection: &{MosaicCreatorV1.MosaicCollectionPublic}

    prepare(signer: AuthAccount) {
        // Borrow a reference to the sender's collection
        self.senderCollection = signer.borrow<&MosaicCreatorV1.Collection>(from: /storage/MosaicCollectionV1)
            ?? panic("Could not borrow a reference to the sender's collection")

        // Borrow a reference to the recipient's collection
        self.recipientCollection = getAccount(recipientAddress)
            .getCapability(/public/MosaicCollectionV1)
            .borrow<&{MosaicCreatorV1.MosaicCollectionPublic}>()
            ?? panic("Could not borrow a reference to the recipient's collection")
    }

    execute {
        // Withdraw the NFT from the sender's collection
        let tile <- self.senderCollection.withdraw(withdrawID: tileID)

        // Deposit the NFT into the recipient's collection
        self.recipientCollection.deposit(token: <-tile)
    }
}
