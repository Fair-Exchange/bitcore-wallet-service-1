var $ = require('preconditions').singleton();
var _ = require('lodash');

var secp256k1 = require('secp256k1');

var Utils = {};

Utils.getMissingFields = function(obj, args) {
  args = [].concat(args);
  if (!_.isObject(obj)) return args;
  var missing = _.filter(args, function(arg) {
    return !obj.hasOwnProperty(arg);
  });
  return missing;
};

/**
 *
 * @desc rounds a JAvascript number
 * @param number
 * @return {number}
 */
Utils.strip = function(number) {
  return parseFloat(number.toPrecision(12));
}

/* TODO: It would be nice to be compatible with bitcoind signmessage. How
 * the hash is calculated there? */
Utils.hashMessage = function(text, noReverse, coin) {
  $.checkArgument(text);
  var buf = new Buffer(text);
  var Bitcore;
  var crypto;
  var encoding;
  if (coin && coin == 'btc') {
    Bitcore = require('bitcore-lib');
  } else if (coin && coin == 'bch') {
    Bitcore = require('bitcore-lib');
  } else if (coin && coin == 'safe') {
    Bitcore = require('bitcore-lib-safecoin');
  } else if (coin && coin == 'btcz') {
    Bitcore = require('bitcore-lib-btcz-mini');
  } else if (coin && coin == 'zcl') {
    Bitcore = require('bitcore-lib-zcl-mini');
  } else if (coin && coin == 'anon') {
    Bitcore = require('bitcore-lib-anon-mini');
  } else if (coin && coin == 'zel') {
    Bitcore = require('bitcore-lib-zel');
  } else if (coin && coin == 'rvn') {
    Bitcore = require('bitcore-lib-rvn-mini');
  } else if (coin && coin == 'ltc') {
    Bitcore = require('bitcore-lib-ltc-mini');
  } else {
    debugger;
  }
  crypto = Bitcore.crypto;
  encoding = Bitcore.encoding;
  var ret = crypto.Hash.sha256sha256(buf);
  if (!noReverse) {
    ret = new encoding.BufferReader(ret).readReverse();
  }
  return ret;
};

Utils.verifyMessage = function(text, signature, publicKey, coin) {
  $.checkArgument(text);

// debugger;
  var hash = Utils.hashMessage(text, true, coin);

  var sig = this._tryImportSignature(signature);
  if (!sig) {
    return false;
  }

  var publicKeyBuffer = this._tryImportPublicKey(publicKey);
  if (!publicKeyBuffer) {
    return false;
  }

  return this._tryVerifyMessage(hash, sig, publicKeyBuffer);
};

Utils._tryImportPublicKey = function(publicKey) {
  var publicKeyBuffer = publicKey;
  try {
    if (!Buffer.isBuffer(publicKey)) {
      publicKeyBuffer = new Buffer(publicKey, 'hex');
    }
    return publicKeyBuffer;
  } catch (e) {
    return false;
  }
};

Utils._tryImportSignature = function(signature) {
  try {
    var signatureBuffer = signature;
    if (!Buffer.isBuffer(signature)) {
      signatureBuffer = new Buffer(signature, 'hex');
    }
    return secp256k1.signatureImport(signatureBuffer);
  } catch (e) {
    return false;
  }
};

Utils._tryVerifyMessage = function(hash, sig, publicKeyBuffer) {
  try {
    return secp256k1.verify(hash, sig, publicKeyBuffer);
  } catch (e) {
    return false;
  }
};

Utils.formatAmount = function(satoshis, unit, opts) {
  var UNITS = {
    btc: {
      toSatoshis: 100000000,
      maxDecimals: 6,
      minDecimals: 2,
    },
    bit: {
      toSatoshis: 100,
      maxDecimals: 0,
      minDecimals: 0,
    },
    sat: {
      toSatoshis: 1,
      maxDecimals: 0,
      minDecimals: 0,
    },
    bch: {
      toSatoshis: 100000000,
      maxDecimals: 6,
      minDecimals: 2,
    },
    safe: {
      toSatoshis: 100000000,
      maxDecimals: 6,
      minDecimals: 2,
    },
    btcz: {
      toSatoshis: 100000000,
      maxDecimals: 6,
      minDecimals: 2,
    },
    zcl: {
      toSatoshis: 100000000,
      maxDecimals: 6,
      minDecimals: 2,
    },
    anon: {
      toSatoshis: 100000000,
      maxDecimals: 6,
      minDecimals: 2,
    },
    zel: {
      toSatoshis: 100000000,
      maxDecimals: 6,
      minDecimals: 2,
    },
    rvn: {
      toSatoshis: 100000000,
      maxDecimals: 6,
      minDecimals: 2,
    },
    ltc: {
      toSatoshis: 100000000,
      maxDecimals: 6,
      minDecimals: 2,
    },
  };

  $.shouldBeNumber(satoshis);
  $.checkArgument(_.contains(_.keys(UNITS), unit));

  function addSeparators(nStr, thousands, decimal, minDecimals) {
    nStr = nStr.replace('.', decimal);
    var x = nStr.split(decimal);
    var x0 = x[0];
    var x1 = x[1];

    x1 = _.dropRightWhile(x1, function(n, i) {
      return n == '0' && i >= minDecimals;
    }).join('');
    var x2 = x.length > 1 ? decimal + x1 : '';

    x0 = x0.replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
    return x0 + x2;
  }

  opts = opts || {};

  var u = _.assign(UNITS[unit], opts);
  var amount = (satoshis / u.toSatoshis).toFixed(u.maxDecimals);
  return addSeparators(amount, opts.thousandsSeparator || ',', opts.decimalSeparator || '.', u.minDecimals);
};

Utils.formatAmountInBtc = function(amount) {
  return Utils.formatAmount(amount, 'btc', {
    minDecimals: 8,
    maxDecimals: 8,
  }) + 'btc';
};

Utils.formatUtxos = function(utxos) {
  if (_.isEmpty(utxos)) return 'none';
  return _.map([].concat(utxos), function(i) {
    var amount = Utils.formatAmountInBtc(i.satoshis);
    var confirmations = i.confirmations ? i.confirmations + 'c' : 'u';
    return amount + '/' + confirmations;
  }).join(', ');
};

Utils.formatRatio = function(ratio) {
  return (ratio * 100.).toFixed(4) + '%';
};

Utils.formatSize = function(size) {
  return (size / 1000.).toFixed(4) + 'kB';
};

Utils.parseVersion = function(version) {
  var v = {};

  if (!version) return null;

  var x = version.split('-');
  if (x.length != 2) {
    v.agent = version;
    return v;
  }
  v.agent = _.contains(['bwc', 'bws'], x[0]) ? 'bwc' : x[0];
  x = x[1].split('.');
  v.major = parseInt(x[0]);
  v.minor = parseInt(x[1]);
  v.patch = parseInt(x[2]);

  return v;
};

Utils.checkValueInCollection = function(value, collection) {
  if (!value || !_.isString(value)) return false;
  return _.contains(_.values(collection), value);
};


Utils.getAddressCoin = function(address, coin) {
  if (coin == 'btc' || coin == 'bch'){
    try {
      new require('bitcore-lib').Address(address);
      return 'btc';
    } catch (e) {
      try {
        new require('bitcore-lib-cash').Address(address);
        return 'bch';
      } catch (e) {
        return;
      }
    }
  } else {
    return coin;
  }
};

Utils.translateAddress = function(address, coin) {
  var origCoin;
  var BitA; 
  var origAddress;
  var origObj;
  var result;
  if (coin && coin == 'btc') {
    var origCoin = Utils.getAddressCoin(address, coin);
    var BitA = require('bitcore-lib').Address; 
    var origAddress = new BitA(address);
    var origObj = origAddress.toObject();
    var result = BitA.fromObject(origObj);
  } else if (coin && coin == 'bch') {
    var origCoin = Utils.getAddressCoin(address, coin);
    var BitA = require('bitcore-lib').Address; 
    var origAddress = new BitA(address);
    var origObj = origAddress.toObject();
    var result = BitA.fromObject(origObj);
  } else if (coin && coin == 'safe') {
    var origCoin = Utils.getAddressCoin(address, coin);
    var BitA = require('bitcore-lib-safecoin').Address; 
    var origAddress = new BitA(address);
    var origObj = origAddress.toObject();
    var result = BitA.fromObject(origObj);
  } else if (coin && coin == 'btcz') {
    var origCoin = Utils.getAddressCoin(address, coin);
    var BitA = require('bitcore-lib-btcz-mini').Address; 
    var origAddress = new BitA(address);
    var origObj = origAddress.toObject();
    var result = BitA.fromObject(origObj);
  } else if (coin && coin == 'zcl') {
    var origCoin = Utils.getAddressCoin(address, coin);
    var BitA = require('bitcore-lib-zcl-mini').Address; 
    var origAddress = new BitA(address);
    var origObj = origAddress.toObject();
    var result = BitA.fromObject(origObj);
  } else if (coin && coin == 'anon') {
    var origCoin = Utils.getAddressCoin(address, coin);
    var BitA = require('bitcore-lib-anon-mini').Address; 
    var origAddress = new BitA(address);
    var origObj = origAddress.toObject();
    var result = BitA.fromObject(origObj);
  } else if (coin && coin == 'zel') {
    var origCoin = Utils.getAddressCoin(address, coin);
    var BitA = require('bitcore-lib-zel').Address; 
    var origAddress = new BitA(address);
    var origObj = origAddress.toObject();
    var result = BitA.fromObject(origObj);
  } else if (coin && coin == 'rvn') {
    var origCoin = Utils.getAddressCoin(address, coin);
    var BitA = require('bitcore-lib-rvn-mini').Address; 
    var origAddress = new BitA(address);
    var origObj = origAddress.toObject();
    var result = BitA.fromObject(origObj);
  } else if (coin && coin == 'ltc') {
    var origCoin = Utils.getAddressCoin(address, coin);
    var BitA = require('bitcore-lib-ltc-mini').Address; 
    var origAddress = new BitA(address);
    var origObj = origAddress.toObject();
    var result = BitA.fromObject(origObj);
  } else {
    debugger;
  }
  return result.toString();
};



module.exports = Utils;
