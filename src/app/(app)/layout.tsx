import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SearchPalette } from "@/components/layout/search-palette";
import { SearchShortcut } from "@/components/layout/search-shortcut";
import { Separator } from "@/components/ui/separator";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <div className="flex-1" />
          <SearchShortcut />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
      <SearchPalette />
    </SidebarProvider>
  );
}
