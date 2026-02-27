#!/usr/bin/env node
import { createRequire } from 'node:module'

import projects from '../src/data/projects.js'

const require = createRequire(import.meta.url)
const blessed = require('blessed')

const profile = {
  name: 'Mika Vohl',
  titles: [
    'Computer Science and Physics @ McGill',
    'Machine Learning & Software Engineer',
  ],
  tagline: 'ML + fullstack builder with a physics mindset.',
  mission: 'Building tools and demos that make complex systems feel tangible.',
  about:
    'I love building products, solving challenging problems, and learning new things. My interest and experience lies mostly in the domains of Machine Learning, Computer Science, and Physics.',
  current: [
    'Researching machine learning imputation techniques in medical data with McGill AI Society',
    "A fullstack developer for McHacks, McGill's largest hackathon",
    'Part of the weekly ML reading group at McGill',
  ],
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mikavohl/' },
    { label: 'GitHub', href: 'https://github.com/MikaVohl' },
    { label: 'Devpost', href: 'https://devpost.com/mikavohl' },
    { label: 'X', href: 'https://x.com/AmateurMika' },
    { label: 'Email', href: 'mailto:mikavohl@gmail.com' },
    { label: 'Resume', href: 'https://mikavohl.ca/MikaVohlResume.pdf' },
  ],
}

const titleArt = [
  ' __  __ _ _        __     __     _ ',
  '|  \\/  (_) | __    \\ \\   / /__  | |',
  '| |\\/| | | |/ /     \\ \\ / / _ \\ | |',
  '| |  | | |   <       \\ V /  __/ | |',
  '|_|  |_|_|_|\\_\\       \\_/ \\___| |_|',
]

const theme = {
  accent: 'cyan',
  live: 'green',
  award: 'yellow',
  domain: 'magenta',
}

const screen = blessed.screen({
  smartCSR: true,
  title: `${profile.name} - Portfolio`,
  unicode: false,
  terminal: 'ansi',
})

const header = blessed.box({
  parent: screen,
  top: 0,
  left: 0,
  width: '100%',
  height: 5,
  padding: { left: 1, right: 1 },
  border: 'line',
  tags: true,
  align: 'center',
  style: {
    border: { fg: theme.accent },
    fg: 'white',
  },
})

const projectsList = blessed.list({
  parent: screen,
  top: 5,
  left: 0,
  width: 32,
  height: 20,
  label: ' Projects ',
  border: 'line',
  keys: true,
  vi: true,
  mouse: true,
  tags: true,
  style: {
    border: { fg: theme.accent },
    selected: { bg: theme.accent, fg: 'black' },
    item: { fg: 'white' },
  },
})

const projectDetails = blessed.box({
  parent: screen,
  top: 5,
  left: 32,
  width: '100%-32',
  height: 20,
  label: ' Details ',
  border: 'line',
  tags: true,
  scrollable: true,
  alwaysScroll: true,
  wrap: true,
  keys: true,
  vi: true,
  mouse: true,
  padding: { left: 1, right: 1 },
  style: {
    border: { fg: theme.accent },
  },
  scrollbar: {
    ch: '#',
    track: { bg: 'black' },
    style: { fg: theme.accent },
  },
})

const footer = blessed.box({
  parent: screen,
  bottom: 1,
  left: 0,
  width: '100%',
  height: 10,
  label: ' Intel ',
  border: 'line',
  tags: true,
  scrollable: true,
  alwaysScroll: true,
  wrap: true,
  keys: true,
  vi: true,
  mouse: true,
  padding: { left: 1, right: 1 },
  style: {
    border: { fg: theme.accent },
  },
  scrollbar: {
    ch: '#',
    track: { bg: 'black' },
    style: { fg: theme.accent },
  },
})

const helpBar = blessed.box({
  parent: screen,
  bottom: 0,
  left: 0,
  width: '100%',
  height: 1,
  tags: true,
  style: {
    fg: 'white',
  },
})

const helpModal = blessed.box({
  parent: screen,
  top: 'center',
  left: 'center',
  width: '70%',
  height: '70%',
  label: ' Help ',
  border: 'line',
  tags: true,
  hidden: true,
  scrollable: true,
  alwaysScroll: true,
  wrap: true,
  keys: true,
  vi: true,
  mouse: true,
  padding: { top: 1, bottom: 1, left: 2, right: 2 },
  style: {
    border: { fg: theme.accent },
    fg: 'white',
  },
  scrollbar: {
    ch: '#',
    track: { bg: 'black' },
    style: { fg: theme.accent },
  },
})

helpModal.key(['escape', 'q', '?'], () => {
  toggleHelp()
})

const fieldBox = blessed.box({
  parent: screen,
  top: 0,
  left: 0,
  width: 28,
  height: 10,
  label: ' Gravity Lab ',
  border: 'line',
  tags: true,
  hidden: true,
  style: {
    border: { fg: theme.accent },
    fg: 'white',
  },
})

const footerModes = ['about', 'radar']
let footerModeIndex = 0
let activeFilterIndex = 0
let filteredIndices = []
const fieldState = {
  enabled: true,
  visible: false,
  width: 0,
  height: 0,
  particles: [],
  stars: [],
  pulses: [],
  tick: 0,
  autoPlay: false,
  mass: { x: 0, y: 0 },
  target: { x: 0, y: 0 },
}
let animationTimer = null

function unique(items) {
  return Array.from(new Set(items))
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min)
}

function parseStackTokens(stack) {
  return stack
    .split('/')
    .map((token) => token.trim())
    .filter(Boolean)
}

function isLiveProject(project) {
  return project.href.includes('mikavohl.ca')
}

function getAwardLine(project) {
  const match = project.description.match(/[^.]*?(winner|1st place)[^.]*\.?/i)
  if (!match) return null
  return match[0].trim().replace(/\.$/, '')
}

function detectDomains(project) {
  const haystack = `${project.title} ${project.description} ${project.stack}`.toLowerCase()
  const domains = []

  if (/(ml|neural|pytorch|transformer|autograd|cnn)/.test(haystack)) {
    domains.push('ML')
  }
  if (/(react|typescript|javascript|web|frontend)/.test(haystack)) {
    domains.push('Web')
  }
  if (/(flask|api|backend|server|postgres|sql)/.test(haystack)) {
    domains.push('Backend')
  }
  if (/(ios|swift)/.test(haystack)) {
    domains.push('Mobile')
  }
  if (/(java|swing|desktop)/.test(haystack)) {
    domains.push('Desktop')
  }
  if (/(game|chess)/.test(haystack)) {
    domains.push('Games')
  }
  if (/(wiki|scrap|data|dataset)/.test(haystack)) {
    domains.push('Data')
  }

  return unique(domains)
}

function formatBadge(label, color) {
  return `{${color}-fg}[${label}]{/${color}-fg}`
}

function formatBadgeList(list, color) {
  if (!list.length) return 'None'
  return list.map((item) => formatBadge(item, color)).join(' ')
}

function buildProjectMeta(items) {
  return items.map((project) => {
    const stackTokens = parseStackTokens(project.stack)
    const award = getAwardLine(project)
    const live = isLiveProject(project)
    const domains = detectDomains(project)
    return { stackTokens, award, live, domains }
  })
}

function buildStackCounts(meta) {
  const counts = {}
  meta.forEach((data) => {
    data.stackTokens.forEach((token) => {
      counts[token] = (counts[token] || 0) + 1
    })
  })
  return counts
}

function buildStats(meta, items) {
  const stackCounts = buildStackCounts(meta)
  const topStacks = Object.entries(stackCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
  const liveCount = meta.filter((data) => data.live).length
  const awards = meta
    .map((data, index) => {
      if (!data.award) return null
      return `${items[index].title}: ${data.award}`
    })
    .filter(Boolean)

  return {
    total: items.length,
    uniqueStacks: Object.keys(stackCounts).length,
    topStacks,
    liveCount,
    awards,
  }
}

function buildFilters(meta, stats) {
  const stackFilters = stats.topStacks.map(([name]) => ({
    label: name,
    predicate: (project, data) => data.stackTokens.includes(name),
  }))

  const filters = [{ label: 'All', predicate: () => true }]
  filters.push(...stackFilters)

  if (stats.liveCount > 0) {
    filters.push({ label: 'Live', predicate: (project, data) => data.live })
  }

  if (stats.awards.length > 0) {
    filters.push({ label: 'Awarded', predicate: (project, data) => Boolean(data.award) })
  }

  return filters
}

const projectMeta = buildProjectMeta(projects)
const stats = buildStats(projectMeta, projects)
const filters = buildFilters(projectMeta, stats)
const domainTargets = {
  ML: { x: 0.2, y: 0.2 },
  Web: { x: 0.8, y: 0.2 },
  Backend: { x: 0.75, y: 0.8 },
  Data: { x: 0.25, y: 0.8 },
  Mobile: { x: 0.15, y: 0.55 },
  Desktop: { x: 0.5, y: 0.85 },
  Games: { x: 0.5, y: 0.5 },
}

function getHeaderLayout(width, height) {
  const compact = width < 90 || height < 28

  if (compact) {
    const lines = [
      `{bold}${profile.name}{/bold}`,
      profile.titles.join(' | '),
      profile.tagline,
    ]
    return { content: lines.join('\n'), height: lines.length + 2 }
  }

  const art = titleArt.map(
    (line) => `{${theme.accent}-fg}${line}{/${theme.accent}-fg}`
  )

  const lines = [
    ...art,
    `{bold}${profile.name}{/bold} - ${profile.tagline}`,
    profile.titles.join(' | '),
  ]

  return { content: lines.join('\n'), height: lines.length + 2 }
}

function footerContent() {
  const mode = footerModes[footerModeIndex]
  if (mode === 'radar') {
    const topStackLine = stats.topStacks
      .map(([name, count]) => `${name}(${count})`)
      .join(', ')
    const awards =
      stats.awards.length > 0 ? stats.awards : ['No awards listed yet.']

    return [
      '{bold}Radar{/bold}',
      `Projects: ${stats.total} | Live demos: ${stats.liveCount}`,
      `Stacks tracked: ${stats.uniqueStacks}`,
      `Top stacks: ${topStackLine || 'None'}`,
      '',
      '{bold}Highlights{/bold}',
      ...awards.map((item) => `- ${item}`),
      '',
      '{bold}Now{/bold}',
      ...profile.current.map((item) => `- ${item}`),
    ].join('\n')
  }

  return [
    '{bold}About{/bold}',
    profile.about,
    '',
    '{bold}Mission{/bold}',
    profile.mission,
    '',
    '{bold}Currently{/bold}',
    ...profile.current.map((item) => `- ${item}`),
    '',
    '{bold}Links{/bold}',
    ...profile.links.map((item) => `${item.label}: ${item.href}`),
  ].join('\n')
}

function detailContent(project, meta, position, total) {
  const badges = []
  badges.push(formatBadge(meta.live ? 'LIVE' : 'CODE', meta.live ? theme.live : theme.award))
  if (meta.award) {
    badges.push(formatBadge('AWARD', theme.award))
  }

  const lines = [
    `${badges.join(' ')} {bold}${project.title}{/bold}`,
    `Project ${position}/${total}`,
    '',
    '{bold}Story{/bold}',
    project.description,
    '',
    '{bold}Stack{/bold}',
    formatBadgeList(meta.stackTokens, theme.accent),
    '',
    '{bold}Domains{/bold}',
    formatBadgeList(meta.domains, theme.domain),
  ]

  if (meta.award) {
    lines.push('', '{bold}Award{/bold}', meta.award)
  }

  lines.push('', '{bold}Link{/bold}', project.href)

  return lines.join('\n')
}

function buildStars(width, height, density = 0.06) {
  const count = Math.max(6, Math.floor(width * height * density))
  const stars = []
  for (let i = 0; i < count; i += 1) {
    stars.push({
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
      glyph: Math.random() > 0.7 ? ':' : '.',
    })
  }
  return stars
}

function initField(width, height) {
  fieldState.width = width
  fieldState.height = height
  fieldState.tick = 0
  fieldState.pulses = []
  fieldState.mass = { x: width / 2, y: height / 2 }
  fieldState.target = { x: width / 2, y: height / 2 }

  const count = Math.max(10, Math.min(26, Math.floor(width * height * 0.06)))
  fieldState.particles = Array.from({ length: count }, (_, index) => ({
    x: randomBetween(0, width - 1),
    y: randomBetween(0, height - 1),
    vx: randomBetween(-0.4, 0.4),
    vy: randomBetween(-0.4, 0.4),
    glyph: index % 3 === 0 ? 'o' : '.',
  }))

  fieldState.stars = buildStars(width, height)
}

function setMassTargetFromMeta(meta) {
  if (!fieldState.enabled || !fieldState.visible) return
  if (!fieldState.width || !fieldState.height) return

  const domain = meta.domains[0]
  const anchor = domainTargets[domain] || { x: 0.5, y: 0.5 }
  const jitter = 0.12
  const targetX = clamp(
    Math.round((anchor.x + randomBetween(-jitter, jitter)) * (fieldState.width - 1)),
    0,
    fieldState.width - 1
  )
  const targetY = clamp(
    Math.round((anchor.y + randomBetween(-jitter, jitter)) * (fieldState.height - 1)),
    0,
    fieldState.height - 1
  )

  fieldState.target = { x: targetX, y: targetY }
}

function triggerPulse() {
  if (!fieldState.enabled || !fieldState.visible) return
  const x = Math.round(fieldState.mass.x)
  const y = Math.round(fieldState.mass.y)
  fieldState.pulses.push({ x, y, r: 0, life: 6 })
}

function advanceSelection() {
  if (!filteredIndices.length) return
  const next = (projectsList.selected + 1) % filteredIndices.length
  projectsList.select(next)
  updateProjectDetails(next)
}

function renderField() {
  if (!fieldState.enabled || !fieldState.visible) {
    fieldBox.setContent('')
    return
  }

  const { width, height } = fieldState
  if (!width || !height) return

  const grid = Array.from({ length: height }, () => Array(width).fill(' '))

  fieldState.stars.forEach((star) => {
    if (grid[star.y] && grid[star.y][star.x] !== undefined) {
      grid[star.y][star.x] = star.glyph
    }
  })

  fieldState.pulses.forEach((pulse) => {
    const r = pulse.r
    for (let dx = -r; dx <= r; dx += 1) {
      const x1 = pulse.x + dx
      const y1 = pulse.y - r
      const y2 = pulse.y + r
      if (grid[y1] && grid[y1][x1] !== undefined) {
        grid[y1][x1] = `{${theme.domain}-fg}+{/${theme.domain}-fg}`
      }
      if (grid[y2] && grid[y2][x1] !== undefined) {
        grid[y2][x1] = `{${theme.domain}-fg}+{/${theme.domain}-fg}`
      }
    }
    for (let dy = -r; dy <= r; dy += 1) {
      const x1 = pulse.x - r
      const x2 = pulse.x + r
      const y1 = pulse.y + dy
      if (grid[y1] && grid[y1][x1] !== undefined) {
        grid[y1][x1] = `{${theme.domain}-fg}+{/${theme.domain}-fg}`
      }
      if (grid[y1] && grid[y1][x2] !== undefined) {
        grid[y1][x2] = `{${theme.domain}-fg}+{/${theme.domain}-fg}`
      }
    }
  })

  fieldState.particles.forEach((particle) => {
    const x = Math.round(particle.x)
    const y = Math.round(particle.y)
    if (grid[y] && grid[y][x] !== undefined) {
      grid[y][x] = particle.glyph
    }
  })

  const massX = Math.round(fieldState.mass.x)
  const massY = Math.round(fieldState.mass.y)
  if (grid[massY] && grid[massY][massX] !== undefined) {
    grid[massY][massX] = `{${theme.live}-fg}@{/${theme.live}-fg}`
  }

  fieldBox.setContent(grid.map((row) => row.join('')).join('\n'))
}

function stepField() {
  if (!fieldState.enabled || !fieldState.visible) return
  if (!fieldState.width || !fieldState.height) return

  fieldState.tick += 1
  const { width, height } = fieldState

  const wobbleX = Math.sin(fieldState.tick / 9) * 0.06
  const wobbleY = Math.cos(fieldState.tick / 11) * 0.06
  fieldState.mass.x += (fieldState.target.x - fieldState.mass.x) * 0.07 + wobbleX
  fieldState.mass.y += (fieldState.target.y - fieldState.mass.y) * 0.07 + wobbleY
  fieldState.mass.x = clamp(fieldState.mass.x, 0, width - 1)
  fieldState.mass.y = clamp(fieldState.mass.y, 0, height - 1)

  fieldState.particles.forEach((particle) => {
    const dx = fieldState.mass.x - particle.x
    const dy = fieldState.mass.y - particle.y
    const dist = Math.sqrt(dx * dx + dy * dy) + 0.3
    const force = Math.min(0.05, 0.6 / (dist * dist))
    particle.vx = (particle.vx + (dx / dist) * force) * 0.98
    particle.vy = (particle.vy + (dy / dist) * force) * 0.98
    particle.x += particle.vx
    particle.y += particle.vy

    if (particle.x < 0 || particle.x > width - 1) {
      particle.x = clamp(particle.x, 0, width - 1)
      particle.vx *= -0.7
    }
    if (particle.y < 0 || particle.y > height - 1) {
      particle.y = clamp(particle.y, 0, height - 1)
      particle.vy *= -0.7
    }
  })

  fieldState.pulses.forEach((pulse) => {
    pulse.r += 1
    pulse.life -= 1
  })
  fieldState.pulses = fieldState.pulses.filter(
    (pulse) => pulse.life > 0 && pulse.r < Math.max(width, height)
  )

  if (fieldState.autoPlay && fieldState.tick % 28 === 0) {
    advanceSelection()
  }

  renderField()
  screen.render()
}

function startAnimation() {
  if (animationTimer) return
  animationTimer = setInterval(() => {
    stepField()
  }, 80)
}

function stopAnimation() {
  if (!animationTimer) return
  clearInterval(animationTimer)
  animationTimer = null
}

function toggleField() {
  fieldState.enabled = !fieldState.enabled
  if (!fieldState.enabled) {
    fieldState.autoPlay = false
    fieldBox.hide()
  }
  layout()
  updateHelpBar()
  screen.render()
}

function toggleAutoplay() {
  if (!fieldState.enabled) {
    fieldState.enabled = true
    layout()
  }
  fieldState.autoPlay = !fieldState.autoPlay
  updateHelpBar()
}

function formatListItem(project, meta, index) {
  const liveMark = meta.live ? '*' : ' '
  const awardMark = meta.award ? '!' : ' '
  const number = String(index + 1).padStart(2, '0')
  return `${number} ${liveMark}${awardMark} ${project.title}`
}

function updateProjectDetails(index = projectsList.selected) {
  if (!filteredIndices.length) {
    projectDetails.setContent(
      'No projects match the current filter.\\nPress f to cycle filters or a to reset.'
    )
    return
  }

  const safeIndex = Math.max(0, Math.min(index, filteredIndices.length - 1))
  const projectIndex = filteredIndices[safeIndex]
  const project = projects[projectIndex]
  const meta = projectMeta[projectIndex]

  projectDetails.setContent(
    detailContent(project, meta, safeIndex + 1, filteredIndices.length)
  )
  setMassTargetFromMeta(meta)
  triggerPulse()
}

function helpContent() {
  const filterLines = filters.map((filter, index) => {
    const marker = index === activeFilterIndex ? '>' : ' '
    return `${marker} ${filter.label}`
  })

  return [
    '{bold}Navigation{/bold}',
    '- up/down or j/k: select project',
    '- pageup/pagedown: scroll details',
    '- tab: switch pane',
    '',
    '{bold}Modes{/bold}',
    '- f: cycle filters',
    '- a: show all',
    '- m: toggle intel mode (about/radar)',
    '- g: toggle gravity lab',
    '- p: autoplay projects',
    '- space: emit pulse',
    '- ?: toggle help',
    '- q / esc: quit',
    '',
    '{bold}Legend{/bold}',
    '- * live demo',
    '- ! award',
    '',
    '{bold}Filters{/bold}',
    ...filterLines,
  ].join('\\n')
}

function updateFooter() {
  footer.setContent(footerContent())
}

function updateHelpBar() {
  const filter = filters[activeFilterIndex]
  const mode = footerModes[footerModeIndex]
  const focusTarget = helpModal.hidden
    ? screen.focused === projectDetails
      ? 'Details'
      : screen.focused === footer
        ? 'Intel'
        : 'Projects'
    : 'Help'
  const labStatus = fieldState.visible
    ? 'on'
    : fieldState.enabled
      ? 'hidden'
      : 'off'
  const autoStatus = fieldState.autoPlay ? 'on' : 'off'
  helpBar.setContent(
    `Mode: ${mode} | Filter: ${filter.label} (${filteredIndices.length}/${projects.length}) | Lab: ${labStatus} | Auto: ${autoStatus} | Focus: ${focusTarget} | ?: help | q: quit`
  )
  helpModal.setContent(helpContent())
}

function applyFilter() {
  const filter = filters[activeFilterIndex]
  filteredIndices = projects
    .map((_, index) => index)
    .filter((index) => filter.predicate(projects[index], projectMeta[index]))

  if (!filteredIndices.length) {
    projectsList.setItems(['(no matches)'])
    projectsList.select(0)
    updateProjectDetails(0)
    updateHelpBar()
    return
  }

  const items = filteredIndices.map((projectIndex, index) =>
    formatListItem(projects[projectIndex], projectMeta[projectIndex], index)
  )

  projectsList.setItems(items)
  projectsList.select(0)
  updateProjectDetails(0)
  updateHelpBar()
}

function toggleFooterMode() {
  footerModeIndex = (footerModeIndex + 1) % footerModes.length
  updateFooter()
  updateHelpBar()
}

function toggleHelp() {
  helpModal.hidden = !helpModal.hidden
  if (helpModal.hidden) {
    focusOrder[focusIndex].focus()
  } else {
    helpModal.focus()
  }
  updateHelpBar()
  screen.render()
}

function layout() {
  const width = screen.width
  const height = screen.height

  const headerLayout = getHeaderLayout(width, height)
  const headerHeight = headerLayout.height
  const helpHeight = 1
  const minMainHeight = 10
  const maxFooterHeight = 12
  let footerHeight = Math.min(maxFooterHeight, Math.max(7, Math.floor(height * 0.3)))
  let mainHeight = height - headerHeight - footerHeight - helpHeight

  if (mainHeight < minMainHeight) {
    const delta = minMainHeight - mainHeight
    footerHeight = Math.max(6, footerHeight - delta)
    mainHeight = height - headerHeight - footerHeight - helpHeight
  }

  const minListWidth = 22
  const minDetailsWidth = 20
  let listWidth = Math.max(minListWidth, Math.min(40, Math.floor(width * 0.35)))
  if (width - listWidth < minDetailsWidth) {
    listWidth = Math.max(12, width - minDetailsWidth)
  }
  let fieldVisible = fieldState.enabled && width >= 105 && mainHeight >= 12
  let fieldWidth = fieldVisible ? Math.max(20, Math.min(30, Math.floor(width * 0.22))) : 0
  let detailsWidth = width - listWidth - fieldWidth

  if (fieldVisible && detailsWidth < 24) {
    fieldVisible = false
    fieldWidth = 0
    detailsWidth = width - listWidth
  }

  header.height = headerHeight
  header.width = width
  header.setContent(headerLayout.content)

  projectsList.top = headerHeight
  projectsList.height = mainHeight
  projectsList.width = listWidth

  projectDetails.top = headerHeight
  projectDetails.left = listWidth
  projectDetails.height = mainHeight
  projectDetails.width = Math.max(10, detailsWidth)

  if (fieldVisible) {
    fieldState.visible = true
    fieldBox.show()
    fieldBox.top = headerHeight
    fieldBox.left = listWidth + projectDetails.width
    fieldBox.height = mainHeight
    fieldBox.width = fieldWidth

    const innerWidth = Math.max(6, fieldWidth - 2)
    const innerHeight = Math.max(4, mainHeight - 2)
    if (innerWidth !== fieldState.width || innerHeight !== fieldState.height) {
      initField(innerWidth, innerHeight)
    }
    if (filteredIndices.length) {
      const projectIndex = filteredIndices[projectsList.selected] ?? filteredIndices[0]
      const meta = projectMeta[projectIndex]
      if (meta) {
        setMassTargetFromMeta(meta)
      }
    }
    renderField()
  } else {
    fieldState.visible = false
    fieldBox.hide()
  }

  footer.width = width
  footer.bottom = helpHeight
  footer.height = footerHeight
  updateFooter()

  helpBar.width = width
  updateHelpBar()

  helpModal.width = Math.max(32, Math.min(90, width - 4))
  helpModal.height = Math.max(10, Math.min(26, height - 4))
}

projectsList.on('keypress', (_, key) => {
  if (!key || !key.name) return
  const navKeys = new Set(['up', 'down', 'k', 'j', 'home', 'end', 'pageup', 'pagedown'])
  if (navKeys.has(key.name)) {
    updateProjectDetails()
    screen.render()
  }
})

projectsList.on('select', (_, index) => {
  updateProjectDetails(index)
  screen.render()
})

const focusOrder = [projectsList, projectDetails, footer]
let focusIndex = 0

projectsList.on('focus', () => {
  focusIndex = 0
  updateHelpBar()
  screen.render()
})

projectDetails.on('focus', () => {
  focusIndex = 1
  updateHelpBar()
  screen.render()
})

footer.on('focus', () => {
  focusIndex = 2
  updateHelpBar()
  screen.render()
})

screen.key(['tab'], () => {
  if (!helpModal.hidden) return
  focusIndex = (focusIndex + 1) % focusOrder.length
  focusOrder[focusIndex].focus()
  updateHelpBar()
  screen.render()
})

screen.key(['f'], () => {
  activeFilterIndex = (activeFilterIndex + 1) % filters.length
  applyFilter()
  screen.render()
})

screen.key(['a'], () => {
  activeFilterIndex = 0
  applyFilter()
  screen.render()
})

screen.key(['m'], () => {
  toggleFooterMode()
  screen.render()
})

screen.key(['g'], () => {
  toggleField()
})

screen.key(['p'], () => {
  toggleAutoplay()
  screen.render()
})

screen.key(['space'], () => {
  triggerPulse()
  screen.render()
})

screen.key(['?'], () => {
  toggleHelp()
})

screen.key(['q', 'C-c', 'escape'], () => {
  if (!helpModal.hidden) {
    toggleHelp()
    return
  }
  stopAnimation()
  screen.destroy()
  process.exit(0)
})

screen.on('resize', () => {
  layout()
  screen.render()
})

applyFilter()
layout()
startAnimation()
projectsList.focus()
screen.render()
