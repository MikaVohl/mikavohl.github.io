import projects from "../data/projects";

export default function Projects() {
  return (
    <section id="projects" className="mt-0 pt-12 pb-10 md:pt-16 md:pb-14">
      <h2 className="mb-10 text-5xl font-medium text-left">Projects</h2>

      <div className="flex flex-wrap justify-start gap-6">
        {projects.map((p) => (
          <a
            key={p.title}
            href={p.href}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
          >
            <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white px-5 py-4 text-left shadow-sm">
              <h3 className="text-2xl font-semibold leading-snug">{p.title}</h3>
              <h4 className="text-lg font-medium text-gray-500 leading-tight">
                {p.stack}
              </h4>
              <p className="mt-2 mb-3 text-base leading-relaxed text-gray-600">
                {p.description}
              </p>
              <div className="h-40 w-full overflow-hidden rounded-md">
                <img
                  src={p.img}
                  alt={p.title}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="mt-auto pt-1">
                <p className="h-6 min-h-[1.5rem] font-medium text-gray-600">
                  {p.href.includes("mikavohl.ca") ? "Try it at " : "View it on "}
                  <span className="text-blue-500 hover:underline">
                    {p.href.includes("mikavohl.ca")
                      ? p.href.replace(/^https?:\/\//, "")
                      : "Github"}
                  </span>
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
