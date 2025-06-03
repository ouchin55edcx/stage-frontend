import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faExclamationTriangle, 
  faInfoCircle, 
  faTimes,
  faQuestion
} from '@fortawesome/free-solid-svg-icons';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
`;

const NotificationItem = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isExiting'].includes(prop),
})`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: ${props => props.isExiting ? slideOut : slideIn} 0.3s ease-out;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => {
      switch (props.type) {
        case 'success': return 'linear-gradient(90deg, #10b981, #059669)';
        case 'error': return 'linear-gradient(90deg, #ef4444, #dc2626)';
        case 'warning': return 'linear-gradient(90deg, #f59e0b, #d97706)';
        case 'info': return 'linear-gradient(90deg, #3b82f6, #2563eb)';
        default: return 'linear-gradient(90deg, #6b7280, #4b5563)';
      }
    }};
  }

  background: ${props => {
    switch (props.type) {
      case 'success': return 'linear-gradient(135deg, #ecfdf5, #d1fae5)';
      case 'error': return 'linear-gradient(135deg, #fef2f2, #fecaca)';
      case 'warning': return 'linear-gradient(135deg, #fffbeb, #fed7aa)';
      case 'info': return 'linear-gradient(135deg, #eff6ff, #dbeafe)';
      default: return 'linear-gradient(135deg, #f9fafb, #f3f4f6)';
    }
  }};

  color: ${props => {
    switch (props.type) {
      case 'success': return '#065f46';
      case 'error': return '#991b1b';
      case 'warning': return '#92400e';
      case 'info': return '#1e40af';
      default: return '#374151';
    }
  }};
`;

const IconWrapper = styled.div`
  margin-right: 12px;
  font-size: 20px;
  color: ${props => {
    switch (props.type) {
      case 'success': return '#059669';
      case 'error': return '#dc2626';
      case 'warning': return '#d97706';
      case 'info': return '#2563eb';
      default: return '#4b5563';
    }
  }};
`;

const MessageWrapper = styled.div`
  flex: 1;
  font-weight: 500;
  line-height: 1.4;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 12px;
  padding: 4px;
  border-radius: 4px;
  color: ${props => {
    switch (props.type) {
      case 'success': return '#059669';
      case 'error': return '#dc2626';
      case 'warning': return '#d97706';
      case 'info': return '#2563eb';
      default: return '#4b5563';
    }
  }};
  
  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

// Confirmation Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const ModalIcon = styled.div`
  font-size: 48px;
  color: #f59e0b;
  margin-bottom: 16px;
`;

const ModalTitle = styled.h3`
  margin: 0 0 12px 0;
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
`;

const ModalMessage = styled.p`
  margin: 0 0 24px 0;
  color: #6b7280;
  line-height: 1.5;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.primary ? `
    background: #ef4444;
    color: white;
    &:hover {
      background: #dc2626;
    }
  ` : `
    background: #f3f4f6;
    color: #374151;
    &:hover {
      background: #e5e7eb;
    }
  `}
`;

// Notification System Component
const NotificationSystem = ({ notifications, removeNotification }) => {
  return (
    <NotificationContainer>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          type={notification.type}
          isExiting={notification.isExiting}
        >
          <IconWrapper type={notification.type}>
            <FontAwesomeIcon icon={getIcon(notification.type)} />
          </IconWrapper>
          <MessageWrapper>{notification.message}</MessageWrapper>
          <CloseButton
            type={notification.type}
            onClick={() => removeNotification(notification.id)}
          >
            <FontAwesomeIcon icon={faTimes} />
          </CloseButton>
        </NotificationItem>
      ))}
    </NotificationContainer>
  );
};

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onCancel}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalIcon>
          <FontAwesomeIcon icon={faQuestion} />
        </ModalIcon>
        <ModalTitle>{title}</ModalTitle>
        <ModalMessage>{message}</ModalMessage>
        <ModalButtons>
          <ModalButton onClick={onCancel}>Annuler</ModalButton>
          <ModalButton primary onClick={onConfirm}>Confirmer</ModalButton>
        </ModalButtons>
      </ModalContent>
    </ModalOverlay>
  );
};

// Helper function to get icon based on type
const getIcon = (type) => {
  switch (type) {
    case 'success': return faCheckCircle;
    case 'error': return faExclamationTriangle;
    case 'warning': return faExclamationTriangle;
    case 'info': return faInfoCircle;
    default: return faInfoCircle;
  }
};

export { NotificationSystem, ConfirmationModal };
