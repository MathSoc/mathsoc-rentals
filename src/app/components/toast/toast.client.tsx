"use client";

import { CloseButton } from "@/app/components/close-button/close-button";
import { Toast } from "@base-ui/react/toast";
import "./toast.scss";

export const ToastViewport: React.FC = () => {
  const { toasts } = Toast.useToastManager();
  return (
    <Toast.Viewport className="toast-viewport">
      {toasts.map((toast) => (
        <Toast.Root key={toast.id} toast={toast} className="toast">
          <Toast.Title className="toast-title" />
          <Toast.Close render={<CloseButton />} />
        </Toast.Root>
      ))}
    </Toast.Viewport>
  );
};
