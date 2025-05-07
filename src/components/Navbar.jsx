export default function Navbar() {
  return (
    <nav className="fixed top-0 z-20 w-full font-semibold text-xl bg-white/95 backdrop-blur py-2">
      <ul className="flex justify-end">
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
    </nav>
  )
}
