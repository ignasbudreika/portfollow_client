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

    createComment(id: string, body: any) {
        return api.post('/public/portfolio/' + id + '/comment', body);
    }

    deleteComment(id: string) {
        return api.delete('/public/portfolio/comment/' + id);
    }
}

export default new PublicPortfolioService();