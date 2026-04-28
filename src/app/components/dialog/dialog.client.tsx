"use client";

import { CloseButton } from "@/app/components/close-button/close-button";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import "./dialog.scss";

export const Dialog: React.FC<{
  title: string;
  open: boolean;
  className?: string;
  onOpenChange: (open: boolean) => void;
  children?: React.ReactNode;
}> = ({ open, onOpenChange, className, title, children }) => {
  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseDialog.Portal>
        <div className={`dialog ${className ?? ""}`}>
          <BaseDialog.Backdrop className="dialog-backdrop" />
          <BaseDialog.Popup className={`dialog-popup`}>
            <BaseDialog.Title className="dialog-title">
              {title}
            </BaseDialog.Title>
            <div className="dialog-content">{children}</div>
            <BaseDialog.Close render={<CloseButton />} />
          </BaseDialog.Popup>
        </div>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
};
