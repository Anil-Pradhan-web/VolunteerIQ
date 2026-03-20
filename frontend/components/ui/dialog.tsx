"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type DialogContextValue = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const context = React.useContext(DialogContext);

  if (!context) {
    throw new Error("Dialog components must be used within <Dialog />");
  }

  return context;
}

function Dialog({
  children,
  open: controlledOpen,
  onOpenChange
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen ?? internalOpen;

  const setOpen: DialogContextValue["setOpen"] = (value) => {
    const nextOpen = typeof value === "function" ? value(open) : value;
    onOpenChange?.(nextOpen);

    if (controlledOpen === undefined) {
      setInternalOpen(nextOpen);
    }
  };

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

function DialogTrigger({
  children,
  asChild
}: {
  children: React.ReactElement;
  asChild?: boolean;
}) {
  const { setOpen } = useDialogContext();

  if (!asChild) {
    return (
      <button type="button" onClick={() => setOpen(true)}>
        {children}
      </button>
    );
  }

  return React.cloneElement(children, {
    onClick: () => setOpen(true)
  });
}

function DialogContent({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { open, setOpen } = useDialogContext();

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        onClick={() => setOpen(false)}
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-lg rounded-[28px] border border-white/60 bg-card p-6 shadow-soft",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 flex flex-col gap-2", className)} {...props} />;
}

function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-display text-2xl font-semibold text-foreground", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
};
