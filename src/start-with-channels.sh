#!/bin/bash
# Claude Code Channels 啟動腳本
# 用法: ./src/start-with-channels.sh [fakechat|telegram|all]

CHANNEL_TYPE="${1:-all}"

case "$CHANNEL_TYPE" in
  fakechat)
    echo "啟動 Claude Code + Fakechat channel..."
    claude --channels plugin:fakechat@claude-plugins-official
    ;;
  telegram)
    echo "啟動 Claude Code + Telegram channel..."
    claude --channels plugin:telegram@claude-plugins-official
    ;;
  all)
    echo "啟動 Claude Code + 所有 channels (Fakechat + Telegram)..."
    claude --channels plugin:fakechat@claude-plugins-official plugin:telegram@claude-plugins-official
    ;;
  *)
    echo "用法: $0 [fakechat|telegram|all]"
    echo "  fakechat  - 啟動 localhost demo channel"
    echo "  telegram  - 啟動 Telegram bot channel"
    echo "  all       - 啟動所有 channels（預設）"
    exit 1
    ;;
esac
