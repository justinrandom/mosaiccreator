import MosaicCreator from "MosaicCreator"

pub fun main(mosaicID: UInt32): [UInt64]? {
    // Borrow a reference to the public dictionary
    let mosaicNFTMapping = MosaicCreator.mosaicNFTMapping

    // Return the list of NFT IDs for the given mosaicID
    return mosaicNFTMapping[mosaicID]
}