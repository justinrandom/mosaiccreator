import FungibleToken from "FungibleToken"
import FlowToken from "FlowToken"

// Script to check the balance of an account for a FungibleToken
pub fun main(address: Address): UFix64 {
    let account = getAccount(address)

    // Assuming the FungibleToken Balance is stored at /public/flowTokenBalance
    let balanceRef = account.getCapability(/public/flowTokenBalance)
        .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow balance reference.")

    return balanceRef.balance
}