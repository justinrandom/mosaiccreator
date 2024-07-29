import MosaicCreatorV1 from 0xdbf7a2a1821c9ffa

transaction(numberOfNFTs: Int) {
    let admin: &MosaicCreatorV1.Admin
    let recipient: &{MosaicCreatorV1.MosaicCollectionPublic}
    let ownerAddress: Address

    prepare(signer: AuthAccount) {
        // Borrow a reference to the Admin resource in storage
        self.admin = signer.borrow<&MosaicCreatorV1.Admin>(from: /storage/MosaicAdminV1)
            ?? panic("Could not borrow a reference to the Admin resource")

        // Get the public account object for the signer
        self.recipient = signer
            .getCapability(/public/MosaicCollectionV1)
            .borrow<&{MosaicCreatorV1.MosaicCollectionPublic}>()
            ?? panic("Could not borrow a reference to the recipient's collection")

        // Get the owner's address
        self.ownerAddress = signer.address
    }

    execute {
        let description = "This is a tile associated with the first Mosaic."
        let collectionPath = "NBA Top Shot"
        let collectionCapabilityPath = "N/A"
        
        var i = 0
        while i < numberOfNFTs {
            self.admin.mintNFT(
                description: description,
                recipient: self.recipient,
                ownerAddress: self.ownerAddress,
                collectionPath: collectionPath,
                collectionCapabilityPath: collectionCapabilityPath
            )
            i = i + 1
        }
    }
}
