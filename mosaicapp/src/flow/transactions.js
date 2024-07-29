import * as fcl from "@onflow/fcl";

// Function to create a mosaic
export async function createMosaic(collection, size) {
  const txId = await fcl.send([
    fcl.transaction`
      import MosaicCreatorV1 from 0xdbf7a2a1821c9ffa

      transaction(collection: String, size: UInt64) {
        prepare(signer: AuthAccount) {
          let adminRef = signer.borrow<&MosaicCreatorV1.Admin>(from: /storage/MosaicAdminV1)
            ?? panic("Could not borrow a reference to the Admin resource")
          adminRef.createMosaic(collection: collection, size: size)
        }
      }
    `,
    fcl.args([fcl.arg(collection, fcl.t.String), fcl.arg(size, fcl.t.UInt64)]),
    fcl.payer(fcl.authz),
    fcl.proposer(fcl.authz),
    fcl.authorizations([fcl.authz]),
    fcl.limit(100),
  ]);

  return txId;
}

// Function to mint a tile
export async function mintTile(
  description,
  collectionPath,
  collectionCapabilityPath
) {
  const txId = await fcl.send([
    fcl.transaction`
      import MosaicCreatorV1 from 0xdbf7a2a1821c9ffa

      transaction(description: String, collectionPath: String, collectionCapabilityPath: String) {
        prepare(signer: AuthAccount) {
          let adminRef = signer.borrow<&MosaicCreatorV1.Admin>(from: /storage/MosaicAdminV1)
            ?? panic("Could not borrow a reference to the Admin resource")
          let recipient = signer.getCapability(/public/MosaicCollectionV1)
            .borrow<&{MosaicCreatorV1.MosaicCollectionPublic}>()
            ?? panic("Could not borrow a reference to the recipient's collection")
          adminRef.mintNFT(
            description: description,
            recipient: recipient,
            ownerAddress: signer.address,
            collectionPath: collectionPath,
            collectionCapabilityPath: collectionCapabilityPath
          )
        }
      }
    `,
    fcl.args([
      fcl.arg(description, fcl.t.String),
      fcl.arg(collectionPath, fcl.t.String),
      fcl.arg(collectionCapabilityPath, fcl.t.String),
    ]),
    fcl.payer(fcl.authz),
    fcl.proposer(fcl.authz),
    fcl.authorizations([fcl.authz]),
    fcl.limit(100),
  ]);

  return txId;
}

// Function to update tile description
export async function updateTileDescription(tileID, newDescription) {
  const txId = await fcl
    .send([
      fcl.transaction`
      import MosaicCreatorV1 from 0xdbf7a2a1821c9ffa

      transaction(tileID: UInt64, newDescription: String) {
        prepare(signer: AuthAccount) {
          let collectionRef = signer.borrow<&MosaicCreatorV1.Collection>(from: /storage/MosaicCollectionV1)
            ?? panic("Could not borrow a reference to the NFT collection")
          let nftRef = collectionRef.borrowTile(id: tileID)
            ?? panic("Could not borrow a reference to the NFT")
          nftRef.updateDescription(newDescription: newDescription)
        }
      }
    `,
      fcl.args([
        fcl.arg(tileID, fcl.t.UInt64),
        fcl.arg(newDescription, fcl.t.String),
      ]),
      fcl.payer(fcl.authz),
      fcl.proposer(fcl.authz),
      fcl.authorizations([fcl.authz]),
      fcl.limit(100),
    ])
    .then(fcl.decode);

  return txId;
}

// Function to update tile metadata
export async function updateTileMetadata(
  tileID,
  newOwnerAddress,
  newCollectionPath,
  newCollectionCapabilityPath
) {
  const txId = await fcl.send([
    fcl.transaction`
      import NonFungibleToken from 0x1d7e57aa55817448
      import MosaicCreatorV1 from 0xdbf7a2a1821c9ffa

      transaction(tileID: UInt64, newOwnerAddress: Address, newCollectionPath: String, newCollectionCapabilityPath: String) {
        let nftRef: &MosaicCreatorV1.NFT

        prepare(signer: AuthAccount) {
          let collection = signer.borrow<&MosaicCreatorV1.Collection>(from: /storage/MosaicCollectionV1)
            ?? panic("Could not borrow reference to the NFT collection")
          self.nftRef = collection.borrowTile(id: tileID)
            ?? panic("Could not borrow reference to the NFT")
        }

        execute {
          self.nftRef.updateMetadata(
            newOwnerAddress: newOwnerAddress,
            newCollectionPath: newCollectionPath,
            newCollectionCapabilityPath: newCollectionCapabilityPath
          )
        }
      }
    `,
    fcl.args([
      fcl.arg(tileID, fcl.t.UInt64),
      fcl.arg(newOwnerAddress, fcl.t.Address),
      fcl.arg(newCollectionPath, fcl.t.String),
      fcl.arg(newCollectionCapabilityPath, fcl.t.String),
    ]),
    fcl.payer(fcl.authz),
    fcl.proposer(fcl.authz),
    fcl.authorizations([fcl.authz]),
    fcl.limit(100),
  ]);

  return txId;
}

// Function to send a tile to another user
export async function sendTile(tileID, recipientAddress) {
  const txId = await fcl.send([
    fcl.transaction`
      import MosaicCreatorV1 from 0xdbf7a2a1821c9ffa

      transaction(tileID: UInt64, recipient: Address) {
        let senderCollection: &MosaicCreatorV1.Collection
        let recipientCollection: &{MosaicCreatorV1.MosaicCollectionPublic}

        prepare(signer: AuthAccount) {
          self.senderCollection = signer.borrow<&MosaicCreatorV1.Collection>(from: /storage/MosaicCollectionV1)
            ?? panic("Could not borrow a reference to the sender's collection")

          self.recipientCollection = getAccount(recipient).getCapability(/public/MosaicCollectionV1)
            .borrow<&{MosaicCreatorV1.MosaicCollectionPublic}>()
            ?? panic("Could not borrow a reference to the recipient's collection")
        }

        execute {
          let tile <- self.senderCollection.withdraw(withdrawID: tileID)
          self.recipientCollection.deposit(token: <-tile)
          log("Tile sent successfully")
        }
      }
    `,
    fcl.args([
      fcl.arg(tileID, fcl.t.UInt64),
      fcl.arg(recipientAddress, fcl.t.Address),
    ]),
    fcl.payer(fcl.authz),
    fcl.proposer(fcl.authz),
    fcl.authorizations([fcl.authz]),
    fcl.limit(100),
  ]);

  return txId;
}
