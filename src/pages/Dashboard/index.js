import React, { PureComponent, Fragment } from 'react';
import src from './images/default.png';

export default class IndexComponent extends PureComponent {
  state = {
 
  };
  
  componentDidMount() {

  }

  render() {

    return (
      <Fragment>
        <img src={src} style={{ width: '100%' }}/>
      </Fragment>
    )
  }
}