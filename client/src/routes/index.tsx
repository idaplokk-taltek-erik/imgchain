import { Button, Flex, Heading, Text } from '@radix-ui/themes';
import { createFileRoute } from '@tanstack/react-router';
import BoxedContainer from '../components/boxed_container';
import LoginDialog from '../components/login_register';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <Flex
      direction="column"
      gapY="4"
      justify="center"
      style={{ height: '70vh' }}
    >
      <BoxedContainer size="3">
        <Flex direction="column" gapY="0">
          <Heading
            size={{
              initial: '8',
              lg: '9',
            }}
          >
            Welcome to MaterialCalc
          </Heading>
          <Text weight="light" mt="2">
            Our website offers fast calculations for materials needed for
            building floors and walls. Choose your wall type, specify dimensions
            and gaps between timber posts, and instantly receive a 3D browsable
            image along with a detailed material table.
          </Text>
        </Flex>
      </BoxedContainer>
      <BoxedContainer size="3">
        <Flex gap="4" justify="end">
          <LoginDialog
            trigger={
              <Button variant="soft" size="3">
                Login / Register
              </Button>
            }
          />
        </Flex>
      </BoxedContainer>
    </Flex>
  );
}

export default Index;
