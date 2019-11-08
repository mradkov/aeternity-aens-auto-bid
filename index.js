import Ae, { Universal } from '@aeternity/aepp-sdk/es/ae/universal'
import axios from 'axios'

const config = require('./config/config')
const util = require('util');

const keypair = {
    publicKey: 'ak_2RUVa9bvHUD8wYSrvixRjy9LonA9L29wRvwDfQ4y37ysMKjgdQ',
    secretKey: '5277f449a5319b744710fc48af8edb5ed6e73218d35647eb7d4d6162ddc88225bb446fc1b78a37c69ffc1e2a61b2a9a10182d3673af2eb1490b3580c46897480'
}

const middleware_url = 'https://mainnet.aeternal.io/middleware/';
let client;
let bid_step = 1000000;
let bid_ttl = 5000;

const initialize_client = async () => {
    await Universal({
        url: 'https://sdk-mainnet.aepps.com',
        internalUrl: 'https://sdk-mainnet.aepps.com',
        compilerUrl: 'https://latest.compiler.aepps.com',
        keypair: keypair
    }).catch(console.error)
    .then((initialized_client) => {
        client = initialized_client;
        auto_bid();
    })

}

const auto_bid = async () => {

    let result = await axios.get(`${middleware_url}names/auctions/active`);
    let active_auctions = result.data;

    //loop all the active auctions
    active_auctions.forEach((auction, index) => {
        // check if last bidder is not me
        if (auction.winning_bidder != keypair.publicKey)
        {
            setTimeout(function(){
                //do stuff
                client.aensBid(
                    auction.name,
                    auction.winning_bid + bid_step,
                    {})
                .then(result => {
                    console.log(result);
                })
                
            }, bid_ttl * index)
        }
    });
}

initialize_client();