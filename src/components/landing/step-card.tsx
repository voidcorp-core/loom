import type { LucideIcon } from "lucide-react";

interface StepCardProps {
  step: number;
  icon: LucideIcon;
  title: string;
  description: string;
}

export function StepCard({ step, icon: Icon, title, description }: StepCardProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-2 text-xs font-medium text-muted-foreground">
        Step {step}
      </div>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/5">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h3 className="mb-1 text-base font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
