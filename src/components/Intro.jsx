export default function Intro() {
  return (
    <section id="intro" className="scroll-mt-[250px] py-20 text-center md:py-32">
      <div className="mx-16 flex max-w-5xl flex-col items-center gap-8 md:flex-row md:gap-16">
        <div className="text-left">
          <h2 className="text-5xl font-semibold md:text-6xl">Mika Vohl</h2>
          <h3 className="mt-5 text-lg text-gray-500 md:text-2xl">
            Computer Science student at McGill University and Fullstack Developer
          </h3>
        </div>
        <img
          src="/images/MikaVohl.jpg"
          alt="Mika Vohl portrait"
          className="w-[22rem] rounded-[10%]"
        />
      </div>
    </section>
  )
}

