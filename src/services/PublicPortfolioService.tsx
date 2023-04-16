import api from '../api/AuthApi';

class PublicPortfolioService {
    getPublicPortfolios(index: number) {
        return api.get('/public/portfolio?index=' + index);
    }

    getPublicPortfolioStats(id: string) {
        return api.get('/public/portfolio/' + id);
    }

    getPublicPortfolioDistribution(id: string) {
        return api.get('/public/portfolio/' + id + '/distribution');
    }

    getPublicPortfolioDistributionByType(id: string, type: string) {
        return api.get('/public/portfolio/' + id + '/distribution?type=' + type);
    }
}

export default new PublicPortfolioService();