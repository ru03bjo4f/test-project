/**
 * NemoClaw 推論客戶端測試
 */

const {
  createClient,
  createOllamaBackend,
  createNvidiaBackend,
  DEFAULTS,
} = require('../src/nemoclaw');

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.log(`  ✗ ${label}`);
    failed++;
  }
}

// ── 單元測試 ──────────────────────────────────────────────

console.log('\n=== NemoClaw 推論客戶端測試 ===\n');

// 1. 預設值
console.log('[Test] DEFAULTS');
assert(DEFAULTS.ollama.baseUrl === 'http://localhost:11434', 'Ollama 預設 URL');
assert(DEFAULTS.ollama.model === 'nemotron-mini', 'Ollama 預設模型');
assert(DEFAULTS.nvidia.baseUrl === 'https://integrate.api.nvidia.com/v1', 'NVIDIA 預設 URL');
assert(DEFAULTS.nvidia.model === 'moonshotai/kimi-k2.5', 'NVIDIA 預設模型');

// 2. 建立 Ollama 後端
console.log('\n[Test] createOllamaBackend');
const ollama = createOllamaBackend({});
assert(ollama.name === 'ollama', 'backend name = ollama');
assert(typeof ollama.chat === 'function', 'has chat()');
assert(typeof ollama.listModels === 'function', 'has listModels()');
assert(typeof ollama.healthCheck === 'function', 'has healthCheck()');

// 3. 建立 NVIDIA 後端
console.log('\n[Test] createNvidiaBackend');
const nvidia = createNvidiaBackend({ apiKey: 'test-key' });
assert(nvidia.name === 'nvidia', 'backend name = nvidia');
assert(typeof nvidia.chat === 'function', 'has chat()');
assert(typeof nvidia.listModels === 'function', 'has listModels()');
assert(typeof nvidia.healthCheck === 'function', 'has healthCheck()');

// 4. 建立客戶端 - 指定後端
console.log('\n[Test] createClient - explicit backend');
const ollamaClient = createClient({ backend: 'ollama' });
assert(ollamaClient.name === 'ollama', 'ollama client name');

const nvidiaClient = createClient({ backend: 'nvidia', apiKey: 'key' });
assert(nvidiaClient.name === 'nvidia', 'nvidia client name');

// 5. 建立客戶端 - auto 模式
console.log('\n[Test] createClient - auto backend');
const autoClient = createClient({ backend: 'auto' });
assert(autoClient.name === 'auto', 'auto client name');
assert(typeof autoClient.chat === 'function', 'auto has chat()');
assert(typeof autoClient.healthCheck === 'function', 'auto has healthCheck()');

// 6. 不支援的後端
console.log('\n[Test] createClient - unsupported backend');
try {
  createClient({ backend: 'invalid' });
  assert(false, 'should throw for invalid backend');
} catch (err) {
  assert(err.message.includes('不支援的後端'), 'throws correct error');
}

// 7. NVIDIA 無 API Key 錯誤
console.log('\n[Test] NVIDIA chat without API key');
const nvidiaNoKey = createNvidiaBackend({ apiKey: '' });
nvidiaNoKey.chat([{ role: 'user', content: 'test' }]).then(() => {
  assert(false, 'should throw without API key');
}).catch((err) => {
  assert(err.message.includes('API Key 未設定'), 'throws API key error');
  printSummary();
});

// 8. Ollama health check（預期失敗，因本地沒有 Ollama）
console.log('\n[Test] Ollama healthCheck (expect fail if no local Ollama)');
ollama.healthCheck().then((result) => {
  console.log(`  → Ollama 狀態: ${result.ok ? '可用' : '不可用'} ${result.error || ''}`);
});

function printSummary() {
  console.log('\n=============================');
  console.log(`結果: ${passed} 通過, ${failed} 失敗`);
  console.log('=============================\n');
  if (failed > 0) process.exit(1);
}
