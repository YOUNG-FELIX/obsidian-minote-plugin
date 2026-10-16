# Obsidian Plugin: 小米笔记同步插件

> 本仓库为 [obsidian-minote-plugin](https://github.com/emac/obsidian-minote-plugin) 的移动端适配分支（非官方）。
> 原插件作者：Emac Shen，MIT 协议。
> 当前适配版版本：**v0.2.26**（桌面端 / iOS / Android 通用）。
> 本分支改动：
> - 登录改为手动粘贴 Cookie 方案，替代 Electron 弹窗抓包（移动端无 Electron），桌面端同样可用
> - 移除 Electron/Node 专属依赖（fs / path / BrowserWindow），改用 Obsidian 跨端 API
> - manifest 设置 isDesktopOnly: false，移动端可正常加载
> - 新增同步范围控制（按文件夹 / 按笔记，可仅同步或排除指定项）
> - 新增图片下载并发数设置、帮助与排查面板、脱敏设置导出
> - 图片按笔记名重命名（单图无序号；多图 -01、-02…），不再使用服务端 hash 文件名
> - 桌面端原有功能保持不变

## 移动端使用方法（适配版新增）

### 一、安装到 Obsidian 移动端

插件文件夹为 `minote-sync`，包含 3 个文件：`main.js`、`manifest.json`、`versions.json`。请到本仓库 [Releases](https://github.com/YOUNG-FELIX/obsidian-minote-plugin/releases) 下载最新版安装包，解压后放到 Vault 下的 `.obsidian/plugins/minote-sync/` 目录。

- **Android**：文件管理器进入 Vault → `.obsidian/plugins/`（没有就新建）→ 新建 `minote-sync` 文件夹放入 3 个文件 → 回 Obsidian 设置 → 第三方插件 → 启用 Minote Sync。
- **iOS**：用「文件」App 进入 `Vault/.obsidian/plugins/`（看不到 `.obsidian` 就开启“显示隐藏文件”）→ 新建 `minote-sync` 文件夹放入文件 → 回 Obsidian 启用；若看不到，退出 Obsidian 重进一次。
- 也可在电脑 Obsidian 放好插件文件夹，再用 iCloud / 网盘把 Vault 同步到手机。

### 二、登录（粘贴 Cookie）

移动端没有 Electron，登录改为手动粘贴 Cookie，桌面端移动端通用：

1. 电脑或手机浏览器打开 https://i.mi.com/note/h5，登录小米账号（支持扫码）；
2. 按 F12 打开开发者工具 → Application（应用）→ Cookies → 选择 `i.mi.com`；若浏览器里看不到 Cookie，可先访问一次 https://i.mi.com/note/h5 再刷新开发者工具；
3. 复制全部 Cookie（形如 `xxx=yyy; aaa=bbb` 的整段）；
4. 回 Obsidian 设置 → Minote Sync → 登录 → 粘贴到输入框 → 【保存并验证】；
5. 显示「登录成功 + 用户名」即完成。Cookie 失效时重复此流程，或点【刷新Cookie】去粘贴新 Cookie。

桌面端默认会自动弹出浏览器窗口登录、扫码后自动完成；当自动登录不可用时，会自动切换为上面的手动粘贴 Cookie 方式。

### 三、同步

- **增量同步**：左侧边栏云朵图标，或设置页「增量同步」按钮，只更新有变化的笔记；
- **强制同步**（首次使用建议）：设置页「强制同步」按钮，或命令面板输入 Minote 选择「强制同步小米笔记」，会全量覆盖更新。

同步默认保存到 Vault 的 `minote/` 文件夹（设置里可改）。同步进行中请勿重复点击。

### 四、同步范围与高级设置（v0.2.24）

- **同步文件夹范围**：默认「全部同步」，可改为「仅同步指定文件夹」或「排除指定文件夹」。点击「管理文件夹列表」，在弹窗中搜索、勾选文件夹（包含「未分类」「摘录」两个虚拟文件夹）。
- **同步笔记范围**：默认「全部同步」，可改为「仅同步指定笔记」或「排除指定笔记」。点击「管理笔记列表」，输入关键字（如：旅行、周报）拉取笔记后勾选。
- 范围设置**只影响后续继续同步更新哪些内容，不会删除本地已经同步的文件**。
- **图片下载并发数**（高级设置）：同步一篇笔记时同时下载的图片数量，可选 2 / 4 / 8（推荐）/ 无限制；数值越大越快，但越容易触发小米云风控，遇到图片下载失败可调低。
- **帮助与排查**：设置页问号按钮，内置常见报错（401/403 登录态失效、同步失败、图片下载失败、如何查看错误日志、安全提示）的原因与处理方法。
- **拷贝设置到剪切板（Cookie 已脱敏）**：一键复制插件设置用于反馈排查，Cookie 会自动脱敏。

### 五、已知限制

- 移动端无法设置文件时间戳（系统限制），不影响内容与增量同步；
- 原版右键菜单的强制同步仅桌面端有效，移动端用设置页按钮或命令面板；
- Cookie 为敏感凭据：保存在插件 `data.json` 中，请勿分享 Vault 数据或 `data.json` 给他人；粘贴后请清空剪贴板；
- 注销仅清理本地 Cookie，不会登出小米账号云端会话；如需彻底退出云端会话，请在浏览器登录 https://i.mi.com 后点击右上角头像退出；
- 保存 Cookie 前会先验证，验证失败不会清除已有有效 Cookie。

### 六、图片命名规则（v0.2.25）

笔记图片统一保存在笔记所在文件夹的 `img/` 目录下，并以**笔记名称**命名，不再使用服务端 hash 字符串文件名：

- 笔记只有 **1 张图片**：直接命名为 `笔记名.jpg`；
- 笔记有 **多张图片**：按图片在笔记正文中出现的顺序命名为 `笔记名-01.jpg`、`笔记名-02.jpg`……序号固定两位（10 张以上也能正确排序）；
- 文件名会自动清洗 `\ / : * ? " < > | # % [ ]` 等会破坏 Markdown 链接的字符，并限制长度；
- 升级到 v0.2.25 后首次同步，旧的 hash 命名图片会自动迁移为新名称，笔记中的引用同步更新；个别图片下载失败时会保留其原始标记，不会影响其他图片。

## 适配版更新内容（v0.2.26）

- 版本推进，重新构建发布；内容与 v0.2.25 一致。

## 适配版更新内容（v0.2.25）

- 同步的笔记图片改为**以笔记名命名**：单图无序号，多图按正文出现顺序追加 `-01`、`-02`（两位序号），替代此前的服务端 hash 字符串文件名。
- 图片 Markdown 引用同步改写；升级后首次同步自动清理旧 hash 命名图片；下载失败的图片保留原始标记、不影响其余内容。
- 文件名自动清洗非法字符（含会破坏 wikilink 的 `# % [ ]`），空标题与重名情况均有兜底。

## 适配版更新内容（v0.2.24）

相对上一版（v0.2.2）的主要变化：

- 新增**同步文件夹范围**控制：全部同步 / 仅同步指定文件夹 / 排除指定文件夹，支持搜索与多选（含「未分类」「摘录」）。
- 新增**同步笔记范围**控制：全部同步 / 仅同步指定笔记 / 排除指定笔记，按关键字拉取列表后多选。
- 新增**图片下载并发数**设置（高级设置，默认 8），缓解图片接口风控限流。
- 新增**帮助与排查**弹窗，覆盖登录态失效（401/403）、同步失败、图片下载失败、查看日志、安全提示。
- 新增**拷贝设置到剪切板（Cookie 已脱敏）**与本地调试入口，方便反馈问题。
- 登录弹窗内置三步粘贴指引；桌面端自动登录不可用时自动回退手动粘贴；Cookie 失效 / 风控提示更明确。
- 修复仅大小写不同的文件夹重命名在大小写不敏感文件系统（Windows / macOS）上的报错。
- 同步增加防重复点击提示；失败篇数会在同步结束后提示，再次同步自动重试。

各版本安装包与历史说明见本适配分支的 [Releases](https://github.com/YOUNG-FELIX/obsidian-minote-plugin/releases)。

[![GitHub license](https://badgen.net/github/license/Naereen/Strapdown.js)](https://github.com/emac/obsidian-minote-plugin/blob/master/LICENSE)
[![Github all releases](https://img.shields.io/github/downloads/emac/obsidian-minote-plugin/total.svg)](https://GitHub.com/emac/obsidian-minote-plugin/releases)
[![GitLab latest release](https://badgen.net/github/release/emac/obsidian-minote-plugin/all)](https://github.com/emac/obsidian-minote-plugin/releases)

Obsidian 小米笔记同步插件是一个社区插件，用来将[小米笔记](https://i.mi.com/note/h5#/)转换为 Markdown 格式保存到 Obsidian 指定的文件夹中。首次使用，如果笔记数量较多，更新会比较慢，后面再去更新的时候只会增量更新有变化的笔记，一般速度很快。

## 更新历史
- 适配版（含移动端安装包）：https://github.com/YOUNG-FELIX/obsidian-minote-plugin/releases
- 上游原版：https://github.com/emac/obsidian-minote-plugin/releases

## 功能
- 按文件夹存放笔记，同时保留笔记的创建时间和修改时间
- 自动下载笔记中的图片，并将引用方式替换成 Markdown 格式
- 图片以笔记名称命名（单图无序号；多图按出现顺序追加 -01、-02…），不再使用服务端 hash 文件名（适配版 v0.2.25 新增）
- 替换 `<background>` 标签为 `<span>` 标签，以支持文字高亮
- 去除多余的 `<text>`、`<new-format/>` 标签
- 兼容旧版本无标题笔记（根据首行内容和笔记 ID 自动生成标题）
- 支持强制同步模式，即全量覆盖更新
- 支持按文件夹 / 按笔记限定同步范围（适配版新增）
- 支持非中国区的小米云服务

## 安装方法
打开 Obsidian 的设置页面，点选左侧`第三方插件`，点击`关闭安全模式`按钮以启用第三方插件，点击社区插件市场的`浏览`按钮，搜索 `minote`，找到 `Minote Sync` 插件，然后安装和启用。移动端或无法访问市场时，可直接在本适配分支 [releases](https://github.com/YOUNG-FELIX/obsidian-minote-plugin/releases) 页面手动下载最新版本安装包。

## 设置
1. 打开 Obsidian 的设置页面，找到 `Minote Sync` 进入到插件设置页面
2. 点击右侧 `登录` 按钮，桌面端可扫码自动登录，移动端按弹窗指引粘贴 Cookie；登录完成后，会显示个人昵称
3. 注销登录可以清除插件的 Cookie 信息，注销方法和网页版小米云服务一样，右上角点击头像，点击退出
4. 设置笔记保存位置，默认保存到 `/minote` 文件夹，可以修改为其他位置
5. 需要只同步部分内容时，在「同步文件夹范围」「同步笔记范围」中设置；图片并发等在「高级设置」中调整

![](/minote-sync-settings.jpg)

## 使用
⚠️ 本插件采用覆盖式更新，请不要在同步的文件里修改内容。

增量同步：点击左侧 Ribbon 上的小米笔记按钮(![](/cloud-download.png))，或者 `command+P(windows ctrl+P)` 调出 Command Pattle 输入 `Minote` 找到`同步小米笔记`并点击。

全量同步：右键点击左侧 Ribbon 上的小米笔记按钮(![](/cloud-download.png))然后选择`强制同步小米笔记`，或者 `command+P(windows ctrl+P)` 调出 Command Pattle 输入 `Minote` 找到`强制同步小米笔记`并点击。

## 已知问题
- 一段时间不使用本插件，Cookie 可能会失效，需要到插件设置页面手动刷新Cookie。
- 偶尔可能会有网络连接问题，重新点击同步即可，已同步的笔记不会再次更新。
- 本插件采用覆盖式更新，不会自动清理已删除的笔记，如需清理过期笔记，请先删除本地笔记文件夹，然后执行一次全量同步。

## TODO
- [ ] 支持思维笔记
- [ ] 支持待办
- [x] 支持移动端（适配版已支持）

## 赞赏
<img src="/wechat-sponsors.jpg" width=30% />

## 免责声明
所有笔记内容均来自小米云服务，用户登录即授权本插件同步用户的笔记内容到本地。

## 感谢
- [Weread Plugin](https://github.com/zhaohongxuan/obsidian-weread-plugin)
- [minote-Obsidian](https://github.com/yulittlemoon/minote-Obsidian)
- [Obsidian Plugin Developer Docs](https://marcus.se.net/obsidian-plugin-docs/)

---

# Obsidian Plugin: Minote Sync Plugin (Mobile-adapted fork)

> This repository is an **unofficial mobile-adapted fork** of [obsidian-minote-plugin](https://github.com/emac/obsidian-minote-plugin) by Emac Shen (MIT licensed).
> Current fork version: **v0.2.26**, works on desktop, iOS and Android.
> Fork changes:
> - Login uses a manual Cookie paste flow instead of the Electron popup (there is no Electron on mobile); it works on desktop too.
> - Electron/Node-only dependencies (fs / path / BrowserWindow) are replaced with cross-platform Obsidian APIs.
> - `isDesktopOnly` is set to `false` in the manifest so the plugin loads on mobile.
> - Adds sync-scope controls (include/exclude selected folders or notes), image download concurrency setting, an in-app help/troubleshooting panel and redacted settings export.
> - Note images are renamed after the note title (no suffix for a single image; `-01`, `-02`... for multiple) instead of server hash names.
> - All original desktop features remain unchanged.

This community plugin syncs your [Xiaomi notes](https://i.mi.com/note/h5#/) to Obsidian by converting them to Markdown format and saving in a specified folder. The initial sync might be slow if you have many notes, but subsequent syncs will only update changed notes incrementally.

## Install on mobile / Download

Download the latest install zip from this fork's [Releases](https://github.com/YOUNG-FELIX/obsidian-minote-plugin/releases), unzip it into `<Vault>/.obsidian/plugins/minote-sync/` (you should get `main.js`, `manifest.json`, `versions.json`), then enable **Minote Sync** under Community plugins.

- **Android**: use a file manager to create `.obsidian/plugins/minote-sync/` inside your Vault and copy the three files in, then enable the plugin.
- **iOS**: use the Files app to create the folder (enable "show hidden files" if `.obsidian` is invisible), copy the files, then enable the plugin; restart Obsidian once if it does not appear.
- You can also install the plugin in the desktop app and sync the Vault to your phone via iCloud / your cloud drive.

## Login (paste Cookie)

1. Open https://i.mi.com/note/h5 in a browser and sign in to your Xiaomi account (QR code supported).
2. Open DevTools (F12) → Application → Cookies → `i.mi.com`. If you cannot see the cookies, visit https://i.mi.com/note/h5 once first and then refresh DevTools.
3. Copy the entire Cookie string (shaped like `xxx=yyy; aaa=bbb`).
4. In Obsidian: Settings → Minote Sync → Login → paste it → **Save and verify**.
5. A success message with your username means you are logged in. When the Cookie expires, click **Refresh Cookie** and paste a new one.

On desktop the plugin can still pop up a browser window for QR login; it automatically falls back to the Cookie paste flow when automatic login is unavailable.

## Syncing and new options (v0.2.24)

- **Incremental sync**: the cloud icon in the left ribbon or the "Incremental sync" button in settings.
- **Force sync** (recommended for the first run): the "Force sync" button in settings, or the "Force sync Xiaomi notes" command in the Command Palette. It overwrites all notes.
- **Folder scope**: All (default) / Include selected folders / Exclude selected folders. Pick folders in a searchable multi-select dialog (including the virtual "Unsorted" and "Excerpts" folders).
- **Note scope**: All (default) / Include selected notes / Exclude selected notes. Search notes by keyword and pick them in the dialog.
- Scope only affects which content keeps updating on future syncs; it never deletes files already saved locally.
- **Image download concurrency** (under Advanced settings): 2 / 4 / 8 (recommended) / unlimited. Lower it if image downloads fail due to rate limiting / risk control.
- **Help & troubleshooting**: the question-mark button in settings lists common errors (401/403 expired session, sync failures, image failures, how to read logs, security notes).
- **Copy settings to clipboard (Cookie redacted)** for bug reports, plus a local debugging entry.
- Known limitation: mobile cannot set file timestamps (OS restriction); this does not affect content or incremental sync.
- Security: the Cookie is a sensitive credential stored in the plugin's `data.json`. Never share your Vault or `data.json`, and clear your clipboard after pasting. Logout only clears the local Cookie; to end the cloud session, sign out at https://i.mi.com in a browser.

## Image naming (v0.2.25)

Note images are stored in the `img/` folder next to the note and are named after the **note title**, instead of server hash strings:

- **One image** in a note: `NoteTitle.jpg`.
- **Multiple images**: `NoteTitle-01.jpg`, `NoteTitle-02.jpg`… in the order they appear in the note body; the suffix is always two digits so sorting stays correct past 10 images.
- Characters that break Markdown links (`\ / : * ? " < > | # % [ ]`) are stripped, and long titles are truncated.
- The first sync after upgrading to v0.2.25 automatically migrates legacy hash-named images and rewrites references; an image that fails to download keeps its original marker and does not affect the others.

## What's new in the fork (v0.2.26)

- Version bump / rebuilt release; content is identical to v0.2.25.

## What's new in the fork (v0.2.25)

- Note images are now **named after the note title**: no suffix for a single image; `-01`, `-02` (two-digit) suffixes in appearance order for multiple images, replacing the previous server hash filenames.
- Markdown references are rewritten accordingly; the first sync after upgrading cleans up legacy hash-named images; failed downloads keep their original markers.
- Filenames sanitize illegal characters (including `# % [ ]` which break wikilinks), with fallbacks for empty titles and name collisions.

## What's new in the fork (v0.2.24)

- Folder-level sync scope: all / include / exclude, with search and multi-select (including "Unsorted" and "Excerpts").
- Note-level sync scope: all / include / exclude, notes fetched by keyword.
- Configurable image download concurrency (default 8) to reduce risk-control throttling.
- Built-in Help & troubleshooting dialog (401/403, sync failures, image failures, logs, security).
- Copy settings to clipboard with the Cookie redacted, plus local debug entry.
- Three-step Cookie paste guide inside the login dialog; desktop auto-login gracefully falls back to manual paste; clearer Cookie-expiry / risk-control messages.
- Fixed case-only folder renames failing on case-insensitive file systems (Windows / macOS).
- Sync is guarded against repeated clicks; failed items are reported and retried on the next sync.

## Features
- Stores notes in folders while preserving their creation time and modification time
- Automatically downloads images from notes and converts references to Markdown format
- Images are named after the note title (no suffix for a single image; `-01`, `-02`... in appearance order for multiple) instead of server hash names (fork v0.2.25)
- Replaces `<background>` tags with `<span>` tags to support text highlighting
- Removes redundant `<text>`、`<new-format/>` tags
- Compatible with old version untitled notes (auto-generates titles based on first line and note ID)
- Supports force sync mode for full overwrite updates
- Supports limiting the sync scope by folder or by note (fork addition)
- Supports Xiaomi Cloud Services in non-Chinese regions

## Installation
Open Obsidian settings, go to `Community plugins` on the left, click the `Turn off safe mode` button to enable third-party plugins. Click the `Browse` button in the Community plugins marketplace, search for `minote`, find `Minote Sync` plugin, then install and enable it. On mobile (or without marketplace access) you can manually download the latest install zip from this fork's [releases](https://github.com/YOUNG-FELIX/obsidian-minote-plugin/releases) page.

## Settings
1. Open Obsidian settings, find `Minote Sync` in the plugin settings
2. Click the `Login` button — scan the QR code on desktop, or paste a Cookie on mobile; your nickname is shown once logged in
3. To logout and clear the plugin's Cookie information, follow the same process as the web version of Xiaomi Cloud Service - click the avatar in the top right corner and select logout
4. Set note storage location (default is `/minote` folder)
5. Use the folder/note sync scope options to sync only part of your library, and Advanced settings for image concurrency

## Usage
⚠️ This plugin uses overwrite-based updates. Please don't modify content in synced files.

Incremental Sync: Click the Xiaomi notes button(![](/cloud-download.png)) in the left Ribbon, or use `command+P(windows ctrl+P)` to open Command Palette and search for `Minote` and choose the first option.

Full Sync: Right-click the Xiaomi notes button(![](/cloud-download.png)) in the left Ribbon and choose the second option, or use `command+P(windows ctrl+P)` to open Command Palette and search for `Minote` and choose the second option.

## Known Issues
- Cookie may expire after periods of inactivity, requiring manual refresh in plugin settings
- Occasional network connection issues may occur; simply retry sync (already synced notes won't update again)
- This plugin uses overwrite-based updates and does not automatically remove deleted notes. To clean up outdated notes, please delete the local notes folder first, then perform a full sync

## TODO
- [ ] Support mind maps
- [ ] Support todos
- [x] Support mobile devices (supported by this fork)

## Disclaimer
All note content comes from Xiaomi Cloud Services. User login authorizes this plugin to sync notes to local storage.

## Acknowledgments
- [Weread Plugin](https://github.com/zhaohongxuan/obsidian-weread-plugin)
- [minote-Obsidian](https://github.com/yulittlemoon/minote-Obsidian)
- [Obsidian Plugin Developer Docs](https://marcus.se.net/obsidian-plugin-docs/)
