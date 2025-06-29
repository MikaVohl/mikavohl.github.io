export default function Intro() {
  return (
    <section
      id="intro"
      className="min-h-[calc(100vh-60px)] flex items-center justify-center scroll-mt-[250px] text-center py-32 md:py-52"
    >
      <div className="-translate-y-[6vh] mx-16 flex max-w-5xl flex-col-reverse items-center gap-8 md:flex-row md:gap-16">
        <div className="text-left">
          <h2 className="text-5xl font-semibold md:text-6xl">Mika Vohl</h2>
          <h3 className="mt-5 text-lg text-gray-500 md:text-2xl">
            Computer Science student at McGill University and Fullstack
            Developer
          </h3>
        </div>
        <picture>
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
            className="w-[13rem] md:w-[22rem] rounded-[10%]"
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>
    </section>
  );
}
