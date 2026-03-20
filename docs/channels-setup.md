# Claude Code Channels 設定指南

> Channels 是研究預覽功能，需要 Claude Code v2.1.80 或更新版本。
> 需要 claude.ai 登入，不支援 Console 或 API key 驗證。

## 什麼是 Channels？

Channel 是一個 MCP server，可以將事件推送到你正在執行的 Claude Code session 中。
這讓 Claude 能在你不在終端機時，即時回應外部事件（訊息、警報、webhook）。

Channel 支援雙向通訊：Claude 讀取事件並透過同一個 channel 回覆。

## 前置需求

- [Claude Code](https://code.claude.com) 已安裝並以 claude.ai 帳號驗證
- [Bun](https://bun.sh) 已安裝（channel 插件為 Bun 腳本）
  ```bash
  # 檢查 Bun 是否已安裝
  bun --version

  # 如果未安裝，請執行
  curl -fsSL https://bun.sh/install | bash
  ```
- 團隊/企業版用戶：組織管理員須先啟用 channels

---

## Fakechat（本地測試 Demo）

Fakechat 是官方支援的 demo channel，在 localhost 上執行聊天 UI，無需任何驗證或外部服務。

### 安裝步驟

1. **安裝插件**
   在 Claude Code session 中執行：
   ```
   /plugin install fakechat@claude-plugins-official
   ```

2. **啟動 Claude Code + Fakechat**
   退出 Claude Code，使用 channel 旗標重新啟動：
   ```bash
   claude --channels plugin:fakechat@claude-plugins-official
   ```
   或使用本專案提供的腳本：
   ```bash
   ./src/start-with-channels.sh fakechat
   ```

3. **開啟瀏覽器測試**
   開啟 http://localhost:8787 並輸入訊息，訊息會進入 Claude Code session，Claude 回覆後結果顯示在瀏覽器中。

---

## Telegram

透過 Telegram bot 將訊息推送到 Claude Code session。

### 步驟 1：建立 Telegram Bot

1. 在 Telegram 開啟 [BotFather](https://t.me/BotFather)
2. 發送 `/newbot`
3. 設定顯示名稱和唯一的使用者名稱（需以 `bot` 結尾）
4. 複製 BotFather 回傳的 token

### 步驟 2：安裝插件

在 Claude Code session 中執行：
```
/plugin install telegram@claude-plugins-official
```

### 步驟 3：設定 Token

執行以下指令，將 `<token>` 替換為 BotFather 給的 token：
```
/telegram:configure <token>
```

Token 會儲存到 `.claude/channels/telegram/.env`。
你也可以在啟動 Claude Code 前設定環境變數：
```bash
export TELEGRAM_BOT_TOKEN=<token>
```

> 參考 `.claude/channels/telegram/.env.example` 了解格式。

### 步驟 4：啟動 Claude Code + Telegram

```bash
claude --channels plugin:telegram@claude-plugins-official
```
或使用腳本：
```bash
./src/start-with-channels.sh telegram
```

### 步驟 5：配對帳號

1. 在 Telegram 中向你的 bot 發送任意訊息
2. Bot 會回覆一個配對碼
3. 回到 Claude Code，執行：
   ```
   /telegram:access pair <code>
   ```
4. 鎖定存取權限，僅允許你的帳號：
   ```
   /telegram:access policy allowlist
   ```

---

## 同時啟動多個 Channels

你可以在 `--channels` 後指定多個插件，以空格分隔：
```bash
claude --channels plugin:fakechat@claude-plugins-official plugin:telegram@claude-plugins-official
```
或使用腳本：
```bash
./src/start-with-channels.sh all
```

---

## 安全性

- 每個 channel 維護一個**發送者允許清單（allowlist）**
- 只有你已配對的帳號 ID 可以推送訊息，其他人的訊息會被靜默丟棄
- 透過 `--channels` 控制每個 session 啟用哪些 server
- 僅在 `.mcp.json` 中註冊不足以推送訊息，還需要在 `--channels` 中指定

---

## 企業版/團隊版設定

| 方案類型 | 預設行為 |
|---------|---------|
| Pro / Max（無組織） | 可用，使用者透過 `--channels` 自行啟用 |
| Team / Enterprise | 預設停用，需管理員明確啟用 |

### 啟用方式

管理員可從以下位置啟用：
- [claude.ai → Admin settings → Claude Code → Channels](https://claude.ai/admin-settings/claude-code)
- 或在 managed settings 中將 `channelsEnabled` 設為 `true`

---

## 注意事項

- Channels 為**研究預覽**功能，`--channels` 語法和協議可能會根據回饋而變更
- 預覽期間，`--channels` 僅接受 Anthropic 維護的允許清單中的插件
- 事件僅在 session 開啟時才會送達
- 如果 Claude 遇到權限提示而你不在終端機前，session 會暫停直到你批准
- 回報問題或提供回饋：[Claude Code GitHub](https://github.com/anthropics/claude-code/issues)
