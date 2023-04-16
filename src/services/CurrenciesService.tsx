import api from '../api/AuthApi';

class CurrenciesService {
  getCurrencies() {
    return api.get('/investment/currency');
  }

  getCurrenciesStats() {
    return api.get('/investment/currency/stats');
  }

  createCurrency(body: any) {
    return api.post('/investment/currency', body);
  }
}

export default new CurrenciesService();