exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const { email, password } = JSON.parse(event.body || '{}');
  if (!email || !password) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Email y password requeridos' }) };
  }

  const SUPABASE_URL     = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE = process.env.SUPABASE_SERVICE_KEY;

  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_SERVICE,
      'Authorization': `Bearer ${SUPABASE_SERVICE}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password, email_confirm: true })
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      statusCode: res.status,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: data.message || 'Error al crear usuario' })
    };
  }

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ id: data.id })
  };
};
