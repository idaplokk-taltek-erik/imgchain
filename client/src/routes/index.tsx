import { Button, Flex, Heading, Text } from '@radix-ui/themes';
import { createFileRoute } from '@tanstack/react-router';
import BoxedContainer from '../components/boxed_container';
import LoginDialog from '../components/login_register';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <Flex direction="column" gapY="2" style={{ height: '100vh' }} py="3">
      <BoxedContainer
        box={{ py: '7' }}
        size={{
          initial: '1',
          lg: '2',
        }}
      >
        <Flex direction="column" gapY="0">
          <Heading
            color="crimson"
            size={{
              initial: '7',
              md: '8',
              lg: '9',
            }}
          >
            Welcome to MaterialCalc
          </Heading>
        </Flex>
      </BoxedContainer>
      <BoxedContainer
        box={{ py: '7' }}
        size={{
          initial: '1',
          lg: '2',
        }}
      >
        <Flex direction="column" gapY="0">
          <Text
            weight="light"
            size={{
              initial: '4',
              lg: '5',
              xl: '6',
            }}
            style={{ textAlign: 'justify' }}
          >
            Our website offers fast calculations for materials needed for
            building floors and walls. Choose your wall type, specify dimensions
            and gaps between timber posts, and instantly receive a 3D browsable
            image along with a detailed material table.
          </Text>
        </Flex>
      </BoxedContainer>
      <BoxedContainer
        size={{
          initial: '2',
          lg: '3',
        }}
      >
        <Flex gap="4" justify="end">
          <LoginDialog
            trigger={
              <Button
                variant="soft"
                size={{
                  initial: '2',
                  lg: '3',
                  xl: '4',
                }}
              >
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
