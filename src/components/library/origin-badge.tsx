import { Package, User, Download, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ResourceOrigin } from "@/types";

const config: Record<
  ResourceOrigin,
  { label: string; icon: typeof Package; className: string }
> = {
  bundled: {
    label: "Bundled",
    icon: Package,
    className: "border-primary/30 text-primary",
  },
  created: {
    label: "Custom",
    icon: User,
    className: "border-emerald-400/30 text-emerald-400",
  },
  installed: {
    label: "Marketplace",
    icon: Download,
    className: "border-violet-400/30 text-violet-400",
  },
};

interface OriginBadgeProps {
  origin?: ResourceOrigin;
  isPublic?: boolean;
}

export function OriginBadge({ origin, isPublic }: OriginBadgeProps) {
  if (!origin || origin === "bundled") return null;

  const { label, icon: Icon, className } = config[origin];

  return (
    <>
      <Badge variant="outline" className={`text-xs gap-1 ${className}`}>
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
      {isPublic && (
        <Badge variant="outline" className="text-xs gap-1 border-amber-400/30 text-amber-400">
          <Globe className="h-3 w-3" />
          Published
        </Badge>
      )}
    </>
  );
}
