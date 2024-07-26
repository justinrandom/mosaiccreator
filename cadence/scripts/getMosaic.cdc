import MosaicCreator from "MosaicCreator"

pub fun main(mosaicID: UInt32): {String: AnyStruct} {
    return MosaicCreator.getMosaicDetails(mosaicID: mosaicID)
}
