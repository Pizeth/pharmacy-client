"use client";
import { useId } from "react";
import { Chip, Typography } from "@mui/material";
import { PeopleOutline, DescriptionOutlined, TranslateOutlined, TrendingUp } from "@mui/icons-material";
import ArrowUpRight from "@mui/icons-material/NorthEast";
import * as S from "./social/styles";
import { DashboardSystemMonitor } from "./DashboardSystemMonitor";
const weeks = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const activity = [124, 186, 142, 230, 198, 276, 244];
const metrics = [
  { label: "Total users", value: "1,284", change: "+12.8% this month", tone: "info", Icon: PeopleOutline },
  { label: "Documents", value: "368", change: "+24 this month", tone: "secondary", Icon: DescriptionOutlined },
  { label: "Translation keys", value: "2,416", change: "96% coverage", tone: "success", Icon: TranslateOutlined },
  { label: "Weekly visits", value: "8,942", change: "+18.4% this week", tone: "warning", Icon: TrendingUp },
];
export function DashboardAnalytics() {
  const id = useId();
  return <section aria-label="Dashboard sample analytics">
    <S.AnalyticsHeader><div><Typography component="h2" variant="h6">Overview</Typography><Typography variant="body2" color="text.secondary">A snapshot of users, content and activity.</Typography></div><Chip size="small" variant="outlined" label="Sample data" /></S.AnalyticsHeader>
    <S.Root>
      <S.Overview>{metrics.map(({ label, value, change, tone, Icon }) => <S.Metric key={label} data-tone={tone}><S.MetricHeader><Typography variant="body2">{label}</Typography><Icon aria-hidden="true" /></S.MetricHeader><S.MetricValue component="p">{value}</S.MetricValue><S.MetricTrend><ArrowUpRight aria-hidden="true" />{change}</S.MetricTrend></S.Metric>)}</S.Overview>
      <S.ChartGrid>
        <S.Panel><S.ChartHeader><div><Typography component="h3" variant="h6">Weekly activity</Typography><Typography variant="body2" color="text.secondary">Visits over the last seven days</Typography></div><Chip size="small" variant="outlined" label="Sample week" /></S.ChartHeader>
          <S.Chart viewBox="0 0 560 270" role="img" aria-labelledby={`${id}-activity-title`} aria-describedby={`${id}-activity-desc`}>
            <title id={`${id}-activity-title`}>Sample visits by day</title><desc id={`${id}-activity-desc`}>{weeks.map((day, i) => `${day}: ${activity[i]} visits`).join(". ")}</desc>
            {[0, 100, 200, 300].map(tick => <g key={tick}><line className="chart-grid" x1="40" x2="550" y1={230 - tick * 0.65} y2={230 - tick * 0.65} /><text data-chart-caption="true" x="4" y={234 - tick * 0.65}>{tick}</text></g>)}
            {activity.map((value, index) => <g key={weeks[index]}><rect className={index === 5 ? "chart-secondary" : "chart-bar"} x={55 + index * 70} y={230 - value * 0.65} width="38" height={value * 0.65} rx="7"><title>{weeks[index]}: {value} visits</title></rect><text x={74 + index * 70} y="255" textAnchor="middle">{weeks[index]}</text></g>)}
          </S.Chart><S.ChartLegend><span>Daily visits</span><span data-series="highlight">Peak day · Saturday</span></S.ChartLegend>
        </S.Panel>
        <S.Panel><S.ChartHeader><div><Typography component="h3" variant="h6">Translation coverage</Typography><Typography variant="body2" color="text.secondary">Across supported locales</Typography></div></S.ChartHeader>
          <S.Chart viewBox="0 0 280 240" role="img" aria-labelledby={`${id}-coverage-title`}><title id={`${id}-coverage-title`}>Sample translation coverage: 96% complete, 4% remaining</title><circle className="chart-track" cx="140" cy="110" r="76" fill="none" strokeWidth="16" /><circle className="chart-ring" cx="140" cy="110" r="76" fill="none" strokeWidth="16" strokeDasharray="458.4 477.5" strokeLinecap="round" transform="rotate(-90 140 110)" /><text data-chart-value="true" x="140" y="114" textAnchor="middle">96%</text><text data-chart-caption="true" x="140" y="138" textAnchor="middle">complete</text><text data-chart-caption="true" x="140" y="223" textAnchor="middle">4% remaining</text></S.Chart><S.ChartLegend><span data-series="coverage">Completed translations</span></S.ChartLegend>
        </S.Panel>
      </S.ChartGrid>
      <DashboardSystemMonitor />
      <Typography variant="caption" color="text.secondary">Preview only. These statistics and charts use illustrative data, not live measurements.</Typography>
    </S.Root>
  </section>;
}
