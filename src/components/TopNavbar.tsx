import { useGoogleLogin } from '@react-oauth/google';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, message } from 'antd';
import { login, logout, selectAuth, useAppDispatch, useAppSelector } from '../app/store';
import { useNavigate } from 'react-router-dom';

import '../styles/topnavbar.css';
import { BarsOutlined, GoogleOutlined, LogoutOutlined } from '@ant-design/icons';
import AuthService from '../services/AuthService';
import { useAtom } from 'jotai';
import { showDrawerAtom } from '../atoms';


export const TopNavbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const auth = useAppSelector(selectAuth);

  const [, setShowDrawer] = useAtom(showDrawerAtom)
  const [messageApi, contextHolder] = message.useMessage();

  const showDrawer = () => {
    setShowDrawer(true);
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

  const success = (message: string) => {
    messageApi.open({
      type: 'success',
      content: message,
    });
  };

  const error = (message: string) => {
    messageApi.open({
      type: 'error',
      content: message,
    });
  };

  const getAccessToken = (authorizationCode: string) => {
    AuthService.retrieveAccessTokenFromAuthenticationCode(authorizationCode)
      .then((res) => {
        if (res.status == 200) {
          dispatch(login({ accessToken: res.data.access_token }));
          navigate('/dash');
          success('Welcome')
        }
      }).catch(() => {
        error('Unable to login. Please try again later')
      });
  }

  const logoutUser = () => {
    dispatch(logout());
    navigate('/');
  }

  const getAuthorizationCode = useGoogleLogin({
    onSuccess: Response => getAccessToken(Response.code),
    flow: 'auth-code',
    redirect_uri: import.meta.env.VITE_OAUTH2_REDIRECT_URI,
  });

  return <div className='topNavigationBar'>
    {contextHolder}
    <div className='leftPartFromMainLogo'>
      {
        useDrawer && auth.accessToken ?
          <BarsOutlined onClick={showDrawer} /> :
          <></>
      }
    </div>
    <div>
      <NavLink to="/" style={{ color: "#121F2B" }}>
        PORTFOLLOW
      </NavLink>
    </div>
    <span className='googleLoginButtonSpan'>
      {auth.accessToken ?
        <Button
          id='logoutButton'
          className='googleLoginButton ant-btn'
          icon={<LogoutOutlined className='googleIcon' />}
          size='small'
          shape='round'
          onClick={() => logoutUser()}
          style={{ borderColor: "#1f1f1f" }}
        >
          {
            useDrawer ? '' : 'Logout'
          }
        </Button>
        :
        <Button
          id='loginButton'
          className='googleLoginButton ant-btn'
          icon={<GoogleOutlined className='googleIcon' />}
          size='small'
          shape='round'
          onClick={() => getAuthorizationCode()}
          style={{ borderColor: "#1f1f1f" }}
        >
          {
            useDrawer ? '' : 'Sign in with Google'
          }
        </Button>
      }
    </span>
  </div >
}
