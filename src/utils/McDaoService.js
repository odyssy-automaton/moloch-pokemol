import DaoAbi from '../contracts/mcdao.json';

export class McDaoService {
  web3;
  daoContract;
  accountAddr;
  bcProcessor;

  constructor(web3, daoAddress, accountAddr) {
    this.web3 = web3;
    this.daoContract = new web3.eth.Contract(DaoAbi, daoAddress);
    this.accountAddr = accountAddr;
  }

  async getAllEvents() {
    const events = await this.daoContract.getPastEvents('allEvents', {
      fromBlock: 0,
      toBlock: 'latest',
    });
    return events;
  }

  async getCurrentPeriod() {
    const currentPeriod = await this.daoContract.methods
      .getCurrentPeriod()
      .call();
    return currentPeriod;
  }

  async getTotalShares(atBlock = 'latest') {
    const totalShares = await this.daoContract.methods
      .totalShares()
      .call({}, atBlock);
    return totalShares;
  }

  async getGracePeriodLength() {
    const gracePeriod = await this.daoContract.methods
      .gracePeriodLength()
      .call();
    return gracePeriod;
  }

  async getVotingPeriodLength() {
    const votingPeriod = await this.daoContract.methods
      .votingPeriodLength()
      .call();
    return votingPeriod;
  }

  async getPeriodDuration() {
    const periodDuration = await this.daoContract.methods
      .periodDuration()
      .call();
    return periodDuration;
  }

  async getProcessingReward() {
    const processingReward = await this.daoContract.methods
      .processingReward()
      .call();
    return processingReward;
  }

  async getProposalDeposit() {
    const proposalDeposit = await this.daoContract.methods
      .proposalDeposit()
      .call();
    return proposalDeposit;
  }

  async getGuildBankAddr() {
    const guildBank = await this.daoContract.methods.guildBank().call();
    return guildBank;
  }

  async approvedToken() {
    const tokenAddress = await this.daoContract.methods.approvedToken().call();
    return tokenAddress;
  }

  async members(account) {
    const members = await this.daoContract.methods.members(account).call();
    return members;
  }

  async memberAddressByDelegateKey(account) {
    const addressByDelegateKey = await this.daoContract.methods
      .memberAddressByDelegateKey(account)
      .call();
    return addressByDelegateKey;
  }

  async canRagequit() {
    const canRage = await this.daoContract.methods.canRagequit().call();
    return canRage;
  }

  async guildBank() {
    const guildBank = await this.daoContract.methods.guildBank().call();
    return guildBank;
  }

  async proposalQueue(id) {
    const info = await this.daoContract.methods.proposalQueue(id).call();
    return info;
  }
}

export class ReadonlyMcDaoService extends McDaoService {}

export class SdkMcDaoService extends McDaoService {
  sdkService;
  bcProcessor;

  constructor(web3, daoAddress, accountAddr, bcProcessor, sdkService) {
    super(web3, daoAddress, accountAddr);
    this.sdkService = sdkService;
    this.bcProcessor = bcProcessor;
  }

  async submitVote(proposalIndex, uintVote) {
    const encodedData = this.daoContract.methods
      .submitVote(proposalIndex, uintVote)
      .encodeABI();
    const hash = await this.sdkSubmit(encodedData);
    this.bcProcessor.setTx(
      hash,
      this.accountAddr,
      `Submit ${
        uintVote === 1 ? 'yes' : 'no'
      } vote on proposal ${proposalIndex}`,
      true,
    );
    return hash;
  }

  async rageQuit(amount) {
    const encodedData = this.daoContract.methods.ragequit(amount).encodeABI();
    const hash = await this.sdkService.submit(encodedData);
    this.bcProcessor.setTx(
      hash,
      this.accountAddr,
      `Rage quit amount: ${amount}`,
      true,
    );
    return hash;
  }

  async processProposal(id) {
    const encodedData = this.daoContract.methods
      .processProposal(id)
      .encodeABI();
    const hash = await this.sdkService.submit(encodedData);
    this.bcProcessor.setTx(
      hash,
      this.accountAddr,
      `Process proposal. id: ${id}`,
      true,
    );
    return hash;
  }

  async submitProposal(applicant, tokenTribute, sharesRequested, details) {
    const encodedData = this.daoContract.methods
      .submitProposal(applicant, tokenTribute, sharesRequested, details)
      .encodeABI();
    const hash = await this.sdkService.submit(encodedData);
    this.bcProcessor.setTx(
      hash,
      this.accountAddr,
      `Submit proposal (${details})`,
      true,
    );
    return hash;
  }
}

export class Web3McDaoService extends McDaoService {
  bcProcessor;

  constructor(web3, daoAddress, accountAddr, bcProcessor) {
    super(web3, daoAddress, accountAddr);
    this.bcProcessor = bcProcessor;
  }

  async submitVote(proposalIndex, uintVote) {
    const txReceipt = await this.daoContract.methods
      .submitVote(proposalIndex, uintVote)
      .send({ from: this.accountAddr });
    this.bcprocessor.setTx(
      txReceipt.transactionHash,
      this.accountAddr,
      `Submit ${
        uintVote === 1 ? 'yes' : 'no'
      } vote on proposal ${proposalIndex}`,
      true,
    );
    return txReceipt.transactionHash;
  }

  async rageQuit(amount) {
    const txReceipt = await this.daoContract.methods
      .ragequit(amount)
      .send({ from: this.accountAddr });
    this.bcProcessor.setTx(
      txReceipt.transactionHash,
      this.accountAddr,
      `Rage quit amount: ${amount}`,
      true,
    );
    return txReceipt.transactionHash;
  }

  async processProposal(id) {
    const txReceipt = await this.daoContract.methods
      .processProposal(id)
      .send({ from: this.accountAddr });
    this.bcProcessor.setTx(
      txReceipt.transactionHash,
      this.accountAddr,
      `Process proposal. id: ${id}`,
      true,
    );
    return txReceipt.transactionHash;
  }

  async submitProposal(applicant, tokenTribute, sharesRequested, details) {
    const txReceipt = await this.daoContract.methods
      .submitProposal(applicant, tokenTribute, sharesRequested, details)
      .send({ from: this.accountAddr });
    this.bcProcessor.setTx(
      txReceipt.transactionHash,
      this.accountAddr,
      `Submit proposal (${details})`,
      true,
    );
    return txReceipt.transactionHash;
  }
}
