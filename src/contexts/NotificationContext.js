import React, { createContext, useContext } from 'react';
import useNotification from '../hooks/useNotification';
import { NotificationSystem, ConfirmationModal } from '../components/NotificationSystem';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const notificationMethods = useNotification();

  return (
    <NotificationContext.Provider value={notificationMethods}>
      {children}
      <NotificationSystem 
        notifications={notificationMethods.notifications}
        removeNotification={notificationMethods.removeNotification}
      />
      <ConfirmationModal 
        isOpen={notificationMethods.confirmationModal.isOpen}
        title={notificationMethods.confirmationModal.title}
        message={notificationMethods.confirmationModal.message}
        onConfirm={notificationMethods.confirmationModal.onConfirm}
        onCancel={notificationMethods.confirmationModal.onCancel}
      />
    </NotificationContext.Provider>
  );
};
