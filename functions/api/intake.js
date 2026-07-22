function maintenanceResponse() {
  return new Response(
    JSON.stringify({
      ok: false,
      error: 'The OrkaOS intake service is temporarily unavailable.'
    }),
    {
      status: 503,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'Retry-After': '86400'
      }
    }
  )
}

export const onRequest = maintenanceResponse
