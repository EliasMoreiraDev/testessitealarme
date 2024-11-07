import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

class Token {
  constructor(value, expirationTimeInSeconds, scope) {
    this.value = value || Cookies.get('suapToken');
    this.startTime = new Date().getTime();
    this.finishTime = new Date(this.startTime + (expirationTimeInSeconds || 0) * 1000) || new Date(Cookies.get('suapTokenExpirationTime'));
    this.scope = scope || Cookies.get('suapScope');

    if (!Cookies.get('suapToken') && this.value) {
      Cookies.set('suapToken', this.value, { expires: new Date(this.finishTime) });
    }
    if (!Cookies.get('suapTokenExpirationTime') && this.finishTime) {
      Cookies.set('suapTokenExpirationTime', this.finishTime.toISOString(), { expires: new Date(this.finishTime) });
    }
    if (!Cookies.get('suapScope') && this.scope) {
      Cookies.set('suapScope', this.scope, { expires: new Date(this.finishTime) });
    }
  }

  getValue = () => this.value;
  getExpirationTime = () => this.finishTime;
  getScope = () => this.scope;
  isValid = () => !!this.value && new Date() < new Date(this.finishTime);

  revoke = () => {
    this.value = null;
    this.startTime = null;
    this.finishTime = null;
    Cookies.remove('suapToken');
    Cookies.remove('suapTokenExpirationTime');
    Cookies.remove('suapScope');
  };
}

class SuapClient {
  constructor(authHost, clientID, redirectURI, scope) {
    this.authHost = authHost.endsWith('/') ? authHost.slice(0, -1) : authHost;
    this.clientID = clientID;
    this.redirectURI = redirectURI;
    this.scope = scope;
    this.resourceURL = `${authHost}/api/eu/`;
    this.authorizationURL = `${authHost}/o/authorize/`;
    this.logoutURL = `${authHost}/o/revoke_token/`;
    this.responseType = 'token';
    this.grantType = 'implicit';
    this.dataJSON = {};
    
    // Inicializar o token aqui
    this.init();
  }

  init = () => {
    const tokenValue = this.extractToken();
    const tokenDuration = this.extractDuration();
    const tokenScope = this.extractScope();
    this.token = new Token(tokenValue, tokenDuration, tokenScope);
    this.dataJSON = {};
  };

  extractToken = () => {
    const match = document.location.hash.match(/access_token=([^&]*)/);
    return match ? match[1] : null;
  };

  extractScope = () => {
    const match = document.location.hash.match(/scope=([^&]*)/);
    return match ? match[1].replace(/\+/g, ' ') : null;
  };

  extractDuration = () => {
    const match = document.location.hash.match(/expires_in=(\d+)/);
    return match ? Number(match[1]) : 0;
  };

  getToken = () => this.token || null;
  getDataJSON = () => this.dataJSON;
  getRedirectURI = () => this.redirectURI;
  isAuthenticated = () => this.token && this.token.isValid();

  getLoginURL = () => {
    return `${this.authorizationURL}?response_type=${this.responseType}&grant_type=${this.grantType}&client_id=${this.clientID}&scope=${this.scope}&redirect_uri=${this.redirectURI}`;
  };

  getRegistrationURL = () => `${this.authHost}/register/?redirect_uri=${this.redirectURI}`;

  getResource = (scope, callback) => {
    if (!this.token || !this.token.isValid()) {
      console.error("Token inválido ou ausente");
      return;
    }

    axios
      .get(this.resourceURL, {
        headers: {
          Authorization: "Bearer " + this.token.getValue(),
          Accept: 'application/json',
        },
        params: { scope },
      })
      .then(response => {
        callback(response.data);
      })
      .catch(error => {
        alert('Falha na comunicação com o SUAP');
        console.error(error);
      });
  };

  login = () => {
    window.location = this.getLoginURL();
  };

  logout = () => {
    if (!this.token || !this.token.getValue()) {
      console.error("Token não encontrado ao tentar deslogar");
      return;
    }

    axios
      .post(this.logoutURL, { token: this.token.getValue(), client_id: this.clientID })
      .then(() => {
        this.token.revoke();
        window.location = this.redirectURI;
      })
      .catch(error => {
        alert('Falha na comunicação com o SUAP');
        console.error(error);
      });
  };
}

export default SuapClient;