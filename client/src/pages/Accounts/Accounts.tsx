import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import AccountsTable from './AccountsTable';
import useAuth from '../../hooks/Auth/useAuth';
import { useEffect } from 'react';

const Accounts = () => {
  const auth = useAuth()
  // useEffect(() => {
    
  // }, [])

  return (
    <>
      <Breadcrumb pageName="Accounts" addButtonLink="/main/accounts/create" />
      <div className="flex flex-col gap-10">
        <AccountsTable />
      </div>
    </>
  );
};

export default Accounts;
