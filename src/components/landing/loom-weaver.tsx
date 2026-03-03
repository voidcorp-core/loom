export function LoomWeaver() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
      <svg
        viewBox="0 0 800 600"
        fill="none"
        className="h-full w-full"
        aria-hidden="true"
      >
        {/* Central node */}
        <circle cx="400" cy="300" r="6" className="fill-primary" />
        <circle cx="400" cy="300" r="16" className="fill-primary/20" />

        {/* Animated threads converging to center */}
        {[
          { x1: 50, y1: 80, label: "skills" },
          { x1: 120, y1: 520, label: "presets" },
          { x1: 700, y1: 100, label: "agents" },
          { x1: 750, y1: 480, label: "tools" },
          { x1: 400, y1: 30, label: "config" },
          { x1: 200, y1: 300, label: "context" },
          { x1: 650, y1: 300, label: "output" },
        ].map((thread, i) => (
          <g key={thread.label}>
            {/* Source node */}
            <circle cx={thread.x1} cy={thread.y1} r="3" className="fill-primary/40" />

            {/* Thread line */}
            <line
              x1={thread.x1}
              y1={thread.y1}
              x2={400}
              y2={300}
              className="stroke-primary/20"
              strokeWidth="1"
              strokeDasharray="6 4"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="40"
                to="0"
                dur={`${3 + i * 0.5}s`}
                repeatCount="indefinite"
              />
            </line>

            {/* Traveling dot */}
            <circle r="2" className="fill-primary/60">
              <animateMotion
                dur={`${4 + i * 0.7}s`}
                repeatCount="indefinite"
              >
                <mpath>
                  <line x1={thread.x1} y1={thread.y1} x2={400} y2={300} />
                </mpath>
              </animateMotion>
            </circle>
          </g>
        ))}

        {/* Central pulse */}
        <circle cx="400" cy="300" r="24" className="stroke-primary/30" strokeWidth="1" fill="none">
          <animate
            attributeName="r"
            values="24;40;24"
            dur="4s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.3;0;0.3"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}
