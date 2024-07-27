import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

export const createMosaic = async (collection, size) => {
  const transactionId = await fcl
    .send([
      fcl.transaction`
      import MosaicCreatorV1 from 0xdbf7a2a1821c9ffa

      transaction(collection: String, size: UInt64) {
        let admin: &MosaicCreatorV1.Admin

        prepare(signer: AuthAccount) {
          self.admin = signer.borrow<&MosaicCreatorV1.Admin>(from: /storage/MosaicAdminV1)
            ?? panic("Could not borrow a reference to the Admin resource")
        }

        execute {
          self.admin.createMosaic(collection: collection, size: size)
        }
      }
    `,
      fcl.args([fcl.arg(collection, t.String), fcl.arg(size, t.UInt64)]),
      fcl.payer(fcl.authz),
      fcl.proposer(fcl.authz),
      fcl.authorizations([fcl.authz]),
      fcl.limit(100),
    ])
    .then(fcl.decode);

  console.log("Transaction Id", transactionId);
};
