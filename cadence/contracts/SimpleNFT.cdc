import NonFungibleToken from "NonFungibleToken"

pub contract SimpleNFT: NonFungibleToken {

    pub let CollectionPublicPath: PublicPath
    pub let CollectionStoragePath: StoragePath
    pub let MinterStoragePath: StoragePath

    pub event NFTMinted(id: UInt64, metadata: String)
    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)
    pub event MomentDestroyed(id: UInt64)

    pub var totalSupply: UInt64

    pub resource NFT: NonFungibleToken.INFT {
        pub let id: UInt64
        pub let metadata: String

        init(id: UInt64, metadata: String) {
            SimpleNFT.totalSupply = SimpleNFT.totalSupply + 1
            self.id = SimpleNFT.totalSupply
            self.metadata = metadata

            emit NFTMinted(id: self.id, metadata: self.metadata)
        }

         // If the Moment is destroyed, emit an event to indicate 
        // to outside observers that it has been destroyed
        destroy() {
            emit MomentDestroyed(id: self.id)
        }
    }

     pub resource interface SimpleNFTCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowNFTSafe(id: UInt64): &NonFungibleToken.NFT?
    }

    pub resource Collection: SimpleNFTCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init() {
            self.ownedNFTs <- {}
        }

        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("NFT does not exist.")
            emit Withdraw(id: withdrawID, from: self.owner?.address)
            return <- token
        }

        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @SimpleNFT.NFT
            let id: UInt64 = token.id
            let oldToken <- self.ownedNFTs[id] <- token
            
            emit Deposit(id: id, to: self.owner?.address)

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

        destroy() {
            destroy self.ownedNFTs
        }
    }

    // NFTMinter resource definition
    pub resource NFTMinter {
        // Function to mint a new NFT
        pub fun mintNFT(recipient: &{NonFungibleToken.CollectionPublic}, metadata: String) {
           
            var newNFT <- create NFT(id: SimpleNFT.totalSupply, metadata: metadata)
        
            emit NFTMinted(id: newNFT.id, metadata: metadata)
            recipient.deposit(token: <-newNFT)
            SimpleNFT.totalSupply = SimpleNFT.totalSupply + 1
        }
    }

    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    // Function to create an NFTMinter resource
    pub fun createNFTMinter(): @NFTMinter {
        return <- create NFTMinter()
    }

    init() {
       
        self.totalSupply = 0

        self.CollectionPublicPath = /public/SimpleNFTCollection
        self.CollectionStoragePath = /storage/SimpleNFTCollection
        self.MinterStoragePath = /storage/NFTMinter

        // Create a Collection resource and save it to storage
        self.account.save(<- create Collection(), to: self.CollectionStoragePath)

       // create a public capability for the collection
        self.account.link<&SimpleNFT.Collection{NonFungibleToken.CollectionPublic, SimpleNFT.SimpleNFTCollectionPublic}>(
            self.CollectionPublicPath,
            target: self.CollectionStoragePath
        )

        // Create a Minter resource and save it to storage

        self.account.save(<- create NFTMinter(), to: self.MinterStoragePath)

        emit ContractInitialized()
    }
}