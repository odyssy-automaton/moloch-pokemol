import Erc20Abi from '../contracts/erc20a.json';

export default class WethService {
  web3;
  contract;

  constructor(web3, daoToken) {
    this.web3 = web3;
    this.contract = new web3.eth.Contract(Erc20Abi, daoToken);
  }

  async getSymbol() {
    const symbol = await this.contract.methods.symbol().call();
    return symbol;
  }

  async totalSupply() {
    const totalSupply = await this.contract.methods.totalSupply().call();
    return totalSupply;
  }

  async balanceOf(account, atBlock = 'latest') {
    const balanceOf = await this.contract.methods
      .balanceOf(account)
      .call({}, atBlock);

    return balanceOf;
  }

  async allowance(accountAddr, contractAddr) {
    const allowance = await this.contract.methods
      .allowance(accountAddr, contractAddr)
      .call();
    return allowance;
  }

  async approve(from, guy, wad, encodedPayload) {
    // guy should be moloch contract
    if (encodedPayload) {
      const data = this.contract.methods.approve(guy, wad).encodeABI();
      return data;
    }

    const approve = await this.contract.methods
      .approve(guy, wad)
      .send({ from })
      .once('transactionHash', (txHash) => {})
      .then((resp) => {
        return resp;
      })
      .catch((err) => {
        console.log(err);
        return { error: 'rejected transaction' };
      });

    return approve;
  }

  async deposit(from, amount, encodedPayload) {
    if (encodedPayload) {
      const data = this.contract.methods.deposit().encodeABI();
      return data;
    }

    const deposit = this.contract.methods
      .deposit()
      .send({ from, value: amount })
      .once('transactionHash', (txHash) => {})
      .then((resp) => {
        return resp;
      })
      .catch((err) => {
        console.log(err);
        return { error: 'rejected transaction' };
      });

    return deposit;
  }

  async transfer(from, dist, wad, encodedPayload) {
    if (encodedPayload) {
      const data = this.contract.methods.transfer(dist, wad).encodeABI();
      return data;
    }

    const trans = await this.contract.methods
      .transfer(dist, wad)
      .send({ from })
      .once('transactionHash', (txHash) => {})
      .then((resp) => {
        return resp;
      })
      .catch((err) => {
        console.log(err);
        return { error: 'rejected transaction' };
      });

    return trans;
  }
}
