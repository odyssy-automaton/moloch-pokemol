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
  CurrentUserContext,
  DaoServiceContext,
} from '../../contexts/Store';

const Proposal = (props) => {
  const id = props.match.params.id;
  const [txLoading, setTxLoading] = useContext(LoaderContext);
  const [currentUser] = useContext(CurrentUserContext);
  const [currentWallet] = useContext(CurrentWalletContext);
  const [daoService] = useContext(DaoServiceContext);

  const processProposal = (id) => {
    const sdk = currentUser.sdk;
    const bnZed = ethToWei(0);

    setTxLoading(true);
    daoService.mcDao
      .processProposal(
        currentUser.attributes['custom:account_address'],
        id,
        true,
      )
      .then((data) => {
        sdk
          .estimateAccountTransaction(daoService.daoAddress, bnZed, data)
          .then((estimated) => {
            if (ethToWei(currentWallet.eth).lt(estimated.totalCost)) {
              alert(
                `you need more gas, at least: ${daoService.web3.utils.fromWei(
                  estimated.totalCost.toString(),
                )}`,
              );

              return false;
            }
            sdk
              .submitAccountTransaction(estimated)
              .then((hash) => {
                daoService.bcProcessor.setTx(
                  hash,
                  currentUser.attributes['custom:account_address'],
                  `Proccess proposal. id: ${id}`,
                  true,
                );

                setTxLoading(false);
                props.history.push('/proposals');
              })
              .catch((err) => {
                console.log('catch', err);
                setTxLoading(false);
              });
          })
          .catch(console.error);
      });
  };

  const submitVote = async (proposal, vote) => {
    const sdk = currentUser.sdk;
    const bnZed = ethToWei(0);

    if (currentWallet.shares) {
      setTxLoading(true);

      if (web3SignedIn) {
        console.log('Using web3 to submit vote');
        const voteRes = await dao.submitVote(
          currentUser.attributes['custom:account_address'],
          proposal.id,
          vote,
          false,
        );
        console.log('voteRes: ', voteRes);
      } else {
        console.log('Using SDK to submit vote');
        dao
          .submitVote(
            currentUser.attributes['custom:account_address'],
            proposal.id,
            vote,
            true,
          )
          .then((data) => {
            sdk
              .estimateAccountTransaction(dao.contractAddr, bnZed, data)
              .then((estimated) => {
                if (ethToWei(currentWallet.eth).lt(estimated.totalCost)) {
                  alert(
                    `you need more gas, at least: ${web3Service.fromWei(
                      estimated.totalCost.toString(),
                    )}`,
                  );

                  return false;
                }
                sdk
                  .submitAccountTransaction(estimated)
                  .then((hash) => {
                    bcprocessor.setTx(
                      hash,
                      currentUser.attributes['custom:account_address'],
                      `Submit ${vote === 1 ? 'yes' : 'no'} vote on proposal ${
                        proposal.id
                      }`,
                      true,
                    );

                    setTxLoading(false);
                  })
                  .catch((err) => {
                    console.log('catch', err);
                    setTxLoading(false);
                  });
              })
              .catch(console.error);
          });
      }
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
