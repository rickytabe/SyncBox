# SyncDrop 📥

**SyncDrop** is a high-performance, minimalist Progressive Web App (PWA) designed to function as a "shared clipboard" with the organization of a digital notebook. It allows for instant text, snippet, and link sharing across mobile and desktop devices with zero friction.

## 🚀 Core Vision
The goal of SyncDrop is to eliminate the "messaging yourself" workflow. Instead of sending links to yourself on Slack or WhatsApp, you "drop" them here. It feels like a native part of your OS while remaining accessible from any browser.

## ✨ Key Features

- **Instant Real-Time Sync**: Utilizes `BroadcastChannel` and `LocalStorage` to ensure data is mirrored across all open tabs instantly. No refreshing required.
- **AI-Powered Categorization**: Integrated with **Google Gemini 3 Flash**, the app automatically:
    - Detects content type (URL, Code Snippet, or Plain Text).
    - Suggests relevant tags for organization.
    - Extracts metadata (Site Name, Title) from shared links.
- **Minimalist "Apple-Style" UI**: A clean, focused interface with a dual-pane layout for desktop and an ergonomic bottom-tab navigation for mobile.
- **PWA Ready**: Can be installed on iOS/Android home screens for a native app experience.
- **Lightning Fast Entry**: The "Quick Drop" area is always accessible at the top of the feed for immediate capture.

## 🛠 Tech Stack

- **Frontend**: React 19 with Tailwind CSS for high-performance styling.
- **AI Engine**: `@google/genai` (Gemini 3 Flash Preview) for content analysis.
- **State & Sync**: Custom `SyncService` simulating a real-time backend via browser APIs.
- **Icons**: Custom SVG set for a consistent, modern aesthetic.
- **Typography**: Inter (Variable font) for maximum readability.

## 📂 Project Structure

- `/components`: Modular UI elements (`Sidebar`, `QuickDrop`, `DropItem`).
- `/services`: Core logic for AI analysis (`geminiService`) and data persistence (`syncService`).
- `types.ts`: Shared TypeScript interfaces for data consistency.
- `constants.tsx`: Configuration for collections, icons, and themes.

## 🔮 Future Roadmap

- [ ] **Native Share Target**: Full implementation of the Web Share Target API to allow sharing directly from mobile "Share" sheets.
- [ ] **Cloud Persistence**: Transition from LocalStorage to Supabase for persistent cross-device accounts.
- [ ] **Rich Media**: Support for image uploads and file attachments.
- [ ] **Biometric Lock**: Optional FaceID/TouchID for sensitive collections.

---

*Built with precision for the modern web.*