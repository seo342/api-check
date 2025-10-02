"use client"

import { useState } from "react"

export default function Home() {
  const [result, setResult] = useState<string>("")
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const callTrafficApi = async () => {
    setStatus("idle")
    setResult("⏳ 호출 중...")

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api-management/test-juice`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_MY_API_KEY}`,
          },
        }
      )

      if (!res.ok) {
        setStatus("error")
        throw new Error(`HTTP ${res.status}`)
      }

      const data = await res.json()
      setStatus("success")
      setResult(JSON.stringify(data, null, 2))
    } catch (err: any) {
      setStatus("error")
      setResult("❌ 호출 실패: " + err.message)
    }
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Dummy Client Site</h1>
      <p className="mb-4">
        이 사이트는 우리 서비스의 API를 호출해서 인증 여부를 확인합니다.
      </p>

      <button
        onClick={callTrafficApi}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        트래픽 API 호출
      </button>

      {/* 상태에 따른 결과 표시 */}
      {status === "success" && (
        <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-md">
          ✅ 인증 성공
          <pre className="mt-2 bg-white p-2 rounded text-sm overflow-x-auto">
            {result}
          </pre>
        </div>
      )}

      {status === "error" && (
        <div className="mt-6 p-4 bg-red-100 text-red-800 rounded-md">
          ❌ 인증 실패
          <pre className="mt-2 bg-white p-2 rounded text-sm overflow-x-auto">
            {result}
          </pre>
        </div>
      )}

      {status === "idle" && result && (
        <pre className="mt-6 p-4 bg-gray-100 rounded-md text-sm">{result}</pre>
      )}
    </main>
  )
}
