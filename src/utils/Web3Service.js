import Web3 from 'web3';

import config from '../config';

let singleton;

export default class Web3Service {
  // make singleton
  static create(useInjected) {
    if (!singleton) {
      singleton = new Web3Service(useInjected);
    }
    return singleton;
  }

  constructor(injected) {
    if (injected) {
      this.web3 = new Web3(injected);
    } else {
      this.web3 = new Web3(new Web3.providers.HttpProvider(config.INFURA_URI));
    }
  }

  getKeyStore(privateKey, password) {
    return this.web3.eth.accounts.encrypt(privateKey, password);
  }

  decryptKeyStore(keystore, password) {
    return this.web3.eth.accounts.decrypt(keystore, password);
  }

  async latestBlock() {
    return await this.web3.eth.getBlock('latest');
  }

  fromWei(amount) {
    if (!amount) {
      return 0;
    }

    return this.web3.utils.fromWei(amount.toString(), 'ether');
  }

  toWei(amount) {
    return this.web3.utils.toWei(amount.toString(), 'ether');
  }

  toNumber(num) {
    return num.toNumber();
  }

  getTransaction(hash) {
    return this.web3.eth.getTransaction(hash);
  }

  initContract(abi, addr) {
    return new this.web3.eth.Contract(abi, addr);
  }

  getBalance(addr) {
    return this.web3.eth.getBalance(addr);
  }

  getTime(block) {
    return this.web3.eth.getBlock(block).timestamp;
  }
}
