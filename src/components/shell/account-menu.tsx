"use client";

import { useState, useTransition } from "react";
import { ChevronsUpDown, LoaderCircle, LogOut, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteAccountAction, signOutAction } from "@/lib/auth/actions";

export function AccountMenu({
  displayName,
  email,
}: {
  displayName: string;
  email: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const initial = displayName.trim().charAt(0).toUpperCase() || "M";

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          data-testid="account-menu-trigger"
          className="flex w-full items-center gap-2 rounded-md p-2 text-left transition-colors hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-md bg-foreground text-xs font-semibold text-background">
            {initial}
          </span>
          <span className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <span className="block truncate text-sm font-medium">{displayName}</span>
            {email ? (
              <span className="block truncate text-xs text-muted-foreground">
                {email}
              </span>
            ) : null}
          </span>
          <ChevronsUpDown
            className="size-3.5 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden"
            aria-hidden="true"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{email ?? displayName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onSelect={(event) => {
              event.preventDefault();
              setConfirmOpen(true);
            }}
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Delete account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <form action={signOutAction}>
            <DropdownMenuItem asChild>
              <button type="submit" className="w-full cursor-pointer">
                <LogOut className="size-4" aria-hidden="true" />
                Sign out
              </button>
            </DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl">
              Delete this account?
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm leading-6 text-muted-foreground">
                <p>
                  This permanently removes{" "}
                  <span className="text-foreground">{email ?? displayName}</span> and
                  every project, task, and milestone owned by it. The deletion is
                  immediate and cannot be undone.
                </p>
                <p>Export anything you want to keep before continuing.</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep account</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={(event) => {
                event.preventDefault();
                startTransition(() => {
                  void deleteAccountAction();
                });
              }}
              disabled={pending}
            >
              {pending ? (
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Trash2 className="size-4" aria-hidden="true" />
              )}
              Delete forever
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
