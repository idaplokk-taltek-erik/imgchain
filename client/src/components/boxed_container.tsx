import { Box, BoxProps, Container, ContainerProps } from '@radix-ui/themes';

const BoxedContainer = (props: ContainerProps & { box?: BoxProps }) => {
  return (
    <Box
      py="4"
      px="4"
      {...props.box}
      style={{
        background: 'var(--sage-surface)',
        borderRadius: 'var(--radius-3)',
        boxShadow: 'var(--kbd-box-shadow)'
      }}
    >
      <Container {...props} />
    </Box>
  );
};

export default BoxedContainer;
