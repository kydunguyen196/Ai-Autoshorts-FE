import { AdminRouteGuard } from "@/components/layout/admin-route-guard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminRouteGuard>{children}</AdminRouteGuard>;
}
