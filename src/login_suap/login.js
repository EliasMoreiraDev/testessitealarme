import React, { useEffect } from 'react';
import useSuapClient from './useSuapClient'; 
import './login.css';

const SuapLogin = () => {
  const clientID = 'S3uUVTw2uvD0hixw0zsrJxlNJt8aWIPXU70LhtYH';
  const redirectURI = 'http://localhost:3000/times';
  const authHost = 'https://suap.ifro.edu.br';
  const scope = 'identificacao email documentos_pessoais';

  const suapClient = useSuapClient(authHost, clientID, redirectURI, scope);

  useEffect(() => {
    suapClient.login();
  }, [suapClient]);

  return null;
};

export default SuapLogin;