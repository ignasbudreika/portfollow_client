import api from '../api/AuthApi';

class StocksService {
    getStocks() {
      return api.get('/investment/stock');
    }
  }
  
  export default new StocksService();