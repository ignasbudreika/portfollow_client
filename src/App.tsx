import { TopNavbar } from './components/TopNavbar';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { selectAuth, useAppSelector } from './app/store';
import { Layout } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import Statistics from './pages/Statistics';
import Stocks from './pages/Stocks';
import Cryptocurrencies from './pages/Cryptocurrencies';
import Connections from './pages/Connections';
import SideNavbar from './components/SideNavbar';
import Sider from 'antd/es/layout/Sider';

function App() {
  const auth = useAppSelector(selectAuth);

  return <Layout 
    style={{minHeight:"100vh"}}
  >
    <BrowserRouter >
        <Header style={{backgroundColor: "#F5F5F5"}}>
          <TopNavbar />
        </Header>
        <Layout>
          {auth.accessToken ? 
            <Sider 
              style={{backgroundColor: "#F5F5F5",
              overflow: 'auto',
              height: '100vh',
              position: 'fixed',
              left: 0,
              top: 0,
              bottom: 0
              }}
              className="flex-column justify-center"
            >
              <SideNavbar></SideNavbar>
            </Sider> 
            : 
            <div></div>}
          <Content>
              <Routes>
                {auth.accessToken ?
                  <>
                    <Route path="/dash" element={<Statistics />} /> 
                    <Route path="/stocks" element={<Stocks />} /> 
                    <Route path="/crypto" element={<Cryptocurrencies />} /> 
                    <Route path="/connections" element={<Connections />} /> 
                    <Route path="*" element={<Navigate to="/dash" />} />
                  </> :
                  <>
                    <Route path="/" element={<LandingPage />} /> 
                    <Route path="*" element={<Navigate to="/" />} />
                  </>
                }
              </Routes>
          </Content>
        </Layout>
    </BrowserRouter>
  </Layout>;
}

export default App;
