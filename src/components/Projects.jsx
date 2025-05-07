import projects from '../data/projects'

export default function Projects() {
  return (
    <section id="projects" className="scroll-mt-[calc(5vh+29px)] py-20 text-center">
      <h2 className="mb-10 text-5xl font-medium">Projects</h2>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <a href={p.href} target="_blank">
            <div
              key={p.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-2xl font-semibold">
                {p.title}
              </h3>
              <h4 className="mb-2 text-lg font-medium text-gray-500">
                {p.stack}
              </h4>
              <div className="h-48 w-full overflow-hidden rounded-md">
                <img
                  src={p.img}
                  alt={p.title}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
