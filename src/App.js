import GlobalStyle from "./styles/global.js";
import styled from "styled-components";
import Form from "./components/Form.js";
import Grid from "./components/Grid.js";
import Login from "./components/Login.js";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Container = styled.div`
  width: 100%;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;
const Title = styled.h2``;

const LogoutButton = styled.button`
  padding: 8px 16px;
  background-color: #f44336; // Vermelho para destaque
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
  position: fixed; // Fixa o botão na viewport
  bottom: 20px; // 20px do fundo
  left: 20px; // 20px da esquerda
  &:hover {
    background-color: #d32f2f;
  }
`;


const API_URL = "http://localhost:8800";

function App() {
  const [users, setUsers] = useState([]);
  const [onEdit, setOnEdit] = useState(null);
  const [isLoggedIn, setLoggedIn] = useState(false);

  const getUsers = async () => {
    try {
      //const res = await axios.get("http://localhost:8800");
      const res = await axios.get(`${API_URL}/form`);
      setUsers(res.data.sort((a, b) => (a.cliente > b.cliente ? 1 : -1)));
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      getUsers();
    }
  }, [setUsers, isLoggedIn]);

  const handleLogout = () => {
    setLoggedIn(false); // Altera o estado para deslogar o usuário
  };
  

  return (
    <div>
      {!isLoggedIn && <Login onLogin={setLoggedIn} />}
      {isLoggedIn && (
        <div>
          <Container>
            <Title>REGISTROS</Title>
            <Form onEdit={onEdit} setOnEdit={setOnEdit} getUsers={getUsers} />
            <Grid users={users} setUsers={setUsers} setOnEdit={setOnEdit} onEdit={onEdit} />
          </Container>
          <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
          <ToastContainer autoClose={3000} />
          <GlobalStyle />
        </div>
      )}
    </div>
  );
}
export default App;