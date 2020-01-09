import Erc20Abi from '../contracts/erc20a.json';

export class WethService {
  web3;
  contract;
  daoAddress;
  accountAddress;

  constructor(web3, daoToken, daoAddress, accountAddress, bcProcessor) {
    this.web3 = web3;
    this.contract = new web3.eth.Contract(Erc20Abi, daoToken);
    this.daoAddress = daoAddress;
    this.accountAddress = accountAddress;
    this.bcProcessor = bcProcessor;
  }

  async getSymbol() {
    const symbol = await this.contract.methods.symbol().call();
    return symbol;
  }

  async totalSupply() {
    const totalSupply = await this.contract.methods.totalSupply().call();
    return totalSupply;
  }

  async balanceOf(account = this.accountAddress, atBlock = 'latest') {
    const balanceOf = await this.contract.methods
      .balanceOf(account)
      .call({}, atBlock);

    return balanceOf;
  }

  async allowance(
    accountAddr = this.accountAddress,
    contractAddr = this.daoAddress,
  ) {
    const allowance = await this.contract.methods
      .allowance(accountAddr, contractAddr)
      .call();
    return allowance;
  }
}

export class SdkWethService extends WethService {
  sdkService;
  constructor(
    web3,
    daoToken,
    daoAddress,
    accountAddress,
    bcProcessor,
    sdkService,
  ) {
    super(web3, daoToken, daoAddress, accountAddress, bcProcessor);
    this.sdkService = sdkService;
  }

  async approve(wad) {
    console.log('this.daoAddress', this.web3.utils.isAddress(this.daoAddress));
    const encodedData = this.contract.methods
      .approve(this.daoAddress, wad)
      .encodeABI();
    const hash = await this.sdkService.submit(encodedData, this.contract.options.address);
    this.bcProcessor.setTx(
      hash,
      this.accountAddress,
      `Update Token Allowance to ${wad}`,
      true,
    );
    return hash;
  }

  async deposit(amount) {
    const encodedData = this.contract.methods.deposit().encodeABI();
    const hash = await this.sdkSubmit(encodedData);
    this.bcProcessor.setTx(
      hash,
      this.accountAddress,
      `Deposit ${amount} Weth`,
      true,
    );
    return hash;
  }

  async transfer(dest, wad, encodedPayload) {
    const encodedData = this.contract.methods.transfer(dest, wad).encodeABI();
    const hash = await this.sdkSubmit(encodedData);
    this.bcProcessor.setTx(
      hash,
      this.accountAddress,
      `Transfer ${wad} Weth to ${dest}`,
      true,
    );
    return hash;
  }
}

export class Web3WethService extends WethService {
  async approve(wad) {
    const txReceipt = await this.contract.methods
      .approve(this.daoAddress, wad)
      .send({ from: this.accountAddress });
    this.bcProcessor.setTx(
      txReceipt.transactionHash,
      this.accountAddress,
      `Update Token Allowance to ${wad}`,
      true,
    );
    return txReceipt.transactionHash;
  }

  async deposit(amount) {
    const txReceipt = await this.contract.methods
      .deposit()
      .send({ from: this.accountAddress, value: amount });
    this.bcProcessor.setTx(
      txReceipt.transactionHash,
      this.accountAddress,
      `Deposit ${amount} Weth`,
      true,
    );
    return txReceipt.transactionHash;
  }

  async transfer(dest, wad) {
    const txReceipt = await this.contract.methods
      .transfer(dest, wad)
      .send({ from: this.accountAddress });
    this.bcProcessor.setTx(
      txReceipt.transactionHash,
      this.accountAddress,
      `Transfer ${wad} Weth to ${dest}`,
      true,
    );
    return txReceipt.transactionHash;
  }
}
