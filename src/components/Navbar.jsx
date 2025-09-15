import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { createPortal } from 'react-dom'
import {
  ChevronDown,
  Target,
  Building2,
  Layers,
  Laptop,
  Zap,
  Link2,
  Shield,
  FileText,
  Briefcase,
  Users,
  Cog,
  BookOpen,
  MessageSquare,
  List,
  Star,
  UserPlus,
  CheckSquare,
  FileCheck,
  Send,
  Lightbulb,
  Cloud,
  Wrench,
  Database,
  Container,
  DollarSign,
  TrendingUp,
  Calculator,
  Sparkles,
  User,
  Boxes
} from 'lucide-react'


function MarkdownText({ text }) {
  if (!text) return null

  // Simple table heuristic
  const lines = String(text).split(/\r?\n/)
  const pipeLines = lines.filter((l) => l.includes('|')).length
  const hasTable = pipeLines >= 2

  // Code fence parsing
  let inCode = false
  const blocks = []
  let listBuffer = null // { type: 'ul' | 'ol', items: [] }

  const flushList = () => {
    if (!listBuffer) return
    if (listBuffer.type === 'ul') {
      blocks.push(
        <ul key={`ul-${blocks.length}`} className="list-disc pl-5 space-y-1">
          {listBuffer.items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>
      )
    } else {
      blocks.push(
        <ol key={`ol-${blocks.length}`} className="list-decimal pl-5 space-y-1">
          {listBuffer.items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ol>
      )
    }
    listBuffer = null
  }

  function renderInline(str) {
    // Convert [label](url) first
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    const parts = []
    let lastIndex = 0
    let m
    while ((m = linkRegex.exec(str)) !== null) {
      const [full, label, url] = m
      if (m.index > lastIndex) parts.push(str.slice(lastIndex, m.index))
      const isInternal = url.startsWith('/')
      parts.push(
        isInternal ? (
          <Link key={`${label}-${m.index}`} to={url} className="text-indigo-700 underline">
            {label}
          </Link>
        ) : (
          <a key={`${label}-${m.index}`} href={url} target="_blank" rel="noreferrer" className="text-indigo-700 underline">
            {label}
          </a>
        )
      )
      lastIndex = m.index + full.length
    }
    if (lastIndex < str.length) parts.push(str.slice(lastIndex))

    // Apply inline code and bold on each string chunk
    const withFormatting = []
    parts.forEach((chunk, idx) => {
      if (typeof chunk !== 'string') {
        withFormatting.push(chunk)
        return
      }
      // Inline code `code`
      const codeSplit = chunk.split(/`([^`]+)`/g)
      codeSplit.forEach((seg, j) => {
        if (j % 2 === 1) {
          withFormatting.push(
            <code key={`code-${idx}-${j}`} className="rounded bg-gray-100 px-1 py-[1px] font-mono text-[12px]">
              {seg}
            </code>
          )
        } else {
          // Bold **text**
          const boldSplit = seg.split(/\*\*([^*]+)\*\*/g)
          boldSplit.forEach((bseg, k) => {
            if (k % 2 === 1) {
              withFormatting.push(
                <strong key={`bold-${idx}-${j}-${k}`} className="font-semibold">
                  {bseg}
                </strong>
              )
            } else {
              withFormatting.push(bseg)
            }
          })
        }
      })
    })

    return <>{withFormatting}</>
  }

  if (hasTable) {
    return (
      <pre className="whitespace-pre-wrap font-mono text-[13px] leading-5">{text}</pre>
    )
  }

  lines.forEach((raw, i) => {
    const line = raw || ''

    // Toggle code fence
    if (line.trim().startsWith('```')) {
      inCode = !inCode
      if (inCode) {
        flushList()
        blocks.push(<pre key={`pre-start-${i}`} className="whitespace-pre-wrap rounded-md bg-gray-900 p-3 text-[13px] text-gray-100">
        </pre>)
      } else {
        // closing handled by adding as text inside last pre via following logic
      }
      return
    }

    if (inCode) {
      const last = blocks[blocks.length - 1]
      if (last && last.type === 'pre') {
        const children = last.props.children + (last.props.children ? "\n" : "") + line
        blocks[blocks.length - 1] = <pre key={last.key} className="whitespace-pre-wrap rounded-md bg-gray-900 p-3 text-[13px] text-gray-100">{children}</pre>
      }
      return
    }

    // Lists
    const olMatch = line.match(/^\s*\d+\.\s+(.*)$/)
    const ulMatch = line.match(/^\s*[-*]\s+(.*)$/)
    if (olMatch) {
      if (!listBuffer || listBuffer.type !== 'ol') {
        flushList()
        listBuffer = { type: 'ol', items: [] }
      }
      listBuffer.items.push(olMatch[1])
      return
    } else if (ulMatch) {
      if (!listBuffer || listBuffer.type !== 'ul') {
        flushList()
        listBuffer = { type: 'ul', items: [] }
      }
      listBuffer.items.push(ulMatch[1])
      return
    } else if (line.trim() === '') {
      flushList()
      return
    } else {
      flushList()
    }

    // Blockquote
    if (line.trim().startsWith('>')) {
      blocks.push(
        <blockquote key={`bq-${i}`} className="border-l-4 border-gray-300 pl-3 italic ">
          {renderInline(line.replace(/^\s*>\s?/, ''))}
        </blockquote>
      )
      return
    }

    // Headings # ## ###
    const h1 = line.match(/^#\s+(.*)$/)
    const h2 = line.match(/^##\s+(.*)$/)
    const h3 = line.match(/^###\s+(.*)$/)
    if (h1) {
      blocks.push(<h1 key={`h1-${i}`} className="text-lg font-bold">{renderInline(h1[1])}</h1>)
      return
    }
    if (h2) {
      blocks.push(<h2 key={`h2-${i}`} className="text-base font-semibold">{renderInline(h2[1])}</h2>)
      return
    }
    if (h3) {
      blocks.push(<h3 key={`h3-${i}`} className="text-sm font-semibold">{renderInline(h3[1])}</h3>)
      return
    }

    // Paragraph
    blocks.push(<p key={`p-${i}`}>{renderInline(line)}</p>)
  })
  flushList()

  return <div className="space-y-2">{blocks}</div>
}

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isStrategyOpen, setIsStrategyOpen] = useState(false)
  const [isBusinessOpen, setIsBusinessOpen] = useState(false)
  const [isTechnologyOpen, setIsTechnologyOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [isToolsOpen, setIsToolsOpen] = useState(false)

  // Ask TSG (Assistant) state
  const [isAssistantOpen, setIsAssistantOpen] = useState(false)
  const [assistantMessages, setAssistantMessages] = useState([])
  const [assistantInput, setAssistantInput] = useState('')
  const [assistantTyping, setAssistantTyping] = useState(false)
  const assistantThreadIdRef = useRef((typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : undefined)

  // Refs for dropdown containers
  const aboutRef = useRef(null)
  const strategyRef = useRef(null)
  const businessRef = useRef(null)
  const technologyRef = useRef(null)
  const servicesRef = useRef(null)
  const toolsRef = useRef(null)
  const chatScrollRef = useRef(null)

  const toggleMobile = () => setIsMobileOpen((v) => !v)

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (aboutRef.current && !aboutRef.current.contains(event.target)) {
        setIsAboutOpen(false)
      }
      if (strategyRef.current && !strategyRef.current.contains(event.target)) {
        setIsStrategyOpen(false)
      }
      if (businessRef.current && !businessRef.current.contains(event.target)) {
        setIsBusinessOpen(false)
      }
      if (technologyRef.current && !technologyRef.current.contains(event.target)) {
        setIsTechnologyOpen(false)
      }
      if (servicesRef.current && !servicesRef.current.contains(event.target)) {
        setIsServicesOpen(false)
      }
      if (toolsRef.current && !toolsRef.current.contains(event.target)) {
        setIsToolsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Prevent background scroll when assistant is open
  useEffect(() => {
    if (isAssistantOpen) {
      const original = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = original
      }
    }
  }, [isAssistantOpen])

  // Auto-scroll chat to bottom on updates
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
    }
  }, [assistantMessages, isAssistantOpen])

  // Allow external pages (e.g., Home) to open the assistant and seed the query
  useEffect(() => {
    const handleOpenAssistant = (e) => {
      setIsAssistantOpen(true)
      const q = e && e.detail && typeof e.detail.query === 'string' ? e.detail.query : ''
      if (q) setAssistantInput(q)
    }
    window.addEventListener('tsg:assistant:open', handleOpenAssistant)
    return () => window.removeEventListener('tsg:assistant:open', handleOpenAssistant)
  }, [])

  const extractResourceLinks = (text) => {
    if (!text) return []
    const urlRegex = /(https?:\/\/[^\s)]+)|(\/[\w\-/?#=&.%:]+)(?=\s|$)/g
    const matches = text.match(urlRegex) || []
    const unique = Array.from(new Set(matches))
    return unique.map((href) => {
      let label = href
      try {
        if (href.startsWith('http')) {
          const u = new URL(href)
          label = u.hostname.replace(/^www\./, '')
        }
      } catch (_) {
        // keep original label
      }
      return { label, href }
    })
  }

  const normalizeAdditionalResources = (val) => {
    if (!val) return []
    const arr = Array.isArray(val) ? val : [val]
    return arr.map((item) => {
      if (typeof item === 'string') {
        try {
          const isUrl = item.startsWith('http')
          return { label: isUrl ? (new URL(item)).hostname.replace(/^www\./, '') : item, href: item }
        } catch (_) {
          return { label: item, href: item }
        }
      }
      const href = item.url || item.path || item.href || ''
      let label = item.label || item.page || item.title || href
      try {
        if (!item.label && href && href.startsWith('http')) {
          label = (new URL(href)).hostname.replace(/^www\./, '')
        }
      } catch (_) {}
      return { label, href }
    }).filter(r => r.href)
  }

  const parseStructuredFromString = (raw) => {
    if (!raw || typeof raw !== 'string') return null
    // Try code fence first: ```json ... ``` or ``` ... ```
    const fenceRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i
    const m = raw.match(fenceRegex)
    const candidate = m ? m[1] : raw.trim()
    try {
      const parsed = JSON.parse(candidate)
      if (parsed && typeof parsed === 'object') return parsed
    } catch (_) {}
    return null
  }

  // Parse additional resources defined in plain text under an "Additional Resources:" section.
  // Supports YAML-like bullets:
  // Additional Resources:
  // - label: Foo\n  url: /foo
  // - label: Bar\n  href: https://bar
  // Also supports single-line: - Foo: /path
  const parseAdditionalResourcesFromText = (text) => {
    if (!text) return []
    const lines = String(text).split(/\r?\n/)
    const out = []
    let inSection = false
    let inFence = false
    let fenceBuffer = []
    const seekUrl = (startIdx) => {
      for (let j = startIdx; j < Math.min(lines.length, startIdx + 6); j++) {
        const l2 = lines[j]
        const mUrl = l2 && l2.match(/^\s*(?:url|href|path)\s*:\s*(\S+)/i)
        if (mUrl) return { href: mUrl[1].trim(), idx: j }
        if (/^\s*label\s*:/i.test(l2) || /^\s*-\s*label\s*:/i.test(l2) || /^\s*(additional\s+resources|additional_resources)\s*:/i.test(l2)) break
      }
      return null
    }
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (!inSection) {
        if (/^\s*(additional\s+resources|additional_resources)\s*:/i.test(line)) {
          inSection = true
        }
        continue
      }
      // If a fenced JSON block follows the header, capture and parse it
      if (!inFence && /^\s*```/i.test(line)) {
        inFence = true
        fenceBuffer = []
        continue
      }
      if (inFence) {
        if (/^\s*```\s*$/i.test(line)) {
          // end of fence - try parse JSON array/object
          try {
            const raw = fenceBuffer.join('\n').trim()
            const parsed = JSON.parse(raw)
            const norm = normalizeAdditionalResources(parsed)
            if (norm && norm.length) out.push(...norm)
          } catch (_) {}
          inFence = false
          inSection = false
          continue
        } else {
          fenceBuffer.push(line)
          continue
        }
      }
      // Accept bullets "- label:" or plain "label:"
      let m = line.match(/^\s*-\s*label\s*:\s*(.+)$/i)
      if (!m) m = line.match(/^\s*label\s*:\s*(.+)$/i)
      if (m) {
        const label = m[1].trim()
        const found = seekUrl(i + 1)
        if (label && found && found.href) {
          out.push({ label, href: found.href })
          i = found.idx
          continue
        }
      }
      // Single-line bullet form: "- Foo: /path"
      const oneLine = line.match(/^\s*-\s*([^:]+):\s*(\S+)/)
      if (oneLine) {
        const label = oneLine[1].trim()
        const href = oneLine[2].trim()
        if (label && href) out.push({ label, href })
        continue
      }
      // End section when a non-empty, non-indented non-attribute line shows up
      if (/^\s*$/.test(line)) continue
      if (!/^\s+(label|url|href|path)\s*:/i.test(line) && !/^\s*-\s*/.test(line)) break
    }
    return out
  }

  // Remove the plain-text "Additional Resources:" section from an answer so it doesn't duplicate
  // after we render chips. Keeps the rest of the markdown intact.
  const stripAdditionalResourcesFromText = (text) => {
    if (!text) return text
    const lines = String(text).split(/\r?\n/)
    const out = []
    let inSection = false
    let inFence = false
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (!inSection && /^\s*(additional\s+resources|additional_resources)\s*:/i.test(line)) {
        inSection = true
        // skip header line and continue to skip its block (label/url pairs or bullets)
        continue
      }
      if (inSection) {
        // Handle fenced block
        if (!inFence && /^\s*```/i.test(line)) { inFence = true; continue }
        if (inFence) { if (/^\s*```\s*$/i.test(line)) { inFence = false; inSection = false; } continue }
        // If blank line, consider section closed and continue
        if (/^\s*$/.test(line)) { inSection = false; continue }
        // Skip label/url lines and bullets
        if (/^\s*(label|url|href|path)\s*:/i.test(line)) continue
        if (/^\s*-\s*/.test(line)) continue
        // Any unrelated content ends the section; include it
        inSection = false
      }
      if (!inSection) out.push(line)
    }
    return out.join('\n').trim()
  }

  // Remove leading "Final Answer:" prefix if present
  const stripFinalAnswerPrefix = (text) => {
    if (!text) return text
    return String(text).replace(/^\s*final\s*answer\s*[:\-]\s*/i, '')
  }

  const handleSendAssistant = async () => {
    const msg = assistantInput.trim()
    if (!msg || assistantTyping) return
    const userMessage = { id: `u-${Date.now()}`, role: 'user', text: msg }
    setAssistantMessages((m) => [...m, userMessage])
    setAssistantInput('')
    setAssistantTyping(true)

    try {
      const payload = { text: msg }
      if (assistantThreadIdRef.current) {
        payload.checkpoint_id = assistantThreadIdRef.current
      }
      const response = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`)
      }
      const data = await response.json()

      // Start with raw fields
      let finalText = (data && (data.final_answer || data.answer || data.text)) || 'No answer found.'
      finalText = stripFinalAnswerPrefix(finalText)
      let additionalResources = normalizeAdditionalResources(data?.additional_resurces || data?.additional_resources)

      // Also parse any resources embedded as plain text under "Additional Resources:" in finalText
      const parsedTextResources = parseAdditionalResourcesFromText(finalText)
      if (parsedTextResources && parsedTextResources.length > 0) {
        const existing = additionalResources || []
        const merged = [...existing]
        parsedTextResources.forEach((r) => {
          if (r && r.href && !merged.some((m) => m.href === r.href)) merged.push(r)
        })
        additionalResources = merged
        // Remove the section to avoid duplicate content next to chips
        finalText = stripAdditionalResourcesFromText(finalText)
        finalText = stripFinalAnswerPrefix(finalText)
      }

      // If finalText carries code-fenced JSON, parse and override
      const parsedInside = parseStructuredFromString(finalText)
      if (parsedInside && typeof parsedInside === 'object') {
        if (parsedInside.final_answer && typeof parsedInside.final_answer === 'string') {
          finalText = parsedInside.final_answer
        }
        const embeddedResources = parsedInside.additional_resurces || parsedInside.additional_resources || parsedInside.resources
        if ((!additionalResources || additionalResources.length === 0) && embeddedResources) {
          additionalResources = normalizeAdditionalResources(embeddedResources)
        }
      }

      const resources = extractResourceLinks(finalText)
      const reply = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: finalText,
        resources,
        additionalResources,
      }
      setAssistantMessages((m) => [...m, reply])
    } catch (err) {
      const errorReply = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: 'Sorry, I could not reach the assistant service. Please try again later.',
      }
      setAssistantMessages((m) => [...m, errorReply])
    } finally {
      setAssistantTyping(false)
    }
  }

  const handleAssistantKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendAssistant()
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200/60 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <nav className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">


          {/* Left side - Brand and Menus */}
          <div className="flex min-w-0 items-center gap-2">
            {/* Brand */}
            
            <Link to="/" className="group inline-flex items-center gap-2">
              <span className="text-lg sm:text-xl md:text-xl font-extrabold tracking-tight">
                TSG Portal
              </span>
            </Link>
          </div>
            

          <div className="hidden md:flex items-stretch gap-1">
            {/* Strategy */}
            <div className="relative" ref={strategyRef}>
              <button
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium  hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                onClick={() => setIsStrategyOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={isStrategyOpen}
              >
                <span>Strategy</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isStrategyOpen ? 'rotate-180' : ''}`} />
              </button>
              {isStrategyOpen && (
                <div className="absolute left-0 mt-2 w-72 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-xl ring-1 ring-black/5">
                  <div className="max-h-[70vh] overflow-y-auto">
                    <Link to="/strategy/digital-strategy-overview" onClick={() => { setIsStrategyOpen(false) }} className="flex items-center gap-2 px-4 py-2 text-sm  hover:bg-gray-50">
                      <Target className="h-4 w-4 text-gray-400" />
                      <span>Digital Strategy Overview</span>
                    </Link>
                    <Link to="/strategy/specialized-strategies" onClick={() => { setIsStrategyOpen(false) }} className="flex items-center gap-2 px-4 py-2 text-sm  hover:bg-gray-50">
                      <Layers className="h-4 w-4 text-gray-400" />
                      <span>Specialized Strategies</span>
                    </Link>
                    <Link to="/strategy/projects-portfolio" onClick={() => { setIsStrategyOpen(false) }} className="flex items-center gap-2 px-4 py-2 text-sm  hover:bg-gray-50">
                      <Briefcase className="h-4 w-4 text-gray-400" />
                      <span>Projects Portfolio</span>
                    </Link>
                    
                  </div>
                </div>
              )}
            </div>

            {/* Business */}
            <div className="relative" ref={businessRef}>
              <button
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium  hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                onClick={() => setIsBusinessOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={isBusinessOpen}
              >
                <span>Business</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isBusinessOpen ? 'rotate-180' : ''}`} />
              </button>
              {isBusinessOpen && (
                <div className="absolute left-0 mt-2 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-xl ring-1 ring-black/5">
                  <div className="max-h-[70vh] overflow-y-auto">
                    <Link to="/business/business-architecture-overview" onClick={() => { setIsBusinessOpen(false) }} className="flex items-center gap-2 px-4 py-2 text-sm  hover:bg-gray-50">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span>Business Architecture</span>
                    </Link>
                    <Link to="/business/business-capabilities" onClick={() => { setIsBusinessOpen(false) }} className="flex items-center gap-2 px-4 py-2 text-sm  hover:bg-gray-50">
                      <Zap className="h-4 w-4 text-gray-400" />
                      <span>Business Capabilities</span>
                    </Link>
                    <Link to="/business/processes" onClick={() => { setIsBusinessOpen(false) }} className="flex items-center gap-2 px-4 py-2 text-sm  hover:bg-gray-50">
                      <Cog className="h-4 w-4 text-gray-400" />
                      <span>Business Processes</span>
                    </Link>
                    <Link to="/business/services" onClick={() => { setIsBusinessOpen(false) }} className="flex items-center gap-2 px-4 py-2 text-sm  hover:bg-gray-50">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>Business Services</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Technology */}
            <div className="relative" ref={technologyRef}>
              <button
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium  hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                onClick={() => setIsTechnologyOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={isTechnologyOpen}
              >
                <span>Technology</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isTechnologyOpen ? 'rotate-180' : ''}`} />
              </button>
              {isTechnologyOpen && (
                <div className="absolute left-0 mt-2 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-xl ring-1 ring-black/5">
                  <div className="max-h-[70vh] overflow-y-auto">
                    <Link to="/technology/target-architecture" onClick={() => { setIsTechnologyOpen(false) }} className="flex items-center gap-2 px-4 py-2 text-sm  hover:bg-gray-50">
                      <Target className="h-4 w-4 text-gray-400" />
                      <span>Target Architecture</span>
                    </Link>
                    
                    <Link to="/technology/business-applications" onClick={() => { setIsTechnologyOpen(false) }} className="flex items-center gap-2 px-4 py-2 text-sm  hover:bg-gray-50">
                      <Laptop className="h-4 w-4 text-gray-400" />
                      <span>Business Applications</span>
                    </Link>

                    <Link to="/technology/software-assets" onClick={() => { setIsTechnologyOpen(false) }} className="flex items-center gap-2 px-4 py-2 text-sm  hover:bg-gray-50">
                      <Boxes className="h-4 w-4 text-gray-400" />
                      <span>Software Technologies</span>
                    </Link>
                    {/* <Link to="/dashboards/technology/software" onClick={() => { setIsTechnologyOpen(false) }} className="flex items-center gap-2 px-4 py-2 text-sm  hover:bg-gray-50">
                      <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l4 4-4 4-4-4 4-4zM6 14h12v2H6v-2zm0 4h12v2H6v-2z"/></svg>
                      <span>Software Technologies</span>
                    </Link>
                    <Link to="/dashboards/technology/risks" onClick={() => { setIsTechnologyOpen(false) }} className="flex items-center gap-2 px-4 py-2 text-sm  hover:bg-gray-50">
                      <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5l-3 6h4l-1 5 4-8h-4l1-3z"/></svg>
                      <span>Risks</span>
                    </Link>
                    <Link to="/dashboards/technology/integrations" onClick={() => { setIsTechnologyOpen(false) }} className="flex items-center gap-2 px-4 py-2 text-sm  hover:bg-gray-50">
                      <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor"><path d="M4 7h16v2H4V7zm0 4h10v2H4v-2zm0 4h7v2H4v-2zM18 11l4 3-4 3v-6z"/></svg>
                      <span>Enterprise Integrations</span>
                    </Link> */}
                    <Link to="/technology/cart" onClick={() => { setIsTechnologyOpen(false) }} className="flex items-center gap-2 px-4 py-2 text-sm  hover:bg-gray-50">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span>CART</span>
                    </Link>
                    <Link to="/technology/cloud-migration" onClick={() => { setIsTechnologyOpen(false) }} className="flex items-center gap-2 px-4 py-2 text-sm  hover:bg-gray-50">
                      <Cloud className="h-4 w-4 text-gray-400" />
                      <span>Cloud Migration</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* TSG Services */}
            <div className="relative" ref={servicesRef}>
              <button
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium  hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                onClick={() => setIsServicesOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={isServicesOpen}
              >
                <span>TSG Services</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>
              {isServicesOpen && (
                <div className="absolute left-0 mt-2 w-auto min-w-max overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-xl ring-1 ring-black/5">
                  <div className="max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-3 gap-1 p-2">
                      {/* Column 1 */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 cursor-not-allowed rounded-md">
                          <Star className="h-4 w-4 text-gray-400" />
                          <span className="whitespace-nowrap">Gartner as a Service</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 cursor-not-allowed rounded-md">
                          <UserPlus className="h-4 w-4 text-gray-400" />
                          <span className="whitespace-nowrap">Request for Internal Consultancy</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 cursor-not-allowed rounded-md">
                          <CheckSquare className="h-4 w-4 text-gray-400" />
                          <span className="whitespace-nowrap">TSG Checklist</span>
                        </div>
                      </div>
                      
                      {/* Column 2 */}
                      <div className="space-y-1">
                        <Link to="/services/business-case-builder" onClick={() => { setIsServicesOpen(false) }} className="flex items-center gap-2 px-3 py-2 text-sm  hover:bg-gray-50 rounded-md">
                          <Briefcase className="h-4 w-4 text-gray-400" />
                          <span className="whitespace-nowrap">Apply for Business Case</span>
                        </Link>
                        <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 cursor-not-allowed rounded-md">
                          <FileCheck className="h-4 w-4 text-gray-400" />
                          <span className="whitespace-nowrap">Apply for RFP</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 cursor-not-allowed rounded-md">
                          <Shield className="h-4 w-4 text-gray-400" />
                          <span className="whitespace-nowrap">Apply for SAD</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 cursor-not-allowed rounded-md">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="whitespace-nowrap">Apply for SRS</span>
                        </div>
                      </div>
                      
                      {/* Column 3 */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 cursor-not-allowed rounded-md">
                          <Lightbulb className="h-4 w-4 text-gray-400" />
                          <span className="whitespace-nowrap">Request for PoC</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tools */}
            <div className="relative" ref={toolsRef}>
              <button
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium  hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                onClick={() => setIsToolsOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={isToolsOpen}
              >
                <span>Self-service Tools</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
              </button>
              {isToolsOpen && (
                <div className="absolute left-0 mt-2 w-auto min-w-max overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-xl ring-1 ring-black/5">
                  <div className="max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-1 p-2">
                      {/* Column 1 */}
                      <div className="space-y-1">
                        <Link to="/tools/cloud-eligibility-tool" onClick={() => { setIsToolsOpen(false) }} className="flex items-center gap-2 px-3 py-2 text-sm  hover:bg-gray-50 rounded-md">
                          <Cloud className="h-4 w-4 text-gray-400" />
                          <span className="whitespace-nowrap">Cloud Eligibility Tool</span>
                        </Link>
                        <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 cursor-not-allowed rounded-md">
                          <TrendingUp className="h-4 w-4 text-gray-400" />
                          <span className="whitespace-nowrap">Build vs Buy</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 cursor-not-allowed rounded-md">
                          <Shield className="h-4 w-4 text-gray-400" />
                          <span className="whitespace-nowrap">DR Tool</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 cursor-not-allowed rounded-md">
                          <Database className="h-4 w-4 text-gray-400" />
                          <span className="whitespace-nowrap">Data Classification Tool</span>
                        </div>
                      </div>
                      
                      {/* Column 2 */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 cursor-not-allowed rounded-md">
                          <Container className="h-4 w-4 text-gray-400" />
                          <span className="whitespace-nowrap">Container Platform Tool</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 cursor-not-allowed rounded-md">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span className="whitespace-nowrap">ROI Tool</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 cursor-not-allowed rounded-md">
                          <Calculator className="h-4 w-4 text-gray-400" />
                          <span className="whitespace-nowrap">TCO Tool</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={aboutRef}>
              <button
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium  hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                onClick={() => setIsAboutOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={isAboutOpen}
              >
                <span>Resources</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isAboutOpen ? 'rotate-180' : ''}`} />
              </button>
              {isAboutOpen && (
                <div className="absolute left-0 mt-2 w-auto min-w-max overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-xl ring-1 ring-black/5">
                  <div className="max-h-[70vh] overflow-y-auto p-2">
                    <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 cursor-not-allowed rounded-md">
                      <BookOpen className="h-4 w-4 text-gray-400" />
                      <span className="whitespace-nowrap">Policies</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 cursor-not-allowed rounded-md">
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                      <span className="whitespace-nowrap">Guidelines</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 cursor-not-allowed rounded-md">
                      <List className="h-4 w-4 text-gray-400" />
                      <span className="whitespace-nowrap">Frameworks</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
            
          

          {/* Right section */}
          <div className="flex items-center gap-4">
                      {/* AI Assistant */}
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full brand-button px-4 py-2 text-sm font-medium"
                onClick={() => setIsAssistantOpen(true)}
              >
                Ask TSG
                <Sparkles className="h-4 w-4" />
              </button>

            {/* Profile icon */}
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="Open profile"
            >
              <User className="h-5 w-5" />
            </button>

            {/* Mobile menu button */}
            <button
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 md:hidden"
              onClick={toggleMobile}
              aria-label="Toggle menu"
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              ) : (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>


      </nav>

      {/* Assistant Sheet (Portal) */}
      {isAssistantOpen && createPortal(
        <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/30" onClick={() => setIsAssistantOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-full sm:w-[420px] md:w-[520px] lg:w-[640px] bg-white shadow-2xl border-l border-gray-200 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-600" />  
                <h2 className="text-sm font-semibold text-gray-900">Ask TSG</h2>
              </div>
              <button className="text-gray-500 hover:" onClick={() => setIsAssistantOpen(false)} aria-label="Close assistant">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            {/* Messages */}
            <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {assistantMessages.length === 0 && (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-base font-semibold text-gray-900">Ask TSG</h2>
                    <p className="mt-1 text-sm text-gray-500 ">TSG Assistant might make mistakes. Please double check the responses.</p>
                  </div>
                </div>
              )}
              {assistantMessages.map((m) => (
                <div key={m.id} className="space-y-1">
                  <div className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`${m.role === 'user' ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-2xl px-3 py-2 text-sm max-w-[85%] whitespace-pre-wrap`}>
                      {m.role === 'user' ? (
                        <div>{m.text}</div>
                      ) : (
                        <MarkdownText text={m.text} />
                      )}
                      {m.resources && m.resources.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {m.resources.map((r, idx) => (
                            r.href && r.href.startsWith('/') ? (
                              <Link key={idx} to={r.href} className="inline-flex items-center gap-1 rounded-full bg-white text-indigo-700 border border-indigo-200 px-2 py-1 text-[11px] hover:bg-indigo-50" onClick={() => setIsAssistantOpen(false)}>
                                <Link2 className="h-3 w-3" />
                                <span className="truncate max-w-[180px]">{r.label}</span>
                              </Link>
                            ) : (
                              <a key={idx} href={r.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full bg-white text-indigo-700 border border-indigo-200 px-2 py-1 text-[11px] hover:bg-indigo-50">
                                <Link2 className="h-3 w-3" />
                                <span className="truncate max-w-[180px]">{r.label}</span>
                              </a>
                            )
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {m.role === 'assistant' && m.additionalResources && m.additionalResources.length > 0 && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 rounded-xl p-3 max-w-[85%]">
                        <div className="text-xs font-medium  mb-2">Additional resources</div>
                        <div className="flex flex-wrap gap-2">
                          {m.additionalResources.map((r, idx) => (
                            r.href && r.href.startsWith('/') ? (
                              <Link key={idx} to={r.href} className="inline-flex items-center gap-1 rounded-full bg-white text-indigo-700 border border-indigo-200 px-2 py-1 text-[11px] hover:bg-indigo-50" onClick={() => setIsAssistantOpen(false)}>
                                <Link2 className="h-3 w-3" />
                                <span className="truncate max-w-[220px]">{r.label}</span>
                              </Link>
                            ) : (
                              <a key={idx} href={r.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full bg-white text-indigo-700 border border-indigo-200 px-2 py-1 text-[11px] hover:bg-indigo-50">
                                <Link2 className="h-3 w-3" />
                                <span className="truncate max-w-[220px]">{r.label}</span>
                              </a>
                            )
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {m.role === 'assistant' && (
                    <div className="flex justify-start">
                      <div className="text-[11px] text-gray-400">TSG Assistant might make mistakes. Please double-check the answer.</div>
                    </div>
                  )}
                </div>
              ))}
              {assistantTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100  rounded-2xl px-3 py-2 text-sm">
                    <div className="flex items-center gap-1 py-0.5">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Composer */}
            <div className="border-t border-gray-200 p-3">
              <div className="flex items-end gap-2">
                <textarea
                  className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={2}
                  value={assistantInput}
                  onChange={(e) => setAssistantInput(e.target.value)}
                  onKeyDown={handleAssistantKeyDown}
                  placeholder="Ask about applications, strategies, or projects…"
                />
                <button
                  className="inline-flex items-center gap-2 rounded-md bg-violet-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  onClick={handleSendAssistant}
                  disabled={assistantTyping || !assistantInput.trim()}
                >
                  <Send className="h-4 w-4 " />
                  Send
                </button>
              </div>
            </div>
          </aside>
        </div>,
        document.body
      )}

      {/* Mobile panel */}
      {isMobileOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden max-h-[calc(100vh-64px)] overflow-y-auto">
          <div className="space-y-1 px-4 py-3">
            {/* About TSG accordion */}
            <details className="group" open>
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-2.5 py-2 text-sm font-medium  hover:bg-gray-50">
                <span className="inline-flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-indigo-600" />
                  About TSG
                </span>
                <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-1 space-y-1 pl-3">
                <div className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-gray-400 cursor-not-allowed">
                  <BookOpen className="h-4 w-4 text-gray-400" />
                  <span>Policies</span>
                </div>
                <div className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-gray-400 cursor-not-allowed">
                  <MessageSquare className="h-4 w-4 text-gray-400" />
                  <span>Guidelines</span>
                </div>
                <div className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-gray-400 cursor-not-allowed">
                  <List className="h-4 w-4 text-gray-400" />
                  <span>Frameworks</span>
                </div>
              </div>
            </details>

            {/* Strategy accordion */}
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-2.5 py-2 text-sm font-medium  hover:bg-gray-50">
                <span className="inline-flex items-center gap-2">
                  <Target className="h-4 w-4 text-indigo-600" />
                  Strategy
                </span>
                <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-1 space-y-1 pl-3">
                <Link to="/dashboards/digital-strategy/overview" onClick={() => { setIsMobileOpen(false) }} className="block rounded-md px-2.5 py-1.5 text-sm  hover:bg-gray-50">Digital Strategy Overview</Link>
                <Link to="/strategy/projects-portfolio" onClick={() => { setIsMobileOpen(false) }} className="block rounded-md px-2.5 py-1.5 text-sm  hover:bg-gray-50">Projects Portfolio</Link>
              </div>
            </details>

            {/* Business accordion */}
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-2.5 py-2 text-sm font-medium  hover:bg-gray-50">
                <span className="inline-flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-amber-600" />
                  Business
                </span>
                <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-1 space-y-1 pl-3">
                <Link to="/business/stakeholders" onClick={() => { setIsMobileOpen(false) }} className="block rounded-md px-2.5 py-1.5 text-sm  hover:bg-gray-50">Stakeholders</Link>
                <Link to="/business/business-capabilities" onClick={() => { setIsMobileOpen(false) }} className="block rounded-md px-2.5 py-1.5 text-sm  hover:bg-gray-50">Business Capabilities</Link>
                <Link to="/dashboards/business/processes" onClick={() => { setIsMobileOpen(false) }} className="block rounded-md px-2.5 py-1.5 text-sm  hover:bg-gray-50">Business Processes</Link>
                <Link to="/dashboards/business/services" onClick={() => { setIsMobileOpen(false) }} className="block rounded-md px-2.5 py-1.5 text-sm  hover:bg-gray-50">Business Services</Link>
              </div>
            </details>

            {/* Technology accordion */}
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-2.5 py-2 text-sm font-medium  hover:bg-gray-50">
                <span className="inline-flex items-center gap-2">
                  <Layers className="h-4 w-4 text-emerald-600" />
                  Technology
                </span>
                <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-1 space-y-1 pl-3">
                <Link to="/technology/business-applications" onClick={() => { setIsMobileOpen(false) }} className="block rounded-md px-2.5 py-1.5 text-sm  hover:bg-gray-50">Business Applications</Link>
                <Link to="/technology/software-assets" onClick={() => { setIsMobileOpen(false) }} className="block rounded-md px-2.5 py-1.5 text-sm  hover:bg-gray-50">Software Technologies</Link>
                <Link to="/dashboards/technology/software" onClick={() => { setIsMobileOpen(false) }} className="block rounded-md px-2.5 py-1.5 text-sm  hover:bg-gray-50">Software Technologies</Link>
                <Link to="/dashboards/technology/risks" onClick={() => { setIsMobileOpen(false) }} className="block rounded-md px-2.5 py-1.5 text-sm  hover:bg-gray-50">Risks</Link>
                <Link to="/dashboards/technology/integrations" onClick={() => { setIsMobileOpen(false) }} className="block rounded-md px-2.5 py-1.5 text-sm  hover:bg-gray-50">Enterprise Integrations</Link>
                <Link to="/technology/cart" onClick={() => { setIsMobileOpen(false) }} className="block rounded-md px-2.5 py-1.5 text-sm  hover:bg-gray-50">CART</Link>
              </div>
            </details>

            {/* TSG Services accordion */}
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-2.5 py-2 text.sm font-medium  hover:bg-gray-50">
                <span className="inline-flex items-center gap-2">
                  <Star className="h-4 w-4 text-purple-600" />
                  TSG Services
                </span>
                <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-1 space-y-1 pl-3">
                <div className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-gray-400 cursor-not-allowed">
                  <Star className="h-4 w-4 text-gray-400" />
                  <span>Gartner as a Service</span>
                </div>
                <div className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-gray-400 cursor-not-allowed">
                  <UserPlus className="h-4 w-4 text-gray-400" />
                  <span>Request for Internal Consultancy</span>
                </div>
                <div className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-gray-400 cursor-not-allowed">
                  <CheckSquare className="h-4 w-4 text-gray-400" />
                  <span>TSG Checklist</span>
                </div>
                <Link to="/services/business-case-builder" onClick={() => { setIsMobileOpen(false) }} className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm  hover:bg-gray-50">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                  <span>Apply for Business Case</span>
                </Link>
                <div className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-gray-400 cursor-not-allowed">
                  <FileCheck className="h-4 w-4 text-gray-400" />
                  <span>Apply for RFP</span>
                </div>
                <div className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-gray-400 cursor-not-allowed">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <span>Apply for SAD</span>
                </div>
                <div className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-gray-400 cursor-not-allowed">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span>Apply for SRS</span>
                </div>
                <div className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-gray-400 cursor-not-allowed">
                  <Lightbulb className="h-4 w-4 text-gray-400" />
                  <span>Request for PoC</span>
                </div>
              </div>
            </details>

            {/* Tools accordion */}
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-2.5 py-2 text-sm font-medium  hover:bg-gray-50">
                <span className="inline-flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-teal-600" />
                  Tools
                </span>
                <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-1 space-y-1 pl-3">
                <Link to="/tools/cloud-eligibility-tool" onClick={() => { setIsMobileOpen(false) }} className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm  hover:bg-gray-50">
                  <Cloud className="h-4 w-4 text-gray-400" />
                  <span>Cloud Eligibility Tool</span>
                </Link>
                <div className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-gray-400 cursor-not-allowed">
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                  <span>Build vs Buy</span>
                </div>
                <div className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-gray-400 cursor-not-allowed">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <span>DR Tool</span>
                </div>
                <div className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-gray-400 cursor-not-allowed">
                  <Container className="h-4 w-4 text-gray-400" />
                  <span>Container Platform Tool</span>
                </div>
                <div className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-gray-400 cursor-not-allowed">
                  <Database className="h-4 w-4 text-gray-400" />
                  <span>Data Classification Tool</span>
                </div>
                <div className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-gray-400 cursor-not-allowed">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span>ROI Tool</span>
                </div>
                <div className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-gray-400 cursor-not-allowed">
                  <Calculator className="h-4 w-4 text-gray-400" />
                  <span>TCO Tool</span>
                </div>
              </div>
            </details>
          </div>
        </div>
      )}
    </header>
  )
}