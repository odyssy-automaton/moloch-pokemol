import { gql } from 'apollo-boost';

export const GET_METADATA = gql`
  query Metadata {
    currentPeriod @client
    totalShares @client
    guildBankAddr @client
    gracePeriodLength @client
    votingPeriodLength @client
    periodDuration @client
    processingReward @client
    proposalDeposit @client
    guildBankValue @client
    shareValue @client
    approvedToken @client
    tokenSymbol @client
  }
`;

export const GET_PROPOSALS_QUERY = gql`
  query proposals($skip: Int) {
    proposals(
      orderBy: proposalIndex
      orderDirection: desc
      first: 100
      skip: $skip
    ) {
      id
      timestamp
      startingPeriod
      tokenTribute
      sharesRequested
      yesVotes
      noVotes
      applicantAddress
      proposalIndex
      didPass
      aborted
      details
      processed
      status @client
      gracePeriod @client
      votingEnds @client
      votingStarts @client
      readyForProcessing @client
      votes {
        memberAddress
        uintVote
        member {
          shares
        }
      }
    }
  }
`;

export const GET_PROPOSAL_QUERY = gql`
  query proposal($id: String!) {
    proposal(id: $id) {
      id
      timestamp
      tokenTribute
      sharesRequested
      startingPeriod
      applicantAddress
      yesVotes
      noVotes
      didPass
      aborted
      details
      processed
      status @client
      gracePeriod @client
      votingEnds @client
      votingStarts @client
      readyForProcessing @client
      votes {
        memberAddress
        uintVote
        member {
          shares
        }
      }
    }
  }
`;
