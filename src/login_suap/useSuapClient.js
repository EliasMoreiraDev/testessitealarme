import { useMemo } from 'react';
import SuapClient from './client';

const useSuapClient = (authHost, clientID, redirectURI, scope) => {
  const suapClient = useMemo(() => new SuapClient(authHost, clientID, redirectURI, scope), [
    authHost,
    clientID,
    redirectURI,
    scope,
  ]);

  return suapClient;
};

export default useSuapClient;