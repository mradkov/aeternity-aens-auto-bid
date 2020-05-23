module.exports = {
  selectedNetwork: 'testnet', // mainnet or testnet
  names: ['shortname.chain', 'anothername.chain'],
  bid: {
    ttl: 5000, // in miliseconds
    step: 10000, //in aettos
  },
  keypair: {
    secretKey:
      'bb9f0b01c8c9553cfbaf7ef81a50f977b1326801ebf7294d1c2cbccdedf27476e9bbf604e611b5460a3b3999e9771b6f60417d73ce7c5519e12f7e127a1225ca',
    publicKey: 'ak_2mwRmUeYmfuW93ti9HMSUJzCk1EYcQEfikVSzgo6k2VghsWhgU',
  },
  networks: {
    testnet: {
      nodeUrl: 'https://testnet.aeternity.io',
      networkId: 'ae_uat',
      compilerUrl: 'https://compiler.aepps.com',
      middlewareUrl: 'https://testnet.aeternal.io/middleware/api/',
    },
    mainnet: {
      nodeUrl: 'https://mainnet.aeternity.io',
      networkId: 'ae_mainnet',
      compilerUrl: 'https://compiler.aepps.com',
      middlewareUrl: 'https://mainnet.aeternal.io/middleware/api/',
    },
  },
}
