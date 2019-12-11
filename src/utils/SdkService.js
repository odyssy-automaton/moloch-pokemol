import Web3 from 'web3';

const bnZed = Web3.utils.toBN(0);

export default class SdkService {
  sdk;
  constructor(sdk) {
    this.sdk = sdk;
  }

  getWeiBalance() {
    return Web3.utils.toBN(this.sdk.state.account.balance.real.toString() || 0);
  }

  getAccountState() {
    return this.sdk.state.account.state;
  }

  async submit(encodedData) {
    const estimated = await this.sdk.estimateAccountTransaction(
      this.daoAddress,
      bnZed,
      encodedData,
    );
    if (this.getWeiBalance().lt(estimated.totalCost)) {
      throw new Error(
        `you need more ETH for gas, at least: ${this.web3.utils.fromWei(
          estimated.totalCost.toString(),
        )}`,
      );
    }
    const hash = await this.sdk.submitAccountTransaction(estimated);
    return hash;
  }
}
