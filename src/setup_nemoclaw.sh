#!/usr/bin/env bash
# ============================================================
# NVIDIA NemoClaw 安裝與設定腳本
# 用途：檢查前置條件並引導完成 NemoClaw 初始設定
# ============================================================

set -euo pipefail

echo "========================================"
echo " NVIDIA NemoClaw 安裝與設定"
echo "========================================"
echo ""

# ----- 前置條件檢查 -----
echo "[1/5] 檢查作業系統..."
if [[ "$(uname)" != "Linux" ]]; then
  echo "  ⚠ NemoClaw 僅支援 Linux（偵測到: $(uname)）"
  echo "  macOS 使用者需要 Docker Desktop 或 Colima"
fi

echo "[2/5] 檢查 Docker..."
if command -v docker &>/dev/null && docker info &>/dev/null; then
  echo "  ✓ Docker 已安裝且正在運行"
else
  echo "  ✗ Docker 未安裝或未運行"
  echo "  請先安裝 Docker: https://docs.docker.com/get-docker/"
  exit 1
fi

echo "[3/5] 檢查 Node.js (需要 v20+)..."
if command -v node &>/dev/null; then
  NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
  if [ "$NODE_VERSION" -ge 20 ]; then
    echo "  ✓ Node.js $(node -v)"
  else
    echo "  ✗ Node.js 版本過低 ($(node -v))，需要 v20+"
    exit 1
  fi
else
  echo "  ✗ Node.js 未安裝"
  echo "  安裝程式會自動安裝 Node.js，繼續..."
fi

echo "[4/5] 檢查可用磁碟空間 (需要 20GB+)..."
AVAILABLE_GB=$(df -BG . | awk 'NR==2 {print $4}' | sed 's/G//')
if [ "$AVAILABLE_GB" -ge 20 ]; then
  echo "  ✓ 可用空間: ${AVAILABLE_GB}GB"
else
  echo "  ✗ 磁碟空間不足 (${AVAILABLE_GB}GB)，需要至少 20GB"
  exit 1
fi

echo "[5/5] 檢查 port 可用性..."
for PORT in 8080 18789; do
  if lsof -i :"$PORT" &>/dev/null; then
    BLOCKER=$(lsof -i :"$PORT" -t 2>/dev/null | head -1)
    echo "  ✗ Port $PORT 被 PID $BLOCKER 佔用"
    echo "    執行: sudo kill $BLOCKER"
    exit 1
  else
    echo "  ✓ Port $PORT 可用"
  fi
done

echo ""
echo "========================================"
echo " 前置條件檢查通過！"
echo "========================================"
echo ""

# ----- 安裝 NemoClaw -----
if command -v nemoclaw &>/dev/null; then
  echo "NemoClaw 已安裝，跳過安裝步驟。"
else
  echo "正在安裝 NemoClaw..."
  echo "執行: curl -fsSL https://www.nvidia.com/nemoclaw.sh | bash"
  echo ""
  curl -fsSL https://www.nvidia.com/nemoclaw.sh | bash
fi

echo ""
echo "========================================"
echo " 開始 NemoClaw 初始設定"
echo "========================================"
echo ""
echo "提示：設定過程中你需要："
echo "  1. NVIDIA API Key (從 https://build.nvidia.com 取得)"
echo "  2. 選擇沙箱名稱"
echo "  3. 選擇推論模型 (預設: nemotron-3-super-120b-a12b)"
echo ""

nemoclaw onboard

echo ""
echo "========================================"
echo " NemoClaw 設定完成！"
echo "========================================"
echo ""
echo "常用指令："
echo "  nemoclaw <沙箱名稱> connect    # 連線到沙箱"
echo "  nemoclaw <沙箱名稱> status     # 查看狀態"
echo "  nemoclaw <沙箱名稱> logs       # 查看日誌"
echo "  openshell term                  # 啟動監控介面"
echo ""
echo "在沙箱內："
echo "  openclaw tui                    # 互動式聊天介面"
echo '  openclaw agent --agent main --local -m "hello" --session-id test'
