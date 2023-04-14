import api from '../api/AuthApi';

class SettingsService {
    getUserSettings() {
        return api.get('/settings');
    }

    setUserSettings(body: any) {
        return api.patch('/settings', body);
    }
}

export default new SettingsService();