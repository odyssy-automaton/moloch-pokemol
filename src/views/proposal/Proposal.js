import React, { Fragment, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';

import { ethToWei } from '@netgum/utils'; // returns BN

import { GET_PROPOSAL_QUERY } from '../../utils/ProposalService';
import ProposalDetail from '../../components/proposal/ProposalDetail';
import ErrorMessage from '../../components/shared/ErrorMessage';
import Loading from '../../components/shared/Loading';

import {
  LoaderContext,
  CurrentWalletContext,
  DaoServiceContext,
} from '../../contexts/Store';

const Proposal = (props) => {
  const [daoService] = useContext(DaoServiceContext);
  const id = props.match.params.id;
  const [txLoading, setTxLoading] = useContext(LoaderContext);
  const [currentWallet] = useContext(CurrentWalletContext);

  const processProposal = async (id) => {
    setTxLoading(true);
    try {
      await daoService.mcDao.processProposal(id, ethToWei(currentWallet.eth));
      props.history.push('/proposals');
    } catch (e) {
      console.error(`Error processing proposal: ${e.toString()}`);
    } finally {
      setTxLoading(false);
    }
  };

  const submitVote = async (proposal, vote) => {
    if (!currentWallet.shares) {
      alert(`You must have valid DAO shares to vote.`);
      return;
    }
    setTxLoading(true);
    try {
      await daoService.mcDao.submitVote(
        proposal.id,
        vote,
        ethToWei(currentWallet.eth),
      );
    } catch (e) {
      console.error(`Error processing proposal: ${e.toString()}`);
    } finally {
      setTxLoading(false);
    }
  };

  return (
    <Query query={GET_PROPOSAL_QUERY} variables={{ id }} pollInterval={2000}>
      {({ loading, error, data }) => {
        if (loading) return <Loading />;
        if (error) return <ErrorMessage message={error} />;
        return (
          <Fragment>
            {txLoading && <Loading />}
            <ProposalDetail
              submitVote={submitVote}
              processProposal={processProposal}
              proposal={data.proposal}
            />
          </Fragment>
        );
      }}
    </Query>
  );
};

export default withRouter(Proposal);
