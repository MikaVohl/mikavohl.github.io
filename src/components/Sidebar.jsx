import { FaGithub, FaLinkedin } from 'react-icons/fa'

export default function Sidebar() {
  const items = [
    { href: 'https://www.linkedin.com/in/mikavohl/', icon: <FaLinkedin /> },
    { href: 'https://github.com/MikaVohl', icon: <FaGithub /> },
  ]
  return (
    <aside className="fixed left-0 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-10 px-3">
      {items.map(({ href, icon }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="zoom text-4xl sm:text-6xl opacity-50 hover:opacity-100"
        >
          {icon}
        </a>
      ))}
    </aside>
  )
}
