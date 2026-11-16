import { SiteBreadcrumbs } from "@/components/layouts/SiteBreadcrumbs";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <><SiteBreadcrumbs />{children}</>;
}
