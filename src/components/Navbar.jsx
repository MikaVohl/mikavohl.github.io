import { FaGithub, FaLinkedin, FaEnvelope, FaXTwitter } from 'react-icons/fa6'
import { SiDevpost } from 'react-icons/si'

export default function Navbar() {
  const socials = [
    { href: 'https://www.linkedin.com/in/mikavohl/', icon: <FaLinkedin /> },
    { href: 'https://github.com/MikaVohl', icon: <FaGithub /> },
    { href: 'mailto:mikavohl@gmail.com', icon: <FaEnvelope /> },
    { href: 'https://devpost.com/mikavohl', icon: <SiDevpost /> },
    { href: 'https://x.com/AmateurMika', icon: <FaXTwitter /> },
  ]

  return (
    <nav className="fixed top-0 z-20 w-full font-semibold text-xl bg-white/70 backdrop-blur-lg shadow-sm py-2">
      <div className="container mx-auto flex max-w-6xl items-center justify-between gap-6 px-4">
        <div className="flex items-center gap-4 text-2xl sm:text-3xl">
          {socials.map(({ href, icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="opacity-60 transition hover:opacity-100"
            >
              {icon}
            </a>
          ))}
        </div>

        <ul className="flex items-center gap-6">
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

        <a
          href="/MikaVohlResume.pdf"
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-black/30 px-4 py-1 text-base font-medium text-black transition hover:border-black hover:bg-black hover:text-white"
        >
          Resume
        </a>
      </div>
    </nav>
  )
}
