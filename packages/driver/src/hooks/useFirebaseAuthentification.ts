import { useContext } from 'react';
import { AuthContext } from '@context/auth';

const useFirebaseAuthentication = () => useContext(AuthContext);

export default useFirebaseAuthentication;
