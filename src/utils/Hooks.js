import { useState } from 'react';
import Web3Service from './Web3Service';

export const useWeb3SignIn = () => {
  const web3LoggedIn = localStorage.getItem('loginType') === 'web3';
  const web3Service = new Web3Service();
  const [web3SignIn, setWeb3] = useState(web3LoggedIn);

  const setWeb3SignIn = async (set, setCurrentUser) => {
    if (set) {
      const accounts = await window.ethereum.enable();
      const account = accounts[0];
      const providerChainId = await web3Service.web3.eth.getChainId();
      if (parseInt(window.ethereum.chainId) !== providerChainId) {
        alert(
          `Please switch Web3 to the correct network and try signing in again.`,
        );
        setCurrentUser();
        localStorage.setItem('loginType', undefined);
        setWeb3(false);
        return false;
      }

      window.ethereum.on('chainChanged', () => {
        document.location.reload();
      });
      window.ethereum.autoRefreshOnNetworkChange = false;

      if (setCurrentUser) {
        setCurrentUser({
          type: 'web3',
          attributes: { 'custom:account_address': account },
          username: account,
        });
      }
      localStorage.setItem('loginType', 'web3');
      setWeb3(true);
      return true;
    } else {
      if (setCurrentUser) {
        setCurrentUser();
      }
      localStorage.setItem('loginType', undefined);
      setWeb3(false);
      return false;
    }
  };
  return [web3SignIn, setWeb3SignIn];
};
