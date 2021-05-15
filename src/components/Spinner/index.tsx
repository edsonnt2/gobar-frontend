import { Container } from './styles';

const Spinner: React.FC = () => {
  return (
    <Container>
      <div>
        {Array.from({
          length: 9,
        }).map((_, index) => (
          <div key={index.toString()} />
        ))}
      </div>
    </Container>
  );
};

export { Spinner };
