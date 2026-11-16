# Personal dashboard

`/dashboard` uses the shared protected layout, profile gate, breadcrumbs and footer.
It displays only the current identity returned by the existing auth provider and
links to public HRD resources. Do not call administrator endpoints for personal
metrics, invent statistics, or expose internal IDs.

System/super administrators are routed to `/admin/dashboard`. Other roles,
including delegated managers, retain the personal dashboard. The shared
`dashboardDestination` helper is presentation routing only and does not grant
permissions or replace backend authorization.

Presentation uses typed `RazethDashboard` MUI slots and shared pill badges and
neumorphic button styles. Keep missing identity metadata explicitly unavailable.
