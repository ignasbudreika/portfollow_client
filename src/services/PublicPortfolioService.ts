import api from '../api/AuthApi';

class PublicPortfolioService {
    getPublicPortfolios(index: number) {
        return api.get('/public/portfolio?index=' + index);
    }

    getPublicPortfolio(id: string) {
        return api.get('/public/portfolio/' + id);
    }

    getPublicPortfolioStats(id: string) {
        return api.get('/public/portfolio/' + id + '/stats');
    }

    getPublicPortfolioDistribution(id: string) {
        return api.get('/public/portfolio/' + id + '/distribution');
    }

    getPublicPortfolioDistributionByType(id: string, type: string) {
        return api.get('/public/portfolio/' + id + '/distribution?type=' + type);
    }

    getComments(id: string) {
        return api.get('/public/portfolio/' + id + '/comment');
    }

    createComment(id: string, body: any) {
        return api.post('/public/portfolio/' + id + '/comment', body);
    }

    deleteComment(id: string) {
        return api.delete('/public/portfolio/comment/' + id);
    }
}

export default new PublicPortfolioService();