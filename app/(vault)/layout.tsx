import { VaultShell } from "@/components/layout/vault-shell";

export default function VaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <VaultShell>{children}</VaultShell>;
}
