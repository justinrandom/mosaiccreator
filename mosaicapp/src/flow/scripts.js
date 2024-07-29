import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

// Cadence script to get all NBA Top Shot moment details for an account
const getTopShotMoments = fcl.cdc`
import TopShot from 0x0b2a3299cc857e29

pub struct MomentDetails {
    pub let id: UInt64
    pub let playID: UInt32
    pub let meta: TopShot.MomentData
    pub let setID: UInt32
    pub let setName: String
    pub let serialNumber: UInt32
    pub let subeditionID: UInt32?

    init(id: UInt64, playID: UInt32, meta: TopShot.MomentData, setID: UInt32, setName: String, serialNumber: UInt32, subeditionID: UInt32?) {
        self.id = id
        self.playID = playID
        self.meta = meta
        self.setID = setID
        self.setName = setName
        self.serialNumber = serialNumber
        self.subeditionID = subeditionID
    }
}

pub fun main(account: Address): [{UInt64: MomentDetails}] {
    let acct = getAccount(account)
    let collectionRef = acct.getCapability(/public/MomentCollection)!.borrow<&{TopShot.MomentCollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")
    
    let momentIDs = collectionRef.getIDs()
    var results: [{UInt64: MomentDetails}] = []

    for id in momentIDs {
        let momentRef = collectionRef.borrowMoment(id: id)
            ?? panic("Could not borrow moment reference")

        let playID = momentRef.data.playID
        let meta = momentRef.data
        let setID = momentRef.data.setID
        let setName = TopShot.getSetName(setID: setID) ?? panic("Could not get set name")
        let serialNumber = momentRef.data.serialNumber
        let subeditionID = TopShot.getMomentsSubedition(nftID: id)

        let details = MomentDetails(
            id: id,
            playID: playID,
            meta: meta,
            setID: setID,
            setName: setName,
            serialNumber: serialNumber,
            subeditionID: subeditionID
        )

        results.append({id: details})
    }

    return results
}
`;

// Cadence script to get all NFTData for an account's tiles
const getTilesScript = fcl.cdc`
import MosaicCreatorV1 from 0xdbf7a2a1821c9ffa

pub struct NFTDetails {
    pub let id: UInt64
    pub let description: String
    pub let ownerAddress: Address
    pub let collectionPath: String
    pub let collectionCapabilityPath: String

    init(
        id: UInt64,
        description: String,
        ownerAddress: Address,
        collectionPath: String,
        collectionCapabilityPath: String
    ) {
        self.id = id
        self.description = description
        self.ownerAddress = ownerAddress
        self.collectionPath = collectionPath
        self.collectionCapabilityPath = collectionCapabilityPath
    }
}

pub fun main(account: Address): [{UInt64: NFTDetails}] {
    let acct = getAccount(account)
    let collectionRef = acct.getCapability(/public/MosaicCollectionV1).borrow<&{MosaicCreatorV1.MosaicCollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")

    let nftIDs = collectionRef.getIDs()
    var results: [{UInt64: NFTDetails}] = []

    for id in nftIDs {
        let nftRef = collectionRef.borrowTile(id: id) ?? panic("Could not borrow a reference to the NFT")
        let nftData = MosaicCreatorV1.nftToData[id] ?? panic("Could not find NFT data")

        let details = NFTDetails(
            id: id,
            description: nftData.description,
            ownerAddress: nftData.ownerAddress,
            collectionPath: nftData.collectionPath,
            collectionCapabilityPath: nftData.collectionCapabilityPath
        )

        results.append({id: details})
    }

    return results
}
`;

// Cadence script to get a single tile's details
const getTileDetailsScript = fcl.cdc`
import MosaicCreatorV1 from 0xdbf7a2a1821c9ffa

pub struct NFTDetails {
    pub let id: UInt64
    pub let description: String
    pub let ownerAddress: Address
    pub let collectionPath: String
    pub let collectionCapabilityPath: String

    init(
        id: UInt64,
        description: String,
        ownerAddress: Address,
        collectionPath: String,
        collectionCapabilityPath: String
    ) {
        self.id = id
        self.description = description
        self.ownerAddress = ownerAddress
        self.collectionPath = collectionPath
        self.collectionCapabilityPath = collectionCapabilityPath
    }
}

pub fun main(account: Address, nftID: UInt64): NFTDetails {
    let collectionRef = getAccount(account).getCapability(/public/MosaicCollectionV1).borrow<&{MosaicCreatorV1.MosaicCollectionPublic}>()
        ?? panic("Could not borrow a reference to the collection")

    let nftRef = collectionRef.borrowTile(id: nftID) ?? panic("Could not borrow a reference to the NFT")
    let nftData = MosaicCreatorV1.nftToData[nftID] ?? panic("Could not find NFT data")

    return NFTDetails(
        id: nftID,
        description: nftData.description,
        ownerAddress: nftData.ownerAddress,
        collectionPath: nftData.collectionPath,
        collectionCapabilityPath: nftData.collectionCapabilityPath
    )
}
`;

// Function to fetch all NBA Top Shot moments for an account
export async function fetchTopShotMoments(address) {
  const result = await fcl
    .send([
      fcl.script(getTopShotMoments),
      fcl.args([fcl.arg(address, t.Address)]),
    ])
    .then(fcl.decode);

  return result;
}

// Function to fetch all user tiles for an account
export async function fetchUserTiles(address) {
  const result = await fcl
    .send([fcl.script(getTilesScript), fcl.args([fcl.arg(address, t.Address)])])
    .then(fcl.decode);

  return result;
}

// Function to fetch details of a specific tile
export async function fetchTileDetails(address, tileID) {
  const result = await fcl
    .send([
      fcl.script(getTileDetailsScript),
      fcl.args([fcl.arg(address, t.Address), fcl.arg(tileID, t.UInt64)]),
    ])
    .then(fcl.decode);

  return result;
}

export async function getSingleNFTDetail(nftID) {
  const script = `
      import MosaicCreatorV1 from 0xdbf7a2a1821c9ffa
  
      pub struct NFTDetails {
          pub let id: UInt64
          pub let description: String
          pub let ownerAddress: Address
          pub let collectionPath: String
          pub let collectionCapabilityPath: String
  
          init(
              id: UInt64,
              description: String,
              ownerAddress: Address,
              collectionPath: String,
              collectionCapabilityPath: String
          ) {
              self.id = id
              self.description = description
              self.ownerAddress = ownerAddress
              self.collectionPath = collectionPath
              self.collectionCapabilityPath = collectionCapabilityPath
          }
      }
  
      pub fun main(nftID: UInt64): NFTDetails {
          let nftData = MosaicCreatorV1.nftToData[nftID] ?? panic("Could not find NFT data")
  
          return NFTDetails(
              id: nftID,
              description: nftData.description,
              ownerAddress: nftData.ownerAddress,
              collectionPath: nftData.collectionPath,
              collectionCapabilityPath: nftData.collectionCapabilityPath
          )
      }
    `;

  const response = await fcl
    .send([
      fcl.script(script),
      fcl.args([fcl.arg(nftID.toString(), fcl.t.UInt64)]),
    ])
    .then(fcl.decode);

  return response;
}

export async function getBatchNFTDetails(nftIDs) {
  const script = `
      import MosaicCreatorV1 from 0xdbf7a2a1821c9ffa
  
      pub struct NFTDetails {
          pub let id: UInt64
          pub let description: String
          pub let ownerAddress: Address
          pub let collectionPath: String
          pub let collectionCapabilityPath: String
  
          init(
              id: UInt64,
              description: String,
              ownerAddress: Address,
              collectionPath: String,
              collectionCapabilityPath: String
          ) {
              self.id = id
              self.description = description
              self.ownerAddress = ownerAddress
              self.collectionPath = collectionPath
              self.collectionCapabilityPath = collectionCapabilityPath
          }
      }
  
      pub fun main(nftIDs: [UInt64]): {UInt64: NFTDetails} {
          let results: {UInt64: NFTDetails} = {}
  
          for id in nftIDs {
              if let nftData = MosaicCreatorV1.nftToData[id] {
                  let details = NFTDetails(
                      id: id,
                      description: nftData.description,
                      ownerAddress: nftData.ownerAddress,
                      collectionPath: nftData.collectionPath,
                      collectionCapabilityPath: nftData.collectionCapabilityPath
                  )
  
                  results[id] = details
              } else {
                  // Handle missing NFT data by creating a default NFTDetails
                  let defaultDetails = NFTDetails(
                      id: id,
                      description: "N/A",
                      ownerAddress: 0x0,
                      collectionPath: "N/A",
                      collectionCapabilityPath: "N/A"
                  )
  
                  results[id] = defaultDetails
              }
          }
  
          return results
      }
    `;

  const response = await fcl
    .send([
      fcl.script(script),
      fcl.args([fcl.arg(nftIDs.map(String), fcl.t.Array(fcl.t.UInt64))]),
    ])
    .then(fcl.decode);

  return response;
}

export async function getMosaicDetails(mosaicID) {
  const script = `
      import MosaicCreatorV1 from 0xdbf7a2a1821c9ffa
  
      pub struct MosaicDetails {
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
  
      pub fun main(mosaicID: UInt32): MosaicDetails {
          let mosaic = MosaicCreatorV1.borrowMosaicPublic(mosaicID: mosaicID)
              ?? panic("Mosaic with the specified ID does not exist")
          
          return MosaicDetails(
              mosaicID: mosaic.mosaicID,
              collection: mosaic.collection,
              size: mosaic.size,
              locked: mosaic.locked
          )
      }
    `;

  const response = await fcl
    .send([
      fcl.script(script),
      fcl.args([fcl.arg(mosaicID.toString(), fcl.t.UInt32)]),
    ])
    .then(fcl.decode);

  return response;
}
