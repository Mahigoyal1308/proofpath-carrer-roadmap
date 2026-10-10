import { useEffect, useState } from 'react'
import {
  ArrowDownToLine,
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Link as LinkIcon,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Target,
  Trash2,
} from 'lucide-react'
import RoadmapResults from './RoadmapResults'
import { generateCareerRoadmap, suggestCompanies, suggestRoles, type CareerRoadmap } from './roadmap'
import './App.css'

type SkillRule = { id: string; name: string; terms: string[] }
type StarResponse = { situation: string; task: string; action: string; result: string }
type PracticeTask = {
  id: string
  day: number
  title: string
  goal: string
  skillIds: string[]
  response: string
  link: string
  complete: boolean
  star?: StarResponse
}
type WorkspaceState = {
  companyName: string
  roleName: string
  education: string
  currentSkills: string
  experience: string
  durationMonths: number
  sourceUrl: string
  jobDescription: string
  skills: SkillRule[]
  tasks: PracticeTask[]
  generated: boolean
  demoContent: boolean
  generatedRoadmap: CareerRoadmap | null
  completedPhases: string[]
  savedRoadmaps: CareerRoadmap[]
}

const STORAGE_KEY = 'proofpath-workspace-v1'

const DEFAULT_SKILLS: SkillRule[] = [
  { id: 'python', name: 'Python', terms: ['python', 'pandas'] },
  { id: 'javascript', name: 'JavaScript', terms: ['javascript', 'typescript', 'react'] },
  { id: 'sql', name: 'SQL & data', terms: ['sql', 'data analysis', 'data analytics', 'dashboard'] },
  { id: 'research', name: 'Research', terms: ['research', 'user research', 'market research'] },
  { id: 'communication', name: 'Communication', terms: ['communication', 'present', 'storytelling'] },
  { id: 'teamwork', name: 'Collaboration', terms: ['collaborate', 'collaboration', 'cross-functional', 'teamwork'] },
  { id: 'marketing', name: 'Marketing', terms: ['marketing', 'campaign', 'social media', 'brand'] },
  { id: 'analytics', name: 'Analytics', terms: ['analytics', 'metrics', 'experiments', 'a/b testing'] },
  { id: 'problem-solving', name: 'Problem solving', terms: ['problem solving', 'debug', 'troubleshoot'] },
]

const SAMPLES: Record<string, { company: string; name: string; description: string }> = {
  software: {
    company: 'Sample employer',
    name: 'Software intern',
    description:
      'We are looking for a software engineering intern to build features with JavaScript, TypeScript, and React. You will work with engineers to debug issues, review code, write tests, and communicate progress across a collaborative team. Familiarity with Git and problem solving is helpful.',
  },
  data: {
    company: 'Sample employer',
    name: 'Data analyst intern',
    description:
      'The data analyst intern will use SQL and Python to explore datasets, build dashboards, and explain trends to partners. You will support data analysis, check data quality, communicate findings, and collaborate with a research team. Excel experience is useful.',
  },
  marketing: {
    company: 'Sample employer',
    name: 'Marketing intern',
    description:
      'Our marketing intern will support social media and brand campaigns, conduct market research, and help measure campaign analytics. You will use storytelling to present ideas, collaborate across teams, and bring curiosity about digital marketing and audience growth.',
  },
}

const TASK_BLUEPRINTS = [
  { title: 'Translate the requirement', goal: 'In your own words, explain what this skill looks like in the role. Find one concrete example in the job description.' },
  { title: 'Learn one useful building block', goal: 'Spend 20 minutes with a trusted learning resource. Write down one concept and one question you still have.' },
  { title: 'Practise the fundamentals', goal: 'Complete one small exercise using this skill. Keep the work focused enough to finish in 25 minutes.' },
  { title: 'Make a tiny artifact', goal: 'Create something you can point to: a short analysis, draft, code snippet, or one-page outline.' },
  { title: 'Explain your choices', goal: 'Write a short note about what you tried, what you noticed, and one decision you would change next time.' },
  { title: 'Connect it to a real example', goal: 'Choose a class, club, volunteer, or personal project example that shows this skill. Capture the details while they are fresh.' },
  { title: 'Rehearse one interview story', goal: 'Use Situation, Task, Action, Result to prepare a specific example connected to this role. Keep the action and outcome clear.' },
]

const STAR_PARTS: { key: keyof StarResponse; label: string; prompt: string }[] = [
  { key: 'situation', label: 'Situation', prompt: 'Set the scene. What was happening?' },
  { key: 'task', label: 'Task', prompt: 'What were you responsible for?' },
  { key: 'action', label: 'Action', prompt: 'What did you specifically do?' },
  { key: 'result', label: 'Result', prompt: 'What changed? Add a concrete outcome if you can.' },
]

function emptyWorkspace(): WorkspaceState {
  return {
    companyName: '',
    roleName: '',
    education: '',
    currentSkills: '',
    experience: 'Beginner',
    durationMonths: 3,
    sourceUrl: '',
    jobDescription: '',
    skills: DEFAULT_SKILLS,
    tasks: [],
    generated: false,
    demoContent: false,
    generatedRoadmap: null,
    completedPhases: [],
    savedRoadmaps: [],
  }
}

function normaliseSavedRoadmap(value: unknown): CareerRoadmap | null {
  if (!value || typeof value !== 'object') return null
  const roadmap = value as CareerRoadmap & { companyEvidence?: unknown[] }
  const companyEvidence = Array.isArray(roadmap.companyEvidence)
    ? roadmap.companyEvidence.flatMap((match) => {
      if (typeof match === 'string') return [{ skillName: match, phrase: match }]
      if (match && typeof match === 'object' && 'skillName' in match && 'phrase' in match) {
        const record = match as { skillName: unknown; phrase: unknown }
        if (typeof record.skillName === 'string' && typeof record.phrase === 'string') return [{ skillName: record.skillName, phrase: record.phrase }]
      }
      return []
    })
    : []
  return { ...roadmap, companyEvidence }
}

function loadWorkspace(): WorkspaceState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return emptyWorkspace()
    const parsed = JSON.parse(saved) as Partial<WorkspaceState>
    return {
      ...emptyWorkspace(),
      ...parsed,
      skills: Array.isArray(parsed.skills) ? parsed.skills : DEFAULT_SKILLS,
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      generatedRoadmap: normaliseSavedRoadmap(parsed.generatedRoadmap),
      completedPhases: Array.isArray(parsed.completedPhases) ? parsed.completedPhases : [],
      savedRoadmaps: Array.isArray(parsed.savedRoadmaps)
        ? parsed.savedRoadmaps.map(normaliseSavedRoadmap).filter((roadmap): roadmap is CareerRoadmap => Boolean(roadmap))
        : [],
    }
  } catch {
    return emptyWorkspace()
  }
}

function findMatches(description: string, skills: SkillRule[]) {
  return skills.map((skill) => {
    const matches = skill.terms.flatMap((term) => {
      const cleanTerm = term.trim()
      if (!cleanTerm) return []
      const escapedTerm = cleanTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const boundaryMatch = new RegExp(`(^|[^\\p{L}\\p{N}_])(${escapedTerm})(?=$|[^\\p{L}\\p{N}_])`, 'iu').exec(description)
      return boundaryMatch ? [boundaryMatch[2]] : []
    })
    return { skill, matches: [...new Set(matches.map((match) => match.toLocaleLowerCase()))] }
  }).filter((entry) => entry.matches.length > 0)
}

function App() {
  const [workspace, setWorkspace] = useState<WorkspaceState>(loadWorkspace)
  const [sampleChoice, setSampleChoice] = useState('')
  const [activeTaskId, setActiveTaskId] = useState('')
  const [editingSkills, setEditingSkills] = useState(false)
  const [newSkillName, setNewSkillName] = useState('')
  const [newSkillTerms, setNewSkillTerms] = useState('')
  const [feedback, setFeedback] = useState('')
  const [compareCompany, setCompareCompany] = useState('')
  const [compareRole, setCompareRole] = useState('')
  const [comparison, setComparison] = useState<{ first: CareerRoadmap; second: CareerRoadmap } | null>(null)
  const [generating, setGenerating] = useState(false)
  const [savedRoadmapIndex, setSavedRoadmapIndex] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace))
    } catch (error) {
      console.error('ProofPath could not save this workspace to browser storage.', error)
    }
  }, [workspace])

  const matchedSkills = findMatches(workspace.jobDescription, workspace.skills)
  const completedTasks = workspace.tasks.filter((task) => task.complete)
  const savedSkillIds = new Set(completedTasks.flatMap((task) => task.skillIds))
  const completedCount = completedTasks.length

  function updateWorkspace(patch: Partial<WorkspaceState>) {
    setWorkspace((current) => ({ ...current, ...patch }))
  }

  function loadSample(sampleKey: string, build = false) {
    const sample = SAMPLES[sampleKey]
    if (!sample) return
    setSampleChoice(sampleKey)
    const nextWorkspace: WorkspaceState = {
      ...workspace,
      companyName: sample.company,
      roleName: sample.name,
      jobDescription: sample.description,
      demoContent: true,
      generated: false,
      generatedRoadmap: null,
      completedPhases: [],
      tasks: [],
    }
    if (build) {
      const roadmap = generateCareerRoadmap({ company: sample.company, role: sample.name, education: '', currentSkills: '', experience: 'Beginner', durationMonths: 3, jobDescription: sample.description, sourceUrl: '' })
      nextWorkspace.generatedRoadmap = roadmap
      nextWorkspace.tasks = createTasks(roadmap.roleSkills.slice(0, 5).map((item) => ({ id: item.name, name: item.name, terms: [item.name] })))
      nextWorkspace.generated = true
      setActiveTaskId(nextWorkspace.tasks[0]?.id ?? '')
      setFeedback('Software intern demo loaded. Add your own examples as you practise.')
    } else {
      setFeedback(`${sample.name} sample loaded. Review it, then build your plan.`)
    }
    setWorkspace(nextWorkspace)
  }

  function createTasks(skills: SkillRule[]) {
    return TASK_BLUEPRINTS.map((blueprint, index): PracticeTask => ({
      id: `${Date.now()}-${index}`,
      day: index + 1,
      title: blueprint.title,
      goal: blueprint.goal,
      skillIds: skills.length ? [skills[index % skills.length].id] : [],
      response: '',
      link: '',
      complete: false,
      ...(index === 6 ? { star: { situation: '', task: '', action: '', result: '' } } : {}),
    }))
  }

  function buildPlan() {
    if (!workspace.companyName.trim() || !workspace.roleName.trim()) {
      setFeedback('Enter a target company and job role. Custom names are accepted.')
      return
    }
    if (workspace.jobDescription.trim().length > 20000) {
      setFeedback('The job description is too long. Keep it under 20,000 characters.')
      return
    }
    if (workspace.sourceUrl.trim()) {
      try {
        const parsed = new URL(workspace.sourceUrl)
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') throw new Error('protocol')
      } catch {
        setFeedback('Source URL must be a valid http:// or https:// link.')
        return
      }
    }
    if (workspace.tasks.some((task) => task.complete || task.response.trim() || task.link.trim())) {
      const replacePlan = window.confirm('Generating a new roadmap replaces the current seven-day practice tasks. Export your data first if you want to keep them. Continue?')
      if (!replacePlan) return
    }
    setGenerating(true)
    window.setTimeout(() => {
      const roadmap = generateCareerRoadmap({
        company: workspace.companyName.trim(),
        role: workspace.roleName.trim(),
        education: workspace.education.trim(),
        currentSkills: workspace.currentSkills,
        experience: workspace.experience,
        durationMonths: workspace.durationMonths,
        jobDescription: workspace.jobDescription,
        sourceUrl: workspace.sourceUrl,
      })
      const matchedNames = new Set(roadmap.companyEvidence.map((match) => match.skillName.toLocaleLowerCase()))
      const taskSkills = roadmap.roleSkills.filter((item) => matchedNames.has(item.name.toLocaleLowerCase()))
      const taskSkillRules = (taskSkills.length ? taskSkills : roadmap.roleSkills.filter((item) => item.priority === 'Core')).map((item) => ({ id: item.name, name: item.name, terms: [item.name] }))
      const tasks = createTasks(taskSkillRules)
      const result: WorkspaceState = {
        ...workspace,
        companyName: workspace.companyName.trim(),
        roleName: workspace.roleName.trim(),
        generated: true,
        generatedRoadmap: roadmap,
        completedPhases: [],
        tasks,
        demoContent: false,
      }
      setWorkspace(result)
      setActiveTaskId(tasks[0]?.id ?? '')
      setComparison(null)
      setGenerating(false)
      setFeedback(`${roadmap.roleSkills.length} role-family skills and an ${workspace.durationMonths}-month roadmap are ready. No company requirements were independently verified.`)
    }, 40)
  }

  function updateProfile(patch: Partial<WorkspaceState>) {
    setWorkspace((current) => ({ ...current, ...patch, generated: false, generatedRoadmap: null, completedPhases: [] }))
    setComparison(null)
  }

  function compareWithRoadmap() {
    if (!workspace.generatedRoadmap || !compareCompany.trim() || !compareRole.trim()) return
    const second = generateCareerRoadmap({
      company: compareCompany.trim(),
      role: compareRole.trim(),
      education: workspace.education,
      currentSkills: workspace.currentSkills,
      experience: workspace.experience,
      durationMonths: workspace.durationMonths,
      jobDescription: '',
      sourceUrl: '',
    })
    setComparison({ first: workspace.generatedRoadmap, second })
  }

  function saveRoadmap() {
    if (!workspace.generatedRoadmap) return
    const savedRoadmaps = [workspace.generatedRoadmap, ...workspace.savedRoadmaps.filter((saved) => !(saved.company === workspace.companyName && saved.role === workspace.roleName))].slice(0, 10)
    updateWorkspace({ savedRoadmaps })
    setFeedback('Roadmap saved in this browser.')
  }

  function openSavedRoadmap() {
    const saved = workspace.savedRoadmaps[Number(savedRoadmapIndex)]
    if (!saved) return
    if (workspace.tasks.some((task) => task.complete || task.response.trim() || task.link.trim())) {
      const replaceWork = window.confirm('Opening this saved roadmap replaces the current seven-day tasks. Export your data first if you want to keep them. Continue?')
      if (!replaceWork) return
    }
    const skillNames = new Set(saved.companyEvidence.map((match) => match.skillName.toLocaleLowerCase()))
    const savedSkills = saved.roleSkills.filter((item) => skillNames.has(item.name.toLocaleLowerCase()))
    const tasks = createTasks((savedSkills.length ? savedSkills : saved.roleSkills.filter((item) => item.priority === 'Core')).map((item) => ({ id: item.name, name: item.name, terms: [item.name] })))
    setWorkspace((current) => ({
      ...current,
      companyName: saved.company,
      roleName: saved.role,
      experience: saved.experience,
      durationMonths: saved.durationMonths,
      generated: true,
      generatedRoadmap: saved,
      completedPhases: [],
      tasks,
      demoContent: false,
    }))
    setActiveTaskId(tasks[0]?.id ?? '')
    setComparison(null)
    setFeedback(`Opened saved roadmap for ${saved.company} · ${saved.role}.`)
  }

  function togglePhase(phaseTitle: string) {
    const completedPhases = workspace.completedPhases.includes(phaseTitle)
      ? workspace.completedPhases.filter((title) => title !== phaseTitle)
      : [...workspace.completedPhases, phaseTitle]
    updateWorkspace({ completedPhases })
  }

  function updateTask(taskId: string, patch: Partial<PracticeTask>) {
    setWorkspace((current) => ({
      ...current,
      tasks: current.tasks.map((task) => task.id === taskId ? { ...task, ...patch } : task),
    }))
  }

  function toggleTask(task: PracticeTask) {
    if (!task.complete) {
      const hasResponse = Boolean(task.response.trim() || Object.values(task.star ?? {}).some((part) => part.trim()))
      let validLink = false
      if (task.link.trim()) {
        try {
          const parsed = new URL(task.link)
          validLink = parsed.protocol === 'https:' || parsed.protocol === 'http:'
        } catch {
          validLink = false
        }
      }
      if (!hasResponse && !validLink) {
        setFeedback('Add a short reflection or a valid http(s) link before completing this task.')
        return
      }
      if (task.link.trim() && !validLink) {
        setFeedback('That link needs to start with http:// or https://.')
        return
      }
    }
    updateTask(task.id, { complete: !task.complete })
    setFeedback(task.complete ? 'Task reopened.' : `Day ${task.day} saved as complete.`)
  }

  function updateSkill(skillId: string, patch: Partial<SkillRule>) {
    updateWorkspace({ skills: workspace.skills.map((skill) => skill.id === skillId ? { ...skill, ...patch } : skill) })
  }

  function addSkill() {
    const name = newSkillName.trim()
    const terms = newSkillTerms.split(',').map((term) => term.trim()).filter(Boolean)
    if (!name || !terms.length) {
      setFeedback('Enter a skill name and at least one match phrase.')
      return
    }
    const id = `skill-${Date.now()}`
    updateWorkspace({ skills: [...workspace.skills, { id, name, terms }] })
    setNewSkillName('')
    setNewSkillTerms('')
    setFeedback(`${name} added to your local matching list.`)
  }

  function exportWorkspace() {
    const blob = new Blob([JSON.stringify({ product: 'ProofPath', exportedAt: new Date().toISOString(), ...workspace }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'proofpath-workspace.json'
    anchor.click()
    URL.revokeObjectURL(url)
    setFeedback('Your browser downloaded a JSON export of this workspace.')
  }

  function resetWorkspace() {
    if (!window.confirm('Reset this demo? Your saved plan and reflections in this browser will be deleted.')) return
    const clean = emptyWorkspace()
    setWorkspace(clean)
    setSampleChoice('')
    setActiveTaskId('')
    setFeedback('Workspace reset. Choose a sample role to start again.')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Main navigation">
        <a className="brand" href="#overview" aria-label="ProofPath home">
          <span className="brand-mark"><Check size={19} strokeWidth={2.7} /></span>
          <span>proofpath<span className="brand-period">.</span></span>
        </a>
        <div className="workspace-label">YOUR WORKSPACE</div>
        <nav className="side-nav">
          <a className="nav-link active" href="#overview"><BriefcaseBusiness size={17} /> Role brief</a>
          <a className="nav-link" href="#plan"><ClipboardCheck size={17} /> 7-day plan</a>
          <a className="nav-link" href="#evidence"><FileText size={17} /> Your evidence</a>
        </nav>
        <div className="sidebar-bottom">
          <div className="privacy-mark"><span className="privacy-dot" /> Stored on this device</div>
          <p>Your notes stay in this browser. Nothing is sent to a ProofPath account.</p>
          <button className="sidebar-reset" type="button" onClick={resetWorkspace}><RotateCcw size={15} /> Reset demo</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">STUDENT WORKSPACE <span>/</span> PREPARATION</div>
          <div className="topbar-actions">
            <span className="local-status"><span /> Saved locally</span>
            <button className="button button-quiet export-button" type="button" onClick={exportWorkspace}>
              <ArrowDownToLine size={16} /> <span>Export data</span>
            </button>
          </div>
        </header>

        <div className="content-wrap">
          <section className="page-intro" id="overview">
            <div className="intro-copy">
              <span className="eyebrow"><span className="eyebrow-line" /> YOUR NEXT ROLE, MADE PRACTICAL</span>
              <h1>Make the role<br className="desktop-break" /> less of a guess.</h1>
              <p>Turn a job description into a week of focused practice, and keep the examples you can talk about later.</p>
            </div>
            <div className="intro-note"><span className="note-number">01</span><span>Start with a role.<br />Finish with proof.</span><ArrowRight size={18} /></div>
          </section>

          <section className="brief-panel" aria-labelledby="brief-title">
            <div className="section-head brief-head">
              <div className="section-title-wrap">
                <span className="section-icon"><BriefcaseBusiness size={17} /></span>
                <div><div className="section-kicker">STEP 01 <span>ROLE BRIEF</span></div><h2 id="brief-title">What are you preparing for?</h2></div>
              </div>
              <span className="demo-tag"><span /> SAMPLE CONTENT, NOT A REAL LISTING</span>
            </div>

            <div className="brief-grid">
              <div className="role-inputs">
                <div className="field-row">
                  <label className="field-label" htmlFor="target-company">Target company</label>
                  <div className="autocomplete-input"><Building2 size={16} /><input id="target-company" className="text-input" list="company-suggestions" autoComplete="organization" value={workspace.companyName} onChange={(event) => { updateProfile({ companyName: event.target.value, demoContent: false }); setSampleChoice('') }} placeholder="Any company, e.g. Capgemini" /><datalist id="company-suggestions">{suggestCompanies(workspace.companyName).map((company) => <option key={company} value={company} />)}</datalist></div>
                </div>
                <div className="field-row">
                  <label className="field-label" htmlFor="role-title">Target job role</label>
                  <div className="autocomplete-input"><Search size={16} /><input id="role-title" className="text-input" list="role-suggestions" autoComplete="organization-title" value={workspace.roleName} onChange={(event) => { updateProfile({ roleName: event.target.value, demoContent: false }); setSampleChoice('') }} placeholder="Search or type any job title" /><datalist id="role-suggestions">{suggestRoles(workspace.roleName).map((role) => <option key={role} value={role} />)}</datalist></div>
                  <p className="field-hint">Suggestions are starting points. Any company or job title is accepted.</p>
                </div>
                <div className="profile-grid">
                  <div className="field-row"><label className="field-label" htmlFor="education-level">Current education</label><div className="autocomplete-input"><GraduationCap size={16} /><input id="education-level" className="text-input" autoComplete="off" value={workspace.education} onChange={(event) => updateProfile({ education: event.target.value })} placeholder="e.g. B.Tech CSE, 3rd year" /></div></div>
                  <div className="field-row"><label className="field-label" htmlFor="experience-level">Experience level</label><div className="select-wrap"><select id="experience-level" className="text-input" value={workspace.experience} onChange={(event) => updateProfile({ experience: event.target.value })}><option>Beginner</option><option>Intermediate</option><option>Experienced</option></select><ChevronDown size={16} /></div></div>
                  <div className="field-row"><label className="field-label" htmlFor="preparation-time">Preparation time</label><div className="select-wrap"><select id="preparation-time" className="text-input" value={workspace.durationMonths} onChange={(event) => updateProfile({ durationMonths: Number(event.target.value) })}><option value={1}>1 month</option><option value={3}>3 months</option><option value={6}>6 months</option><option value={12}>12 months</option></select><ChevronDown size={16} /></div></div>
                  <div className="field-row"><label className="field-label" htmlFor="current-skills">Current skills</label><input id="current-skills" className="text-input" value={workspace.currentSkills} onChange={(event) => updateProfile({ currentSkills: event.target.value })} placeholder="Python basics, teamwork, Excel" /></div>
                </div>
                <div className="field-row">
                  <label className="field-label" htmlFor="sample-role">Or start with a sample role</label>
                  <div className="select-wrap"><select id="sample-role" className="text-input" value={sampleChoice} onChange={(event) => { if (event.target.value) loadSample(event.target.value) }}>
                    <option value="">Choose a sample role</option>
                    <option value="software">Software intern · demo</option>
                    <option value="data">Data analyst intern · demo</option>
                    <option value="marketing">Marketing intern · demo</option>
                  </select><ChevronDown size={16} /></div>
                </div>
                <div className="field-row description-field">
                  <div className="label-inline"><label className="field-label" htmlFor="job-description">Optional job description</label><span>{workspace.jobDescription.length} characters</span></div>
                  <textarea id="job-description" className="text-input job-textarea" value={workspace.jobDescription} onChange={(event) => updateProfile({ jobDescription: event.target.value, demoContent: false })} placeholder="Paste the responsibilities and qualifications here..." rows={6} />
                  <p className="field-hint">Used for phrase matches only. It is not sent to an external service or independently verified.</p>
                </div>
                <div className="field-row">
                  <label className="field-label" htmlFor="source-url">Optional source URL for your job description</label>
                  <input id="source-url" className="text-input" type="url" value={workspace.sourceUrl} onChange={(event) => updateProfile({ sourceUrl: event.target.value })} placeholder="https://careers.example.com/job-posting" />
                </div>
                <div className="brief-actions">
                  <button className="button button-primary" type="button" onClick={buildPlan} disabled={generating}>{generating ? <span className="button-spinner" /> : <Sparkles size={16} />} {generating ? 'Building roadmap…' : 'Generate career roadmap'} <ArrowRight size={16} /></button>
                  <button className="button button-text" type="button" onClick={() => loadSample('software', true)}><BookOpen size={16} /> Load software intern demo</button>
                </div>
                {feedback && <p className="feedback" role="status" aria-live="polite">{feedback}</p>}
              </div>

              <div className="skill-panel">
                <div className="skill-panel-head">
                  <div><span className="mini-heading">TRANSPARENT SKILL MATCHES</span><p>Phrase matches from your brief</p></div>
                  <button className="edit-rules-button" type="button" onClick={() => setEditingSkills(!editingSkills)} aria-expanded={editingSkills}>{editingSkills ? 'Done' : 'Edit list'} <ChevronDown size={14} className={editingSkills ? 'chevron-open' : ''} /></button>
                </div>
                {!workspace.jobDescription.trim() ? (
                  <div className="match-empty"><Target size={19} /><p>Add a role brief to see which skill phrases match.</p></div>
                ) : matchedSkills.length ? (
                  <ul className="match-list">{matchedSkills.map(({ skill, matches }) => <li key={skill.id}><span className="match-check"><Check size={12} /></span><span className="match-name">{skill.name}</span><span className="match-phrases">{matches.join(', ')}</span></li>)}</ul>
                ) : (
                  <div className="match-empty"><Target size={19} /><p>No phrases matched yet. You can still build a general plan, or edit the list.</p></div>
                )}
                <div className="match-legend"><span className="legend-swatch" /> Matching is case-insensitive and phrase-boundary aware.</div>
                {editingSkills && <div className="rules-editor">
                  <p className="rules-help">Each row is a skill and its trigger phrases. Changes stay in this browser.</p>
                  {workspace.skills.map((skill) => <div className="rule-row" key={skill.id}>
                    <input aria-label={`Skill name for ${skill.name}`} value={skill.name} onChange={(event) => updateSkill(skill.id, { name: event.target.value })} />
                    <input aria-label={`Match phrases for ${skill.name}`} value={skill.terms.join(', ')} onChange={(event) => updateSkill(skill.id, { terms: event.target.value.split(',').map((term) => term.trim()) })} />
                    <button className="icon-button remove-rule" type="button" aria-label={`Remove ${skill.name}`} onClick={() => updateWorkspace({ skills: workspace.skills.filter((entry) => entry.id !== skill.id) })}><Trash2 size={15} /></button>
                  </div>)}
                  <div className="add-rule-row"><input aria-label="New skill name" value={newSkillName} onChange={(event) => setNewSkillName(event.target.value)} placeholder="Skill name" /><input aria-label="New skill match phrases" value={newSkillTerms} onChange={(event) => setNewSkillTerms(event.target.value)} placeholder="phrases, separated, by commas" /><button className="icon-button add-rule" type="button" aria-label="Add skill" onClick={addSkill}><Plus size={17} /></button></div>
                </div>}
              </div>
            </div>
          </section>

          {workspace.generated && <>
            {workspace.generatedRoadmap && <div className="roadmap-toolbar"><span><Target size={15} /> {workspace.generatedRoadmap.company} · {workspace.generatedRoadmap.role}</span><div className="roadmap-toolbar-actions">{workspace.savedRoadmaps.length > 0 && <><select aria-label="Saved roadmaps" className="saved-roadmap-select" value={savedRoadmapIndex} onChange={(event) => setSavedRoadmapIndex(event.target.value)}><option value="">Saved roadmaps</option>{workspace.savedRoadmaps.map((saved, index) => <option key={`${saved.company}-${saved.role}-${index}`} value={index}>{saved.company} · {saved.role}</option>)}</select><button type="button" className="button button-quiet" disabled={savedRoadmapIndex === ''} onClick={openSavedRoadmap}>Open</button></>}<button type="button" className="button button-quiet" onClick={saveRoadmap}><CheckCircle2 size={15} /> Save roadmap</button></div></div>}
            {workspace.generatedRoadmap && <RoadmapResults
              roadmap={workspace.generatedRoadmap}
              compareCompany={compareCompany}
              compareRole={compareRole}
              comparison={comparison}
              onCompareFieldChange={(field, value) => field === 'company' ? setCompareCompany(value) : setCompareRole(value)}
              onCompare={compareWithRoadmap}
              completedPhases={workspace.completedPhases}
              onTogglePhase={togglePhase}
            />}
            <div className="plan-overview" id="plan">
              <section className="plan-heading">
                <div className="plan-label"><span className="section-icon plan-icon"><ClipboardCheck size={17} /></span><div><div className="section-kicker">STEP 02 <span>YOUR PRACTICE PLAN</span></div><h2>A week for <em>{workspace.roleName || 'your next role'}</em></h2></div></div>
                <div className="plan-meta"><span className="demo-tag"><span /> {workspace.demoContent ? 'SAMPLE ROLE · DEMO' : 'YOUR PLAN'}</span><span>7 days · about 20–30 min a day</span></div>
              </section>

              <div className="plan-layout">
                <section className="task-list" aria-label="Seven day preparation plan">
                  <div className="task-list-intro"><span>THE WEEK</span><span>{completedCount} OF 7 COMPLETE</span></div>
                  {workspace.tasks.map((task) => {
                    const taskSkills = task.skillIds.map((id) => workspace.skills.find((skill) => skill.id === id)?.name).filter((name): name is string => Boolean(name))
                    const isOpen = activeTaskId === task.id
                    const star = task.star ?? { situation: '', task: '', action: '', result: '' }
                    return <article className={`task-card${isOpen ? ' task-open' : ''}${task.complete ? ' task-complete' : ''}`} key={task.id}>
                      <button className="task-toggle" type="button" aria-expanded={isOpen} onClick={() => setActiveTaskId(isOpen ? '' : task.id)}>
                        <span className={`day-mark${task.complete ? ' day-mark-done' : ''}`}>{task.complete ? <Check size={15} /> : String(task.day).padStart(2, '0')}</span>
                        <span className="task-title-group"><span className="task-day">DAY {String(task.day).padStart(2, '0')}{taskSkills.length > 0 && <span className="task-skill-tag">{taskSkills.join(' · ')}</span>}</span><strong>{task.title}</strong></span>
                        {task.complete ? <CheckCircle2 className="task-status done" size={19} /> : <Circle className="task-status" size={19} />}
                        <ChevronDown className={`task-chevron${isOpen ? ' task-chevron-open' : ''}`} size={17} />
                      </button>
                      {isOpen && <div className="task-detail">
                        <p className="task-goal">{task.goal}</p>
                        {task.day === 7 ? <>
                          <div className="star-grid">{STAR_PARTS.map((part) => {
                            const passes = star[part.key].trim().length >= 20
                            return <label className="star-field" key={part.key}><span className="star-label">{part.label}<span className={passes ? 'rubric-pass' : 'rubric-pending'}>{passes ? 'Ready' : 'Add detail'}</span></span><textarea value={star[part.key]} onChange={(event) => updateTask(task.id, { star: { ...star, [part.key]: event.target.value } })} placeholder={part.prompt} rows={3} aria-label={`${part.label} for your interview example`} /></label>
                          })}</div>
                          <div className="rubric-note"><ClipboardCheck size={15} /><span>Quick review: aim for at least 20 characters in each section. Make your action specific and your result concrete.</span></div>
                        </> : <label className="response-field"><span>Your notes</span><textarea value={task.response} onChange={(event) => updateTask(task.id, { response: event.target.value })} placeholder="Capture what you tried, what you learned, or the example you want to remember..." rows={4} /></label>}
                        <label className="response-field link-field"><span>Link to your work <span className="optional-label">OPTIONAL</span></span><span className="link-input-wrap"><LinkIcon size={15} /><input type="url" value={task.link} onChange={(event) => updateTask(task.id, { link: event.target.value })} placeholder="https://" /></span></label>
                        <div className="task-actions"><button type="button" className={`button ${task.complete ? 'button-complete' : 'button-primary'}`} onClick={() => toggleTask(task)}>{task.complete ? <><Check size={16} /> Completed · reopen</> : <><Check size={16} /> Mark complete</>}</button><span className="autosave-note">Saved automatically on this device</span></div>
                      </div>}
                    </article>
                  })}
                </section>

                <aside className="progress-column" aria-label="Preparation progress">
                  <section className="progress-panel">
                    <div className="panel-overline"><span>YOUR PROGRESS</span><Target size={16} /></div>
                    <div className="progress-count"><strong>{completedCount}<span> / 7</span></strong><span>days practised</span></div>
                    <div className="progress-track" role="progressbar" aria-label="Practice days completed" aria-valuenow={completedCount} aria-valuemin={0} aria-valuemax={7}><span style={{ width: `${completedCount / 7 * 100}%` }} /></div>
                    <p className="progress-caption">A record of practice, not a prediction of hiring outcomes.</p>
                    <div className="progress-divider" />
                    <div className="saved-skills-head"><span>SKILLS WITH EXAMPLES</span><strong>{savedSkillIds.size}</strong></div>
                    {matchedSkills.length ? <ul className="saved-skill-list">{matchedSkills.map(({ skill }) => {
                      const evidenceCount = completedTasks.filter((task) => task.skillIds.includes(skill.id)).length
                      return <li key={skill.id}><span className={evidenceCount ? 'skill-dot has-evidence' : 'skill-dot'} /> <span>{skill.name}</span><span className="evidence-count">{evidenceCount || '—'}</span></li>
                    })}</ul> : <p className="progress-empty">No matched skills to track yet.</p>}
                  </section>
                  <div className="side-tip"><span className="tip-icon"><Sparkles size={16} /></span><p><strong>Small beats perfect.</strong> One honest example is easier to remember than a week of tabs left open.</p></div>
                </aside>
              </div>
            </div>

            <section className="evidence-section" id="evidence">
              <div className="evidence-heading"><div><div className="section-kicker">STEP 03 <span>KEEP YOUR PROOF</span></div><h2>Examples worth keeping.</h2></div><span className="evidence-count-label">{completedCount} saved {completedCount === 1 ? 'example' : 'examples'}</span></div>
              {completedTasks.length ? <div className="evidence-grid">{completedTasks.map((task) => {
                const skillsForTask = task.skillIds.map((id) => workspace.skills.find((skill) => skill.id === id)?.name).filter((name): name is string => Boolean(name))
                const note = task.day === 7 ? STAR_PARTS.map((part) => task.star?.[part.key] ? `${part.label}: ${task.star[part.key]}` : '').filter(Boolean).join(' ') : task.response
                return <article className="evidence-item" key={task.id}><div className="evidence-item-top"><span className="evidence-day">DAY {String(task.day).padStart(2, '0')}</span><CheckCircle2 size={16} /></div><h3>{task.title}</h3><p>{note || 'Work link saved for this practice task.'}</p>{task.link && <a href={task.link} target="_blank" rel="noreferrer"><LinkIcon size={14} /> View your work</a>}{skillsForTask.length > 0 && <div className="evidence-skill-tags">{skillsForTask.map((skill) => <span key={skill}>{skill}</span>)}</div>}</article>
              })}</div> : <div className="evidence-empty"><div className="empty-icon"><FileText size={20} /></div><div><strong>Your examples will collect here.</strong><p>Write a note or add a work link to a practice task, then mark it complete.</p></div><a href="#plan">Go to your plan <ArrowRight size={15} /></a></div>}
            </section>
          </>}

          {!workspace.generated && <section className="first-run-note"><span className="first-run-icon"><ArrowRight size={18} /></span><div><strong>Start with any company and any role.</strong><p>Enter a company and target title, then add your education, current skills, and preparation time. A real posting helps tailor the role guidance. Sample descriptions are clearly marked demo content; no company requirements are invented or verified.</p></div></section>}

          <footer className="page-footer"><span>PROOFPATH <span className="footer-dot">/</span> PRACTICE WITH INTENTION</span><span>Private to this browser · No account required</span></footer>
        </div>
      </main>
    </div>
  )
}

export default App
