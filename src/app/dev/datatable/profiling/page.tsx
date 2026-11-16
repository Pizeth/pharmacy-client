import { notFound } from "next/navigation";
import { canAccessLocalProfile } from "@/components/DataTable/mui/dev/performance/profileAccess";
import { ProductionProfiling } from "@/components/DataTable/mui/dev/performance/ProductionProfiling";

export default async function Page({ searchParams }: {
  readonly searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  if (!canAccessLocalProfile({
    buildMode: process.env.DATATABLE_PROFILE_BUILD_MODE,
    runtimeMode: process.env.DATATABLE_LOCAL_PROFILE,
    expectedToken: process.env.DATATABLE_PROFILE_TOKEN,
    token: query.token,
  })) notFound();
  return <ProductionProfiling buildMode={process.env.DATATABLE_PROFILE_BUILD_MODE === "react" ? "react" : "browser"} />;
}
