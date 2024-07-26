import MosaicCreator from "MosaicCreator"

transaction(mosaicID: UInt32, nftID: UInt64) {
    prepare(signer: AuthAccount) {
        // Borrow a reference to the Admin resource
        let adminRef = signer.borrow<&MosaicCreator.Admin>(from: /storage/MosaicAdmin)
            ?? panic("Could not borrow a reference to the Admin resource")

        // Call the addTile function
        adminRef.addTile(mosaicID: mosaicID, nftID: nftID)
    }

    execute {
        
    }
}