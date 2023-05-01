import api from '../api/AuthApi';

class ConnectionsService {
  getConnections() {
    return api.get('/connection');
  }

  createSpectrocoinConnection(body: any) {
    return api.post('/connection/spectrocoin', body);
  }

  fetchSpectrocoinConnection() {
    return api.post('/connection/spectrocoin/fetch');
  }

  deleteSpectrocoinConnection() {
    return api.delete('/connection/spectrocoin');
  }

  createEthereumWalletConnection(body: any) {
    return api.post('/connection/ethereum', body);
  }

  fetchEthereumWalletConnection() {
    return api.post('/connection/ethereum/fetch');
  }

  deleteEthereumWalletConnection() {
    return api.delete('/connection/ethereum');
  }

  createAlpacaConnection(body: any) {
    return api.post('/connection/alpaca', body);
  }

  fetchAlpacaConnection() {
    return api.post('/connection/alpaca/fetch');
  }

  deleteAlpacaConnection() {
    return api.delete('/connection/alpaca');
  }
}

export default new ConnectionsService();