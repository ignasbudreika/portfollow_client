import api from '../api/AuthApi';

class InvestmentService {
  createTx(id: string, body: any) {
    return api.post('/investment/' + id + '/tx', body);
  }

  deleteInvestment(id: string) {
    return api.delete('/investment/' + id);
  }

  stopPeriodicInvestments(id: string) {
    return api.post('/investment/' + id + '/stop');
  }
}

export default new InvestmentService();