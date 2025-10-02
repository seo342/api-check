import { NextResponse } from "next/server"
import crypto from "crypto"

const API_KEY_SALT = process.env.API_KEY_SALT || "default_salt"

// 더미 발급 키
const RAW_KEY =
  "95e48310119726a7d8c7019526dc14738bc1bad129d17cc5e8a9c3309c829833"

// 서버에 저장된 key_hash라고 가정
const DUMMY_HASHED_KEY = crypto
  .createHash("sha256")
  .update(RAW_KEY + API_KEY_SALT)
  .digest("hex")

function verifyKey(rawKey: string): boolean {
  const hashed = crypto
    .createHash("sha256")
    .update(rawKey + API_KEY_SALT)
    .digest("hex")
  return hashed === DUMMY_HASHED_KEY
}

// ✅ CORS 응답 헬퍼
function withCors(data: object, status = 200) {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}

// ✅ OPTIONS (Preflight 요청 대응)
export async function OPTIONS() {
  return withCors({}, 200)
}

// ✅ GET 방식: Authorization 헤더 검증
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) return withCors({ error: "Unauthorized" }, 401)

    const rawKey = authHeader.replace("Bearer ", "").trim()
    if (!verifyKey(rawKey)) {
      return withCors({ error: "Invalid API Key", received: rawKey }, 403)
    }

    return withCors({
      ok: true,
      message: "✅ GET: API Key 검증 성공",
      received: rawKey,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return withCors({ error: message }, 500)
  }
}

// ✅ POST 방식: 헤더 or body.apiKey 둘 다 허용
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    const body = (await req.json().catch(() => ({}))) as { apiKey?: string }

    // 헤더 우선, 없으면 body.apiKey
    const rawKey = authHeader
      ? authHeader.replace("Bearer ", "").trim()
      : body.apiKey?.trim()

    if (!rawKey) return withCors({ error: "API Key 필요" }, 400)

    if (!verifyKey(rawKey)) {
      return withCors({ error: "Invalid API Key", received: rawKey }, 403)
    }

    return withCors({
      ok: true,
      message: "✅ POST: API Key 검증 성공",
      received: rawKey,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return withCors({ error: message }, 500)
  }
}
