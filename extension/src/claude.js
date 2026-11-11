// The one place that talks to the Claude API.
import Anthropic from "@anthropic-ai/sdk";

export const MODEL = "claude-opus-5-5";

const TOOLS = [
  // Server-side tools: Anthropic runs the searches, nothing runs on this computer.
  { type: "web_search_20260209", name: "web_search", max_uses: 8 },
  { type: "web_fetch_20260209", name: "web_fetch", max_uses: 4 },
];

export function makeClient(apiKey) {
  // The key lives in this browser's extension storage and is sent only to
  // api.anthropic.com. "dangerouslyAllowBrowser" is the SDK's opt-in for
  // running outside a server; it's appropriate here because the person using
  // the extension owns the key. Put a monthly spend limit on it in the Console.
  return new Anthropic({ apiKey, dangerouslyAllowBrowser: true, maxRetries: 2 });
}

/**
 * Runs one turn of the conversation, streaming text as it arrives.
 * `messages` is mutated: the assistant's full content is appended so
 * follow-up questions keep the whole context (including search results).
 *
 * callbacks: onText(fullTextSoFar), onStatus({kind, detail})
 * Returns { stopReason, text }.
 */
export async function runTurn({ client, system, messages, signal, onText, onStatus }) {
  let text = "";

  // A turn that does many searches can pause (stop_reason "pause_turn");
  // sending the conversation back lets the server carry on where it stopped.
  for (let round = 0; round < 5; round++) {
    const stream = client.beta.messages.stream(
      {
        model: MODEL,
        max_tokens: 32000,
        system,
        messages,
        tools: TOOLS,
        thinking: { type: "adaptive" },
        output_config: { effort: "high" },
        // If the model declines on a safety classifier, the API retries on a
        // fallback model inside the same call instead of failing.
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
      },
      { signal },
    );

    stream.on("streamEvent", (event) => {
      if (event.type === "content_block_start") {
        const block = event.content_block;
        if (block.type === "thinking") onStatus({ kind: "thinking" });
        if (block.type === "text") onStatus({ kind: "writing" });
      }
    });
    // The answer arrives as several text blocks (citations split it up).
    // `finished` holds completed blocks; the "text" snapshot is the block
    // currently being written.
    let finished = "";
    stream.on("contentBlock", (block) => {
      if (block.type === "text") finished += block.text;
      if (block.type === "server_tool_use") {
        const input = block.input ?? {};
        if (block.name === "web_search") onStatus({ kind: "searching", detail: input.query });
        if (block.name === "web_fetch") onStatus({ kind: "fetching", detail: input.url });
      }
    });
    stream.on("text", (_delta, snapshot) => onText(text + finished + snapshot));

    const message = await stream.finalMessage();
    messages.push({ role: "assistant", content: message.content });
    text += finished;
    onText(text);

    if (message.stop_reason !== "pause_turn") {
      return { stopReason: message.stop_reason, text };
    }
  }
  return { stopReason: "pause_turn", text };
}

/** Cheap call used by the settings page to check that a key works. */
export async function testKey(apiKey) {
  const client = makeClient(apiKey);
  await client.models.retrieve(MODEL);
}
