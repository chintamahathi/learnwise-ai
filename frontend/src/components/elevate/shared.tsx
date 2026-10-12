import { X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-heading">
          <h2>{title}</h2>
          <Button variant="ghost" size="icon" aria-label="Close dialog" onClick={onClose}>
            <X />
          </Button>
        </div>
        {children}
      </section>
    </div>
  );
}
export function PageHeading({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">YOUR GROWTH WORKSPACE</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="heading-actions">{children}</div>
    </div>
  );
}
export function Tag({ children, color = "" }: { children: ReactNode; color?: string }) {
  return <span className={`tag ${color}`}>{children}</span>;
}
export function Ring({ value, color = "" }: { value: number; color?: string }) {
  return (
    <div className={`progress-ring ${color}`}>
      <svg viewBox="0 0 48 48">
        <circle className="ring-track" cx="24" cy="24" r="19" />
        <circle
          className="ring-fill"
          cx="24"
          cy="24"
          r="19"
          strokeDasharray={`${value * 1.194} 119.4`}
        />
      </svg>
      <span>{value}%</span>
    </div>
  );
}
export function Progress({ value, color = "" }: { value: number; color?: string }) {
  return (
    <div className="progress-track">
      <div
        className={`progress-fill ${color}`}
        ref={(el) => {
          if (el) el.style.width = `${value}%`;
        }}
      />
    </div>
  );
}
export function PanelHeader({
  title,
  description,
  action,
}: {
  title: ReactNode;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="panel-header">
      <div>
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}
export function LinkLabel({ children }: { children: ReactNode }) {
  return (
    <span className="panel-link">
      {children}
      <ArrowUpRight />
    </span>
  );
}
