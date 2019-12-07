import React from 'react';
import { useWeb3SignIn } from '../../utils/Hooks';

export const Web3SignIn = ({ history, setCurrentUser }) => {
  const [, setWeb3SignIn] = useWeb3SignIn();
  return (
    <button
      onClick={async () => {
        const set = setWeb3SignIn(true, setCurrentUser);
        if (set && history) {
          history.push('/proposals');
        }
      }}
    >
      Sign In With Web3
    </button>
  );
};
