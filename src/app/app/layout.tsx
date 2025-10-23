import { Navbar } from "@/components/navigation/navbar";
import { SidebarClient } from "@/components/navigation/sidebar-client";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  return (
    <div className="flex h-screen flex-col">
      <Navbar email={user?.email} />
      <div className="flex flex-1 overflow-hidden">
        <SidebarClient />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}
