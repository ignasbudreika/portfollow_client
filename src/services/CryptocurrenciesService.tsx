import api from '../api/AuthApi';

class CryptocurrenciesService {
  getCrypto() {
    return api.get('/investment/crypto');
  }

  getCryptoStats() {
    return api.get('/investment/crypto/stats');
  }

  createCrypto(body: any) {
    return api.post('/investment/crypto', body);
  }
}

export default new CryptocurrenciesService();