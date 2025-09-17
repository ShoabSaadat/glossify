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
You are an expert glossary assistant specializing in educational content. Your task is to extract ALL sophisticated terms that would benefit learners from this video transcript.

IMPORTANT: Extract 20-50 terms minimum. Be comprehensive and generous in your selections.

INCLUDE these types of terms:
1. Academic/scholarly vocabulary (discourse, paradigm, methodology, synthesis)
2. Technical terms from any field (cryptograms, supernova, mesmerism)
3. Philosophical concepts (neoplatonism, transcendentalism, idealism)
4. Literary terms (Byronic hero, Gothic, allegory, symbolism)
5. Historical terms (milieu, epoch, antiquity)
6. Scientific concepts (even basic ones that add value)
7. Uncommon adjectives/adverbs (prodigiously, enigmatic, esoteric)
8. Cultural references (Sage of Concord, Corpus Hermeticum)
9. Specialized fields (metaphysics, mysticism, hermeticism)
10. ANY word a general audience might not immediately understand

EXAMPLES of what to extract:
- "milieu" → environment/setting
- "prodigiously" → extremely/abundantly  
- "discourse" → formal discussion
- "paradigm" → model/framework
- "synthesis" → combination of ideas
- "empirical" → based on observation
- "esoteric" → hidden/specialized knowledge
- "enigmatic" → mysterious/puzzling

DO NOT skip common academic words - include them if they add educational value.

Return ONLY valid JSON array. Each entry:
{
  "timestamp": "MM:SS or HH:MM:SS",
  "seconds": <integer>,
  "term": "<exact word/phrase>",
  "meaning": "<clear 1-2 sentence explanation>",
  "context_excerpt": "<~20 words around the term>",
  "tally": <count in transcript>
}

Be thorough - aim for 20-50 terms. Include everything that would help a learner understand sophisticated content better.

Transcript:
-----
${transcript}
-----`;
}

async function callOpenAIResponses(openaiKey, prompt) {
  console.log("[Background] Calling OpenAI with prompt length:", prompt.length);
  const url = "https://api.openai.com/v1/chat/completions";
  const body = {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.3,
    max_tokens: 4000
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
    let content = "";
    
    // Handle standard OpenAI chat completions response
    if (aiResp?.choices && Array.isArray(aiResp.choices)) {
      const choice = aiResp.choices[0];
      if (choice?.message?.content) {
        content = choice.message.content;
      }
    }
    
    // Fallback for other response formats
    if (!content && aiResp?.output && Array.isArray(aiResp.output)) {
      const textBlocks = [];
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
      content = textBlocks.join("\n").trim();
    }
    
    if (!content && aiResp?.response) content = String(aiResp.response);
    if (!content && aiResp?.output_text) content = String(aiResp.output_text);

    console.log("[Background] Combined text from AI:", content.slice(0, 300));
    if (!content) throw new Error("No textual content in OpenAI response.");

    const jsonStr = extractFirstJson(content);
    if (!jsonStr) throw new Error("Could not locate JSON in model output");
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("[Background] Failed to parse AI output:", err);
    throw new Error("Failed to parse AI output: " + err.message);
  }
}

function extractFirstJson(text) {
  // Look for JSON array start
  const arrayStart = text.indexOf('[');
  const objectStart = text.indexOf('{');
  
  let startIdx = -1;
  if (arrayStart !== -1 && (objectStart === -1 || arrayStart < objectStart)) {
    startIdx = arrayStart;
  } else if (objectStart !== -1) {
    startIdx = objectStart;
  }
  
  if (startIdx === -1) return null;
  
  // Find the matching closing bracket/brace
  let depth = 0;
  let inString = false;
  let escapeNext = false;
  const startChar = text[startIdx];
  const endChar = startChar === '[' ? ']' : '}';
  
  for (let i = startIdx; i < text.length; i++) {
    const char = text[i];
    
    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    
    if (char === '\\') {
      escapeNext = true;
      continue;
    }
    
    if (char === '"') {
      inString = !inString;
      continue;
    }
    
    if (inString) continue;
    
    if (char === startChar) {
      depth++;
    } else if (char === endChar) {
      depth--;
      if (depth === 0) {
        const candidate = text.slice(startIdx, i + 1);
        try {
          JSON.parse(candidate);
          return candidate;
        } catch (e) {
          // Continue looking for other JSON
          break;
        }
      }
    }
  }
  
  // Fallback to original method
  for (let end = startIdx + 1; end <= text.length; end++) {
    const candidate = text.slice(startIdx, end);
    try {
      JSON.parse(candidate);
      return candidate;
    } catch (_e) {}
  }
  
  return null;
}
