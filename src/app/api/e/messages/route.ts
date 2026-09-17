import { getPayload } from "payload"
import config from "@payload-config"
import { ELECTRIC_PROTOCOL_QUERY_PARAMS } from "@electric-sql/client"

const ELECTRIC_URL = process.env.ELECTRIC_URL!

export async function GET(request: Request) {
  try {
    const requestURL = new URL(request.url)

    const roomId = requestURL.searchParams.get("roomId")

    if (!roomId) {
      return Response.json(
        {
          message: "roomId is required.",
        },
        {
          status: 400,
        },
      )
    }

    /**
     * Incoming request:
     *
     * /api/e/messages?roomId=1&log=full&offset=-1
     *
     * Electric shape endpoint:
     *
     * /v1/shape
     */
    const electricURL = new URL("/v1/shape", ELECTRIC_URL)

    /**
     * Server-controlled shape configuration.
     */
    electricURL.searchParams.set("table", "messages")

    electricURL.searchParams.set(
      "columns",
      "id,message,message_by,room_id,created_at",
    )

    electricURL.searchParams.set(
      "where",
      "room_id = $1",
    )

    electricURL.searchParams.set(
      "params[1]",
      roomId,
    )

    /**
     * Forward Electric protocol parameters
     * from TanStack DB → Next.js → Electric.
     */
    for (const [key, value] of requestURL.searchParams) {
      if (key === "roomId") {
        continue
      }

      if (ELECTRIC_PROTOCOL_QUERY_PARAMS.includes(key)) {
        electricURL.searchParams.set(key, value)
      }
    }

    /**
     * Safety fallback for initial sync.
     *
     * TanStack normally sends offset=-1.
     */
    if (!electricURL.searchParams.has("offset")) {
      electricURL.searchParams.set("offset", "-1")
    }

    console.log("[Electric Proxy]", {
      roomId,
      requestURL: requestURL.toString(),
      electricURL: electricURL.toString(),
    })

    const response = await fetch(electricURL.toString(), {
      method: "GET",
      cache: "no-store",
    })

    /**
     * Forward Electric response headers.
     */
    const headers = new Headers(response.headers)

    headers.delete("content-encoding")
    headers.delete("content-length")

    headers.set(
      "Cache-Control",
      "no-store",
    )

    /**
     * Electric client needs access to these headers.
     */
    headers.set(
      "Access-Control-Expose-Headers",
      [
        "electric-offset",
        "electric-handle",
        "electric-schema",
      ].join(", "),
    )

    /**
     * Keep CORS explicit for Electric/TanStack requests.
     */
    headers.set(
      "Access-Control-Allow-Origin",
      "*",
    )

    headers.set(
      "Access-Control-Allow-Methods",
      "GET, HEAD, OPTIONS",
    )

    return new Response(
      response.body,
      {
        status: response.status,
        statusText: response.statusText,
        headers,
      },
    )
  } catch (error) {
    console.error(
      "[Electric messages proxy error]",
      error,
    )

    return Response.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Electric messages proxy failed.",
      },
      {
        status: 500,
      },
    )
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Expose-Headers":
        "electric-offset, electric-handle, electric-schema",
    },
  })
}



export async function POST(request: Request) {
  try {
    const body = await request.json()

    const roomId = body.roomId
    const message = String(body.message ?? "").trim()
    const messageBy = body.messageBy

    if (!roomId) {
      return Response.json(
        { message: "roomId is required." },
        { status: 400 },
      )
    }

    if (!message) {
      return Response.json(
        { message: "Message is required." },
        { status: 400 },
      )
    }

    if (!messageBy) {
      return Response.json(
        { message: "messageBy is required." },
        { status: 400 },
      )
    }

    const payload = await getPayload({
      config,
    })

    const createdMessage = await payload.create({
      collection: "messages",
      data: {
        message,
        message_by: messageBy,
        room: roomId,
      },
      depth: 0,
    })

    return Response.json(
      {
        id: createdMessage.id,
        message: createdMessage.message,
        messageBy: createdMessage.message_by,
        room: createdMessage.room,
        createdAt: createdMessage.createdAt,
      },
      {
        status: 201,
      },
    )
  } catch (error) {
    console.error("[Chat Message API]", error)

    return Response.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to create message.",
      },
      {
        status: 500,
      },
    )
  }
}
