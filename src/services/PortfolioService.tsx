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

    getPortfolioHistory() {
      return api.get('/portfolio/history');
    }
  }
  
  export default new PortfolioService();