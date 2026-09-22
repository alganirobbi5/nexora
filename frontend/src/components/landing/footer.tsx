export function Footer() {
  return (
    <footer
      className="relative py-10 lg:py-14 bg-bg-primary text-text-secondary border-t border-surface-border/20"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-4">
          <div>
            <span className="text-xl font-bold tracking-tight text-text-primary">NEXORA</span>
            <p className="mt-2 text-sm text-text-tertiary">
              Personal finance and productivity, in one focused workspace.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-medium text-text-primary uppercase tracking-wider">Product</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="hover:text-text-primary transition-colors"
                  aria-label="Features"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#analytics"
                  className="hover:text-text-primary transition-colors"
                  aria-label="Analytics"
                >
                  Analytics
                </a>
              </li>
              <li>
                <a
                  href="#goals"
                  className="hover:text-text-primary transition-colors"
                  aria-label="Goals"
                >
                  Goals
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-medium text-text-primary uppercase tracking-wider">Company</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#about"
                  className="hover:text-text-primary transition-colors"
                  aria-label="About"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-text-primary transition-colors"
                  aria-label="Contact"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-medium text-text-primary uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="hover:text-text-primary transition-colors"
                  aria-label="Home"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/nexora"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-text-primary transition-colors"
                  aria-label="GitHub"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  className="hover:text-text-primary transition-colors"
                  aria-label="Privacy"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="hover:text-text-primary transition-colors"
                  aria-label="Terms"
                >
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 lg:mt-12 pt-8 border-t border-surface-border/20 text-center">
          <p className="text-xs text-text-tertiary">
            © 2026 NEXORA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}