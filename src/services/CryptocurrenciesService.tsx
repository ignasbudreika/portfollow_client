import api from '../api/AuthApi';

class CryptocurrenciesService {
    getCrypto() {
      return api.get('/investment/crypto');
    }
  }
  
  export default new CryptocurrenciesService();