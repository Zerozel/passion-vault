import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CapsuleReveal } from "@/components/vault/capsule-reveal";

export default async function OpenCapsulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  return <CapsuleReveal capsuleId={id} />;
}
