import { useTransition } from 'react-spring';
import { ToastMessage } from '../../hooks/Toast';
import { Container } from './styles';
import Toast from './Toast';

interface ToastContainerProps {
  messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
  const transitions = useTransition(messages, ({ id }) => id, {
    from: {
      left: '-120%',
      opacity: 0,
    },
    enter: {
      left: '0',
      opacity: 1,
    },
    leave: {
      left: '-120%',
      opacity: 0,
    },
  });

  return (
    <Container>
      {transitions.map(({ item, props, key }) => (
        <Toast key={key} message={item} style={props} />
      ))}
    </Container>
  );
};

export default ToastContainer;
