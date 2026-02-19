/* Layout UI */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* Place children where you want to render a page or nested layout */
  return <main>{children}</main>;
}
