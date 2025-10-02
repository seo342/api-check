import { NextResponse } from "next/server"
import crypto from "crypto"

// ⚠️ 실제 운영에서는 절대 이렇게 쓰면 안 되고, .env.local에 넣어야 함!
// 지금은 "흉내내기용"이라서 하드코딩
const API_KEY_SALT = "dummy_salt_value"

function hashKey(key: string) {
  return crypto.createHash("sha256").update(key + API_KEY_SALT).digest("hex")
}

// 더미 DB (실제로는 Supabase 사용)
const dummyDb = [
  {
    id: 1,
    user_id: "user-1234",
    rawApiKey: "TEST_KEY_123", // 유저에게 발급된 키 (원래는 저장 안 함)
    key_hash: "",              // rawApiKey + salt 해시값
    site_url: "https://example.com"
  }
]

// key_hash 미리 계산해서 저장
dummyDb[0].key_hash = hashKey(dummyDb[0].rawApiKey)

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const rawApiKey = authHeader.split(" ")[1]
    const hashedKey = hashKey(rawApiKey)

    // DB에서 key_hash 비교
    const found = dummyDb.find((row) => row.key_hash === hashedKey)

    if (!found) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 403 })
    }

    return NextResponse.json({
      ok: true,
      message: "API Key valid ✅",
      user_id: found.user_id,
      site_url: found.site_url,
      timestamp: new Date().toISOString(),
    })
  } catch (err: any) {
    console.error("API 인증 실패:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
