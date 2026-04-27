import { ChatPanel } from './components/ChatPanel'
import './App.css'

function App() {
  return (
    <div className="app-root">
      <aside className="app-sidebar" aria-label="App navigation">
        <div className="sidebar-topbar">
          <button type="button" className="sidebar-tool-btn" aria-label="Go back">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button type="button" className="sidebar-tool-btn" aria-label="New chat">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav-card" aria-label="Sections">
          <ul className="sidebar-nav-list">
            <li>
              <button type="button" className="sidebar-nav-btn">
                <span className="sidebar-nav-icon sidebar-nav-icon--blue">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                  </svg>
                </span>
                <span className="sidebar-nav-label">Video Gallery</span>
              </button>
            </li>
            <li>
              <button type="button" className="sidebar-nav-btn">
                <span className="sidebar-nav-icon sidebar-nav-icon--violet">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                  </svg>
                </span>
                <span className="sidebar-nav-label">Practice Tests</span>
              </button>
            </li>
            <li className="sidebar-nav-item-badge-wrap">
              <button type="button" className="sidebar-nav-btn">
                <span className="sidebar-nav-icon sidebar-nav-icon--green">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c0 1.5 2.5 3 6 3s6-1.5 6-3v-5" />
                  </svg>
                </span>
                <span className="sidebar-nav-label">AP Exam Hub</span>
                <span className="sidebar-new-badge" aria-label="New">
                  New!
                </span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="sidebar-recent">
          <h2 className="sidebar-recent-heading">Recent Chats</h2>
          <p className="sidebar-recent-empty">No chats.</p>
        </div>
      </aside>

      <main className="app-main">
        <ChatPanel />
      </main>
    </div>
  )
}

export default App
