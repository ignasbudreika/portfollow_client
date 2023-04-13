import api from '../api/AuthApi';

class SettingsService {
    getUserSettings() {
        return api.get('/settings');
    }
}

export default new SettingsService();