import { ArrowRightIcon, Cross2Icon } from '@radix-ui/react-icons';
import { Button, Dialog, Flex, Text } from '@radix-ui/themes';
import { useMutation } from '@tanstack/react-query';
import { Form } from 'radix-ui';
import { ReactNode, useCallback, useState } from 'react';
import { useTRPC } from '../lib/trpc';

const LoginDialog = ({ trigger }: { trigger: ReactNode }) => {
  const trpc = useTRPC();
  const userCreator = useMutation(trpc.user.create.mutationOptions());
  const [serverError, setServerError] = useState({} as Record<string, string>);

  const submitForm = useCallback(
    (data: { [k: string]: FormDataEntryValue }) => {
      console.log('data2', data);
      userCreator
        .mutateAsync({
          email: data.email as string,
          password_hash: data.password as string,
        })
        .then((data) => {
          if (data.length) {
            setServerError(
              Object.fromEntries(
                data.map(({ field, message }) => [field, message]),
              ),
            );
          } else {
            console.log('TODO login successful')
          }
        })
        .catch((err) => {
          console.log(err.message);
          setServerError(err.message);
        });
    },
    [userCreator],
  );

  return (
    <Dialog.Root onOpenChange={() => setServerError({})}>
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

            console.log('data');
            console.log(data);

            submitForm(data);

            // prevent default form submission
            event.preventDefault();
          }}
          onClearServerErrors={() => setServerError({})}
        >
          <Flex direction="column" gap="3">
            <Form.Field asChild name="email" serverInvalid={!!serverError.email}>
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
                  forceMatch={!!serverError.email}
                >
                  <Text size="1" color="amber">
                    {serverError.email}
                  </Text>
                </Form.Message>
              </Flex>
            </Form.Field>

            <Form.Field name="password" asChild>
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

                <Form.Message
                  asChild
                  match="typeMismatch"
                  forceMatch={!!serverError.password}
                >
                  <Text size="1" color="amber">
                    {serverError.password}
                  </Text>
                </Form.Message>
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
