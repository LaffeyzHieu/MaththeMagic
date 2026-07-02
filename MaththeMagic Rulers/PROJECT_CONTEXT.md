# PROJECT_CONTEXT.md
> Tài liệu onboarding cho AI assistant (GPT, CodeX, Cursor, Gemini, Kimi...)  
> Cập nhật lần cuối: 06/2026 · v2.0.0

---

## Mục lục

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Design Rules](#3-design-rules)
4. [Project Structure](#4-project-structure)
5. [Current Project Status](#5-current-project-status)
6. [Firebase](#6-firebase)
7. [Architecture](#7-architecture)
8. [Coding Conventions](#8-coding-conventions)
9. [AI Notes](#9-ai-notes)
10. [Roadmap](#10-roadmap)
11. [Decision History](#11-decision-history)

---

## 1. Project Overview

| Field | Detail |
|---|---|
| **Tên project** | MatheMagic (hay MaththeMagic) |
| **URL** | https://jvmelaffeyz.web.app |
| **Version hiện tại** | v2.0.0 |
| **Tác giả** | LaffeyzHieu (QuyKhietDN™) |
| **Mục tiêu** | Tool tính toán hỗ trợ sinh viên ASM (trường học) cho các môn Digital Principles, Engineering Mathematics, Semiconductor Manufacture |
| **Đối tượng** | Sinh viên ASM, chủ yếu dùng trên desktop và mobile |
| **Tagline** | "Kết quả có thể sai · Chế độ cợt nhả không thể tắt · Bạn không phải Admin" |

### Tính năng chính

| Tính năng | Route | Trạng thái |
|---|---|---|
| Phân tích dữ liệu | `/data` | ✅ Hoàn thành |
| Chuyển đổi số | `/number` | ✅ Hoàn thành |
| Cấp số cộng/nhân | `/sequence` | ✅ Hoàn thành |
| Karnaugh Map | `/kmap` | ✅ Hoàn thành |
| Truth Table | `/truth` | ✅ Hoàn thành |
| Import XLSX | `/xlsx` | ✅ Tích hợp vào Data Analysis |
| Phản hồi + Poll | `/feedback` | ✅ Hoàn thành + Firestore |
| Resources | `/resources` | ✅ Hoàn thành |
| theMagic Account | Boot screen | ✅ Hoàn thành |
| AI Analysis | `/ai` | 🚧 Đang phát triển |

---

## 2. Tech Stack

### Frontend
| Package | Version | Mục đích |
|---|---|---|
| React | 18.x | UI framework |
| Vite | 5.x | Build tool |
| react-router-dom | 6.x | Client-side routing |
| html2canvas | latest | Save as image |
| @tabler/icons-webfont | latest | Icon set (CDN trong index.html) |

### Backend / Database
| Service | Mục đích |
|---|---|
| Firebase Firestore | Feedback, Poll, Users, Visitors, Stats |
| Firebase Hosting | Deploy static site |

### Fonts (Google Fonts CDN)
- `JetBrains Mono` — monospace, dùng cho tất cả code/terminal text
- `Space Grotesk` — sans-serif, dùng cho body text

### Build & Deploy
```bash
npm run build        # Build ra /dist
firebase deploy      # Deploy lên Firebase Hosting
# Hoặc dùng deploy.bat có sẵn ở root project
```

---

## 3. Design Rules

### UI/UX Aesthetic
Project theo **terminal/developer aesthetic** — dark mode là primary, có toggle sang light mode.

> ⚠️ **TUYỆT ĐỐI KHÔNG** thay đổi aesthetic này. Đây là identity của project.

### Color System (CSS Variables)

#### Dark mode (default)
```css
--bg-page:        #0e0e0f
--bg-topbar:      #161618
--bg-sidebar:     #131315
--bg-panel:       rgba(255,255,255,0.04)   /* glass panel */
--bg-input:       rgba(255,255,255,0.05)
--bg-card:        rgba(255,255,255,0.03)
--bg-nav-hover:   #1e1e22
--border-main:    rgba(255,255,255,0.08)
--border-sub:     #222226
--text-primary:   #eeeeee
--text-secondary: #aaaaaa
--text-muted:     #666666
--accent:         #D85A30   /* màu cam chủ đạo — KHÔNG ĐỔI */
--accent-dim:     rgba(216,90,48,0.15)
```

#### Light mode (`[data-theme="light"]`)
```css
--bg-page:        #f0ede8
--bg-topbar:      #ffffff
--accent:         #D85A30   /* giữ nguyên */
```

#### Aliases (cho compatibility với Cursor-generated components)
```css
--text:    var(--text-primary)
--sub:     var(--text-secondary)
--surface: var(--bg-card)
--border:  var(--border-main)
--panel:   var(--bg-topbar)
```

### Typography Rules
- **Tất cả** labels, code, numbers, monospace text → `JetBrains Mono`
- **Body text**, buttons, headings → `Space Grotesk`
- Font size tối thiểu: 11px (sau khi tăng từ 10px lên theo feedback user)

### Coding Style
- Inline styles trong JSX (không dùng Tailwind, không dùng CSS Modules)
- CSS class chỉ dùng cho shared components định nghĩa trong `App.css`
- Không dùng `className` nhiều — chỉ dùng cho: `page-title`, `commit-msg`, `warning-tape`, `btn-main`, `btn-clear`, `input-group`, `input-label`, `ln`, `error-text`, `footer-code`, `footer-green`, `footer-red`

### Những điều TUYỆT ĐỐI không thay đổi
- Màu accent `#D85A30`
- Font `JetBrains Mono` cho terminal text
- Terminal chrome bar (3 dots đỏ/vàng/xanh) ở topbar
- Personality cợt nhả trong UI copy
- Boot sequence flow: Boot → Landing → App

---

## 4. Project Structure

```
MathemagicASM/
├── mathemagic/                  # React project (Vite)
│   ├── public/
│   │   ├── favicon.gif
│   │   ├── index.html           # Entry HTML, có link Tabler Icons CDN
│   │   └── data/
│   │       └── changelog.json   # Lịch sử update hiển thị trên Landing
│   ├── src/
│   │   ├── App.jsx              # Root component: layout, routing, theme toggle
│   │   ├── App.css              # Global styles + CSS variables dark/light
│   │   ├── AuthContext.jsx      # theMagic Account: auth state, register, login, logout
│   │   ├── firebase.js          # Firebase init + export db
│   │   ├── main.jsx             # Entry point, wrap AuthProvider
│   │   ├── index.css            # Reset (để trống hoặc minimal)
│   │   ├── components/
│   │   │   ├── AccountModal.jsx    # Modal đăng nhập/tạo tài khoản (dùng React Portal)
│   │   │   ├── AccountSection.jsx  # Account box trong Boot screen
│   │   │   └── ActionBar.jsx       # Save as image + Link to NotetheMagic button
│   │   └── pages/
│   │       ├── Home.jsx            # Boot screen: terminal lines + "What are you doing here?"
│   │       ├── Landing.jsx         # Landing page: features, changelog, visitor count, account
│   │       ├── DataAnalysis.jsx    # Phân tích dữ liệu + XLSX import
│   │       ├── NumberConverter.jsx # Chuyển đổi số hệ cơ số + phép tính
│   │       ├── Sequence.jsx        # Cấp số cộng/nhân + detect
│   │       ├── KMapSolver.jsx      # Karnaugh Map solver
│   │       ├── TruthTable.jsx      # Truth Table từ biểu thức Boolean
│   │       ├── Feedback.jsx        # Phản hồi + Poll + Admin mode
│   │       ├── Resources.jsx       # "Ở đây không có" - link tools ngoài
│   │       └── DevOnly.jsx         # Placeholder "tính năng chỉ dành cho nhà phát triển"
│   ├── package.json
│   ├── vite.config.js
│   └── firebase.json            # Hosting config: public=dist, rewrites SPA
├── public/                      # Thư mục HTML cũ (không còn dùng)
├── firebase.json                # Firebase config ở root (trỏ vào mathemagic/dist)
└── deploy.bat                   # Script build + deploy 1 click
```

### File quan trọng

| File | Vai trò |
|---|---|
| `App.jsx` | Quản lý routing, sidebar, topbar, theme. Đây là file trung tâm nhất |
| `App.css` | Design system toàn app. Sửa file này ảnh hưởng tất cả |
| `AuthContext.jsx` | Auth state global. Wrap toàn app trong `main.jsx` |
| `firebase.js` | Khởi tạo Firebase một lần duy nhất, export `db` |
| `deploy.bat` | Build + deploy, để ở `MathemagicASM/` root |

---

## 5. Current Project Status

### ✅ Hoàn thành
- Multi-page React app với React Router v6
- Dark/light theme toggle với CSS variables
- Boot screen terminal animation + "What are you doing here?"
- Landing page với feature grid, changelog, visitor counter, My Account card
- Sidebar navigation với "Ở đây không có" ghim đáy
- theMagic Account (username + PIN 4 số, Firestore-backed)
- Phân tích dữ liệu (mean, median, std dev, verdict cợt nhả)
- Chuyển đổi số (binary/octal/decimal/hex + arithmetic)
- Cấp số cộng/nhân (manual + auto-detect)
- Karnaugh Map solver
- Truth Table từ biểu thức Boolean (AND/OR/NOT/XOR/NAND/NOR/XNOR)
- Phản hồi.exe với Firestore realtime, poll system, admin mode (password "2710")
- Resources page phân theo môn học
- Save as image với watermark "MatheMagic©"
- NotetheMagic easter egg (terminal animation "SOON™")
- 404.html terminal error page với nút "ăn vạ với admin"
- Visitor counter (unique per device, reset key theo version)
- Rate limit feedback: 5 comment/ngày per user (localStorage + Firestore double-check)
- Biệt danh giang hồ: tên user có hậu tố ngẫu nhiên cố định theo device ID

### 🚧 Đang phát triển
- AI Analysis page (proxy qua AItheMagic project riêng)
- NotetheMagic Android app (planned)

### 🐛 Bug đã biết
- Reload ở bất kỳ page nào → về Boot screen (sessionStorage chưa persist booted state đúng cách) — **đây là "nghi thức" đã được chấp nhận**
- `onboarding.js` error trong Cốc Cốc browser — lỗi từ browser extension, không phải code app

### ✅ Bug đã sửa
- Cấp số nhân auto làm tròn sai → fix `fmt()` dùng `toPrecision(10)`
- Vote poll không hoạt động → fix dùng `setDoc` với `merge: true`
- AccountModal bị trap bởi glass-panel → fix dùng React Portal
- AccountSection không render → fix missing import trong Home.jsx
- Boot screen auto-skip AccountSection → fix bỏ `setTimeout(() => onEnter())`
- K-Map bị xóa khỏi nav → fix thêm lại vào NAV_ITEMS và Landing FEATURES

### 📋 TODO
- [ ] Thêm AI Analysis page (cần AItheMagic proxy project)
- [ ] My Account page chi tiết (lịch sử tính toán)
- [ ] Truth Table thêm vào Landing features
- [ ] Tích hợp username từ theMagic Account vào Feedback (thay biệt danh)
- [ ] Thêm môn Semiconductor Manufacture vào Resources

---

## 6. Firebase

### Services đang dùng
- **Firestore** — database realtime
- **Hosting** — static site hosting

### Collections

| Collection | Document | Fields | Mục đích |
|---|---|---|---|
| `feedback` | auto-id | `name`, `rawName`, `userId`, `text`, `createdAt`, `upvotes`, `downvotes` | Comments + reactions |
| `users` | `u_{username}` | `username`, `pin`, `uid`, `joinedAt`, `calcCount` | theMagic Account |
| `polls` | custom-id | `ups`, `downs` | Pinned polls trên Feedback page |
| `stats` | `visitors` | `count` | Tổng unique visitors |
| `stats_visitors` | `{userId}` | `resetKey`, `visitedAt` | Track đã đếm visitor chưa |

### Security Rules hiện tại
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /feedback/{doc} {
      allow read: if true;
      allow create: if request.resource.data.name is string
                    && request.resource.data.name.size() >= 2
                    && request.resource.data.text is string
                    && request.resource.data.text.size() >= 5
                    && request.resource.data.text.size() <= 300;
      allow update: if request.resource.data.diff(resource.data).affectedKeys()
                       .hasOnly(['upvotes', 'downvotes']);
    }
    match /users/{userId} {
      allow read, write: if true;
    }
    match /polls/{pollId} {
      allow read: if true;
      allow write: if true;
    }
    match /stats/{docId} {
      allow read: if true;
      allow write: if true;
    }
    match /stats_visitors/{userId} {
      allow read, write: if true;
    }
  }
}
```

### firebase.json (root)
```json
{
  "hosting": {
    "public": "mathemagic/dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

> ⚠️ `firebase.json` ở root trỏ vào `mathemagic/dist`, không phải `dist` hay `public`

### Deploy
```bash
# Từ thư mục MathemagicASM/
deploy.bat            # Recommended: build + deploy tự động
# Hoặc thủ công:
cd mathemagic && npm run build
cd .. && firebase deploy
```

### Lưu ý bảo mật
- Firebase config (apiKey, etc.) được hardcode trong `src/firebase.js` — **chấp nhận được** vì đây là client-side config, không phải secret
- Admin password "2710" hardcode trong `Feedback.jsx` — security by obscurity, phù hợp với scope project cá nhân
- PIN của user lưu plain text trong Firestore — **đã được chủ project confirm chấp nhận**

---

## 7. Architecture

### Luồng hoạt động

```
User vào app
    ↓
Boot Screen (Home.jsx)
    · Terminal animation chạy
    · "What are you doing here?" + 2 lựa chọn
    · AccountSection: đăng nhập / bỏ qua
    ↓
Landing (Landing.jsx)
    · Feature grid
    · My Account card
    · Changelog, visitor count, footer
    ↓
App (sidebar + routes)
    · /data    → DataAnalysis
    · /number  → NumberConverter
    · /sequence → Sequence
    · /kmap    → KMapSolver
    · /truth   → TruthTable
    · /feedback → Feedback
    · /resources → Resources
```

### Routing
- React Router v6 `BrowserRouter`
- SPA routing — Firebase rewrites `**` về `index.html`
- **Không dùng `<Link>`** trong sidebar — dùng `NavLink` với `isActive` để highlight

### State Management
- **Không có global state manager** (Redux, Zustand...)
- `AuthContext` (React Context) — duy nhất cho auth state
- Mọi state khác là local `useState` trong từng page component
- Theme state (`dark`/`light`) trong `App.jsx`, apply qua `document.documentElement.setAttribute('data-theme', ...)`

### Component Hierarchy
```
main.jsx
└── AuthProvider (AuthContext.jsx)
    └── App.jsx
        ├── Topbar (inline trong App.jsx)
        ├── Sidebar (inline trong App.jsx)
        │   └── NavLink × n
        └── Routes
            ├── Home.jsx
            │   └── AccountSection.jsx
            │       └── AccountModal.jsx (Portal → document.body)
            ├── Landing.jsx
            │   └── AccountModal.jsx (Portal → document.body)
            ├── DataAnalysis.jsx
            │   └── ActionBar.jsx
            ├── [other pages...]
            └── Feedback.jsx
                └── AdminModal (inline)
```

### Data Flow
```
Firestore → onSnapshot → useState → render   (realtime: Feedback)
Firestore → getDoc → useState → render       (one-time: Users, Stats)
localStorage → useState init → render        (persistent: theme, userId, votes)
sessionStorage → useState init               (session: admin mode)
```

---

## 8. Coding Conventions

### Đặt tên

| Loại | Convention | Ví dụ |
|---|---|---|
| Component file | PascalCase | `DataAnalysis.jsx`, `AccountModal.jsx` |
| Component function | PascalCase | `export default function DataAnalysis()` |
| Helper function | camelCase | `fmt()`, `analyzeData()`, `timeAgo()` |
| CSS class | kebab-case | `.page-title`, `.btn-main`, `.nav-item` |
| CSS variable | `--kebab-case` | `--bg-card`, `--text-muted`, `--accent` |
| localStorage key | `mm_` prefix | `mm_user_id`, `mm_fb_name`, `mm_theme` |
| Firestore collection | lowercase | `feedback`, `users`, `polls` |

### Component conventions
- Mỗi page = 1 file trong `src/pages/`
- Shared UI components = `src/components/`
- Helper functions định nghĩa trước component trong cùng file (không tách ra utils)
- Props đặt tên rõ ràng: `onNavigate`, `onEnter`, `onClose`, `onSuccess`

### CSS conventions
- **Ưu tiên inline style** trong JSX cho component-specific styles
- `App.css` chỉ chứa: CSS variables, reset, layout (`.app-shell`, `.sidebar`, `.main-content`, `.glass-panel`), shared component classes
- Khi dùng Cursor để generate component mới → dùng CSS aliases (`var(--text)`, `var(--border)`) hoặc variables đầy đủ, không hardcode màu

### React conventions
- Không dùng `<form>` tag — dùng `<div>` + `onClick` handler
- Không dùng class components — functional components only
- `useEffect` cleanup: luôn return unsubscribe cho Firestore listeners

---

## 9. AI Notes

> Đọc kỹ phần này trước khi làm bất cứ điều gì.

### Quy tắc bắt buộc

1. **KHÔNG tự ý refactor toàn bộ project** — chỉ sửa đúng file và đúng phạm vi được yêu cầu
2. **KHÔNG đổi tên file hoặc component** nếu không được yêu cầu rõ ràng
3. **KHÔNG thay đổi CSS variables** trong `:root` hoặc `[data-theme="light"]` trừ khi được yêu cầu
4. **KHÔNG đổi màu accent** `#D85A30` — đây là màu identity của project
5. **KHÔNG convert sang Tailwind** hoặc CSS Modules
6. **KHÔNG thêm global state manager** (Redux, Zustand...) trừ khi được yêu cầu
7. **GIỮ NGUYÊN** personality cợt nhả trong UI copy — đây là feature, không phải bug

### Khi thêm tính năng mới
- Tạo file mới trong `src/pages/` nếu là page mới
- Thêm route vào `App.jsx` (NAV_ITEMS array + Routes)
- Thêm vào FEATURES array trong `Landing.jsx` nếu muốn hiện trên landing
- Dùng CSS variables, không hardcode màu
- Giữ font `JetBrains Mono` cho labels/code, `Space Grotesk` cho body

### Khi fix bug
- Đọc file hiện tại trước khi sửa
- Chỉ sửa đúng chỗ bị lỗi, không "clean up" thêm
- Test mental xem fix có break chỗ khác không

### Known quirks
- `glass-panel` có thể trap `position: fixed` elements → dùng React Portal (`createPortal(modal, document.body)`) cho modals
- CSS aliases `--text`, `--sub`, `--surface`, `--border` tồn tại để Cursor-generated code hoạt động không cần sửa
- `firebase.json` ở **root** `MathemagicASM/`, không phải trong `mathemagic/`
- Deploy cần chạy từ `MathemagicASM/` không phải từ `mathemagic/`

---

## 10. Roadmap

### Gần (đang làm)
- [ ] AI Analysis page — proxy qua AItheMagic project riêng
  - Models: Zmi genLite (Qwen/Groq), Zmi genPro (Gemini 2.0), Zmi genMax (DeepSeek), Zmi genCost (GPT/Kimi)
  - Rate limit: 5 lần hỏi/ngày per user
  - Architecture: MatheMagic fetch → AItheMagic proxy → API keys ẩn

### Trung hạn
- [ ] My Account page — lịch sử tính toán, settings
- [ ] Tích hợp theMagic Account vào Feedback (tên = username)
- [ ] Truth Table thêm vào Landing feature grid
- [ ] Semiconductor Manufacture resources
- [ ] Sparkline chart trong Data Analysis

### Dài hạn
- [ ] NotetheMagic — Android note-taking app (Flutter/Dart)
  - Sync kết quả từ MatheMagic qua QR Code hoặc Firebase
  - UI inspired by MiUI Notes, high customization
- [ ] Dimensional Analysis tool (hoặc link Resources)
- [ ] State Table & Diagram generator (Digital Principles)
- [ ] Timing Diagram / Waveform generator

### Ý tưởng tương lai
- AItheMagic ecosystem: proxy server cho nhiều AI models với branding "Zmi gen"
- NotetheMagic liên kết với MatheMagic account

---

## 11. Decision History

### Vì sao dùng inline styles thay vì Tailwind?
Project bắt đầu là HTML/CSS thuần, migrate sang React giữa chừng. Inline styles giữ được tính nhất quán với CSS variables (`var(--accent)`, `var(--bg-card)`...) và dễ đọc hơn khi debug. Tailwind sẽ require rebuild toàn bộ component — không worth với scope hiện tại.

### Vì sao dùng sessionStorage cho Admin mode thay vì state?
Admin mode (`isAdmin`) cần persist qua re-render nhưng reset khi đóng tab — sessionStorage là fit perfect. Không cần đưa vào AuthContext vì chỉ dùng trong Feedback page.

### Vì sao Boot screen không persist qua reload?
`booted` state trong `App.jsx` là `useState(false)` — reset mỗi lần reload. Đây ban đầu là bug, nhưng sau khi cân nhắc đã được chủ project chấp nhận như "nghi thức" — mỗi lần vào app đều trải qua boot screen là intentional UX.

### Vì sao Feedback dùng Firestore thay vì localStorage?
Comments cần sync realtime giữa nhiều users — localStorage chỉ là local per device. Firestore `onSnapshot` cho realtime updates mà không cần polling.

### Vì sao không dùng Firebase Auth?
Lo ngại "thu thập thông tin cá nhân" từ chủ project. theMagic Account dùng username + PIN lưu Firestore — đủ cho scope cá nhân, không collect email hay OAuth data.

### Vì sao AccountModal dùng React Portal?
`glass-panel` wrapper có `backdrop-filter` và `transform` properties — những CSS properties này tạo ra stacking context mới, làm `position: fixed` bị trap bên trong thay vì relative to viewport. Portal render modal ra `document.body` để bypass vấn đề này.

### Vì sao `firebase.json` ở root thay vì trong `mathemagic/`?
Firebase project (`jvmelaffeyz`) được init ở `MathemagicASM/` trước khi React project được tạo. Giữ nguyên để tránh re-init Firebase, chỉ update `"public": "mathemagic/dist"` để trỏ đúng build output.

### Vì sao có CSS aliases (`--text`, `--sub`, `--surface`, `--border`)?
Cursor AI khi generate component tự dùng tên variables ngắn hơn. Thay vì sửa từng file Cursor tạo ra, thêm aliases vào `App.css` một lần — tất cả component của Cursor hoạt động ngay mà không cần chỉnh.

### Vì sao chia component theo cách hiện tại?
- `pages/` — mỗi route = 1 file, dễ tìm, dễ navigate
- `components/` — chỉ cho shared UI (AccountModal, AccountSection, ActionBar)
- Helper functions trong cùng file với component sử dụng — tránh over-engineering với separate `utils/` folder cho project này

---

*Tài liệu này được tạo bởi Ako (Claude) · Dựa trên toàn bộ lịch sử phát triển MatheMagic từ v0.0.1 đến v2.0.0*
