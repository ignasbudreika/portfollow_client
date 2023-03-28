import axios from 'axios';
import api from '../api/AuthApi'

class AuthService {
  retrieveAccessTokenFromAuthenticationCode(code: string) {
    var axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_SERVER_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })

    return axiosInstance
      .post("/oauth2/token?grant_type=authorization_code&redirect_uri=" + import.meta.env.VITE_OAUTH2_REDIRECT_URI + "&code=" + code);
  }
}

export default new AuthService();