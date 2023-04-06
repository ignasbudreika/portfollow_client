import { TopNavbar } from './components/TopNavbar';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { selectAuth, useAppSelector } from './app/store';
import { Layout } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import Statistics from './pages/Statistics';
import DashNavbar from './components/DashNavbar';
import Stocks from './pages/Stocks';
import Cryptocurrencies from './pages/Cryptocurrencies';
import Connections from './pages/Connections';

function App() {
  const auth = useAppSelector(selectAuth);

  return <Layout 
    style={{minHeight:"100vh"}}
  >
    <BrowserRouter >
          <Header style={{backgroundColor: "#121F2B"}}>
            <TopNavbar />
          </Header>
        <Content>
              {auth.accessToken ? <DashNavbar/> : <></>}
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
        <Footer style={{backgroundColor: "#121F2B", color: "white"}}>
            made by ign
        </Footer>
    </BrowserRouter>
  </Layout>;
}

export default App;
