/**
 * NemoClaw 推論客戶端
 * 支援雙後端：Ollama (本地) + NVIDIA API (雲端)
 *
 * 用法：
 *   const { createClient } = require('./nemoclaw');
 *   const client = createClient({ backend: 'ollama' });
 *   const reply = await client.chat('你好');
 */

const http = require('http');
const https = require('https');

// ── 預設設定 ──────────────────────────────────────────────
const DEFAULTS = {
  ollama: {
    baseUrl: 'http://localhost:11434',
    model: 'nemotron-mini',
  },
  nvidia: {
    baseUrl: 'https://integrate.api.nvidia.com/v1',
    model: 'moonshotai/kimi-k2.5',
  },
};

// ── 輔助函式 ──────────────────────────────────────────────

/**
 * 簡易 HTTP/HTTPS JSON 請求（不依賴外部套件）
 */
function jsonRequest(url, options, body) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const transport = parsed.protocol === 'https:' ? https : http;

    const req = transport.request(url, options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const raw = Buffer.concat(chunks).toString();
        if (res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}: ${raw}`));
          return;
        }
        try {
          resolve(JSON.parse(raw));
        } catch {
          reject(new Error(`無法解析回應 JSON: ${raw.slice(0, 200)}`));
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// ── Ollama 後端 ───────────────────────────────────────────

function createOllamaBackend(config) {
  const baseUrl = config.baseUrl || DEFAULTS.ollama.baseUrl;
  const model = config.model || DEFAULTS.ollama.model;

  return {
    name: 'ollama',

    async chat(messages, options = {}) {
      const url = `${baseUrl}/api/chat`;
      const body = {
        model: options.model || model,
        messages,
        stream: false,
        ...(options.temperature != null && { options: { temperature: options.temperature } }),
      };

      const result = await jsonRequest(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }, body);

      return {
        content: result.message?.content || '',
        model: result.model,
        backend: 'ollama',
        usage: {
          prompt_tokens: result.prompt_eval_count || 0,
          completion_tokens: result.eval_count || 0,
        },
      };
    },

    async listModels() {
      const result = await jsonRequest(`${baseUrl}/api/tags`, { method: 'GET' });
      return (result.models || []).map((m) => m.name);
    },

    async healthCheck() {
      try {
        await jsonRequest(`${baseUrl}/api/tags`, { method: 'GET' });
        return { ok: true, backend: 'ollama', baseUrl };
      } catch (err) {
        return { ok: false, backend: 'ollama', error: err.message };
      }
    },
  };
}

// ── NVIDIA API 後端 ───────────────────────────────────────

function createNvidiaBackend(config) {
  const baseUrl = config.baseUrl || DEFAULTS.nvidia.baseUrl;
  const model = config.model || DEFAULTS.nvidia.model;
  const apiKey = config.apiKey || process.env.NVIDIA_API_KEY || '';

  return {
    name: 'nvidia',

    async chat(messages, options = {}) {
      if (!apiKey) {
        throw new Error(
          'NVIDIA API Key 未設定。請設定環境變數 NVIDIA_API_KEY 或在 config 中提供 apiKey'
        );
      }

      const url = `${baseUrl}/chat/completions`;
      const body = {
        model: options.model || model,
        messages,
        ...(options.temperature != null && { temperature: options.temperature }),
        ...(options.max_tokens != null && { max_tokens: options.max_tokens }),
      };

      const result = await jsonRequest(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }, body);

      const choice = result.choices?.[0];
      return {
        content: choice?.message?.content || '',
        model: result.model,
        backend: 'nvidia',
        usage: result.usage || {},
      };
    },

    async listModels() {
      if (!apiKey) return [];
      const result = await jsonRequest(`${baseUrl}/models`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      return (result.data || []).map((m) => m.id);
    },

    async healthCheck() {
      try {
        if (!apiKey) return { ok: false, backend: 'nvidia', error: 'API Key 未設定' };
        await jsonRequest(`${baseUrl}/models`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        return { ok: true, backend: 'nvidia', baseUrl };
      } catch (err) {
        return { ok: false, backend: 'nvidia', error: err.message };
      }
    },
  };
}

// ── 統一客戶端 ────────────────────────────────────────────

/**
 * 建立 NemoClaw 推論客戶端
 *
 * @param {Object} config
 * @param {'ollama'|'nvidia'|'auto'} config.backend - 推論後端（預設 'auto'）
 * @param {string} [config.baseUrl]   - 自訂 API URL
 * @param {string} [config.model]     - 模型名稱
 * @param {string} [config.apiKey]    - NVIDIA API Key
 * @returns {Object} 客戶端實例
 */
function createClient(config = {}) {
  const backendType = config.backend || 'auto';

  const backends = {
    ollama: () => createOllamaBackend(config),
    nvidia: () => createNvidiaBackend(config),
  };

  // auto 模式：優先 Ollama，失敗就切 NVIDIA
  if (backendType === 'auto') {
    const ollama = createOllamaBackend(config);
    const nvidia = createNvidiaBackend(config);

    return {
      name: 'auto',

      async chat(messages, options = {}) {
        // 先試 Ollama
        const ollamaHealth = await ollama.healthCheck();
        if (ollamaHealth.ok) {
          console.log('[NemoClaw] 使用 Ollama 本地推論');
          return ollama.chat(messages, options);
        }

        // Ollama 不可用，嘗試 NVIDIA API
        console.log('[NemoClaw] Ollama 不可用，切換到 NVIDIA API');
        return nvidia.chat(messages, options);
      },

      async listModels() {
        const ollamaHealth = await ollama.healthCheck();
        if (ollamaHealth.ok) return ollama.listModels();
        return nvidia.listModels();
      },

      async healthCheck() {
        const results = await Promise.all([
          ollama.healthCheck(),
          nvidia.healthCheck(),
        ]);
        return {
          backends: results,
          anyAvailable: results.some((r) => r.ok),
        };
      },
    };
  }

  if (!backends[backendType]) {
    throw new Error(`不支援的後端: ${backendType}（可選: ollama, nvidia, auto）`);
  }

  return backends[backendType]();
}

// ── 快捷函式 ──────────────────────────────────────────────

/**
 * 簡單對話（一問一答）
 * @param {string} prompt - 使用者訊息
 * @param {Object} [config] - 客戶端設定
 * @returns {Promise<string>} 回覆文字
 */
async function chat(prompt, config = {}) {
  const client = createClient(config);
  const result = await client.chat([{ role: 'user', content: prompt }]);
  return result.content;
}

module.exports = {
  createClient,
  createOllamaBackend,
  createNvidiaBackend,
  chat,
  DEFAULTS,
};
