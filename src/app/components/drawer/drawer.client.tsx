"use client";

import { Drawer } from "@base-ui/react/drawer";
import "./drawer.scss";

type DrawerPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children?: React.ReactNode;
};

export const DrawerPanel: React.FC<DrawerPanelProps> = ({
  open,
  onOpenChange,
  title,
  children,
}) => {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Backdrop className="drawer-backdrop" />
        <Drawer.Popup className="drawer-popup">
          <Drawer.Title className="drawer-title">{title}</Drawer.Title>
          {children}
        </Drawer.Popup>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
