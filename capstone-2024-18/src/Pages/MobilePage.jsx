import React from 'react';
import Header from '../Components/Mobile/Header';
import Intro from '../Components/Mobile/Intro';
import MainContent from '../Components/Mobile/MainContent';

import classes from './MobilePage.module.css';
import Footer from '../Components/Mobile/Footer';

const MobilePage = () => {
  return (
    <div className={classes.container}>
      <div className={classes.oval}/>
      <div className={classes.rectangle}/>
      <Header/>
      <Intro/>
      <MainContent/>
      <Footer/>
    </div>
  );
}

export default MobilePage;
