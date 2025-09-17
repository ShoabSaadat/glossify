// src/background.js
// Service worker: handles network requests (Apify + OpenAI) and acts as a safe place to store API keys.

const DEFAULT_APIFY_TOKEN = "";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["openaiKey", "apifyToken"], (items) => {
    if (!items.apifyToken) chrome.storage.local.set({ apifyToken: DEFAULT_APIFY_TOKEN });
  });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === "RUN_TRANSCRIPT_WORKFLOW") {
    console.log("[Background] Received RUN_TRANSCRIPT_WORKFLOW for", msg.videoUrl);
    runTranscriptWorkflow(msg.videoUrl)
      .then((glossaryJson) => {
        console.log("[Background] Workflow success, items:", glossaryJson.length);
        sendResponse({ success: true, glossary: glossaryJson });
      })
      .catch((err) => {
        console.error("[Background] Workflow failed:", err);
        sendResponse({ success: false, error: String(err) });
      });
    return true;
  }
});

async function runTranscriptWorkflow(videoUrl) {
  console.log("[Background] runTranscriptWorkflow start");
  const { apifyToken, openaiKey } = await getStoredKeys();
  console.log("[Background] Keys loaded", { apifyToken: !!apifyToken, openaiKey: !!openaiKey });

  if (!openaiKey) throw new Error("OpenAI API key missing. Set it in the extension popup.");
  if (!apifyToken) throw new Error("Apify token missing. Set it in the extension popup.");

  const transcript = await fetchTranscriptFromApify(videoUrl, apifyToken);
  console.log("[Background] Transcript fetched, length:", transcript.length);

  if (!transcript || transcript.trim().length === 0) {
    throw new Error("Transcript empty or could not be fetched.");
  }

  console.log("[Background] Sending entire transcript to OpenAI (single request).");
  const prompt = buildPrompt(transcript);
  const aiResp = await callOpenAIResponses(openaiKey, prompt);
  console.log("[Background] OpenAI raw response received", aiResp);

  const parsed = extractJsonFromOpenAIResponse(aiResp);
  console.log("[Background] Parsed JSON entries:", parsed?.length);

  if (!Array.isArray(parsed)) {
    throw new Error("OpenAI did not return expected JSON array. Raw: " + JSON.stringify(aiResp));
  }

  parsed.sort((a, b) => (b.seconds || 0) - (a.seconds || 0));
  console.log("[Background] Workflow finished, entries:", parsed.length);
  return parsed;
}

async function getStoredKeys() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["openaiKey", "apifyToken"], (items) => resolve(items || {}));
  });
}

async function fetchTranscriptFromApify(videoUrl, apifyToken) {
  console.log("[Background] Fetching transcript for", videoUrl);
  const actorId = "scrape-creators~best-youtube-transcripts-scraper";
  const url = `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${apifyToken}`;

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoUrls: [videoUrl] })
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Apify actor failed: ${resp.status} ${resp.statusText} - ${txt}`);
  }

  const items = await resp.json();
  console.log("[Background] Apify returned items:", items.length);
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("No transcript data returned");
  }

  const first = items[0];
  if (!first.transcript || first.transcript.length === 0) {
    throw new Error("Transcript missing in Apify output.");
  }

  return first.transcript.map(it => `[${it.startTimeText}] ${it.text}`).join("\n");
}

function buildPrompt(transcript) {
  return `
You are a precise literary-and-philosophy glossary assistant.

Input: a transcript (from a YouTube video) that includes spoken text and timestamps. Extract sophisticated words/phrases and produce a JSON array of entries.

Each entry must have:
{
  "timestamp": "HH:MM:SS" or "MM:SS",
  "seconds": <integer seconds>,
  "term": "<word or phrase>",
  "meaning": "<plain-English explanation (1–2 sentences)>",
  "context_excerpt": "<short excerpt (~20 words)>",
  "tally": <integer count of appearances in this transcript>
}

- Return strictly valid JSON only.
- Ensure seconds matches timestamp.
- Extract literary, philosophical, or heavy terms.
Transcript:
-----
${transcript}
-----`;
}

async function callOpenAIResponses(openaiKey, prompt) {
  console.log("[Background] Calling OpenAI with prompt length:", prompt.length);
  const url = "https://api.openai.com/v1/responses";
  const body = {
    model: "o3-mini",
    reasoning: { effort: "medium" },
    input: prompt
  };

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${openaiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`OpenAI error ${resp.status}: ${txt}`);
  }
  return resp.json();
}

function extractJsonFromOpenAIResponse(aiResp) {
  try {
    const textBlocks = [];
    if (aiResp?.output && Array.isArray(aiResp.output)) {
      for (const block of aiResp.output) {
        if (block?.content && Array.isArray(block.content)) {
          for (const c of block.content) {
            if (c?.text) textBlocks.push(c.text);
            if (typeof c === "string") textBlocks.push(c);
          }
        } else if (block?.text) {
          textBlocks.push(block.text);
        }
      }
    }
    if (textBlocks.length === 0 && aiResp?.response) textBlocks.push(String(aiResp.response));
    if (textBlocks.length === 0 && aiResp?.output_text) textBlocks.push(String(aiResp.output_text));

    const joined = textBlocks.join("\n").trim();
    console.log("[Background] Combined text from AI:", joined.slice(0, 300));
    if (!joined) throw new Error("No textual content in OpenAI response.");

    const jsonStr = extractFirstJson(joined);
    if (!jsonStr) throw new Error("Could not locate JSON in model output");
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("[Background] Failed to parse AI output:", err);
    throw new Error("Failed to parse AI output: " + err.message);
  }
}

function extractFirstJson(text) {
  const startIdx = Math.min(
    ...["[", "{"].map(ch => {
      const idx = text.indexOf(ch);
      return idx === -1 ? Infinity : idx;
    })
  );
  if (!isFinite(startIdx)) return null;
  for (let end = startIdx + 1; end <= text.length; end++) {
    const candidate = text.slice(startIdx, end);
    try {
      JSON.parse(candidate);
      return candidate;
    } catch (_e) {}
  }
  return null;
}
