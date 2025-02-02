import FungibleToken from 0xee82856bf20e2aa6
import NonFungibleToken from 0xf8d6e0586b0a20c7

pub contract MosaicCreator: NonFungibleToken {
    pub event ContractInitialized()
    pub event TileAddedToMosaic(mosaicID: UInt32, nftID: UInt64)
    pub event MosaicCreated(mosaicID: UInt32)
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)
    pub event MomentDestroyed(id: UInt64)

    access(self) var mosaics: @{UInt32: Mosaic}
    pub var mosaicNFTMapping: {UInt32: [UInt64]}
    pub var nextMosaicID: UInt32
    pub var totalSupply: UInt64
    pub var nftToDescription: {UInt64: String}
    pub var nftToData: {UInt64: NFTData}

    pub struct MosaicData {
        pub let mosaicID: UInt32
        pub let collection: String
        pub let size: UInt64
        pub let locked: Bool

        init(mosaicID: UInt32, collection: String, size: UInt64, locked: Bool) {
            self.mosaicID = mosaicID
            self.collection = collection
            self.size = size
            self.locked = locked
        }
    }

    pub resource Mosaic {
        pub let mosaicID: UInt32
        pub let collection: String
        pub let size: UInt64
        pub var locked: Bool

        init(collection: String, size: UInt64) {
            self.mosaicID = MosaicCreator.nextMosaicID
            MosaicCreator.nextMosaicID = MosaicCreator.nextMosaicID + 1
            self.collection = collection
            self.size = size
            self.locked = false
        }

        pub fun lock() {
            self.locked = true
        }

        pub fun getDetails(): {String: AnyStruct} {
            return {
                "mosaicID": self.mosaicID,
                "collection": self.collection,
                "size": self.size,
                "locked": self.locked,
                "nftIDs": MosaicCreator.mosaicNFTMapping[self.mosaicID]!
            }
        }
    }

    pub struct NFTData {
        pub let description: String
        pub let ownerAddress: Address
        pub let collectionPath: String
        pub let collectionCapabilityPath: String

        init(description: String, ownerAddress: Address, collectionPath: String, collectionCapabilityPath: String) {
            self.description = description
            self.ownerAddress = ownerAddress
            self.collectionPath = collectionPath
            self.collectionCapabilityPath = collectionCapabilityPath
        }
    }

    pub resource NFT: NonFungibleToken.INFT {
        pub let id: UInt64
        pub var description: String
        pub var ownerAddress: Address
        pub var collectionPath: String
        pub var collectionCapabilityPath: String

        init(description: String, ownerAddress: Address, collectionPath: String, collectionCapabilityPath: String) {
            self.id = MosaicCreator.totalSupply
            MosaicCreator.totalSupply = MosaicCreator.totalSupply + 1
            self.description = description
            self.ownerAddress = ownerAddress
            self.collectionPath = collectionPath
            self.collectionCapabilityPath = collectionCapabilityPath
            MosaicCreator.nftToDescription[self.id] = description
            MosaicCreator.nftToData[self.id] = NFTData(description: description, ownerAddress: ownerAddress, collectionPath: collectionPath, collectionCapabilityPath: collectionCapabilityPath)
        }

        pub fun updateDescription(newDescription: String) {
            self.description = newDescription
            MosaicCreator.nftToDescription[self.id] = newDescription
            let nftData = MosaicCreator.nftToData[self.id]!
            MosaicCreator.nftToData[self.id] = NFTData(description: newDescription, ownerAddress: nftData.ownerAddress, collectionPath: nftData.collectionPath, collectionCapabilityPath: nftData.collectionCapabilityPath)
        }

        pub fun updateMetadata(newOwnerAddress: Address, newCollectionPath: String, newCollectionCapabilityPath: String) {
            self.ownerAddress = newOwnerAddress
            self.collectionPath = newCollectionPath
            self.collectionCapabilityPath = newCollectionCapabilityPath
            let nftData = MosaicCreator.nftToData[self.id]!
            MosaicCreator.nftToData[self.id] = NFTData(description: nftData.description, ownerAddress: newOwnerAddress, collectionPath: newCollectionPath, collectionCapabilityPath: newCollectionCapabilityPath)
        }

        destroy() {
            emit MomentDestroyed(id: self.id)
        }
    }

    pub resource Admin {
        pub fun createMosaic(collection: String, size: UInt64): UInt32 {
            var newMosaic <- create Mosaic(collection: collection, size: size)
            let newID = newMosaic.mosaicID
            MosaicCreator.mosaics[newID] <-! newMosaic
            MosaicCreator.mosaicNFTMapping[newID] = []
            emit MosaicCreated(mosaicID: newID)
            return newID
        }

        pub fun addTile(mosaicID: UInt32, nftID: UInt64) {
            // Append the NFT ID to the mosaic's list of NFTs
            MosaicCreator.mosaicNFTMapping[mosaicID]?.append(nftID)
                ?? panic("Mosaic with the specified ID does not exist")
            emit TileAddedToMosaic(mosaicID: mosaicID, nftID: nftID)
        }

        pub fun borrowMosaic(mosaicID: UInt32): &Mosaic {
            return (&MosaicCreator.mosaics[mosaicID] as &Mosaic?)!
        }

        pub fun getMosaicNFTMapping(mosaicID: UInt32): [UInt64]? {
            return MosaicCreator.mosaicNFTMapping[mosaicID]
        }

        pub fun mintNFT(description: String, recipient: &{MosaicCreator.MosaicCollectionPublic}, ownerAddress: Address, collectionPath: String, collectionCapabilityPath: String) {
            let newNFT <- create MosaicCreator.NFT(description: description, ownerAddress: ownerAddress, collectionPath: collectionPath, collectionCapabilityPath: collectionCapabilityPath)
            recipient.deposit(token: <-newNFT)
        }
    }

    pub resource interface MosaicCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT?
        pub fun borrowTile(id: UInt64): &MosaicCreator.NFT? {
            // If the result isn't nil, the id of the returned reference
            // should be the same as the argument to the function
            post {
                (result == nil) || (result?.id == id): 
                    "Cannot borrow Mosaic reference: The ID of the returned reference is incorrect"
            }
        }
    }

    pub resource Collection: MosaicCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init() {
            self.ownedNFTs <- {}
        }

        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let nft <- self.ownedNFTs.remove(key: withdrawID)
                ?? panic("Cannot withdraw: NFT does not exist in the collection")
            emit Withdraw(id: withdrawID, from: self.owner?.address)
            return <-nft
        }

        pub fun deposit(token: @NonFungibleToken.NFT) {
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

        pub fun borrowTile(id: UInt64): &MosaicCreator.NFT? {
            if let ref = &self.ownedNFTs[id] as auth &NonFungibleToken.NFT? {
                return ref as! &MosaicCreator.NFT
            } else {
                return nil
            }
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

    pub fun borrowMosaicPublic(mosaicID: UInt32): &Mosaic? {
        return &self.mosaics[mosaicID] as &Mosaic?
    }

    pub fun getMosaicDetails(mosaicID: UInt32): {String: AnyStruct} {
        let mosaicRef = self.borrowMosaicPublic(mosaicID: mosaicID)
            ?? panic("Mosaic with the specified ID does not exist")

        return mosaicRef.getDetails()
    }

    init() {
        self.mosaics <- {}
        self.mosaicNFTMapping = {}
        self.nextMosaicID = 0
        self.totalSupply = 0
        self.nftToDescription = {}
        self.nftToData = {}

        self.account.save<@Collection>(<- create Collection(), to: /storage/MosaicCollection)
        self.account.link<&{MosaicCollectionPublic}>(/public/MosaicCollection, target: /storage/MosaicCollection)
        self.account.save<@Admin>(<- create Admin(), to: /storage/MosaicAdmin)

        emit ContractInitialized()
    }
}
