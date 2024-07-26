import MosaicCreator from "MosaicCreator"

transaction(description: String, collectionPath: String, collectionCapabilityPath: String) {
    let admin: &MosaicCreator.Admin
    let recipient: &{MosaicCreator.MosaicCollectionPublic}
    let ownerAddress: Address

    prepare(signer: AuthAccount) {
        // Borrow a reference to the Admin resource in storage
        self.admin = signer.borrow<&MosaicCreator.Admin>(from: /storage/MosaicAdmin)
            ?? panic("Could not borrow a reference to the Admin resource")

        // Get the public account object for the signer
        self.recipient = signer
            .getCapability(/public/MosaicCollection)
            .borrow<&{MosaicCreator.MosaicCollectionPublic}>()
            ?? panic("Could not borrow a reference to the recipient's collection")

        // Get the owner's address
        self.ownerAddress = signer.address
    }

    execute {
        // Mint a new NFT and deposit it into the recipient's collection
        self.admin.mintNFT(
            description: description,
            recipient: self.recipient,
            ownerAddress: self.ownerAddress,
            collectionPath: collectionPath,
            collectionCapabilityPath: collectionCapabilityPath
        )
    }
}
