import api from '../api/AuthApi';

class TransactionService {
    editTransaction(id: string, body: any) {
        return api.patch('/tx/' + id, body);
    }

    deleteTransaction(id: string) {
        return api.delete('/tx/' + id);
    }
}

export default new TransactionService();