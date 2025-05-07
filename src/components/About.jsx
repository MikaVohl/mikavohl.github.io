export default function About() {
  return (
    <section id="about" className="scroll-mt-[calc(9vh+35px)] py-20 md:py-24 text-center">
      <h2 className="mb-10 text-5xl font-medium">About Me</h2>

      {/* DESKTOP layout */}
      <div className="desktop mx-auto hidden max-w-5xl gap-10 md:flex md:items-center">
        <div className="text-left text-gray-700 text-xl">
          <p className="mb-6">
            Combining a love for problem solving with a fascination for technology, I've
            developed a deep passion for computer programming.
          </p>
          <p className="mb-6">
            Through internships, personal projects and coursework I've honed my skills in
            <b> Python, Java, Go, JavaScript, SQL, and more</b>. I'm continually mastering my current stack and exploring new technologies, with a recent focus on Machine Learning.
          </p>
          <p className="font-semibold">Check out my projects above!</p>
        </div>
        <img
          src="/images/MikaVohl2.jpg"
          alt="Mika second portrait"
          className="mx-auto mt-7 w-full h-96 rounded-[10%] object-cover"
        />
      </div>

      {/* MOBILE layout */}
      <div className="mobile mx-10 block md:hidden text-xl">
        <p className="mb-6 text-gray-700">
          Combining a love for problem solving with a fascination for technology, I've
          developed a deep passion for computer programming
        </p>
        <p className="mb-6 text-gray-700">
          Through internships, personal projects and coursework I've honed my skills in
          <b> Python, Java, Go, JavaScript, SQL, and more</b>. I'm continually mastering my current stack and exploring new technologies, with a recent focus on Machine Learning.
        </p>
        <p className="mb-6 font-semibold">Check out my projects above!</p>
        <img
          src="/images/MikaVohl2.jpg"
          alt="Mika second portrait"
          className="mx-auto mt-8 w-4/5 rounded-[10%] object-cover"
        />
      </div>
    </section>
  )
}
