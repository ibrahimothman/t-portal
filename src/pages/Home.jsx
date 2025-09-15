import { useMemo, useState } from 'react'
import { Sparkles, Search } from 'lucide-react'
import { Footer } from '../components'

const STAGES = [
  {
    key: 's2p',
    title: 'Strategy to Portfolio',
    tagline: 'Vision • Investment • Portfolio',
    description:
      'Define business strategy, set enterprise outcomes, govern architecture guardrails, and prioritize investments that maximize value. TSG owns this stream end‑to‑end and steers the IT4IT flow.',
    activities: [
      'Strategy Management',
      'Portfolio Management',
      'Demand Management',
      'Budget Management',
      'Enterprise Architecture',
      'Benefits Management'
    ],
  },
  {
    key: 'r2d',
    title: 'Requirement to Deploy',
    tagline: 'Design • Build • Release',
    description:
      'Capture and refine requirements, design and review solutions, build and integrate, test with quality gates, and deploy reliably. TSG governs architecture reviews and change policy.',
    activities: [
      'Requirements Management',
      'Solution Design & Review',
      'Build & Integration',
      'Testing & Quality Gates',
      'Release & Change Control',
      'CI/CD Pipelines',
    ],
  },
  {
    key: 'd2c',
    title: 'Detect to Correct',
    tagline: 'Catalog • Self‑Service • SLAs',
    description:
      'Publish catalog offerings, intake and approve requests, provision services, manage assets/configuration, and assure SLAs. TSG governs service standards and compliance.',
    activities: [
      'Solution Maintenance',
      'Incident Management',
      'Change Management',
      'IT Operations'
    ],
  }
]

export default function Home() {
  const [active, setActive] = useState('s2p')
  const activeStage = useMemo(() => STAGES.find((s) => s.key === active) || STAGES[0], [active])
  const [heroQuery, setHeroQuery] = useState('')
  const isValueGreen = active === 'd2c'

  // No animations; logic-only UI state

  return (
    <>
    {/* Hero */}
    <section className="relative w-full">
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Welcome to TSG Portal
          </h1>
          <p className="mt-3 text-base sm:text-lg text-gray-600">
            Ask questions, explore strategy, and navigate your technology portfolio with AI assistance.
          </p>
        </div>

        <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-gray-200 bg-white  flex flex-col justify-center gap-3 py-4">
          <div className="px-3 sm:px-4">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Sparkles className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                placeholder="Ask the AI assistant..."
                className="block w-full rounded-xl border border-gray-200 bg-white pl-10 pr-28 py-3 text-[15px] text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 rounded-full brand-button px-4 py-2 text-sm font-medium"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('tsg:assistant:open', { detail: { query: heroQuery } }))
                }}
              >
                Ask
                <Sparkles className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="px-3 sm:px-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="hidden sm:inline">Try:</span>
              <button className="rounded-full border border-gray-200 px-2.5 py-1 text-[12px] text-gray-700 hover:bg-gray-50" onClick={() => setHeroQuery('Projects within the "digital strategy 2030" strategy')}>Projects within digital strategy 2030</button>
              <button className="rounded-full border border-gray-200 px-2.5 py-1 text-[12px] text-gray-700 hover:bg-gray-50" onClick={() => setHeroQuery('# of Applications eligible for cloud migration')}>Applications eligible for cloud migration</button>
              <button className="rounded-full border border-gray-200 px-2.5 py-1 text-[12px] text-gray-700 hover:bg-gray-50" onClick={() => setHeroQuery('# of Applications under retirement')}>Applications under retirement</button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <hr className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen border-t border-gray-200 m-0" />
      
    <section className="relative w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-4 justify-center">
          <div className="text-left">
            <h2 className="scroll-m-20 text-3xl font-bold tracking-tight first:mt-0">
              IT Demand to Delivery Value Chain
            </h2>
            {/* <p className="mt-1 text-sm text-gray-600">
              TSG connects strategy to execution across four value streams.
            </p> */}
          </div>

      {/* Chevron step navigation */}
        <div className="mt-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-stretch gap-2 sm:gap-3 flex-1">
              {STAGES.map((s, idx) => {
                const isActive = active === s.key
                const isLast = idx === STAGES.length
                return (
                  <button
                    key={s.key}
                    onClick={() => setActive(s.key)}
                    className="relative flex-1 focus:outline-none"
                    aria-current={isActive}
                  >
                    <svg viewBox="0 0 112 80" preserveAspectRatio="none" className={`h-20 w-full`}>
                      <defs>
                        <linearGradient id={`brand-${s.key}`} x1="0" x2="1">
                          <stop offset="0%" stopColor="#7c3aed" />
                          
                        </linearGradient>
                      </defs>
                      <polygon
                        points={`${isLast ? '0,0 112,0 112,80 0,80 12,40' : '0,0 100,0 112,40 100,80 0,80 12,40'}`}
                        fill={'#ffffff'}
                        stroke={isActive ? '#000000' : '#9ca3af'}
                        strokeWidth={isActive ? 2 : 1}
                        strokeLinejoin={'round'}
                        shapeRendering={'crispEdges'}
                        vectorEffect={'non-scaling-stroke'}
                        className={isActive ? 'chevron-dashed' : ''}
                      />
                    </svg>
                    
                    <div className="absolute inset-0 grid place-items-center">
                      <div className="px-3 text-center">
                        <div className={`text-base sm:text-lg md:text-xl font-semibold tracking-tight transition-all ${isActive ? 'text-black opacity-100 translate-y-0' : 'text-gray-700 opacity-90 translate-y-[1px]'}`}>{s.title}</div>
                        <div className={`hidden sm:block mt-1 text-xs transition-all ${isActive ? 'text-black/80 opacity-100' : 'text-gray-500 opacity-90'}`}>{s.tagline}</div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

          

            {/* Value Realized badge */}
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32 transition-[transform,filter] duration-500 hover:scale-[1.02] cursor-pointer group ">
                <svg viewBox="0 0 80 80" className="w-full h-full">
                  <circle cx="40" cy="40" r="38" fill={isValueGreen ? '#22C55E' : '#ffffff'} stroke="#d1d5db" strokeWidth="1" shapeRendering="crispEdges" vectorEffect="non-scaling-stroke" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 py-3">
                  <div className={`${isValueGreen ? 'text-white' : 'text-black'} font-semibold text-xl sm:text-2xl leading-tight`}>Value</div>
                  <div className={`${isValueGreen ? 'text-white' : 'text-black'} font-semibold text-xl sm:text-2xl leading-tight`}>Realized</div>
                  <div className={`${isValueGreen ? 'text-white/90' : 'text-gray-700'} text-sm sm:text-base mt-1`}>Benefits</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detail panel */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 ">
            
              {/* <p className="text-md text-gray-700 transition-all duration-500">{activeStage.description}</p> */}
              <div className="mt-0">
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">{activeStage.title} Main Activities</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {activeStage.activities.map((a, i) => (
                    <div
                      key={a}
                      className="group inline-flex items-center whitespace-nowrap rounded-lg border border-gray-200 bg-white px-3 py-2  transition-all duration-300  hover:-translate-y-0.5"
                      style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
                    >
                      <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full brand-dot" />
                      <span className="text-[13px] text-gray-800">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  
    </>
  )
}


