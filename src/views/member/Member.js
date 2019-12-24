import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import { GET_MEMBER_QUERY } from '../../utils/MemberService';
import MemberDetail from '../../components/member/MemberDetail';
import ErrorMessage from '../../components/shared/ErrorMessage';
import BottomNav from '../../components/shared/BottomNav';
import Loading from '../../components/shared/Loading';

const Member = (props) => {
  const id = props.match.params.id;
  const { loading, error, data } = useQuery(GET_MEMBER_QUERY, {
    variables: { id },
  });

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="View">
      <div className="MemberDetail">
        <MemberDetail member={data.member} />
      </div>
      <BottomNav />
    </div>
  );
};

export default Member;
