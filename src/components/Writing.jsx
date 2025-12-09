export const markdownFiles = import.meta.glob('../writing/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const parseFrontmatter = (raw = '') => {
  const match = raw.match(/^---\n([\s\S]+?)\n---\n?/)
  if (!match) return { meta: {}, content: raw }

  const metaLines = match[1].split('\n')
  const meta = metaLines.reduce((acc, line) => {
    const [key, ...rest] = line.split(':')
    if (!key || rest.length === 0) return acc
    const cleanedKey = key.trim().toLowerCase()
    const cleanedVal = rest.join(':').trim()
    if (cleanedKey) acc[cleanedKey] = cleanedVal
    return acc
  }, {})

  const content = raw.slice(match[0].length)
  return { meta, content }
}

const parseDateValue = (value = '') => {
  if (!value) return null
  const parsed = new Date(value)
  if (Number.isNaN(parsed?.getTime?.())) return null
  return parsed
}

const parseDateParts = (value = '') => {
  const trimmed = value.trim()
  const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return null
  const [, year, month, day] = match
  const y = Number(year)
  const m = Number(month)
  const d = Number(day)
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null
  return { year: y, month: m, day: d }
}

const formatDisplayDate = (parts) => {
  if (!parts) return ''
  const { year, month, day } = parts
  const utcDate = new Date(Date.UTC(year, month - 1, day))
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
  return formatter.format(utcDate)
}

export const posts = Object.fromEntries(
  Object.entries(markdownFiles).map(([path, rawContent]) => {
    const slug = path.split('/').pop().replace(/\.md$/, '')
    const { meta, content } = parseFrontmatter(rawContent)
    const lines = content.split('\n')
    const [firstLine, ...restLines] = lines
    const firstLineTrimmed = firstLine?.trim?.() ?? ''
    const hasTitleOnFirstLine = firstLineTrimmed.startsWith('# ') && !firstLineTrimmed.startsWith('##')
    const titleFromHeading = firstLineTrimmed.replace(/^#\s+/, '')
    const title = meta.title || titleFromHeading || slug
    const bodyContent = hasTitleOnFirstLine ? restLines.join('\n') : content
    const rawDate = (meta.date || meta.datetime || meta.published || '').trim()
    const dateParts = parseDateParts(rawDate)
    const dateObj = dateParts ? new Date(Date.UTC(dateParts.year, dateParts.month - 1, dateParts.day)) : parseDateValue(rawDate)
    const displayDate = dateParts ? formatDisplayDate(dateParts) : rawDate
    const dateValue = dateObj ? dateObj.getTime() : null

    return [
      slug,
      {
        title,
        body: bodyContent,
        date: meta.date || '',
        displayDate,
        dateValue,
      },
    ]
  }),
)

const sortPostsByDate = (entries = []) =>
  [...entries].sort((a, b) => {
    const aDate = a[1].dateValue
    const bDate = b[1].dateValue
    if (aDate != null && bDate != null) return aDate - bDate
    if (aDate != null) return -1
    if (bDate != null) return 1
    return a[0].localeCompare(b[0])
  })

export const getSortedPosts = () =>
  sortPostsByDate(Object.entries(posts))
    .reverse()
    .map(([slug, data]) => ({
      slug,
      ...data,
    }))

export const getEarliestPost = () => {
  const sorted = getSortedPosts()
  return sorted[0] ?? null
}

const escapeHtml = (str = '') =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const sanitizeSize = (value = '') => {
  const cleaned = value.trim()
  if (!cleaned) return ''
  if (/^\d+(\.\d+)?$/.test(cleaned)) return `${cleaned}px`
  if (/^\d+(\.\d+)?(px|%)$/.test(cleaned)) return cleaned
  return ''
}

const parseImageAttrs = (raw = '') => {
  const clean = raw.replace(/^\{|\}$/g, '').trim()
  if (!clean) return {}
  return clean.split(/\s+/).reduce((acc, pair) => {
    const [key, val] = pair.split('=')
    if (key && val) acc[key.toLowerCase()] = val
    return acc
  }, {})
}

const renderContent = (str = '') => {
  const escaped = escapeHtml(str)
  const imageRegex = /!\[([^\]]*)\]\(([^)\s]+)\)(\{[^}]*\})?/g
  const withImages = escaped.replace(imageRegex, (_, alt, src, attrBlock = '') => {
    const attrs = parseImageAttrs(attrBlock)
    const align = attrs.align === 'right' ? 'right' : 'left'
    const width = sanitizeSize(attrs.width || attrs.w || '')
    const height = sanitizeSize(attrs.height || attrs.h || '')
    const floatStyle = align === 'right' ? 'float:right;' : 'float:left;'
    const marginStyle = align === 'right' ? 'margin-left:18px;' : 'margin-right:18px;'
    const sizeStyle = `${width ? `width:${width};` : ''}${height ? `height:${height};` : ''}`

    return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" style="${floatStyle}${marginStyle}margin-bottom:12px;${sizeStyle}" class="rounded-md" />`
  })

  const withBold = withImages.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  return withBold
}

export default function Writing({ title }) {
  const sortedPosts = getSortedPosts()
  const fallbackSlug = sortedPosts[0]?.slug
  const targetSlug = title || fallbackSlug
  const post = targetSlug ? posts[targetSlug] : null

  if (!post) {
    return (
      <section>
        <div className="mx-auto max-w-4xl rounded-lg border border-gray-200 bg-white px-6 py-8 text-gray-700 shadow-sm">
          <p className="text-lg">
            No writing found for <span className="font-semibold">/{title || '(no slug provided)'}</span>. Add a markdown
            file named <code>{title || 'post'}.md</code> under <code>src/writing/</code> to populate this page.
          </p>
          {sortedPosts.length > 0 ? (
            <div className="mt-4">
              <p className="font-semibold text-gray-900">Available posts:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-base">
                {sortedPosts.map(({ slug, title: candidateTitle }) => (
                  <li key={slug}>
                    <a href={`/writing/${encodeURIComponent(slug)}`} className="text-blue-700 underline">
                      {candidateTitle || slug}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>
    )
  }

  const linePattern =
    'repeating-linear-gradient(to bottom, #c8ccd2 0, #c8ccd2 1px, transparent 1px, transparent 32px)'
  const paperTexture =
    'radial-gradient(circle at 10% 18%, rgba(0,0,0,0.03) 0, rgba(0,0,0,0) 18%), radial-gradient(circle at 80% 12%, rgba(0,0,0,0.025) 0, rgba(0,0,0,0) 18%), linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.9) 55%, rgba(255,255,255,0.65) 100%)'
  const lineInset = '16px'
  const lineTop = '50px'
  const lineBottom = '24px'
  const titleTop = '16px'
  const lineOffset = '6px'
  const handwritingFont = '"Patrick Hand", "Segoe Print", "Bradley Hand", "Patrick Hand", "Caveat", "Comic Neue", "Comic Sans MS", cursive'
  return (
    <section>
      <div className="relative mx-auto max-w-6xl px-2 sm:px-4 lg:px-10 lg:grid lg:grid-cols-[minmax(0,820px)_220px] lg:items-start lg:gap-2 lg:justify-center">
        <div className="flex justify-center lg:col-start-1">
          <div className="relative mt-10 min-h-[520px] w-full max-w-3xl overflow-visible">
            {/* Blank left page extending out of the container */}
            <div
              aria-hidden="true"
              className="absolute top-0 h-full w-[88%] bg-[#fffdf4] shadow-[0_18px_30px_rgba(0,0,0,0.16)]"
              style={{
                right: 'calc(100% - 12px)',
                backgroundImage: paperTexture,
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <div
                className="pointer-events-none absolute"
                style={{
                  top: lineTop,
                  bottom: lineBottom,
                  left: lineInset,
                  right: lineInset,
                  backgroundImage: linePattern,
                  backgroundSize: '100% 32px',
                  backgroundRepeat: 'repeat',
                }}
              />
            </div>

            {/* Main (right) notebook page */}
            <div
              className="relative z-10 ml-[12px] w-full max-w-3xl bg-[#fffef9] shadow-[0_26px_50px_rgba(0,0,0,0.22)]"
              style={{
                backgroundImage: paperTexture,
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
              }}
            >
              {/* Crease between pages (aligned to the container left bound) */}
              <div
                aria-hidden="true"
                className="absolute left-[-12px] top-0 h-full w-10"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.16) 46%, rgba(0,0,0,0.06) 70%, rgba(0,0,0,0) 100%)',
                }}
              />

              {/* Page surface with lines */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute"
                style={{
                  top: lineTop,
                  bottom: lineBottom,
                  left: lineInset,
                  right: lineInset,
                  backgroundImage: linePattern,
                  backgroundSize: '100% 32px',
                  backgroundRepeat: 'repeat',
                }}
              />

              <div
                className="relative pl-8 pr-4 pb-12 md:pl-12 md:pb-14"
                style={{
                  fontFamily: handwritingFont,
                }}
              >
                <div
                  className="absolute flex w-full items-center justify-between text-[24px] font-semibold leading-[2.4rem] text-gray-700 md:px-8"
                  style={{
                    top: titleTop,
                    left: lineInset,
                    right: lineInset,
                    fontFamily: handwritingFont,
                  }}
                >
                  <span>{post.title}</span>
                  <span className="text-[22px] font-normal text-gray-700 text-right md:px-4">
                    {post.displayDate || post.date || 'Date unknown'}
                  </span>
                </div>
                <div
                  className="whitespace-pre-wrap text-[20px] leading-[2rem] text-gray-700 after:content-[''] after:block after:clear-both"
                  style={{
                    paddingTop: `calc(${lineTop} + ${lineOffset})`,
                    lineHeight: '32px',
                    fontFamily: handwritingFont,
                  }}
                  dangerouslySetInnerHTML={{ __html: renderContent(post.body) }}
                />
              </div>
            </div>
          </div>
        </div>

        <aside className="fixed mt-10 lg:mt-0 lg:col-start-2 lg:row-start-1">
          <div className="rounded-lg bg-white px-4 py-5 lg:sticky lg:top-24">
            <ul className="mt-4 space-y-2">
              {sortedPosts.map(({ slug, title: postTitle, displayDate }) => {
                const isActive = slug === targetSlug
                return (
                  <li key={slug}>
                    <a
                      href={`/writing/${encodeURIComponent(slug)}`}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex flex-col rounded-md px-3 py-2 transition hover:-translate-y-[1px] ${
                        isActive ? 'font-semibold' : 'font-normal'
                      }`}
                    >
                      <span className={isActive ? "font-bold" : "font-semibold"}>{postTitle || slug}</span>
                      {displayDate ? <span className="text-sm text-gray-500">{displayDate}</span> : null}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  )
}
