import React, { useState, useContext } from 'react';
import { Formik, Form } from 'formik'; // returns BN

import Loading from '../shared/Loading';

import {
  CurrentUserContext,
  CurrentWalletContext,
  LoaderContext,
  DaoServiceContext,
} from '../../contexts/Store';

const ApproveAllowance = () => {
  const [daoService] = useContext(DaoServiceContext);
  const [currentUser] = useContext(CurrentUserContext);
  const [loading, setLoading] = useContext(LoaderContext);
  const [currentWallet] = useContext(CurrentWalletContext);
  const [formSuccess, setFormSuccess] = useState(false);

  return (
    <>
      {loading && <Loading />}
      <h2>Set Token Allowance</h2>
      <p>
        This token is used for submitting proposals in the DAO. You must approve
        the app to use your tokens.
      </p>
      <Formik
        initialValues={{
          amount: currentWallet.tokenBalance,
          addr: currentUser.attributes['custom:account_address'],
        }}
        validate={(values) => {
          const errors = {};
          if (!values.amount) {
            errors.amount = 'Required';
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setLoading(true);
          try {
            await daoService.token.approve(
              daoService.web3.utils.toWei(values.amount),
            );
            setFormSuccess(true);
          } catch (e) {
            console.error(`Approving weth: ${e.toString()}`);
            alert(`Something went wrong. Please try again.`);
            setFormSuccess(false);
          }
          resetForm();
          setLoading(false);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) =>
          !formSuccess ? (
            <Form className="Form FlexCenter">
              <button type="submit" disabled={isSubmitting}>
                Approve
              </button>
            </Form>
          ) : (
            <h2>Approval Sent</h2>
          )
        }
      </Formik>
    </>
  );
};

export default ApproveAllowance;
