import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Intro from './components/Intro'
import Projects from './components/Projects'
import About from './components/About'

export default function App() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Sidebar/>
      <Navbar/>
      <div className="h-[60px]" />
      <main className="container mx-auto max-w-6xl px-4 flex-1">
        <Intro/>
        <Projects/>
        <About/>
      </main>
      <div className="h-[200px]" />
    </div>

  )
}
