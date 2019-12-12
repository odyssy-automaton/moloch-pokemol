import Web3 from 'web3';
import {
  SdkMcDaoService,
  Web3McDaoService,
  ReadonlyMcDaoService,
} from './McDaoService';
import BcProcessorService from './BcProcessorService';
import { Web3WethService, SdkWethService } from './TokenService';
import config from '../config';
import { WalletStatuses } from './WalletStatus';
import SdkService from './SdkService';

let singleton;

export class DaoService {
  accountAddr;
  web3;
  mcDao;
  token;
  daoAddress;

  constructor(accountAddr, web3, mcDaoService, token) {
    this.accountAddr = accountAddr;
    this.web3 = web3;
    this.mcDao = mcDaoService;
    this.token = token;
    this.daoAddress = config.CONTRACT_ADDRESS;
  }

  static retrieve() {
    return singleton || undefined;
  }

  static async instantiateWithWeb3(accountAddr, injected) {
    const web3 = new Web3(injected);
    const bcProcessor = new BcProcessorService(web3);
    const mcDao = new Web3McDaoService(
      web3,
      config.CONTRACT_ADDRESS,
      accountAddr,
      bcProcessor,
    );
    const approvedToken = await mcDao.approvedToken();
    const token = new Web3WethService(web3, approvedToken);
    singleton = new Web3DaoService(accountAddr, web3, mcDao, token);
    return singleton;
  }

  static async instantiateWithSDK(accountAddr, sdk) {
    const web3 = new Web3(new Web3.providers.HttpProvider(config.INFURA_URI));
    const sdkService = new SdkService(sdk);
    const bcProcessor = new BcProcessorService(web3);
    const mcDao = new SdkMcDaoService(
      web3,
      config.CONTRACT_ADDRESS,
      accountAddr,
      bcProcessor,
      sdkService,
    );
    const approvedToken = await mcDao.approvedToken();
    const token = new SdkWethService(web3, approvedToken);
    singleton = new SdkDaoService(accountAddr, web3, mcDao, token, sdkService);
    return singleton;
  }

  static async instantiateWithReadOnly() {
    const web3 = new Web3(new Web3.providers.HttpProvider(config.INFURA_URI));
    const mcDao = new ReadonlyMcDaoService(web3, config.CONTRACT_ADDRESS, '');
    const approvedToken = await mcDao.approvedToken();
    const token = new SdkWethService(web3, approvedToken);
    singleton = new ReadonlyDaoService('', web3, mcDao, token);
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

export class ReadonlyDaoService extends DaoService {
  async getAccountWei() {
    return '0';
  }

  getAccountState() {
    return WalletStatuses.NotConnected;
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
  sdkService;
  constructor(
    accountAddr,
    web3,
    mcDaoService,
    bcProcessorService,
    token,
    sdkService,
  ) {
    super(accountAddr, web3, mcDaoService, bcProcessorService, token);
    this.sdkService = sdkService;
  }

  async getAccountWei() {
    const ethWei = this.sdkService.getAccountWei();
    return ethWei;
  }

  getAccountState() {
    return this.sdkService.getAccountState();
  }
}
