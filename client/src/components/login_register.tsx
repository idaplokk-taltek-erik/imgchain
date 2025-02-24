import { ArrowRightIcon, Cross2Icon } from '@radix-ui/react-icons';
import { Button, Dialog, Flex, Text } from '@radix-ui/themes';
import { Form } from 'radix-ui';
import { ReactNode, useState } from 'react';

async function submitForm(data: unknown) {
  console.log(data);
}

const LoginDialog = ({ trigger }: { trigger: ReactNode }) => {
  const [serverErrors, setServerErrors] = useState({
    email: false,
    password: false,
  });

  return (
    <Dialog.Root>
      <Dialog.Trigger>{trigger}</Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>
          <Flex justify="between" align="center">
            <Text>Login or Register</Text>
            <Dialog.Close>
              <Button size="3" variant="ghost">
                <Cross2Icon />
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Title>
        <Dialog.Description size="2" mb="4"></Dialog.Description>

        <Form.Root
          onSubmit={(event) => {
            const data = Object.fromEntries(new FormData(event.currentTarget));

            submitForm(data)
              .then(() => {})
              /**
               * Map errors from your server response into a structure you'd like to work with.
               * In this case resulting in this object: `{ email: false, password: true }`
               */
              // .catch((errors) => setServerErrors(mapServerErrors(errors)));
              .catch((errors) => setServerErrors(errors));

            // prevent default form submission
            event.preventDefault();
          }}
          onClearServerErrors={() =>
            setServerErrors({ email: false, password: false })
          }
        >
          <Flex direction="column" gap="3">
            <Form.Field asChild name="email" serverInvalid={serverErrors.email}>
              <Flex direction="column" gap="1">
                <Form.Label asChild>
                  <Text size="1" weight="bold">
                    Email address
                  </Text>
                </Form.Label>
                <Form.Control type="email" required />
                <Form.Message asChild match="valueMissing">
                  <Text size="1" color="amber">
                    Please enter your email.
                  </Text>
                </Form.Message>
                <Form.Message
                  asChild
                  match="typeMismatch"
                  forceMatch={serverErrors.email}
                >
                  <Text size="1" color="amber">
                    Please provide a valid email.
                  </Text>
                </Form.Message>
              </Flex>
            </Form.Field>

            <Form.Field
              name="password"
              asChild
              serverInvalid={serverErrors.password}
            >
              <Flex direction="column" gap="1">
                <Form.Label asChild>
                  <Text size="1" weight="bold">
                    Password
                  </Text>
                </Form.Label>
                <Form.Control type="password" required />
                <Form.Message asChild match="valueMissing">
                  <Text size="1" color="amber">
                    Please enter a password.
                  </Text>
                </Form.Message>
                {serverErrors.password && (
                  <Form.Message asChild>
                    <Text size="1" color="amber">
                      Please provide a valid email.
                    </Text>
                  </Form.Message>
                )}
              </Flex>
            </Form.Field>
            <Flex justify="end">
              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button variant="soft" color="gray">
                    Cancel
                  </Button>
                </Dialog.Close>
                <Form.Submit asChild>
                  <Button>
                    Next <ArrowRightIcon />
                  </Button>
                </Form.Submit>
              </Flex>
            </Flex>
          </Flex>
        </Form.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default LoginDialog;
