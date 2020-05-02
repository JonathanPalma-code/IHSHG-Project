import React from 'react';
import { Link } from 'react-router-dom';

import Logo from '../../assets/imgs/logo.png';
import './Logo.css';

export default props =>
  <aside className='logo bg-image'>
    <Link to='/' className='logo'>
      <img src={Logo} alt='logo' />
    </Link>
  </aside>
