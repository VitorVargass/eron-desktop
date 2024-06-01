// Este é o componente Modal que você forneceu.
import React from 'react';
import styled from 'styled-components';

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; // Garantir que o modal esteja acima de outros elementos
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  width: 500px; // Definir uma largura fixa para o modal
  max-width: 90%; // Garantir que seja responsivo
  max-height: 70vh; // Altura máxima antes de começar a rolar
  overflow-y: auto; // Adiciona rolagem vertical se o conteúdo passar de max-height
  position: relative; // Para posicionar o botão de fechar absolutamente
`;

const Modal = ({ onClose, children }) => {
  return (
    <Backdrop onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        {children}
      </ModalContent>
    </Backdrop>
  );
};

export default Modal;
