var config = {
  basePath: '/bwss/api',
  disableLogs: false,
  port: 3233,

  // Uncomment to make BWS a forking server
  // cluster: true,

  // Uncomment to set the number or process (will use the nr of availalbe CPUs by default)
  // clusterInstances: 4,

  // https: true,
  // privateKeyFile: 'private.pem',
  // certificateFile: 'cert.pem',
  ////// The following is only for certs which are not
  ////// trusted by nodejs 'https' by default
  ////// CAs like Verisign do not require this
  // CAinter1: '', // ex. 'COMODORSADomainValidationSecureServerCA.crt'
  // CAinter2: '', // ex. 'COMODORSAAddTrustCA.crt'
  // CAroot: '', // ex. 'AddTrustExternalCARoot.crt'

  storageOpts: {
    mongoDb: {
      uri: 'mongodb://localhost:27017/bwss',
    },
  },
  lockOpts: {
    //  To use locker-server, uncomment this:
    lockerServer: {
      host: 'localhost',
      port: 13231,
    },
  },
  messageBrokerOpts: {
    //  To use message broker server, uncomment this:
    messageBrokerServer: {
      url: 'http://localhost:13380',
    },
  },
  blockchainExplorerOpts: {
    btc: {
      livenet: {
        provider: 'insight',
        url: 'https://btc.safc.cc:443'
      }
    },
//    bch: {
//      livenet: {
//        provider: 'insight',
//        //url: 'https://cashexplorer.bitcoin.com',
//        url: 'https://bch-insight.bitpay.com:443',
//        addressFormat: 'cashaddr',  // copay, cashaddr, or legacy
//      }
//    },
    safe: {
      livenet: {
        provider: 'insight',
        url: [/* 'https://explorer.safecoin.org:443', */  'https://safe.safc.cc:443'],
        addressFormat: 'safeaddr',  // copay, cashaddr, or legacy
      }
    },
    btcz: {
      livenet: {
        provider: 'insight',
        url: 'https://explorer.btcz.rocks:443',
        addressFormat: 'btczaddr',  // copay, cashaddr, or legacy
      }
    },
    btg: {
      livenet: {
        provider: 'insight',
//        url: 'https://btgexplorer.com:443', // 'https://explorer.bitcoingold.org:443',
        url: 'https://explorer.bitcoingold.org:443',
        addressFormat: 'btgaddr',  // copay, cashaddr, or legacy
      }
    },
/*    anon: {
      livenet: {
        provider: 'insight',
        url: [ 'http://95.216.45.94:3006','https://explorer.anonfork.io:443'],
        addressFormat: 'anonaddr',  // copay, cashaddr, or legacy
      } 
    },  
    zcl: {
      livenet: {
        provider: 'insight',
        url: [ 'http://95.216.45.94:3007', 'http://explorer.zclassicblue.org:3001'],
        addressFormat: 'zcladdr',  // copay, cashaddr, or legacy
      }
    },  */
    zel: {
      livenet: {
        provider: 'insight',
        url: ['https://explorer2.zel.cash:443', 'https://explorer.zel.cash:443'],
        addressFormat: 'zeladdr',  // copay, cashaddr, or legacy
      }
    },
/*    zen: {
      livenet: {
        provider: 'insight',
        url: 'https://explorer.zen-solutions.io:443',// 'https://explorer.zensystem.io:443',
        addressFormat: 'zenaddr',  // copay, cashaddr, or legacy
      }
    },*/
    ltc: {
      livenet: {
        provider: 'insight',
        url: ['https://ltc.safc.cc:443', 'https://litecoinblockexplorer.net:443', 'https://insight.litecore.io:443'],
        addressFormat: 'ltcaddr'  // copay, cashaddr, or legacy
      }
    }, 
    rito: {
      livenet: {
        provider: 'insight',
        url: 'https://rito.safc.cc:443',
        addressFormat: 'ritoaddr'  // copay, cashaddr, or legacy
      }
    }
//    rvn: {
//      livenet: {
//        provider: 'insight',
//        url: 'http://116.202.28.206:3004',
//        addressFormat: 'rvnaddr',  // copay, cashaddr, or legacy
//      }
//    },
  },
//  pushNotificationsOpts: {
//    templatePath: './lib/templates',
//    defaultLanguage: 'en',
//    defaultUnit: 'btc',
//    subjectPrefix: '',
//    pushServerUrl: 'https://fcm.googleapis.com/fcm',
//    authorizationKey: 'You_have_to_put_something_here',
//  },
  fiatRateServiceOpts: {
    defaultProvider: 'BitPay',
    fetchInterval: 60, // in minutes
  },
  // To use email notifications uncomment this:
  // emailOpts: {
  //  host: 'localhost',
  //  port: 25,
  //  ignoreTLS: true,
  //  subjectPrefix: '[Wallet Service]',
  //  from: 'wallet-service@bitcore.io',
  //  templatePath: './lib/templates',
  //  defaultLanguage: 'en',
  //  defaultUnit: 'btc',
  //  publicTxUrlTemplate: {
  //    btc: {
  //      livenet: 'https://insight.bitpay.com/tx/{{txid}}',
  //      testnet: 'https://test-insight.bitpay.com/tx/{{txid}}',
  //    },
  //    bch: {
  //      livenet: 'https://bch-insight.bitpay.com/#/tx/{{txid}}',
  //      testnet: 'https://test-bch-insight.bitpay.com/#/tx/{{txid}}',
  //    }
  //  },
  // },
  // To use sendgrid:
  // var sgTransport = require('nodemail-sendgrid-transport');
  // mailer:sgTransport({
  //  api_user: xxx,
  //  api_key: xxx,
  // });
};
module.exports = config;
