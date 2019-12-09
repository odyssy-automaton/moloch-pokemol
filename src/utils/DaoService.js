import Web3 from 'web3';
import { SdkMcDaoService, Web3McDaoService } from './McDaoService';
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
    const mcDao = new Web3McDaoService(
      web3,
      config.CONTRACT_ADDRESS,
      accountAddr,
    );
    const bcProcessor = new BcProcessorService(web3);
    const approvedToken = await mcDao.approvedToken();
    const token = new Web3WethService(web3, approvedToken);
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
    const sdkService = new SdkService(sdk);
    const mcDao = new SdkMcDaoService(
      web3,
      config.CONTRACT_ADDRESS,
      accountAddr,
      sdkService,
    );
    const bcProcessor = new BcProcessorService(web3);
    const approvedToken = await mcDao.approvedToken();
    const token = new SdkWethService(web3, approvedToken);
    singleton = new SdkDaoService(
      accountAddr,
      web3,
      mcDao,
      bcProcessor,
      token,
      sdkService,
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
