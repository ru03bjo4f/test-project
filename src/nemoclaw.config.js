/**
 * NemoClaw 推論後端設定
 *
 * 使用方式：
 *   1. 複製此檔案或直接修改
 *   2. 設定環境變數 NVIDIA_API_KEY（用於 NVIDIA 雲端推論）
 *   3. 確保 Ollama 在本地運行（用於本地推論）
 *
 * 環境變數：
 *   NVIDIA_API_KEY    - NVIDIA build.nvidia.com API Key
 *   NEMOCLAW_BACKEND  - 預設後端 ('ollama' | 'nvidia' | 'auto')
 *   OLLAMA_BASE_URL   - Ollama 服務位址（預設 http://localhost:11434）
 *   OLLAMA_MODEL      - Ollama 模型名稱（預設 nemotron-mini）
 */

const config = {
  // 推論後端：'ollama' | 'nvidia' | 'auto'
  // auto = 先試 Ollama，不可用則切換 NVIDIA API
  backend: process.env.NEMOCLAW_BACKEND || 'auto',

  // ── Ollama 本地推論設定 ──
  // 適合開發測試，模型較小但反應快、免費
  // 安裝 Ollama: https://ollama.com
  // 拉取模型: ollama pull nemotron-mini
  baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  model: process.env.OLLAMA_MODEL || 'nemotron-mini',

  // ── NVIDIA API 雲端推論設定 ──
  // 適合正式環境，120B 參數模型，推理能力強
  // 取得 API Key: https://build.nvidia.com
  apiKey: process.env.NVIDIA_API_KEY || '',

  // NVIDIA 雲端模型設定（在 backend='nvidia' 時覆蓋上方 model）
  // 可選模型：nvidia/nemotron-3-super-120b-a12b, moonshotai/kimi-k2.5, 等
  nvidia: {
    baseUrl: 'https://integrate.api.nvidia.com/v1',
    model: process.env.NVIDIA_MODEL || 'moonshotai/kimi-k2.5',
  },
};

module.exports = config;
