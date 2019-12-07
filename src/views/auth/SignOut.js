import React, { useContext, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { Auth } from 'aws-amplify';

import { CurrentUserContext } from '../../contexts/Store';
import { useWeb3SignIn } from '../../utils/Hooks';

const SignOut = () => {
  const [, setCurrentUser] = useContext(CurrentUserContext);
  const [, setWeb3SignIn] = useWeb3SignIn();

  useEffect(() => {
    // log user out of aws cognito auth,
    // probably should clear sdk from local storage but no way to recover yet
    const currentUser = async () => {
      try {
        await Auth.signOut();
        setCurrentUser();
        await setWeb3SignIn(false, setCurrentUser);
        console.log(localStorage.getItem("loginType"));
        localStorage.clear();
      } catch (e) {
        console.log(e);
      }
    };

    currentUser();
  }, [setCurrentUser, setWeb3SignIn]);

  return <Redirect to="/" />;
};

export default SignOut;
