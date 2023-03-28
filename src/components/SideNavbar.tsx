import React from 'react';
import {
  FileProtectOutlined,
  LogoutOutlined,
  RiseOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { logout, useAppDispatch } from '../app/store';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Statistics', '1', <RiseOutlined />),
  getItem('Stocks', '2', <FileProtectOutlined />),
  getItem('Explore', '3', <TeamOutlined />),
];

const SideNavbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const logoutUser = () => {
    dispatch(logout());
    navigate('/');
  }

  return (
      <>
        <div style={{ height: 32, margin: 16, backgroundColor: "#121F2B" }} />
        <Menu theme="dark" defaultSelectedKeys={['1']} style={{backgroundColor: "#121F2B"}} items={items} />
      </>
  );
};

export default SideNavbar;