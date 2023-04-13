import { useGoogleLogin } from '@react-oauth/google';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from 'antd';
import { login, logout, selectAuth, useAppDispatch, useAppSelector } from '../app/store';
import { useNavigate } from 'react-router-dom';

import '../styles/topnavbar.css';
import { GoogleOutlined, LogoutOutlined } from '@ant-design/icons';
import AuthService from '../services/AuthService';


export const TopNavbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const auth = useAppSelector(selectAuth);

  const getAccessToken = (authorizationCode: string) => {
    AuthService.retrieveAccessTokenFromAuthenticationCode(authorizationCode)
      .then((res) => {
        if (res.status == 200) {
          dispatch(login({ accessToken: res.data.access_token }));
          navigate('/dash');
        }
      }).catch(err => { })
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
    <div className='leftPartFromMainLogo'></div>
    <div>
      <NavLink to="/" style={{ color: "#121F2B" }}>
        PORTFOLLOW
      </NavLink>
    </div>
    <span className='googleLoginButtonSpan'>
      {auth.accessToken ?
        <Button
          className='googleLoginButton ant-btn'
          icon={<LogoutOutlined className='googleIcon' />}
          size='small'
          shape='round'
          onClick={() => logoutUser()}
        >
          Logout
        </Button>
        :
        <Button
          className='googleLoginButton ant-btn'
          icon={<GoogleOutlined className='googleIcon' />}
          size='small'
          shape='round'
          onClick={() => getAuthorizationCode()}
        >
          Sign in with Google
        </Button>
      }
    </span>
  </div>
}
