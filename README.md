
# bitcore-wallet-service-safecoin

A Multisig HD Bitcore Wallet Service, Safecoin edition.

# Description

Bitcore Wallet Service facilitates multisig HD wallets creation and operation through a (hopefully) simple and intuitive REST API.

BWS can usually be installed within minutes and accommodates all the needed infrastructure for peers in a multisig wallet to communicate and operate – with minimum server trust.
  
See [Bitcore-wallet-client-safecoin](https://github.com/fair-exchange/bitcore-wallet-client-safe) for the *official* client library that communicates to BWS and verifies its response. Also check [Bitcore-wallet](https://github.com/bitpay/bitcore-wallet) for a simple CLI wallet implementation that relies on BWS.

BWS is been used in production enviroments for [Copay Wallet Safecoin edition](https://copay.safecoin.org).  


# Getting Started
```
 git clone https://github.com/fair-exchange/bitcore-wallet-service-safecoin.git
 cd bitcore-wallet-service-safecoin
 npm install
 npm start
```


This will launch the BWS service (with default settings) at `http://localhost:3233/bwss/api`.

BWS needs mongoDB. You can configure the connection at `config.js`

BWS uses by default a Request Rate Limitation to CreateWallet endpoint. If you need to modify it, check defaults.js' `Defaults.RateLimit`

# Using BWS with PM2

BWS can be used with PM2 with the provided `app.js` script: 
 
```
  pm2 start app.js --name "bitcoin-wallet-service"
```

# Security Considerations
 * Private keys are never sent to BWS. Copayers store them locally.
 * Extended public keys are stored on BWS. This allows BWS to easily check wallet balance, send offline notifications to copayers, etc.
 * During wallet creation, the initial copayer creates a wallet secret that contains a private key. All copayers need to prove they have the secret by signing their information with this private key when joining the wallet. The secret should be shared using secured channels.
 * A copayer could join the wallet more than once, and there is no mechanism to prevent this. See [wallet](https://github.com/bitpay/bitcore-wallet)'s confirm command, for a method for confirming copayers.
 * All BWS responses are verified:
  * Addresses and change addresses are derived independently and locally by the copayers from their local data.
  * TX Proposals templates are signed by copayers and verified by others, so the BWS cannot create or tamper with them.
