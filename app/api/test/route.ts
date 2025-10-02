import { NextResponse } from "next/server"
import crypto from "crypto"

const API_KEY_SALT = process.env.API_KEY_SALT || "default_salt"

// 더미용 발급 키
const RAW_KEY =
  "95e48310119726a7d8c7019526dc14738bc1bad129d17cc5e8a9c3309c829833"

// 서버에 저장된 key_hash라고 가정
const DUMMY_HASHED_KEY = crypto
  .createHash("sha256")
  .update(RAW_KEY + API_KEY_SALT)
  .digest("hex")

function verifyKey(rawKey: string) {
  const hashed = crypto
    .createHash("sha256")
    .update(rawKey + API_KEY_SALT)
    .digest("hex")

  return hashed === DUMMY_HASHED_KEY
}

// ✅ GET 방식: Authorization 헤더로 키 전달
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const rawKey = authHeader.replace("Bearer ", "").trim()

    if (!verifyKey(rawKey)) {
      return NextResponse.json(
        { error: "Invalid API Key", received: rawKey },
        { status: 403 }
      )
    }

    return NextResponse.json({
      ok: true,
      message: "✅ GET: API Key 검증 성공",
      received: rawKey,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// ✅ POST 방식: body.json() 안에 { apiKey } 전달
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { apiKey?: string }
    const rawKey = body.apiKey?.trim()

    if (!rawKey) {
      return NextResponse.json({ error: "API Key 필요" }, { status: 400 })
    }

    if (!verifyKey(rawKey)) {
      return NextResponse.json(
        { error: "Invalid API Key", received: rawKey },
        { status: 403 }
      )
    }

    return NextResponse.json({
      ok: true,
      message: "✅ POST: API Key 검증 성공",
      received: rawKey,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
