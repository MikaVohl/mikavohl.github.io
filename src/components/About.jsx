export default function About() {
  return (
    <section
      id="about"
      className="scroll-mt-[calc(9vh+35px)] mt-8 py-12 text-left md:mt-10 md:py-16"
    >
      <h2 className="hidden text-left text-5xl font-medium sm:mb-10 sm:block">About Me</h2>
      <div className="flex w-full flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-8">
        <div className="text-left text-gray-700 text-xl md:flex-1">
          <p className="mb-6">
            I love building products, solving challenging problems, and learning new things. My interest and experience lies mostly in the domains of Machine Learning, Computer Science, and Physics.
          </p>
          <p className="mb-2">
            <strong>I'm currently:</strong>
          </p>
          <ul className="mb-6 list-disc space-y-2 pl-6">
            <li>Researching <strong>machine learning imputation techniques</strong> in medical data with McGill AI Society</li>
            <li>A <strong>fullstack developer</strong> for McHacks, McGill's largest hackathon</li>
            <li>Part of the <strong>weekly ML reading group</strong> at McGill</li>
          </ul>
          <p className="mb-6">
            Feel free to reach out and connect!
          </p>
        </div>
        <img
          src="/images/MikaVohl2.jpg"
          alt="Mika second portrait"
          className="mx-auto h-80 w-3/4 rounded-[10%] object-cover md:mx-0 md:ml-auto md:w-[300px] md:flex-none"
        />
      </div>
    </section>
  )
}
