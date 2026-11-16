"use client";

import { useEffect } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useGetIdentity } from "@refinedev/core";
import { Alert, Button, Typography } from "@mui/material";
import { AccountCircleOutlined, ArrowForwardRounded, CheckCircleOutline, ContactSupportOutlined, DescriptionOutlined, EmailOutlined, HomeOutlined, PersonOutline, SecurityOutlined } from "@mui/icons-material";
import { ResourcePage } from "@/components/layouts/ResourcePage";
import { RouteContentLoading } from "@/components/layouts/RouteContentLoading";
import { ResourceBadge } from "@/components/Tables/ResourceBadge";
import { isSuperAdminRole } from "@/lib/auth/dashboardDestination";
import type { DashboardIdentity } from "./types";
import * as S from "./styles";

const links = [
  { title: "Documents", description: "Find forms, publications and downloadable files.", href: "/hrd/documents", Icon: DescriptionOutlined, tone: "info" },
  { title: "HRD home", description: "Explore the department’s services and information.", href: "/hrd", Icon: HomeOutlined, tone: "secondary" },
  { title: "About the department", description: "Learn about the team and organization.", href: "/hrd/about", Icon: AccountCircleOutlined, tone: "success" },
  { title: "Contact & support", description: "Get help or send an enquiry to the department.", href: "/hrd/contact", Icon: ContactSupportOutlined, tone: "warning" },
] as const;

function BooleanBadge({ value, yes, no }: { value?: boolean; yes: string; no: string }) {
  return <ResourceBadge size="small" color={value === true ? "success" : value === false ? "warning" : "default"}
    icon={value === true ? <CheckCircleOutline /> : undefined} label={value === true ? yes : value === false ? no : "Not available"} />;
}

export function UserDashboard() {
  const identity = useGetIdentity<DashboardIdentity>();
  const router = useRouter();
  const superAdmin = isSuperAdminRole(identity.data?.role);
  useEffect(() => {
    if (!identity.isLoading && superAdmin) router.replace("/admin/dashboard");
  }, [identity.isLoading, superAdmin, router]);

  if (identity.isLoading || superAdmin) return <RouteContentLoading />;
  if (identity.error || !identity.data) return <ResourcePage title="Dashboard" showHeader={false}>
    <Alert severity="error" action={<Button onClick={() => identity.refetch()}>Retry</Button>}>Your account information could not be loaded.</Alert>
  </ResourcePage>;

  return <DashboardContent user={identity.data} />;
}

/** Presentation shared by the authenticated page and its visual/test fixtures. */
export function DashboardContent({ user }: { user: DashboardIdentity }) {
  const accountLabel = user.isLocked ? "Locked" : user.isEnabled === false ? "Disabled" : user.isActivated === false ? "Pending activation" : user.isEnabled === true ? "Active" : "Signed in";
  const role = (user.role ?? "User").split(",").map(value => value.trim().replace(/[_-]+/g, " ")).filter(Boolean).join(", ") || "User";

  return <ResourcePage title="Dashboard" showHeader={false} maxWidth="xl"><S.Root>
    <S.Welcome>
      <S.Identity>
        <S.UserAvatar src={user.avatar} alt={user.name || "Your avatar"}>{user.name?.trim().charAt(0).toUpperCase() || <PersonOutline />}</S.UserAvatar>
        <div>
          <Typography variant="overline" color="text.secondary">Your workspace</Typography>
          <Typography component="h1" variant="h5">Welcome back{user.name ? `, ${user.name}` : ""}</Typography>
          {user.email && <Typography variant="body2" color="text.secondary">{user.email}</Typography>}
        </div>
      </S.Identity>
      <ResourceBadge color="info" size="small" icon={<PersonOutline />} label={role} />
    </S.Welcome>

    <S.Layout>
      <S.Panel component="section" aria-labelledby="dashboard-quick-access">
        <Typography id="dashboard-quick-access" component="h2" variant="h6">Quick access</Typography>
        <S.QuickLinks>
          {links.map(({ title, description, href, Icon, tone }) => <S.QuickLink key={href} component={NextLink} href={href} color="inherit">
            <S.Icon data-tone={tone}><Icon /></S.Icon>
            <Typography component="span" variant="subtitle1" fontWeight={500}>{title}</Typography>
            <Typography component="span" variant="body2" color="text.secondary">{description}</Typography>
          </S.QuickLink>)}
        </S.QuickLinks>
      </S.Panel>

      <S.Root>
        <S.Panel component="section" aria-labelledby="dashboard-account">
          <Typography id="dashboard-account" component="h2" variant="h6">Account & access</Typography>
          <S.Facts>
            <S.Fact><dt><SecurityOutlined fontSize="small" />Account</dt><dd><ResourceBadge size="small" color={user.isLocked || user.isEnabled === false ? "error" : user.isActivated === false ? "warning" : "success"} label={accountLabel} /></dd></S.Fact>
            <S.Fact><dt><EmailOutlined fontSize="small" />Email</dt><dd><BooleanBadge value={user.isVerified} yes="Verified" no="Not verified" /></dd></S.Fact>
            <S.Fact><dt><AccountCircleOutlined fontSize="small" />Profile</dt><dd><BooleanBadge value={user.isLinked} yes="Linked" no="Not linked" /></dd></S.Fact>
          </S.Facts>
        </S.Panel>
        <S.Panel component="section" aria-labelledby="dashboard-help">
          <Typography id="dashboard-help" component="h2" variant="h6">Need a hand?</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>For questions about your account or department services, contact the HRD team.</Typography>
          <S.Actions><Button component={NextLink} href="/hrd/contact" color="info" endIcon={<ArrowForwardRounded />}>Get support</Button></S.Actions>
        </S.Panel>
      </S.Root>
    </S.Layout>
  </S.Root></ResourcePage>;
}
