type RawUser = {id: string; name: string; email: string; password: string};

let users: RawUser[] = [
  {id: '1', name: 'Mock User', email: 'test@demo.com', password: '123456'},
];

const makeToken = (email: string) =>
  `mock.${email.replace(/[^a-zA-Z0-9]/g, '_')}.${Date.now()}`;
export async function mockLogin(email: string, password: string) {
  const u = users.find(
    x =>
      x.email.toLowerCase() === email.toLowerCase() && x.password === password,
  );
  if (!u) throw new Error('Invalid credentials');
  const user = {id: u.id, name: u.name, email: u.email};
  const token = makeToken(u.email);
  return {user, token};
}

export async function mockSignup(
  name: string,
  email: string,
  password: string,
) {
  const exists = users.some(x => x.email.toLowerCase() === email.toLowerCase());
  if (exists) throw new Error('Email already registered');
  const id = String(users.length + 1);
  users.push({id, name, email, password});
  const user = {id, name, email};
  const token = makeToken(email);
  return {user, token};
}
