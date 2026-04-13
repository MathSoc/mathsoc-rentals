"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import "./dialog.scss";

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children?: React.ReactNode;
};

export const Dialog: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  title,
  children,
}) => {
  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseDialog.Portal>
        <div className="dialog">
          <BaseDialog.Backdrop className="dialog-backdrop" />
          <BaseDialog.Popup className="dialog-popup">
            <BaseDialog.Title className="dialog-title">
              {title}
            </BaseDialog.Title>
            <div className="dialog-content">{children}</div>
            <BaseDialog.Close className="dialog-close-button">
              ×
            </BaseDialog.Close>
          </BaseDialog.Popup>
        </div>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
};
