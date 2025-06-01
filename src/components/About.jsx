export default function About() {
  return (
    <section id="about" className="scroll-mt-[calc(9vh+35px)] py-20 md:py-24 text-center">
      <h2 className="mb-10 text-5xl font-medium">About Me</h2>
      <div className="mx-auto max-w-5xl flex flex-col md:flex-row md:items-center gap-10">
        <div className="text-left text-gray-700 text-xl mx-10 md:mx-0">
          <p className="mb-6">
            I'm passionate about building software that improves outcomes and solving the challenging problems along the way. With a lifelong goal of learning new things and building cool stuff, my path has often crossed projects in Machine Learning, Computer Science, and Physics.
          </p>
          <p className="mb-6">
            With hands-on experience through internships, personal projects, and coursework, I've sharpened my skills in
            Python, Go, Java, JavaScript, SQL, and more. My current focus is on Machine Learning, particularly neural networks and large language models, using frameworks like PyTorch, TensorFlow, and NumPy.
          </p>
          <p>
            I am always open to exploring new internship opportunities or collaborations. Feel free to connect with me on LinkedIn, send me an email, and check out my projects above!
          </p>
        </div>
        <img
          src="/images/MikaVohl2.jpg"
          alt="Mika second portrait"
          className="mx-auto w-4/5 md:w-full h-96 object-cover rounded-[10%]"
        />
      </div>
    </section>
  )
}
