exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const { celular, mensaje } = JSON.parse(event.body || '{}');
  if (!celular || !mensaje) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Celular y mensaje requeridos' }) };
  }

  const API_KEY  = process.env.INFOBIP_API_KEY;
  const BASE_URL = process.env.INFOBIP_BASE_URL;

  const numero = '57' + celular.replace(/\D/g, '').slice(-10);

  const res = await fetch(`https://${BASE_URL}/sms/2/text/advanced`, {
    method: 'POST',
    headers: {
      'Authorization': 'App ' + API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      messages: [{
        from: 'PlataformaC5',
        destinations: [{ to: numero }],
        text: mensaje
      }]
    })
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      statusCode: res.status,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: data.requestError || 'Error al enviar SMS' })
    };
  }

  const status = data.messages && data.messages[0] ? data.messages[0].status.name : 'UNKNOWN';

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ ok: true, status: status })
  };
};
