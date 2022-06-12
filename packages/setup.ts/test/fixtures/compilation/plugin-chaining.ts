import { defineSetup, definePlugin } from '@';

const changeBugEmail = definePlugin<{ email: string }>(({ email }) => ({
  bugs: {
    email,
  },
}));

const changeDescription = definePlugin<{ description: string }>(
  ({ description }) => ({
    description,
  }),
);

export default defineSetup({
  name: 'test-name',
  description: 'test-desc',
  version: '1.0.0',
})
  .add(changeBugEmail({ email: 'test@test.de' }))
  .add(changeDescription({ description: 'changed by test plugin 2' }));
