import Image from "next/image";
import { ExternalLink } from "lucide-react";

const footerLinks = [
  {
    label: "npm",
    href: "https://www.npmjs.com/package/@folpe/loom",
  },
  {
    label: "GitHub",
    href: "https://github.com/voidcorp-core/loom",
  },
  {
    label: "Marketplace",
    href: "/marketplace",
  },
];

export function LandingFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-8 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Loom"
            width={20}
            height={20}
            className="dark:invert"
          />
          <span className="text-sm text-muted-foreground">
            Loom &copy; {new Date().getFullYear()}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={
                link.href.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
              className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
              {link.href.startsWith("http") && (
                <ExternalLink className="h-3 w-3" />
              )}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
