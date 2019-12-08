import Web3 from 'web3';
import McDaoService from './McDaoService';
import BcProcessorService from './BcProcessorService';
import TokenService from './TokenService';
import config from '../config';
import { WalletStatuses } from './WalletStatus';

let singleton;

export class DaoService {
  accountAddr;
  web3;
  mcDao;
  bcProcessor;
  token;
  daoAddress;

  constructor(accountAddr, web3, mcDaoService, bcProcessorService, token) {
    this.accountAddr = accountAddr;
    this.web3 = web3;
    this.mcDao = mcDaoService;
    this.bcProcessor = bcProcessorService;
    this.token = token;
    this.daoAddress = config.CONTRACT_ADDRESS;
  }

  static retrieve() {
    return singleton || undefined;
  }

  static async instantiateWithInjected(accountAddr, injected) {
    const web3 = new Web3(injected);
    const mcDao = new McDaoService(web3, config.CONTRACT_ADDRESS);
    const bcProcessor = new BcProcessorService(web3);
    const approvedToken = await mcDao.approvedToken();
    const token = new TokenService(web3, approvedToken);
    singleton = new Web3DaoService(
      accountAddr,
      web3,
      mcDao,
      bcProcessor,
      token,
    );
    return singleton;
  }

  static async instantiateWithSDK(accountAddr, sdk) {
    const web3 = new Web3(new Web3.providers.HttpProvider(config.INFURA_URI));
    const mcDao = new McDaoService(web3, config.CONTRACT_ADDRESS);
    const bcProcessor = new BcProcessorService(web3);
    const approvedToken = await mcDao.approvedToken();
    const token = new TokenService(web3, approvedToken);
    singleton = new SdkDaoService(
      accountAddr,
      web3,
      mcDao,
      bcProcessor,
      token,
      sdk,
    );
    return singleton;
  }

  async getAccountWei() {
    throw new Error(`Not implemented by subclass.`);
  }

  async getAccountState() {
    throw new Error(`Not implemented by subclass.`);
  }

  async getAccountEth() {
    const wei = await this.getAccountWei();
    return this.web3.utils.fromWei(wei);
  }
}

export class Web3DaoService extends DaoService {
  async getAccountWei() {
    const ethWei = await this.web3.eth.getBalance(this.accountAddr);
    return ethWei;
  }

  getAccountState() {
    return WalletStatuses.Connected;
  }
}

export class SdkDaoService extends DaoService {
  sdk;
  constructor(accountAddr, web3, mcDaoService, bcProcessorService, token, sdk) {
    super(accountAddr, web3, mcDaoService, bcProcessorService, token);
    this.sdk = sdk;
  }

  async getAccountWei() {
    const ethWei = this.sdk.state.account.balance.real.toString() || 0;
    return ethWei;
  }

  getAccountState() {
    return this.sdk.state.account.state;
  }
}
