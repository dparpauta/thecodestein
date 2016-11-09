import React, {PropTypes} from 'react';
import {ButtonToolbar, Button} from 'react-bootstrap';

const Login = ({route}) => (
  <div>
    <h2>Login</h2>
    <ButtonToolbar>
      <Button bsStyle="primary" onClick={route.handleLogin}>Login</Button>
    </ButtonToolbar>
  </div>
);

Login.propTypes = {
  route: PropTypes.object.isRequired
};

export default Login;
