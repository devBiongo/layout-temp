# 💻 インストール手順 (Windows)

このドキュメントでは、Windows 環境に **Node.js 20.19.1 (LTS)** と **Node.js 10** をインストールする方法を説明します。

---

## ✅ 1. Node.js のインストール

### 1.1 Node.js 20.19.1 (LTS) のインストール

1. 以下のリンクから **Node.js 20.19.1 (LTS)** の **zip アーカイブ** をダウンロードします。

   👉 [Node.js 20.19.1 (LTS) zip ダウンロードページ](https://nodejs.org/dist/v20.19.1/node-v20.19.1-x64.zip)

2. ダウンロードした **zip ファイル** を **`C:\develop\frontend\node_home\node-v20`** に解凍します。

### 1.2 Node.js 10 のインストール

1. 以下のリンクから **Node.js 10.x.x (LTS)** の **zip アーカイブ** をダウンロードします。

   👉 [Node.js 10.x.x (LTS) zip ダウンロードページ](https://nodejs.org/dist/v10.24.1/node-v10.24.1-x64.zip)

2. ダウンロードした **zip ファイル** を **`C:\develop\frontend\node_home\node-v10`** に解凍します。

### 1.3🔎 環境変数の設定

Node.js をどこからでも実行できるように、環境変数を設定します。

1. **「スタートメニュー」→「システム環境設定」** を開き、「環境変数」を選択します。
2. **ユーザー環境変数** セクションで、次の変数を追加します：
   - **変数名**: `NODE_HOME`
   - **変数値**: `C:\develop\frontend\node_home\node-v20`
3. さらに **Path** を選び、「編集」をクリックします。
4. 新しいパスを追加します：`%NODE_HOME%`
5. 変更を保存してウィンドウを閉じます。

### 1.4 `node_switch.bat` を作成して Node.js バージョンを切り替える

1. **`C:\develop\frontend\node_home`** フォルダ内に **`node_switch.bat`** という名前の新しいファイルを作成します。
2. このファイルに以下の内容を追加します：

```batch
@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: Set the current directory as the Node version directory
set "NODE_VERSIONS_DIR=%~dp0"
set "NODE_VERSIONS_DIR=%NODE_VERSIONS_DIR:~0,-1%"

echo.
echo Available Node.js versions (%NODE_VERSIONS_DIR%):
echo ========================================================

set /a index=0

for /d %%D in ("%NODE_VERSIONS_DIR%\*") do (
    set /a index+=1
    set "ver[!index!]=%%~nxD"
    echo !index!. %%~nxD
)

echo ========================================================

:selectVersion

set /p sel=Please enter the version number to use :

set "selected=!ver[%sel%]!"

if "%selected%"=="" (
    echo Invalid selection, please try again.
    goto selectVersion
)

set "NEW_NODE_HOME=%NODE_VERSIONS_DIR%\%selected%"

reg query "HKCU\Environment" /v NODE_HOME >nul 2>&1
if %errorlevel%==0 (
    echo Overwriting existing NODE_HOME...
) else (
    echo Creating new NODE_HOME...
)

setx NODE_HOME "%NEW_NODE_HOME%" >nul

echo ✔ Switched to Node.js version "%selected%".
echo ✔ NODE_HOME = %NEW_NODE_HOME%
echo ✔ Please restart the terminal for the changes to take effect.

pause
```

## ✅ 2. pnpm のインストールと配置

```bash
npm install -g pnpm
pnpm -v
pnpm config set registry https://registry.npmmirror.com
```

## ✅ 3.

```bash
cd C:\develop\workspace
git clone https://gitlab.com/your-group/your-project.git
pnpm install
pnpm dev
```
