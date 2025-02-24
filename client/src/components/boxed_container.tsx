import { Box, Container, ContainerProps } from '@radix-ui/themes';

const BoxedContainer = (props: ContainerProps) => {
  return (
    <Box
      py="4"
      px="2"
      style={{
        background: 'var(--gray-a2)',
        borderRadius: 'var(--radius-3)',
      }}
    >
      <Container {...props} />
    </Box>
  );
};

export default BoxedContainer;