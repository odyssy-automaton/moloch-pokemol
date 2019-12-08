import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from './Routes';
import Header from './components/header/Header';
import Loading from './components/shared/Loading';

import './App.scss';
import { DaoServiceContext } from './contexts/Store';

const App = ({ client }) => {
  const [loading, setloading] = useState(true);
  const [daoService] = useContext(DaoServiceContext);

  useEffect(() => {
    // save all web3 data to apollo cache
    const fetchData = async () => {
      if (!daoService) {
        client.writeData({
          data: {
            currentPeriod: 0,
            totalShares: 0,
            guildBankAddr: '0x00000000000000000000',
            approvedToken: '0x00000000000000000000',
            tokenSymbol: 'DAO',
            gracePeriodLength: 0,
            votingPeriodLength: 0,
            periodDuration: 0,
            processingReward: 0,
            proposalDeposit: 0,
            guildBankValue: 0,
            shareValue: 0,
          },
        });
        return;
      }

      const currentPeriod = await daoService.mcDao.getCurrentPeriod();
      const totalShares = await daoService.mcDao.getTotalShares();
      const guildBankAddr = await daoService.mcDao.getGuildBankAddr();
      const gracePeriodLength = await daoService.mcDao.getGracePeriodLength();
      const votingPeriodLength = await daoService.mcDao.getVotingPeriodLength();
      const periodDuration = await daoService.mcDao.getPeriodDuration();
      const processingReward = await daoService.mcDao.getProcessingReward();
      const proposalDeposit = await daoService.mcDao.getProposalDeposit();
      const approvedToken = await daoService.mcDao.approvedToken();

      const guildBankValue = await daoService.token.balanceOf(guildBankAddr);
      const tokenSymbol = await daoService.token.getSymbol();

      client.writeData({
        data: {
          currentPeriod: parseInt(currentPeriod),
          totalShares: parseInt(totalShares),
          guildBankAddr,
          approvedToken,
          tokenSymbol,
          gracePeriodLength: parseInt(gracePeriodLength),
          votingPeriodLength: parseInt(votingPeriodLength),
          periodDuration: parseInt(periodDuration),
          processingReward: daoService.web3.utils.fromWei(processingReward),
          proposalDeposit: daoService.web3.utils.fromWei(proposalDeposit),
          guildBankValue: daoService.web3.utils.fromWei(guildBankValue),
          shareValue: parseFloat(
            daoService.web3.utils.fromWei(
              daoService.web3.utils
                .toBN(guildBankValue)
                .div(daoService.web3.utils.toBN(totalShares)),
            ),
          ),
        },
      });
      setloading(false);
    };

    fetchData();
  }, [client, daoService]);
  return (
    <div className="App">
      {loading ? (
        <Loading />
      ) : (
        <Router>
          <Header />
          <Routes />
        </Router>
      )}
    </div>
  );
};

export default App;
