import { useState } from "react";
import { verifyTraceEvent } from "../services/trace";

interface VerifyResult {
  valid: boolean;
  event: {
    id: number;
    eventType: string;
    actorName: string;
    timestamp: string;
    blockchainHash?: string;
    signature?: string;
  };
}

export default function VerifyEvent() {
  const [eventId, setEventId] = useState(0);

  const [result, setResult] =
    useState<VerifyResult | null>(null);

  const [status, setStatus] = useState("");

  async function handleVerify(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setStatus("Verifying trace event...");

      const data = await verifyTraceEvent(eventId);

      setResult(data);

      setStatus("Verification complete");

    } catch (err) {
      console.error(err);

      setStatus("Verification failed");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Verify Trace Event</h1>

      <p>
        Verifikasi integritas dan keaslian
        trace event berbasis blockchain.
      </p>

      <hr />

      <form onSubmit={handleVerify}>

        <div>
          <label>Trace Event ID</label>
          <br />

          <input
            type="number"
            value={eventId}
            onChange={(e) =>
              setEventId(Number(e.target.value))
            }
          />
        </div>

        <br />

        <button type="submit">
          Verify Event
        </button>

      </form>

      <br />

      <p>Status: {status}</p>

      <hr />

      {result && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: 20,
            marginTop: 20,
          }}
        >

          <h2>
            Verification Result
          </h2>

          <h3>
            {result.valid
              ? "✅ VALID"
              : "❌ INVALID"}
          </h3>

          <p>
            <strong>Event ID:</strong>{" "}
            {result.event.id}
          </p>

          <p>
            <strong>Event Type:</strong>{" "}
            {result.event.eventType}
          </p>

          <p>
            <strong>Actor:</strong>{" "}
            {result.event.actorName}
          </p>

          <p>
            <strong>Timestamp:</strong>{" "}
            {new Date(
              result.event.timestamp
            ).toLocaleString()}
          </p>

          {result.event.blockchainHash && (
            <p>
              <strong>Blockchain Hash:</strong>
              <br />
              {result.event.blockchainHash}
            </p>
          )}

          {result.event.signature && (
            <p>
              <strong>Digital Signature:</strong>
              <br />
              {result.event.signature}
            </p>
          )}

        </div>
      )}
    </div>
  );
}