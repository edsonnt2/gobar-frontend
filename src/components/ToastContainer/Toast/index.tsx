import { useEffect } from 'react';
import { FiXCircle, FiInfo, FiAlertOctagon, FiCheckCircle } from 'react-icons/fi';
import { AnimatedValue } from 'react-spring';
import { ToastMessage, useToast } from '@/hooks/Toast';
import { Container } from './styles';

interface ToastProps {
  message: ToastMessage;
  style: AnimatedValue<React.CSSProperties>;
}

const Toast: React.FC<ToastProps> = ({ message: { id, message, description, type }, style }) => {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id);
    }, 4000);
    return () => {
      clearTimeout(timer);
    };
  }, [removeToast, id]);

  const icons = {
    info: <FiInfo size={20} />,
    success: <FiCheckCircle size={20} />,
    error: <FiAlertOctagon size={20} />,
  };

  return (
    <Container type={type} hasdescription={Number(!!description)} style={style}>
      {icons[type || 'info']}
      <div>
        <strong>{message}</strong>
        {description && <p>{description}</p>}
      </div>
      <button type="button">
        <FiXCircle size={18} onClick={() => removeToast(id)} />
      </button>
    </Container>
  );
};

export default Toast;
