"use client"
import { useState } from "react"

export default function Home() {
  const [result, setResult] = useState("")

  // ✅ GET 방식 호출
  const verifyKeyWithGet = async () => {
    setResult("⏳ GET 요청 중...")
    try {
      const res = await fetch("/api/test", {
        headers: {
          Authorization:
            "Bearer 95e48310119726a7d8c7019526dc14738bc1bad129d17cc5e8a9c3309c829833",
        },
      })
      const data = await res.json()
      setResult("GET 응답:\n" + JSON.stringify(data, null, 2))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      setResult("❌ GET 오류: " + message)
    }
  }

  // ✅ POST 방식 호출
  const verifyKeyWithPost = async () => {
    setResult("⏳ POST 요청 중...")
    try {
      const res = await fetch("/api/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey:
            "95e48310119726a7d8c7019526dc14738bc1bad129d17cc5e8a9c3309c829833",
        }),
      })
      const data = await res.json()
      setResult("POST 응답:\n" + JSON.stringify(data, null, 2))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      setResult("❌ POST 오류: " + message)
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold">Dummy Verify Test</h1>
      <p className="mb-4 text-gray-600">
        GET / POST 두 가지 방식으로 API 키를 검증합니다.
      </p>

      <div className="flex gap-4">
        <button
          onClick={verifyKeyWithGet}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          🔑 GET 방식 검증
        </button>

        <button
          onClick={verifyKeyWithPost}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          🔑 POST 방식 검증
        </button>
      </div>

      {result && (
        <pre className="mt-6 p-4 bg-gray-100 rounded text-sm whitespace-pre-wrap">
          {result}
        </pre>
      )}
    </main>
  )
}
