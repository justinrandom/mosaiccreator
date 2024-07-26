import FungibleToken from 0xee82856bf20e2aa6
import NonFungibleToken from 0xf8d6e0586b0a20c7

pub contract MosaicCreator: NonFungibleToken {
    pub event ContractInitialized()
    pub event NFTAddedToMosaic(mosaicID: UInt32, nftID: UInt64)
    pub event MosaicCreated(mosaicID: UInt32)
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)
    pub event MomentDestroyed(id: UInt64)

    access(self) var mosaics: @{UInt32: Mosaic}
    access(self) var mosaicNFTMapping: {UInt32: [UInt64]}
    pub var nextMosaicID: UInt32
    pub var totalSupply: UInt64

    pub resource NFT: NonFungibleToken.INFT {
        pub let id: UInt64
        pub let metadata: {String: String}

        init(metadata: {String: String}) {
            pre { metadata.length != 0: "New NFT metadata cannot be empty" }
            self.id = MosaicCreator.totalSupply + 1
            self.metadata = metadata
            MosaicCreator.totalSupply = self.id
        }

        destroy() {
            emit MomentDestroyed(id: self.id)
        }
    }

    pub resource Mosaic {
        pub let mosaicID: UInt32
        pub let collection: String
        pub let size: UInt64
        access(contract) var nfts: @{UInt64: NFT}
        pub var locked: Bool

        init(collection: String, size: UInt64) {
            self.mosaicID = MosaicCreator.nextMosaicID
            self.collection = collection
            self.size = size
            self.nfts <- {}
            self.locked = false
            MosaicCreator.mosaicNFTMapping[self.mosaicID] = []
        }

        pub fun addNFT(metadata: {String: String}) {
            pre {
                !self.locked: "Cannot add the NFT to the Mosaic after the mosaic has been locked."
            }
            let newNFT <- create MosaicCreator.NFT(metadata: metadata)
            let nftID = newNFT.id
            self.nfts[nftID] <-! newNFT
            MosaicCreator.mosaicNFTMapping[self.mosaicID]!.append(nftID)
            emit NFTAddedToMosaic(mosaicID: self.mosaicID, nftID: nftID)
        }

        pub fun lock() {
            self.locked = true
        }

        pub fun getNFTs(): [UInt64] {
            return MosaicCreator.mosaicNFTMapping[self.mosaicID]!
        }

        destroy() {
            destroy self.nfts
        }
    }

    pub resource Admin {
        pub fun createMosaic(collection: String, size: UInt64): UInt32 {
            var newMosaic <- create Mosaic(collection: collection, size: size)
            MosaicCreator.nextMosaicID = MosaicCreator.nextMosaicID + 1
            let newID = newMosaic.mosaicID
            MosaicCreator.mosaics[newID] <-! newMosaic
            emit MosaicCreated(mosaicID: newID)
            return newID
        }

        pub fun borrowMosaic(mosaicID: UInt32): &Mosaic {
            pre { MosaicCreator.mosaics[mosaicID] != nil: "Cannot borrow Mosaic: The Mosaic doesn't exist" }
            return (&MosaicCreator.mosaics[mosaicID] as &Mosaic?)!
        }
    }

    pub resource interface CollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
    }

    pub resource Collection: CollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init() {
            self.ownedNFTs <- {}
        }

        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID)
                ?? panic("Cannot withdraw: NFT does not exist in the collection")
            emit Withdraw(id: token.id, from: self.owner?.address)
            return <-token
        }

        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @MosaicCreator.NFT
            let id = token.id
            let oldToken <- self.ownedNFTs[id] <- token
            if self.owner?.address != nil {
                emit Deposit(id: id, to: self.owner?.address)
            }
            destroy oldToken
        }

        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
        }

        pub fun borrowNFTSafe(id: UInt64): &NonFungibleToken.NFT? {
            if let nftRef = &self.ownedNFTs[id] as &NonFungibleToken.NFT? {
                return nftRef
            }
            return nil
        }

        pub fun destroyMoments(ids: [UInt64]) {
            for id in ids {
                let token <- self.ownedNFTs.remove(key: id)
                    ?? panic("Cannot destroy: NFT does not exist in collection: ".concat(id.toString()))
                emit Withdraw(id: id, from: self.owner?.address)
                destroy token
            }
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <-create MosaicCreator.Collection()
    }

    init() {
        self.mosaics <- {}
        self.mosaicNFTMapping = {}
        self.nextMosaicID = 1
        self.totalSupply = 0

        self.account.save<@Collection>(<- create Collection(), to: /storage/MomentCollection)
        self.account.link<&{CollectionPublic}>(/public/MomentCollection, target: /storage/MomentCollection)
        self.account.save<@Admin>(<- create Admin(), to: /storage/TopShotAdmin)

        emit ContractInitialized()
    }
}
