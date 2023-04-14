import api from '../api/AuthApi';

class PublicPortfolioService {
    getPublicPortfolios(index: number) {
        return api.get('/public/portfolio?index=' + index);
    }
}

export default new PublicPortfolioService();