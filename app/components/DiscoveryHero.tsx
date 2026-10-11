"use client";

type DiscoveryHeroProps = {
  status: string;
  recording: boolean;
  busy: boolean;
  audioUrl: string | null;
  startRecording: () => void;
  stopRecording: () => void;
  analyzeSound: () => void;
};

export default function DiscoveryHero({
  status,
  recording,
  busy,
  audioUrl,
  startRecording,
  stopRecording,
  analyzeSound,
}: DiscoveryHeroProps) {
  return (
    //!TO-DO:move this section to seperate css file and import it here
    <section className="eq-hero">
      <style>{`
        .eq-hero {
          --lime: #A3BFA8;
          --muted: #9eac9c;
          position: relative;
          isolation: isolate;
          overflow: hidden;
          padding: clamp(22px, 5vw, 48px);
          border: 1px solid rgba(163,191,168,.17);
          border-radius: 32px;
          color: #f0f4e8;
          background:
            radial-gradient(ellipse at 50% 35%, rgba(58,105,48,.2), transparent 48%),
            linear-gradient(145deg,#17251a,#0d150f 65%,#101c13);
          box-shadow: 0 24px 80px rgba(0,0,0,.24);
        }

        .eq-topline {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--lime);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .16em;
        }

        .eq-dot {
          flex-shrink: 0;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--lime);
          box-shadow: 0 0 12px rgba(199,255,101,.65);
        }

        .eq-version { margin-left: auto; color: #788878; }

        .eq-intro {
          margin-top: 48px;
          text-align: center;
        }

        .eq-eyebrow, .eq-label {
          color: var(--lime);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .22em;
        }

        .eq-title {
          margin-top: 12px;
          font-size: clamp(46px,9vw,76px);
          font-weight: 900;
          line-height: 1;
          letter-spacing: -.075em;
        }

        .eq-title span { color: var(--lime); }
        .eq-title .eq-title-dot { color: white; }

        .eq-description {
          margin-top: 20px;
          color: var(--muted);
          font-size: 15px;
          line-height: 1.9;
        }

        .eq-description strong { color: #f1f6e9; }

        .eq-orbital {
          position: relative;
          display: flex;
          width: min(100%,340px);
          aspect-ratio: 1;
          align-items: center;
          justify-content: center;
          margin: 10px auto 0;
        }

        .eq-orbit, .eq-orbit-inner {
          position: absolute;
          border: 1px solid rgba(199,255,101,.15);
          border-radius: 50%;
        }

        .eq-orbit {
          inset: 9%;
          animation: eq-rotate 30s linear infinite;
        }

        .eq-orbit::before, .eq-orbit::after {
          position: absolute;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--lime);
          content: "";
          box-shadow: 0 0 15px rgba(199,255,101,.7);
        }

        .eq-orbit::before { top: 16%; left: 12%; }
        .eq-orbit::after { right: 8%; bottom: 25%; width: 4px; height: 4px; }

        .eq-orbit-inner {
          inset: 21%;
          border-style: dashed;
          border-color: rgba(199,255,101,.19);
          animation: eq-rotate 40s linear infinite reverse;
        }

        .eq-core {
          z-index: 1;
          display: grid;
          width: 112px;
          height: 112px;
          place-items: center;
          border: 1px solid rgba(199,255,101,.42);
          border-radius: 50%;
          background: radial-gradient(circle at 35% 25%,#304A39,#17281b 75%);
          box-shadow: 0 0 35px rgba(166,255,89,.12), inset 0 0 25px rgba(199,255,101,.08);
        }

        .eq-leaf {
          font-size: 43px;
          filter: drop-shadow(0 0 14px rgba(199,255,101,.2));
        }

        .eq-core.eq-recording {
          border-color: #ff8888;
          animation: eq-pulse 1.4s ease-in-out infinite;
        }

        .eq-waveform {
          position: absolute;
          right: 0;
          bottom: 12%;
          left: 0;
          display: flex;
          height: 70px;
          align-items: center;
          justify-content: center;
          gap: 4px;
          opacity: .75;
        }

        .eq-waveform span {
          width: 3px;
          max-height: 64px;
          border-radius: 8px;
          background: linear-gradient(to top,#607C67,var(--lime));
          animation: eq-wave 1.3s ease-in-out infinite alternate;
          animation-play-state: paused;
        }

        .eq-waveform.eq-wave-active span { animation-play-state: running; }

        .eq-orbit-label {
          position: absolute;
          bottom: 0;
          color: #72816e;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .22em;
        }

        .eq-recorder {
          position: relative;
          z-index: 2;
          margin-top: 12px;
          padding: clamp(18px,4vw,28px);
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 24px;
          background: rgba(255,255,255,.045);
          backdrop-filter: blur(16px);
        }

        .eq-recorder-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .eq-recorder-header h2 {
          margin-top: 8px;
          font-size: clamp(18px,3vw,22px);
          font-weight: 800;
          letter-spacing: -.035em;
        }

        .eq-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 10px;
          border: 1px solid rgba(199,255,101,.2);
          border-radius: 99px;
          color: var(--lime);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .08em;
          white-space: nowrap;
        }

        .eq-hint {
          margin-top: 12px;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.8;
        }

        .eq-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 24px;
        }

        .eq-button {
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 48px;
          padding: 12px 20px;
          border: 1px solid transparent;
          border-radius: 999px;
          font-family: inherit;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: transform .2s ease, box-shadow .2s ease;
        }

        .eq-button:hover:not(:disabled) { transform: translateY(-2px); }

        .eq-button:disabled {
          opacity: .45;
          cursor: not-allowed;
        }

        .eq-primary {
  background: #D1DDC8;
  color: #18251E;
  border-color: #D1DDC8;
}

.eq-primary:hover:not(:disabled) {
  box-shadow: 0 8px 28px rgba(163, 191, 168, 0.18);
}

        .eq-secondary {
          background: #1c2b1e;
          color: var(--lime);
          border-color: var(--lime);
        }

        .eq-stop {
          background: #ff7373;
          color: #1b0b0b;
          border-color: #ff7373;
        }

        .eq-status {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin-top: 20px;
          color: #b9c8b3;
          font-size: 12px;
          line-height: 1.7;
        }

        .eq-status .eq-dot { width: 6px; height: 6px; margin-top: 5px; }

        .eq-audio {
          display: block;
          width: 100%;
          margin-top: 16px;
        }

        .eq-footer {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 14px 26px;
          margin-top: 26px;
          color: #7d8c79;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .12em;
        }

        @keyframes eq-rotate { to { transform: rotate(360deg); } }

        @keyframes eq-pulse {
          0%,100% { box-shadow: 0 0 25px rgba(255,120,120,.1); }
          50% { box-shadow: 0 0 45px rgba(255,120,120,.3); }
        }

        @keyframes eq-wave {
          from { transform: scaleY(.35); }
          to { transform: scaleY(1); }
        }

        @media (max-width: 480px) {
          .eq-hero { border-radius: 24px; }
          .eq-intro { margin-top: 38px; }
          .eq-orbital { width: min(100%,290px); }
          .eq-recorder-header { flex-direction: column; }
          .eq-actions { flex-direction: column; align-items: stretch; }
          .eq-button { width: 100%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .eq-orbit, .eq-orbit-inner, .eq-recording, .eq-waveform span {
            animation: none;
          }
          .eq-button { transition: none; }
        }
      `}</style>

      <div className="eq-topline">
        <span className="eq-dot" />
        <span>YOUR PERSONAL NATURE SCANNER</span>
        <span className="eq-version">AI / 01</span>
      </div>

      <div className="eq-intro">
        <p className="eq-eyebrow">THE WORLD IS SPEAKING</p>
        <h1 className="eq-title">
          Echo<span>Quest</span>
          <span className="eq-title-dot">.</span>
        </h1>
        <p className="eq-description">
          Leave the noise behind.
          <br />
          <strong>Discover the sounds of life.</strong>
        </p>
      </div>

      <div className="eq-orbital">
        <div className="eq-orbit" />
        <div className="eq-orbit-inner" />

        <div className={`eq-core ${recording ? "eq-recording" : ""}`}>
          <span className="eq-leaf">🌿</span>
        </div>

        <div
          className={`eq-waveform ${recording ? "eq-wave-active" : ""}`}
          aria-hidden="true"
        >
          {[18, 30, 44, 24, 52, 35, 62, 28, 46, 68, 32, 50, 25, 42, 20].map(
            (height, index) => (
              <span
                key={index}
                style={{
                  height: `${height}px`,
                  animationDelay: `${index * 0.07}s`,
                }}
              />
            ),
          )}
        </div>

        <span className="eq-orbit-label">LISTEN / EXPLORE</span>
      </div>

      <div className="eq-recorder">
        <div className="eq-recorder-header">
          <div>
            <p className="eq-label">FIELD RECORDING</p>
            <h2>
              {recording
                ? "Listening to nature..."
                : busy
                  ? "Reading the soundscape..."
                  : "Ready to explore?"}
            </h2>
          </div>

          <span className="eq-badge">
            <span className="eq-dot" />
            {recording ? "RECORDING" : busy ? "ANALYZING" : "STANDBY"}
          </span>
        </div>

        <p className="eq-hint">
          Find a quiet spot and capture 5–10 seconds of the world around you.
        </p>

        <div className="eq-actions">
          {!recording ? (
            <button
              type="button"
              onClick={startRecording}
              disabled={busy}
              className="eq-button eq-primary"
            >
              🎙 Start listening
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecording}
              className="eq-button eq-stop"
            >
              ■ Stop recording
            </button>
          )}

          <button
            type="button"
            onClick={analyzeSound}
            disabled={!audioUrl || busy || recording}
            className="eq-button eq-secondary"
          >
            {busy ? "⏳ Analyzing..." : "✦ Analyze sound"}
          </button>
        </div>

        <p className="eq-status" role="status" aria-live="polite">
          <span className="eq-dot" />
          {status}
        </p>

        {audioUrl && <audio className="eq-audio" controls src={audioUrl} />}
      </div>

      <div className="eq-footer">
        <span>01 — LISTEN</span>
        <span>02 — DISCOVER</span>
        <span>03 — COLLECT XP</span>
      </div>
    </section>
  );
}
