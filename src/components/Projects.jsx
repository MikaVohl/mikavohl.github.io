import projects from "../data/projects";

export default function Projects() {
  return (
    <section id="projects" className="py-20 text-center">
      <h2 className="mb-10 text-5xl font-medium">Projects</h2>

      <div className="flex flex-wrap justify-center gap-6">
        {projects.map((p) => (
          <a
            key={p.title}
            href={p.href}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-80 md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
          >
            <div className="h-full rounded-lg border border-gray-200 bg-white px-6 py-5 shadow-sm">
              <h3 className="text-2xl font-semibold">{p.title}</h3>
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
              <p className="h-6 min-h-[1.5rem] font-medium mt-1 text-gray-600">
                {p.href.includes("mikavohl.ca") ? "Try it at " : "View it on "}
                <span className="text-blue-500 hover:underline">
                  {p.href.includes("mikavohl.ca")
                    ? p.href.replace(/^https?:\/\//, "")
                    : "Github"}
                </span>
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
