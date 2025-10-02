import { NextResponse } from "next/server"
import crypto from "crypto"

// ⚠️ 테스트용 더미 salt (운영시 .env.local 사용해야 함)
const API_KEY_SALT = "dummy_salt_value"

function hashKey(key: string) {
  return crypto.createHash("sha256").update(key + API_KEY_SALT).digest("hex")
}

// 더미 DB (실제로는 Supabase)
const dummyDb = [
  {
    id: 1,
    user_id: "user-1234",
    rawApiKey: "TEST_KEY_123", // 실제론 DB에 저장 안 함
    key_hash: "",
    site_url: "https://example.com"
  }
]

// 더미 DB에 해시 저장
dummyDb[0].key_hash = hashKey(dummyDb[0].rawApiKey)

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const rawApiKey = authHeader.split(" ")[1]
    const hashedKey = hashKey(rawApiKey)

    const found = dummyDb.find((row) => row.key_hash === hashedKey)

    if (!found) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 403 })
    }

    return NextResponse.json({
      ok: true,
      message: "API Key valid ✅",
      user_id: found.user_id,
      site_url: found.site_url,
      timestamp: new Date().toISOString()
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("API 인증 실패:", message)
    return NextResponse.json({ error: "Internal Server Error", details: message }, { status: 500 })
  }
}
