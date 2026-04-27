export default function Footer() {
  return (
    <footer className="border-t border-cyan-hp/10 bg-midnight px-6 py-10 text-center">
      <p className="font-wizard text-silver-hp/50 text-sm">
        © {new Date().getFullYear()} Hexafalls — cast with care, no muggles harmed.
      </p>
    </footer>
  );
}
