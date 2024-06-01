import React, { useState } from 'react';
import styled from 'styled-components';
import Global from '../styles/global.js';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f0f2f5; /* Suave fundo cinza */
`;

const StyledForm = styled.form`
  padding: 30px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
`;

const StyledInput = styled.input`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  font-size: 16px;
  &:focus {
    border-color: #0066ff; /* Azul quando focado */
    box-shadow: 0 0 5px rgba(0, 102, 255, 0.5);
    outline: none;
  }
`;

const StyledButton = styled.button`
  background-color: #0066ff;
  width: 60%;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.2s;
  &:hover {
    background-color: #0051cc; /* Escurecer ao passar o mouse */
  }
  &:active {
    transform: scale(0.98); /* Efeito de clique */
  }
`;

const StyledLabel = styled.label`
  font-size: 16px;
  color: #444;
  margin-bottom: 5px;
  width: 85%;
  margin-right: 20px;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
`;

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (username === 'jane' && password === '123') {
      onLogin(true);
    } else {
      setError('Credenciais inválidas!');
      setUsername('');
      setPassword('');
      onLogin(false);
    }
  };


  return (
    <>
    <FormContainer>
      <StyledForm onSubmit={handleSubmit}>
        <StyledLabel>
          Usuário:
          <StyledInput
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </StyledLabel>
        <StyledLabel>
          Senha:
          <StyledInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </StyledLabel>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <StyledButton type="submit">Entrar</StyledButton>
      </StyledForm>
    </FormContainer>
    <Global />
    </>
  );
}

export default Login;
