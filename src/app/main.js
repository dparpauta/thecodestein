import React, {Component} from 'react';
import {Header} from './header';
import {Footer} from './footer';
require('./configuration/prismConfiguration');

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%'
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  }
};

export class Main extends Component {
  render() {
    return (
      <div style={styles.container}>
        <Header/>
        <main style={styles.main}>
        </main>
        <Footer/>
      </div>
    );
  }
}
