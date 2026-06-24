"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useI18n } from "@/features/i18n/language-context";
import { useToast } from "@/features/toast/toast-context";
import { formatDateTime, getErrorMessage } from "@/lib/utils";
import {
  adjustUserCredits,
  listAdminUsers,
  updateAdminUser,
} from "@/services/admin-service";
import type { AdminUser } from "@/types/api";

export default function AdminUsersPage() {
  const { t } = useI18n();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const usersQuery = useQuery({
    queryKey: ["admin", "users", page, search],
    queryFn: () => listAdminUsers({ page, limit: 20, search: search || undefined }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { role?: string; enabled?: boolean } }) =>
      updateAdminUser(id, payload),
    onSuccess: () => {
      toast.success(t("admin.users.updated", "User updated"));
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const creditsMutation = useMutation({
    mutationFn: ({ id, amount, reason }: { id: string; amount: number; reason: string }) =>
      adjustUserCredits(id, { amount, reason }),
    onSuccess: () => {
      toast.success(t("admin.users.creditsAdjusted", "Credits adjusted"));
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const adjustCredits = (user: AdminUser) => {
    const raw = window.prompt(
      t("admin.users.creditsPrompt", "Credit amount (use a negative number to deduct):"),
      "10",
    );
    if (raw === null) return;
    const amount = Number(raw);
    if (!Number.isFinite(amount) || amount === 0) {
      toast.error(t("admin.users.creditsInvalid", "Enter a non-zero number."));
      return;
    }
    const reason =
      window.prompt(t("admin.users.creditsReason", "Reason:"), "admin adjustment") ?? "admin adjustment";
    creditsMutation.mutate({ id: user.id, amount, reason });
  };

  return (
    <div>
      <PageHeader
        title={t("admin.users.title", "Users")}
        description={t("admin.users.description", "Manage roles, access and credit balances.")}
      />

      <Card>
        <form
          className="mb-4 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            setSearch(searchInput.trim());
            setPage(0);
          }}
        >
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder={t("admin.users.searchPlaceholder", "Search by email or name")}
          />
          <Button type="submit" variant="secondary">
            {t("common.search", "Search")}
          </Button>
        </form>

        {usersQuery.isLoading ? (
          <p className="text-sm text-muted">{t("common.loading", "Loading…")}</p>
        ) : usersQuery.data && usersQuery.data.items.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-subtle text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">{t("admin.users.colUser", "User")}</th>
                  <th className="px-4 py-3 font-medium">{t("admin.users.colRole", "Role")}</th>
                  <th className="px-4 py-3 font-medium">{t("admin.users.colStatus", "Status")}</th>
                  <th className="px-4 py-3 font-medium">{t("admin.users.colCreated", "Created")}</th>
                  <th className="px-4 py-3 font-medium">{t("admin.users.colActions", "Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {usersQuery.data.items.map((user) => (
                  <tr key={user.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <p className="text-foreground">{user.displayName}</p>
                      <p className="text-[12px] text-muted">{user.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge intent={user.role === "ADMIN" ? "accent" : "neutral"}>{user.role}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge intent={user.enabled ? "success" : "danger"}>
                        {user.enabled ? "ACTIVE" : "LOCKED"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted">{formatDateTime(user.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={updateMutation.isPending}
                          onClick={() =>
                            updateMutation.mutate({
                              id: user.id,
                              payload: { role: user.role === "ADMIN" ? "USER" : "ADMIN" },
                            })
                          }
                        >
                          {user.role === "ADMIN"
                            ? t("admin.users.demote", "Make user")
                            : t("admin.users.promote", "Make admin")}
                        </Button>
                        <Button
                          size="sm"
                          variant={user.enabled ? "danger" : "secondary"}
                          disabled={updateMutation.isPending}
                          onClick={() =>
                            updateMutation.mutate({
                              id: user.id,
                              payload: { enabled: !user.enabled },
                            })
                          }
                        >
                          {user.enabled ? t("admin.users.lock", "Lock") : t("admin.users.unlock", "Unlock")}
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={creditsMutation.isPending}
                          onClick={() => adjustCredits(user)}
                        >
                          {t("admin.users.credits", "Credits")}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title={t("admin.users.empty", "No users found")}
            description={t("admin.users.emptyDesc", "Try a different search term.")}
          />
        )}

        {usersQuery.data ? (
          <PaginationControls
            page={usersQuery.data.page}
            totalPages={usersQuery.data.totalPages}
            hasPrevious={usersQuery.data.hasPrevious}
            hasNext={usersQuery.data.hasNext}
            onChange={(nextPage) => setPage(Math.max(nextPage, 0))}
          />
        ) : null}
      </Card>
    </div>
  );
}
