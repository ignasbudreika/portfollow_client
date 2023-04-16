import api from '../api/AuthApi';

class StocksService {
  getStocks() {
    return api.get('/investment/stock');
  }

  getStocksStats() {
    return api.get('/investment/stock/stats');
  }

  createStock(body: any) {
    return api.post('/investment/stock', body);
  }
}

export default new StocksService();