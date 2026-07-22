import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const rawBackendUrl = (import.meta.env.VITE_BACKEND_URL || "").trim().replace(/^["']|["']$/g, "");
const PRIMARY_SHELL_API = rawBackendUrl ? `${rawBackendUrl.replace(/\/$/, "")}/api/shell` : "/api/shell";

const SUGGESTED_COMMANDS = [
  { cmd: "echo Hello, world!", desc: "Print text to stdout" },
  { cmd: "pwd", desc: "Show current directory" },
  { cmd: "cd /tmp", desc: "Change directory" },
  { cmd: "touch hello.txt", desc: "Create an empty file" },
  { cmd: "cat hello.txt", desc: "Print file contents" },
  { cmd: "mkdir my_folder", desc: "Create directory" },
  { cmd: "echo hello | cat", desc: "Pipeline chain" },
  { cmd: "declare MY_VAR=hello", desc: "Set shell variable" },
  { cmd: "echo $MY_VAR", desc: "Expand variable" },
  { cmd: "history", desc: "Command history" },
];

const FEATURES = [
  { icon: "⚡", title: "Custom Lexer & Parser", desc: "Tokenizes raw input → AST" },
  { icon: "🔧", title: "Built-in Commands", desc: "echo, cd, pwd, cat, mkdir, rm, touch, history, jobs, declare" },
  { icon: "🔗", title: "Pipelines", desc: "Chain with | — multi-stage" },
  { icon: "📁", title: "I/O Redirection", desc: ">, >>, 2>, 2>> to files" },
  { icon: "⏳", title: "Background Jobs", desc: "Run with & and track via jobs" },
  { icon: "🔤", title: "Variable Expansion", desc: "$VAR and ${VAR} syntax" },
  { icon: "📜", title: "Command History", desc: "Persistent via $HISTFILE" },
  { icon: "🌐", title: "HTTP API", desc: "POST /execute with session state" },
];

export default function ShellPage() {
  const [lines, setLines] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [input, setInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [currentDir, setCurrentDir] = useState("~");
  const [shellStatus, setShellStatus] = useState("checking"); // checking | online | offline
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const outputRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll on new output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines, showWelcome]);

  // Focus the input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Health check on mount
  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch(`${PRIMARY_SHELL_API}/health`);
        if (res.ok) {
          setShellStatus("online");
        } else {
          setShellStatus("offline");
        }
      } catch (_err) {
        setShellStatus("offline");
      }
    }
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const executeCommand = useCallback(async (command) => {
    const trimmed = command.trim();
    if (!trimmed) return;

    // Add to history
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    // Show the prompt + command in output
    const promptLine = { type: "prompt", text: `${currentDir} $ ${trimmed}` };
    setLines((prev) => [...prev, promptLine]);
    setIsRunning(true);

    // Handle "clear" locally
    if (trimmed === "clear") {
      setLines([]);
      setShowWelcome(false);
      setIsRunning(false);
      return;
    }

    try {
      const res = await fetch(`${PRIMARY_SHELL_API}/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLines((prev) => [
          ...prev,
          { type: "stderr", text: data.error || "Shell server error" },
          ...(data.details ? [{ type: "stderr", text: data.details }] : []),
        ]);
        if (data.error === "Shell server is not reachable") {
          setShellStatus("offline");
        }
        setIsRunning(false);
        return;
      }

      // Update connection status
      setShellStatus("online");

      // Update current directory
      if (data.current_dir) {
        setCurrentDir(data.current_dir);
      }

      // Add stdout lines
      const newLines = [];
      if (data.stdout && data.stdout.trim()) {
        data.stdout.split("\n").forEach((line) => {
          if (line !== "") {
            newLines.push({ type: "stdout", text: line });
          }
        });
      }

      // Add stderr lines
      if (data.stderr && data.stderr.trim()) {
        data.stderr.split("\n").forEach((line) => {
          if (line !== "") {
            newLines.push({ type: "stderr", text: line });
          }
        });
      }

      // Handle exit
      if (data.should_exit) {
        newLines.push({ type: "system", text: "Shell session ended. Refresh to start a new session." });
      }

      setLines((prev) => [...prev, ...newLines]);
    } catch (err) {
      setShellStatus("offline");
      setLines((prev) => [
        ...prev,
        { type: "stderr", text: "⚠ Could not reach the shell server." },
        { type: "stderr", text: err instanceof Error ? err.message : "Connection failed." },
      ]);
    } finally {
      setIsRunning(false);
    }
  }, [currentDir]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isRunning) {
      e.preventDefault();
      executeCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(commandHistory[newIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    }
  };

  const handleSuggestionClick = (cmd) => {
    if (!isRunning) {
      setInput(cmd);
      inputRef.current?.focus();
    }
  };

  const getLineClass = (type) => {
    const map = {
      stdout: "shell-line-stdout",
      stderr: "shell-line-stderr",
      prompt: "shell-line-prompt",
      system: "shell-line-system",
      info: "shell-line-info",
    };
    return map[type] || "shell-line-stdout";
  };

  return (
    <div className="shell-page-wrapper">
      {/* Top Bar */}
      <header className="shell-topbar">
        <div className="shell-topbar-left">
          <Link to="/" className="shell-back-btn" title="Back to Portfolio">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back to Portfolio</span>
          </Link>
          <div className="shell-title-group">
            <span className="shell-brand-icon">🐚</span>
            <h1 className="shell-title">BYO Shell — Live Sandbox</h1>
            <span className="shell-badge-version">v1.0 (Rust)</span>
          </div>
        </div>

        <div className="shell-topbar-right">
          <div className={`shell-status-badge shell-status-${shellStatus}`}>
            <span className="status-dot" />
            <span>
              {shellStatus === "checking" && "Checking Server..."}
              {shellStatus === "online" && "Server Online"}
              {shellStatus === "offline" && "Server Offline"}
            </span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="shell-main-layout">
        {/* Terminal Window */}
        <div className="shell-terminal-container">
          <div className="shell-window-bar">
            <div className="shell-window-dots">
              <span className="dot dot-red" />
              <span className="dot dot-yellow" />
              <span className="dot dot-green" />
            </div>
            <div className="shell-window-title">
              byo-shell — {currentDir}
            </div>
            <button
              className="shell-clear-btn"
              onClick={() => {
                setLines([]);
                setShowWelcome(false);
              }}
              title="Clear Terminal"
            >
              Clear
            </button>
          </div>

          {/* Terminal Output */}
          <div className="shell-output-area" ref={outputRef}>
            {showWelcome && (
              <div className="shell-welcome-banner">
                <div className="shell-mobile-banner-title">
                  <span>🐚 BYO SHELL</span> — POSIX Engine in Rust
                </div>
                <pre className="shell-ascii-art">
{`  ____   __   ______    ____   ______  _    _  ______  _      _     
 |  _ \\  \\ \\ / /  _ \\  / ___| |  ____|| |  | ||  ____|| |    | |    
 | |_) |  \\ V /| |_) || |     | |__   | |__| || |__   | |    | |    
 |  _ <    | | |  _ < | |     |  __|  |  __  ||  __|  | |    | |    
 | |_) |   | | | |_) || |___  | |____ | |  | || |____ | |____| |____
 |____/    |_| |____/  \\____| |______||_|  |_||______||______|______|`}
                </pre>
                <p className="shell-welcome-intro">
                  Welcome to <strong>BYO Shell</strong> — a POSIX-style shell engine written from scratch in <strong>Rust</strong>.
                </p>
                <p className="shell-welcome-sub">
                  Type a command below or tap a suggestion to execute.
                </p>
                <div className="shell-quick-tips">
                  <span>Tip: try <code>pwd</code>, <code>echo hello</code>, or <code>declare FOO=bar</code></span>
                </div>
              </div>
            )}

            {lines.map((line, idx) => (
              <div key={idx} className={`shell-line ${getLineClass(line.type)}`}>
                {line.text}
              </div>
            ))}
          </div>

          {/* Terminal Input */}
          <div className="shell-input-bar">
            <span className="shell-prompt-label">{currentDir} $</span>
            <input
              ref={inputRef}
              type="text"
              className="shell-input-field"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isRunning}
              placeholder={isRunning ? "Executing..." : "Type command..."}
              spellCheck={false}
              autoComplete="off"
            />
            {isRunning ? (
              <span className="shell-spinner" />
            ) : (
              <button
                className="shell-run-btn"
                onClick={() => {
                  executeCommand(input);
                  setInput("");
                }}
                disabled={!input.trim()}
                title="Execute Command"
                aria-label="Run command"
              >
                Run ↵
              </button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="shell-sidebar">
          {/* Suggested Commands */}
          <div className="shell-sidebar-card">
            <h3>Try These Commands</h3>
            <div className="shell-suggestions-list">
              {SUGGESTED_COMMANDS.map((item) => (
                <button
                  key={item.cmd}
                  className="shell-suggestion-chip"
                  onClick={() => handleSuggestionClick(item.cmd)}
                  title={item.desc}
                >
                  <code>{item.cmd}</code>
                  <span className="suggestion-desc">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Shell Architecture Features */}
          <div className="shell-sidebar-card">
            <h3>Engine Features</h3>
            <div className="shell-features-grid">
              {FEATURES.map((f) => (
                <div key={f.title} className="shell-feature-item">
                  <span className="feature-icon">{f.icon}</span>
                  <div>
                    <strong>{f.title}</strong>
                    <p>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
