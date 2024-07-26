import SimpleNFT from 0xf8d6e0586b0a20c7
import NonFungibleToken from 0xf8d6e0586b0a20c7

transaction(recipient: Address, metadata: String) {
    // Reference to the NFT minter
    let minter: &SimpleNFT.NFTMinter

    // Reference to the recipient's collection
    let recipientCollection: &{NonFungibleToken.CollectionPublic}

    prepare(signer: AuthAccount) {
        // Borrow the minter reference from the signer's storage
        self.minter = signer.borrow<&SimpleNFT.NFTMinter>(from: SimpleNFT.MinterStoragePath)
            ?? panic("Could not borrow reference to the NFT minter")

        // Get the recipient's public account address
        let recipientAccount = getAccount(recipient)

        // Borrow the recipient's collection public capability
        self.recipientCollection = recipientAccount.getCapability(SimpleNFT.CollectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not borrow reference to the recipient's collection")
    }

    execute {
        // Mint the NFT and deposit it into the recipient's collection
        self.minter.mintNFT(recipient: self.recipientCollection, metadata: metadata)
    }
}
