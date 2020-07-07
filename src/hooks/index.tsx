import React from 'react';

import { ToastProvider } from './Toast';
import { AuthProvider } from './Auth';
import { ModalProvider } from './Modal';

const ContextProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <ToastProvider>
      <ModalProvider>{children}</ModalProvider>
    </ToastProvider>
  </AuthProvider>
);

export default ContextProvider;
