export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-secondary/20 bg-background text-text transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
        <span className="text-lg font-black tracking-wider text-primary">
          KINETIX
        </span>

        <p className="text-sm text-text/70">
          © {currentYear} Kinetix. Created by{" "}
          <a
            href="https://github.com/Y1lion"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            Y1lion
          </a>{" "}
          and{" "}
          <a
            href="https://github.com/C4MRS"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            C4MRS
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
