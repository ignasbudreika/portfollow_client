import api from '../api/AuthApi';

class InvestmentService {
    createTx(id: string, body: any) {
      return api.post('/investment/' + id + '/tx', body);
    }
  }
  
  export default new InvestmentService();