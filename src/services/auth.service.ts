const API_URL = import.meta.env.PUBLIC_API_URL;

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error('Credenciales inválidas');
  }

  return res.json();
}
