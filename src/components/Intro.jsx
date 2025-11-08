export default function Intro() {
  return (
    <section
      id="intro"
      className="scroll-mt-32 py-8 text-center md:py-20"
    >
      <div className="flex w-full max-w-5xl flex-col items-center gap-6 text-center md:flex-row md:items-center md:justify-between md:gap-16 md:text-left">
        <div className="order-2 max-w-xl text-center md:order-1 md:text-left">
          <h2 className="text-5xl font-semibold md:text-6xl">Mika Vohl</h2>
          <h3 className="mt-5 text-lg text-gray-500 md:text-2xl">
            Computer Science and Physics @ McGill
            <br />
            Machine Learning & Software Engineer
          </h3>
        </div>
        <picture className="order-1 flex-shrink-0 md:order-2">
          {/* WebP first */}
          <source
            type="image/webp"
            srcSet="/images/MikaVohl_1x.webp 1x, /images/MikaVohl_2x.webp 2x"
          />
          {/* JPEG fallback */}
          <source
            type="image/jpeg"
            srcSet="/images/MikaVohl_1x.jpg 1x, /images/MikaVohl_2x.jpg 2x"
          />
          <img
            src="/images/MikaVohl_2x.jpg"
            width="352"
            height="352"
            alt="Mika Vohl portrait"
            className="w-36 md:w-48 flex-shrink-0 rounded-[10%]"
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>
    </section>
  );
}
