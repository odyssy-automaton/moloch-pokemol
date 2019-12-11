import React from 'react';

export const Web3SignIn = ({ history }) => {
  return (
    <button
      onClick={async () => {
        localStorage.setItem('loginType', 'web3');
        history.push('/proposals');
      }}
    >
      Sign In With Web3
    </button>
  );
};
