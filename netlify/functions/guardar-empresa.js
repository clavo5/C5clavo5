exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const body = JSON.parse(event.body || '{}');
  const { Nombre_Empresa, Celular, auth_user_id } = body;

  if (!Nombre_Empresa || !Celular || !auth_user_id) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Datos incompletos' }) };
  }

  const SUPABASE_URL     = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE = process.env.SUPABASE_SERVICE_KEY;

  const payload = { Nombre_Empresa, Celular, auth_user_id };
  if (body['Nombre del responsable']) payload['Nombre del responsable'] = body['Nombre del responsable'];

  const res = await fetch(`${SUPABASE_URL}/rest/v1/Tbl_Empresa`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_SERVICE,
      'Authorization': `Bearer ${SUPABASE_SERVICE}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      statusCode: res.status,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: data.message || data.details || 'Error al guardar empresa' })
    };
  }

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(Array.isArray(data) ? data[0] : data)
  };
};
