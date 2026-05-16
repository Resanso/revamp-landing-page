"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cn } from "@/lib/utils";

export function AdminConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = "Continue",
  cancelText = "Cancel",
  isDanger = true,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children && <AlertDialogPrimitive.Trigger asChild>{children}</AlertDialogPrimitive.Trigger>}
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <AlertDialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-[#D9D9D9] bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          <div className="flex flex-col space-y-2 text-center sm:text-left">
            <AlertDialogPrimitive.Title className="text-lg font-semibold text-black font-jakarta">
              {title}
            </AlertDialogPrimitive.Title>
            <AlertDialogPrimitive.Description className="text-sm text-black/70 font-jakarta">
              {description}
            </AlertDialogPrimitive.Description>
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <AlertDialogPrimitive.Cancel className="mt-2 sm:mt-0 px-4 py-2 bg-transparent text-black border border-[#D9D9D9] rounded hover:bg-black/5 transition-colors font-jakarta text-sm font-semibold">
              {cancelText}
            </AlertDialogPrimitive.Cancel>
            <AlertDialogPrimitive.Action
              onClick={onConfirm}
              className={cn(
                "px-4 py-2 rounded transition-colors font-jakarta text-sm font-semibold",
                isDanger
                  ? "bg-[#F75F5F] text-white hover:bg-red-600"
                  : "bg-[#FFC917] text-black hover:bg-[#ffb901]"
              )}
            >
              {confirmText}
            </AlertDialogPrimitive.Action>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
}
