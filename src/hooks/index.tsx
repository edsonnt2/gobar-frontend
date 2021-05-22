import { ToastProvider } from './Toast';
import { AuthProvider } from './Auth';
import { ModalProvider } from './Modal';
import { LoadingProvider } from './Loading';

export * from './Toast';
export * from './Auth';
export * from './Modal';
export * from './Loading';

const ContextProvider: React.FC = ({ children }) => (
  <LoadingProvider>
    <AuthProvider>
      <ToastProvider>
        <ModalProvider>{children}</ModalProvider>
      </ToastProvider>
    </AuthProvider>
  </LoadingProvider>
);

export default ContextProvider;
