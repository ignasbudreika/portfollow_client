import api from '../api/AuthApi';

class CryptocurrenciesService {
    getCrypto() {
      return api.get('/investment/crypto');
    }

    createCrypto(body: any) {
      return api.post('/investment/crypto', body);
    }
  }
  
  export default new CryptocurrenciesService();