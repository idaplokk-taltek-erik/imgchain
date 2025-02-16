import { trpc } from '../lib/trpc';

export function Greeting() {
  const greeting = trpc.user.list.useQuery();

  return <div>{JSON.stringify(greeting.data)}</div>;
}
