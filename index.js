const { Universal: Ae, MemoryAccount, Node, Crypto, Aens } = require('@aeternity/aepp-sdk')
const config = require('./config')
const axios = require('axios')

// Initialize aeternity SDK client
let sdk

// This is used for handling multiple name claims at once
// as the on-chain actions (transactions) require valid account nonce
// this will allow transactions to be executed one by one
// preventing duplicated nonce resulting in tx drop
let index = 1

const initSDK = async (keypair = config.keypair) => {
  sdk = await Ae({
    nodes: [
      {
        name: 'someNode',
        instance: await Node({
          url: config.networks[config.selectedNetwork].nodeUrl,
          internalUrl: config.networks[config.selectedNetwork].nodeUrl,
        }),
      },
    ],
    compilerUrl: config.networks[config.selectedNetwork].compilerUrl,
    accounts: [MemoryAccount({ keypair: keypair })],
    address: keypair.publicKey,
  })

  const height = await sdk.height()
  console.log(`SDK initialized by ${keypair.publicKey} ! Current network height: ${height}`)

  config.names.forEach(async (name, index) => await claimOrBid(name, index).catch((e) => e))
}

initSDK()

const claimOrBid = async (name, index) => {
  const checkName = await sdk.aensQuery(name).catch((e) => e)

  // check if name is already claimed
  if (checkName && Object.prototype.hasOwnProperty.call(checkName, 'id')) {
    console.log('[Name]: ' + name + ' Status: taken')
    console.log(checkName)

    // check for active auction and bid if there is one
    console.log('[Name]: ' + name + ' Check for active auction')
    const bidResult = await autoBid(name)
    console.log(bidResult)
  } else {
    // if name is not registered by anyone then we proceed with claiming
    console.log('[Name]: ' + name + ' Status: available')
    setTimeout(async () => {
      console.log(name, ' : Pre-claim request ...')
      const preclaimResult = await sdk.aensPreclaim(name)
      console.log(preclaimResult)
      console.log(name, ' : Claim request ...')
      const claimName = await sdk.aensClaim(name, preclaimResult.salt)
      console.log(claimName)
    }, config.bid.ttl * (index + 1))
  }
}

const autoBid = async (name) => {
  console.log(`${config.networks[config.selectedNetwork].middlewareUrl}names/auctions/bids/${name}`)
  let result = await axios.get(
    `${config.networks[config.selectedNetwork].middlewareUrl}names/auctions/bids/${name}`,
  )
  let activeAuctions = result.data

  console.log(activeAuctions)

  //loop all the active auctions
  activeAuctions.forEach((auction, index) => {
    // check if last bidder is not me
    if (auction.winning_bidder != config.keypair.publicKey) {
      setTimeout(async () => {
        //do stuff
        const bid = await sdk.aensBid(auction.name, auction.winning_bid + config.bid.step, {})
        console.log(bid)
      }, config.bid.ttl * (index + 1))
    }
  })
}
