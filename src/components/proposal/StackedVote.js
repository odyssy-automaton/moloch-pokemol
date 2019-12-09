import React, { useState, useEffect, useContext } from 'react';
import './StackedVote.scss';
import { DaoServiceContext } from '../../contexts/Store';

const StackedVote = ({
  id,
  baseColor,
  noColor,
  yesColor,
  currentYesVote,
  currentNoVote,
}) => {
  const [noVoteShares, setNoVoteShares] = useState(0);
  const [yesVoteShares, setYesVoteShares] = useState(0);
  const [percentageSharesYes, setPercentageSharesYes] = useState(0);
  const [percentageSharesNo, setPercentageSharesNo] = useState(0);
  const [daoService] = useContext(DaoServiceContext);

  if (currentYesVote === undefined) {
    currentYesVote = 0;
  }
  if (currentNoVote === undefined) {
    currentNoVote = 0;
  }

  useEffect(() => {
    const currentProposal = async () => {
      const info = await daoService.mcDao.proposalQueue(id);
      const noVoteShares = parseInt(info.noVotes) + currentNoVote;
      const yesVoteShares = parseInt(info.yesVotes) + currentYesVote;
      const totalVoteShares = noVoteShares + yesVoteShares;
      const percentageSharesYes = (yesVoteShares / totalVoteShares) * 100 || 0;
      const percentageSharesNo = (noVoteShares / totalVoteShares) * 100 || 0;

      setNoVoteShares(noVoteShares);
      setYesVoteShares(yesVoteShares);
      setPercentageSharesYes(percentageSharesYes);
      setPercentageSharesNo(percentageSharesNo);
    };
    currentProposal();
  }, [
    id,
    currentYesVote,
    currentNoVote,
    daoService.mcDao,
    daoService.token,
    daoService.web3.eth,
  ]);

  // const noVotes = {
  //   textAlign: 'center',
  // };
  const noBar = {
    width: percentageSharesNo + '%',
  };
  const yesBar = {
    width: percentageSharesYes + '%',
  };

  return (
    <div className="FullBar">
      <div className="Labels">
        <span className="YesLabel">{yesVoteShares}</span>
        <span className="NoLabel">{noVoteShares}</span>
      </div>
      <div className="BaseBar" />
      <div className="NoBar" style={noBar} />
      <div className="YesBar" style={yesBar} />
      <div className="QuorumBar" />
    </div>
  );
};

export default StackedVote;
