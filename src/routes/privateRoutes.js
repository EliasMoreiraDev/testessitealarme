import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useSuapClient from '../login_suap/useSuapClient';
import Loading from '../components/layouts/Loading';
import Cookies from 'js-cookie';
import { ip } from '../components/ip';

export default function PrivateRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const clientID = 'S3uUVTw2uvD0hixw0zsrJxlNJt8aWIPXU70LhtYH';
  const redirectURI = 'http://localhost:3000/times';
  const authHost = 'https://suap.ifro.edu.br';
  const scope = 'identificacao email documentos_pessoais';

  const { getResource, logout, isAuthenticated: checkAuth } = useSuapClient(authHost, clientID, redirectURI, scope);

  useEffect(() => {
    fetch(`http://${ip}:5000/users`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(resp => resp.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Erro ao buscar usuários:', error));
  }, []);

  useEffect(() => {
    const tokenInfo = Cookies.get('suapToken');
    if (tokenInfo) {
      getResource((data) => {
        const userExists = users.some(user => user.identificacao.trim() === data.identificacao.trim());
        if (userExists) {
          setIsAuthenticated(true);
        } else {
          logout();
          setIsAuthenticated(false);
          alert('Você não tem acesso a esta área.');
        }
        setLoading(false);
      });
    } else {
      setIsAuthenticated(checkAuth());
      setLoading(false);
    }
  }, [users]);

  if (loading) return <Loading />;
  return isAuthenticated ? children : <Navigate to="/login" />;
}