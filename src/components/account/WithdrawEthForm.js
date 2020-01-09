import React, { useState, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import {
  CurrentUserContext,
  LoaderContext,
  DaoServiceContext,
} from '../../contexts/Store';
import Loading from '../shared/Loading';

const WithdrawEthForm = () => {
  const [daoService] = useContext(DaoServiceContext);
  const [currentUser] = useContext(CurrentUserContext);
  const [loading, setLoading] = useContext(LoaderContext);
  const [formSuccess, setFormSuccess] = useState(false);

  return (
    <>
      {loading && <Loading />}

      <h2>Send ETH from your wallet</h2>
      <Formik
        initialValues={{
          amount: '',
          addr: currentUser.attributes['custom:account_address'],
          dist: '',
        }}
        validate={(values) => {
          const errors = {};
          if (!values.amount) {
            errors.amount = 'Required';
          }
          if (!values.dist) {
            errors.dist = 'Required';
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          const weiAmount = daoService.web3.utils.toWei("" + values.amount, "ether")
          const bnAmount = daoService.web3.utils.toBN(weiAmount);

          setLoading(true);
          try {
            await daoService.mcDao.withdrawEth(values.dist, bnAmount);

          } catch (err) {
            console.error(err);

          } finally {
            resetForm();
            setLoading(false);
            setSubmitting(false);
            setFormSuccess(true);
          }
        }}
      >
        {({ isSubmitting }) =>
          !formSuccess ? (
            <Form className="Form">
              <Field name="amount">
                {({ field, form }) => (
                  <div className={field.value ? 'Field HasValue' : 'Field '}>
                    <label>Amount</label>
                    <input
                      min="0"
                      type="number"
                      inputMode="numeric"
                      step="any"
                      {...field}
                    />
                  </div>
                )}
              </Field>
              <ErrorMessage
                name="amount"
                render={(msg) => <div className="Error">{msg}</div>}
              />
              <Field name="dist">
                {({ field, form }) => (
                  <div className={field.value ? 'Field HasValue' : 'Field '}>
                    <label>Destination Address</label>
                    <input type="text" {...field} />
                  </div>
                )}
              </Field>
              <ErrorMessage
                name="dist"
                render={(msg) => <div className="Error">{msg}</div>}
              />
              <button type="submit" disabled={isSubmitting}>
                Send
              </button>
            </Form>
          ) : (
              <h2>Eth Sent</h2>
            )
        }
      </Formik>
    </>
  );
};

export default WithdrawEthForm;
