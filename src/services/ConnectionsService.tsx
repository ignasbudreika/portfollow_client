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

  createEthereumWalletConnection(body: any) {
    return api.post('/connection/ethereum', body);
  }

  fetchEthereumWalletConnection() {
    return api.post('/connection/ethereum/fetch');
  }
}

export default new ConnectionsService();