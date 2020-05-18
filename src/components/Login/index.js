import React, { useState } from "react";
import { Button, FormGroup, FormControl } from "react-bootstrap";
import "./Login.css";
import { useHistory } from 'react-router-dom';


export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  function validateForm() {
    return login.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
      fetch('http://0.0.0.0:8080/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({login: login, password: password}),

        }).then(r => {return r.json()})
            .then(data => {
              localStorage.setItem("USER_ID", data.id);
              localStorage.setItem("USER_LOGIN", data.login);
              localStorage.setItem("USER_TOKEN", data.token);
              history.push("/");
            });
    event.preventDefault();
  }

  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="email" bsSize="large">
          {/*<ControlLabel>Email</ControlLabel>*/}
          <FormControl
            autoFocus
            type="text"
            value={login}
            onChange={e => setLogin(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          {/*<ControlLabel>Password</ControlLabel>*/}
          <FormControl
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
          />
        </FormGroup>
        <Button block bsSize="large" disabled={!validateForm()} type="submit">
          Login
        </Button>
      </form>
    </div>
  );
}