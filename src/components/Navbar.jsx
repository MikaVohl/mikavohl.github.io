import SocialLinks from './SocialLinks'

export default function Navbar() {
  return (
    <nav className="fixed top-0 z-20 w-full bg-white/70 py-2 font-semibold text-base backdrop-blur-lg shadow-sm sm:text-xl">
      <div className="container mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-3 sm:flex-nowrap sm:gap-6 sm:px-4">
        <SocialLinks className="text-2xl sm:justify-start sm:text-3xl" />

        <ul className="hidden flex-1 items-center justify-center gap-6 text-base sm:flex sm:text-xl">
          {[
            { id: 'intro', label: 'Home' },
            { id: 'projects', label: 'Projects' },
            { id: 'about', label: 'About' },
          ].map(({ id, label }) => (
            <li key={id}>
              <a href={`#${id}`} className="nav-link">
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex justify-center sm:justify-end">
          <a
            href="/MikaVohlResume.pdf"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-black/30 px-3 py-1 text-sm font-medium text-black transition hover:border-black hover:bg-black hover:text-white sm:px-4 sm:text-base"
          >
            Resume
          </a>
        </div>
      </div>
    </nav>
  )
}
