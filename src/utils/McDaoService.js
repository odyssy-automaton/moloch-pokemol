import DaoAbi from '../contracts/mcdao.json';

export default class McDaoService {
  web3;
  daoContract;

  constructor(web3, daoAddress) {
    this.web3 = web3;
    this.daoContract = new web3.eth.Contract(DaoAbi, daoAddress);
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

  async submitVote(from, proposalIndex, uintVote, encodedPayload) {
    if (encodedPayload) {
      const data = this.daoContract.methods
        .submitVote(proposalIndex, uintVote)
        .encodeABI();
      return data;
    }

    return this.daoContract.methods
      .submitVote(proposalIndex, uintVote)
      .send({ from })
      .catch((err) => {
        console.log(err);
        return { error: 'rejected transaction' };
      });
  }

  async rageQuit(from, amount, encodedPayload) {
    if (encodedPayload) {
      const data = this.daoContract.methods.ragequit(amount).encodeABI();
      return data;
    }

    const rage = this.daoContract.methods
      .ragequit(amount)
      .send({ from })
      .once('transactionHash', (txHash) => {})
      .then((resp) => {
        return resp;
      })
      .catch((err) => {
        console.log(err);
        return { error: 'rejected transaction' };
      });
    return rage;
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

  async processProposal(from, id, encodedPayload) {
    if (encodedPayload) {
      const data = this.daoContract.methods.processProposal(id).encodeABI();
      return data;
    }

    return this.daoContract.methods
      .processProposal(id)
      .send({ from })
      .catch((err) => {
        console.log(err);
        return { error: 'rejected transaction' };
      });
  }

  async submitProposal(
    from,
    applicant,
    tokenTribute,
    sharesRequested,
    details,
    encodedPayload = false,
  ) {
    if (encodedPayload) {
      const data = this.daoContract.methods
        .submitProposal(applicant, tokenTribute, sharesRequested, details)
        .encodeABI();
      return data;
    }

    const proposal = this.daoContract.methods
      .submitProposal(applicant, tokenTribute, sharesRequested, details)
      .send({ from })
      .once('transactionHash', (txHash) => {})
      .then((resp) => {
        return resp;
      })
      .catch((err) => {
        console.log(err);
        return { error: 'rejected transaction' };
      });

    return proposal;
  }
}
