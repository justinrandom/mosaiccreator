This project is designed to allow the creation of a Mosaic of Tiles which allow the owner to display an NFT in their collection.
flow transactions send ./cadence/transactions/createMosaic.cdc "NBA Top Shot" 100

flow scripts execute .\cadence\scripts\getMosaic.cdc 0

flow transactions send ./cadence/transactions/mintNFT.cdc "here is a description" "this is collection path" "capability path"

flow scripts execute .\cadence\scripts\getNFT.cdc 0xf8d6e0586b0a20c7 0

flow transactions send ./cadence/transactions/addTile.cdc 0 0

flow scripts execute .\cadence\scripts\getMapping.cdc 0

flow transactions send ./cadence/transactions/updateDescription.cdc 0 "WNBA"

flow scripts execute .\cadence\scripts\getNFT.cdc 0xf8d6e0586b0a20c7 0

flow scripts execute .\cadence\scripts\getNFTDescription.cdc 0

flow transactions send ./cadence/transactions/updateMetadata.cdc 0 0xf8d6e0586b0a20c9 "this is a new collect path" "new collection cap"

flow scripts execute .\cadence\scripts\getNFTData.cdc 0

0x0e79f439f8fcb6f4
