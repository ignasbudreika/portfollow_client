import { TopNavbar } from './components/TopNavbar';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { selectAuth, useAppSelector } from './app/store';
import { Drawer, Layout } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import Statistics from './pages/Statistics';
import Stocks from './pages/Stocks';
import Cryptocurrencies from './pages/Cryptocurrencies';
import Connections from './pages/Connections';
import SideNavbar from './components/SideNavbar';
import Sider from 'antd/es/layout/Sider';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { showDrawerAtom } from './atoms';

function App() {
  const auth = useAppSelector(selectAuth);

  const [openDrawer, setShowDrawer] = useAtom(showDrawerAtom)

  const onClose = () => {
    setShowDrawer(false);
  };

  const [useDrawer, setUseDrawer] = useState(window.innerWidth < 1250)

  const handleResize = () => {
    if (window.innerWidth < 1200) {
      setUseDrawer(true)
    } else {
      setUseDrawer(false)
    }
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize)
  })

  return <Layout
    style={{ minHeight: "100vh" }}
  >
    <BrowserRouter >
      <Header style={{ backgroundColor: "#F5F5F5" }}>
        <TopNavbar />
      </Header>
      <Layout>
        {auth.accessToken ?
          useDrawer ?
            <Drawer
              width={'100px'}
              height={'100vh'}
              style={{
                backgroundColor: "#F5F5F5",
                overflow: 'auto',
                alignContent: 'center',
                justifyContent: 'center',
                display: 'grid',
              }}
              placement={'left'}
              closable={false}
              onClose={onClose}
              open={openDrawer}
            >
              <SideNavbar></SideNavbar>
            </Drawer> :
            <Sider
              style={{
                backgroundColor: "#F5F5F5",
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
            </Sider> :
          <></>
        }
        <Content>
          <Routes>
            {auth.accessToken ?
              <>
                <Route path="/dash" element={<Statistics />} />
                <Route path="/stocks" element={<Stocks />} />
                <Route path="/currencies" element={<Cryptocurrencies />} />
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
    </BrowserRouter >
  </Layout >;
}

export default App;
