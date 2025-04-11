import { Link } from "react-router-dom";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className="w-full border-t border-border/40 bg-background py-6">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 md:px-8">
        {/* Left side */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <a 
            href="/" 
            className="text-foreground hover:text-foreground/80 transition-colors"
          >
            heykuba.com
          </a>
          <span className="text-border">·</span>
          <a 
            href="/privacy" 
            className="hover:text-foreground transition-colors"
          >
            Cookies and privacy policy.
          </a>
        </div>

        {/* Right side - Social Links */}
        <nav className="flex items-center gap-8">
          <a 
            href="https://twitter.com" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            X / Twitter
          </a>
          <a 
            href="https://dribbble.com" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dribbble
          </a>
          <a 
            href="/layers" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Layers
          </a>
          <a 
            href="/shop" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Shop
          </a>
        </nav>
      </div>
    </footer>
  );
} 