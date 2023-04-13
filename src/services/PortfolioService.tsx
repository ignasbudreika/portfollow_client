import api from '../api/AuthApi';

class PortfolioService {
    getPortfolio() {
      return api.get('/portfolio');
    }

    getPortfolioDistribution() {
      return api.get('/portfolio/distribution');
    }

    getPortfolioDistributionByType(investmentType: string) {
      return api.get('/portfolio/distribution?type=' + investmentType);
    }

    getPortfolioValueHistory(historyType: string) {
      return api.get('/portfolio/history?type=' + historyType);
    }

    getPortfolioProfitLossHistory(historyType: string) {
      return api.get('/portfolio/profit-loss?type=' + historyType);
    }
  }
  
  export default new PortfolioService();