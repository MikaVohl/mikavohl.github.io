import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Intro from './components/Intro'
import Projects from './components/Projects'
import About from './components/About'
import Writing, { getSortedPosts } from './components/Writing'

export default function App() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/'
  const segments = decodeURIComponent(pathname.replace(/^\/+|\/+$/g, ''))
    .split('/')
    .filter(Boolean)
  const [rootSegment, writingSlug] = segments
  const isWritingPage = rootSegment === 'writing'
  const sortedPosts = getSortedPosts()
  const earliestSlug = sortedPosts[0]?.slug || ''
  const targetSlug = writingSlug || earliestSlug

  useEffect(() => {
    if (!isWritingPage) return
    if (writingSlug || !earliestSlug) return
    const nextPath = `/writing/${encodeURIComponent(earliestSlug)}`
    if (window.location.pathname !== nextPath) {
      window.history.replaceState(null, '', nextPath)
    }
  }, [isWritingPage, writingSlug, earliestSlug])

  if (isWritingPage) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <Navbar />
        <div className="h-[46px] md:h-[60px]" />
        <main className="mx-auto w-full max-w-screen-2xl px-4 flex-1">
          <Writing title={targetSlug} />
        </main>
        <div className="h-[20px]" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar/>
      <div className="h-[46px] md:h-[60px]" />
      <main className="container mx-auto max-w-6xl px-4 flex-1">
        <Intro/>
        <Projects/>
        <About/>
      </main>
      <div className="h-[20px]" />
    </div>
  )
}
