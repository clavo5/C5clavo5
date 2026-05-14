exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const { celular, password } = JSON.parse(event.body || '{}');
  if (!celular || !password) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Celular y password requeridos' }) };
  }

  const SUPABASE_URL     = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE = process.env.SUPABASE_SERVICE_KEY;

  const email = celular + '@plataformac5.com';

  const resUsers = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(email)}`, {
    headers: {
      'apikey': SUPABASE_SERVICE,
      'Authorization': `Bearer ${SUPABASE_SERVICE}`
    }
  });

  const usersData = await resUsers.json();
  const user = usersData.users && usersData.users[0];

  if (!user) {
    return {
      statusCode: 404,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Usuario no encontrado' })
    };
  }

  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${user.id}`, {
    method: 'PUT',
    headers: {
      'apikey': SUPABASE_SERVICE,
      'Authorization': `Bearer ${SUPABASE_SERVICE}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ password: password })
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      statusCode: res.status,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: data.message || 'Error al cambiar contraseña' })
    };
  }

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ ok: true })
  };
};
