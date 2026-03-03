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
    className: "border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400",
  },
  created: {
    label: "Custom",
    icon: User,
    className: "border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400",
  },
  installed: {
    label: "Marketplace",
    icon: Download,
    className: "border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-400",
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
        <Badge variant="outline" className="text-xs gap-1 border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-400">
          <Globe className="h-3 w-3" />
          Published
        </Badge>
      )}
    </>
  );
}
