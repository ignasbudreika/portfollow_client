import api from '../api/AuthApi';

class ConnectionsService {
    getConnections() {
      return api.get('/connection');
    }

    createSpectrocoinConnection(body: any) {
      return api.post('/connection/spectrocoin', body);
    }

    createEthereumWalletConnection(body: any) {
        return api.post('/connection/ethereum', body);
    }
  }
  
  export default new ConnectionsService();