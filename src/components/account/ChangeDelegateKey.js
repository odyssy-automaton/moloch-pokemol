import React, { useState, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import { LoaderContext, DaoServiceContext } from '../../contexts/Store';
import Loading from '../shared/Loading';

const ChangeDelegateKeyForm = () => {
  const [daoService] = useContext(DaoServiceContext);
  const [loading, setLoading] = useContext(LoaderContext);
  const [formSuccess, setFormSuccess] = useState(false);

  return (
    <>
      {loading && <Loading />}

      <h2>Change Delegate Key</h2>
      <Formik
        initialValues={{
          newDelegateKey: '',
        }}
        validate={(values) => {
          const errors = {};
          if (!values.newDelegateKey) {
            errors.newDelegateKey = 'Required';
          }
          if (!daoService.web3.utils.isAddress(values.newDelegateKey)) {
            errors.newDelegateKey = `Not a valid address`;
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setLoading(true);
          try {
            await daoService.mcDao.updateDelegateKey(values.newDelegateKey);
            setFormSuccess(true);
          } catch (e) {
            console.error(`Error changing delegate key: ${e.toString()}`);
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
            <Form className="Form">
              <Field name="newDelegateKey">
                {({ field }) => (
                  <div className={field.value ? 'Field HasValue' : 'Field '}>
                    <label>New Delegate Key</label>
                    <input type="text" {...field} />
                  </div>
                )}
              </Field>
              <ErrorMessage
                name="newDelegateKey"
                render={(msg) => <div className="Error">{msg}</div>}
              />
              <button type="submit" disabled={isSubmitting}>
                Change
              </button>
            </Form>
          ) : (
            <h2>Ragequit Successful</h2>
          )
        }
      </Formik>
    </>
  );
};

export default ChangeDelegateKeyForm;
