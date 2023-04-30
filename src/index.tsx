import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'antd/dist/reset.css';
import './App.css';
import { ConfigProvider } from 'antd';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: "#1f1f1f",
        colorPrimaryHover: "#c7c4c5"
      },
    }}
  >
    <Provider store={store}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </Provider>
  </ConfigProvider>
);
