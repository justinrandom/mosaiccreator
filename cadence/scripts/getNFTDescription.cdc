import MosaicCreator from 0xf8d6e0586b0a20c7

pub fun main(nftID: UInt64): String? {
    return MosaicCreator.nftToDescription[nftID]
}
