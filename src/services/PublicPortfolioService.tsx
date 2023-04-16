import api from '../api/AuthApi';

class PublicPortfolioService {
    getPublicPortfolios(index: number) {
        return api.get('/public/portfolio?index=' + index);
    }

    getPublicPortfolioStats(id: string) {
        return api.get('/public/portfolio/' + id);
    }
}

export default new PublicPortfolioService();