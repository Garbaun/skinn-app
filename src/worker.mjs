export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const p = url.pathname
    const m = request.method
    const CORS = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type"}
    async function json(data, status=200){return new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json",...CORS}})}
    if (m === "OPTIONS") {return new Response(null,{status:204,headers:CORS})}
    async function ensure(){await env.DB.prepare("CREATE TABLE IF NOT EXISTS jobs (id TEXT PRIMARY KEY, image_key TEXT, status TEXT, result TEXT, created_at TEXT)").run();await env.DB.prepare("CREATE TABLE IF NOT EXISTS subscriptions (id INTEGER PRIMARY KEY AUTOINCREMENT, endpoint TEXT, p256dh TEXT, auth TEXT, created_at TEXT)").run()}
    await ensure()
    if (p === "/api/upload" && m === "POST") {
      const body = await request.json()
      const dataUrl = body.dataUrl || ""
      const idx = dataUrl.indexOf(",")
      const b64 = idx>0 ? dataUrl.slice(idx+1) : dataUrl
      const bin = Uint8Array.from(atob(b64), c=>c.charCodeAt(0))
      const key = `img-${crypto.randomUUID()}.jpg`
      await env.IMAGES.put(key, bin)
      return json({ imageKey: key })
    }
    if (p === "/api/analyze" && m === "POST") {
      const body = await request.json()
      const imageKey = body.imageKey || ""
      const id = crypto.randomUUID()
      const now = new Date().toISOString()
      const result = `Analiz tamamlandı: ${imageKey}`
      await env.DB.prepare("INSERT INTO jobs (id,image_key,status,result,created_at) VALUES (?,?,?,?,?)").bind(id,imageKey,"completed",result,now).run()
      return json({ jobId: id, status: "completed" }, 202)
    }
    if (p.startsWith("/api/result/") && m === "GET") {
      const id = p.split("/").pop()
      const row = await env.DB.prepare("SELECT id,image_key,status,result,created_at FROM jobs WHERE id=?").bind(id).first()
      if (!row) return json({ error: "not_found" },404)
      return json(row)
    }
    if (p === "/api/subscribe" && m === "POST") {
      const sub = await request.json()
      const endpoint = sub.endpoint || ""
      const keys = sub.keys || {}
      const p256dh = keys.p256dh || ""
      const auth = keys.auth || ""
      const now = new Date().toISOString()
      await env.DB.prepare("INSERT INTO subscriptions (endpoint,p256dh,auth,created_at) VALUES (?,?,?,?)").bind(endpoint,p256dh,auth,now).run()
      return json({ ok: true })
    }
    return new Response("Not Found",{status:404,headers:CORS})
  }
}