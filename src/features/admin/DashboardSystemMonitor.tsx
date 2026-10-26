"use client";

import { useEffect, useId, useReducer } from "react";
import { Button, Chip, Typography } from "@mui/material";
import BoltOutlined from "@mui/icons-material/BoltOutlined";
import Pause from "@mui/icons-material/Pause";
import PlayArrow from "@mui/icons-material/PlayArrow";
import RestartAlt from "@mui/icons-material/RestartAlt";
import * as S from "./social/styles";

type Sample = { cpu: number; memory: number; network: number };
type State = { running: boolean; tick: number; spikeUntil: number; history: Sample[] };
type Action = { type: "tick" | "toggle" | "spike" | "reset" };
const WINDOW = 60;
const clamp = (n: number) => Math.round(Math.max(0, Math.min(100, n)));
function sample(tick: number, spike = false): Sample {
  return {
    cpu: clamp(34 + Math.sin(tick * 0.37) * 13 + Math.cos(tick * 0.83) * 7 + (spike ? 45 : 0)),
    memory: clamp(52 + Math.sin(tick * 0.13) * 6 + (spike ? 17 : 0)),
    network: clamp(28 + Math.sin(tick * 0.29) * 16 + Math.cos(tick * 0.67) * 8 + (spike ? 40 : 0)),
  };
}
function initialState(): State {
  return { running: true, tick: 0, spikeUntil: 0, history: Array.from({ length: WINDOW }, (_, i) => sample(i - WINDOW + 1)) };
}
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "reset": return initialState();
    case "toggle": return { ...state, running: !state.running };
    case "spike": return { ...state, spikeUntil: state.tick + 10, history: [...state.history.slice(0, -1), sample(state.tick, true)] };
    case "tick": {
      if (!state.running) return state;
      const tick = state.tick + 1;
      return { ...state, tick, history: [...state.history.slice(1), sample(tick, tick < state.spikeUntil)] };
    }
  }
}
const series = [
  { key: "cpu", label: "CPU utilization", unit: "%" },
  { key: "memory", label: "Memory pressure", unit: "%" },
  { key: "network", label: "Network throughput", unit: " MB/s" },
] as const;
const volumes = [{ label: "System", used: 56, size: "512 GB" }, { label: "Documents", used: 55, size: "2 TB" }, { label: "Cache", used: 37, size: "256 GB" }, { label: "Backups", used: 71, size: "1 TB" }];

/**
 * Synthetic telemetry inspired by DevDesLpz's SYSCORE visualization:
 * https://codepen.io/DevDesLpz/pen/QwpxLaN
 * Original React/SVG implementation; no server metrics are collected.
 */
export function DashboardSystemMonitor() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const id = useId();
  useEffect(() => {
    if (!state.running) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) dispatch({ type: "tick" });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [state.running]);
  const latest = state.history[state.history.length - 1];
  return <S.Panel aria-label="Simulated system monitor">
    <S.ChartHeader>
      <div><Typography component="h2" variant="h6">System monitor</Typography><Typography variant="body2" color="text.secondary">Synthetic telemetry · rolling 60-second history</Typography></div>
      <Chip size="small" color={state.running ? "success" : "default"} variant="outlined" label={state.running ? "Demo running" : "Demo paused"} />
    </S.ChartHeader>
    <S.Actions>
      <Button size="small" startIcon={state.running ? <Pause /> : <PlayArrow />} onClick={() => dispatch({ type: "toggle" })}>{state.running ? "Pause simulation" : "Resume simulation"}</Button>
      <Button size="small" startIcon={<BoltOutlined />} onClick={() => dispatch({ type: "spike" })}>Load spike</Button>
      <Button size="small" startIcon={<RestartAlt />} onClick={() => dispatch({ type: "reset" })}>Reset simulation</Button>
    </S.Actions>
    <S.MonitorGrid>{series.map(({ key, label, unit }) => {
      const points = state.history.map((point, i) => `${32 + i * 4.7},${140 - point[key] * 1.12}`).join(" ");
      return <div key={key}>
        <Typography component="h3" variant="subtitle2">{label}</Typography>
        <Typography variant="h5" component="p" data-testid={`monitor-${key}`}>{latest[key]}{unit}</Typography>
        <S.Chart viewBox="0 0 320 170" role="img" data-series={key} aria-labelledby={`${id}-${key}`}>
          <title id={`${id}-${key}`}>{label}: {latest[key]}{unit}, simulated last 60 seconds</title>
          {[0, 50, 100].map(value => <g key={value}><line className="chart-grid" x1="32" x2="310" y1={140 - value * 1.12} y2={140 - value * 1.12} /><text data-chart-caption x="1" y={144 - value * 1.12}>{value}</text></g>)}
          <polygon className="monitor-area" points={`32,140 ${points} 309.3,140`} />
          <polyline className="monitor-line" points={points} />
          <text data-chart-caption x="32" y="164">−60s</text><text data-chart-caption x="310" y="164" textAnchor="end">Now</text>
        </S.Chart>
      </div>;
    })}</S.MonitorGrid>
    <S.ChartGrid>
      <div><Typography component="h3" variant="subtitle2">CPU core distribution</Typography>
        <S.MonitorMeters>{Array.from({ length: 8 }, (_, i) => {
          const value = clamp(latest.cpu + Math.sin(state.tick * 0.2 + i) * 16);
          return <S.MonitorMeter key={i}><span>Core {String(i + 1).padStart(2, "0")}</span><span>{value}%</span><S.MonitorProgress aria-label={`Core ${i + 1} utilization`} value={value} max={100} /></S.MonitorMeter>;
        })}</S.MonitorMeters>
      </div>
      <div><Typography component="h3" variant="subtitle2">Storage volumes</Typography>
        <S.MonitorMeters>{volumes.map(({ label, used, size }) => <S.MonitorMeter key={label}><span>{label} · {size}</span><span>{used}%</span><S.MonitorProgress aria-label={`${label} storage used`} value={used} max={100} /></S.MonitorMeter>)}</S.MonitorMeters>
      </div>
    </S.ChartGrid>
    <Typography variant="caption" color="text.secondary">Demo only — these charts do not represent the application's infrastructure or actual usage.</Typography>
  </S.Panel>;
}
