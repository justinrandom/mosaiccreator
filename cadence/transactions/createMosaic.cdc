import MosaicCreator from "MosaicCreator"

transaction(name: String, size: UInt64) {
    let admin: &MosaicCreator.Admin

    prepare(signer: AuthAccount) {
        // Borrow a reference to the Admin resource in storage
        self.admin = signer.borrow<&MosaicCreator.Admin>(from: /storage/MosaicAdmin)
            ?? panic("Could not borrow a reference to the Admin resource")
    }

    execute {
        // Create a new Mosaic
        let mosaicID = self.admin.createMosaic(collection: name, size: size)
    }
}
