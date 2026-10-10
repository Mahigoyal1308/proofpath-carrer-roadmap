import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  CircleAlert,
  ExternalLink,
  Layers3,
  Target,
} from 'lucide-react'
import { compareRoadmaps, type CareerRoadmap } from './roadmap'

type CompareFields = { company: string; role: string }

type RoadmapResultsProps = {
  roadmap: CareerRoadmap
  compareCompany: string
  compareRole: string
  comparison: { first: CareerRoadmap; second: CareerRoadmap } | null
  onCompareFieldChange: (field: keyof CompareFields, value: string) => void
  onCompare: () => void
  completedPhases: string[]
  onTogglePhase: (phaseTitle: string) => void
}

function safeHttpUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : ''
  } catch {
    return ''
  }
}

function RoadmapResults({
  roadmap,
  compareCompany,
  compareRole,
  comparison,
  onCompareFieldChange,
  onCompare,
  completedPhases,
  onTogglePhase,
}: RoadmapResultsProps) {
  const comparedSkills = comparison ? compareRoadmaps(comparison.first, comparison.second) : null
  const evidenceLink = safeHttpUrl(roadmap.sourceUrl)
  const companyTerms = new Map(roadmap.companyEvidence.map((match) => [match.skillName.toLocaleLowerCase(), match.phrase]))

  return (
    <section className="roadmap-results" id="roadmap-results" aria-labelledby="roadmap-results-title">
      <div className="roadmap-titlebar">
        <div>
          <div className="section-kicker">PERSONALIZED ROADMAP <span>{roadmap.durationMonths} MONTHS</span></div>
          <h2 id="roadmap-results-title">{roadmap.role} <span>at</span> {roadmap.company}</h2>
          <p className="roadmap-family">{roadmap.family} · {roadmap.experience} experience</p>
        </div>
        <a href="#overview" className="regenerate-link">Edit inputs <ArrowRight size={14} /></a>
      </div>

      <div className="evidence-status" role="status">
        <CircleAlert size={18} />
        <div>
          <strong>Company-specific requirements are not independently verified.</strong>
          <p>{roadmap.sourceStatus} Role technologies and learning steps are recommendations for this role family, not claims about the employer.</p>
          {evidenceLink && <a href={evidenceLink} target="_blank" rel="noreferrer">Open the source you supplied <ExternalLink size={13} /></a>}
        </div>
      </div>

      <section className="roadmap-section overview-section">
        <div className="roadmap-section-heading"><span className="roadmap-step">01</span><div><h3>Company and role overview</h3><p>Role guidance, not an employer-confirmed job profile</p></div></div>
        <p className="overview-copy">{roadmap.overview}</p>
        <div className="overview-columns">
          <div><h4>Typical responsibilities</h4><ul>{roadmap.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div><h4>Entry-level foundations</h4><ul>{roadmap.entryRequirements.map((item) => <li key={item}>{item}</li>)}</ul></div>
        </div>
      </section>

      <section className="roadmap-section skills-section">
        <div className="roadmap-section-heading"><span className="roadmap-step">02</span><div><h3>Technologies and skills</h3><p>Each item is labeled by its evidence source</p></div></div>
        <div className="evidence-legend"><span className="legend-listing">Pasted listing match · unverified</span><span className="legend-guidance">Role-family guidance</span><span className="legend-recommendation">Additional recommendation</span></div>
        <div className="roadmap-skill-grid">{roadmap.roleSkills.map((item) => {
          const matchedPhrase = companyTerms.get(item.name.toLocaleLowerCase())
          const fromListing = Boolean(matchedPhrase)
          const recommendationClass = item.priority === 'Stretch' ? 'skill-source-recommendation' : 'skill-source-guidance'
          return <article className="roadmap-skill" key={item.name}>
            <div className="roadmap-skill-top"><strong>{item.name}</strong><span className={`priority-tag priority-${item.priority.toLocaleLowerCase()}`}>{item.priority}</span></div>
            <p>{item.explanation}</p>
            <span className={`skill-source ${fromListing ? 'skill-source-listing' : recommendationClass}`}>{fromListing ? `Matched “${matchedPhrase}” · not verified` : item.priority === 'Stretch' ? 'Additional recommendation' : 'Role-family guidance'}</span>
          </article>
        })}</div>
        {roadmap.companyEvidence.length > 0 && <p className="listing-match-note">Phrases matched from your supplied description: {roadmap.companyEvidence.map((match) => `“${match.phrase}”`).join(', ')}. These matches are not an independent verification of the employer or listing.</p>}
      </section>

      <section className="roadmap-section phases-section">
        <div className="roadmap-section-heading"><span className="roadmap-step">03</span><div><h3>Your learning roadmap</h3><p>Eight adaptable phases · estimated activities total about {roadmap.durationMonths} months</p></div></div>
        <div className="phase-list">{roadmap.phases.map((phase, index) => {
          const isComplete = completedPhases.includes(phase.title)
          return <details className={`phase-item${isComplete ? ' phase-complete' : ''}`} key={phase.title} open={index === 0}>
            <summary><span className="phase-number">{String(index + 1).padStart(2, '0')}</span><span className="phase-summary"><strong>{phase.title}</strong><span>{phase.duration} · {phase.outcome}</span></span><ChevronDown className="phase-chevron" size={17} /></summary>
            <div className="phase-detail">
              <p>{phase.objective}</p>
              <div className="phase-detail-grid">
                <div><h4>Topics and tools</h4><p>{[...phase.topics, ...phase.tools].join(' · ')}</p></div>
                <div><h4>Prerequisite</h4><p>{phase.prerequisite}</p></div>
              </div>
              <div className="phase-exercise"><span>PRACTISE</span><p>{phase.exercise}</p></div>
              <p className="phase-outcome"><strong>Measurable outcome:</strong> {phase.outcome}</p>
              <a className="resource-link" href={phase.resource.url} target="_blank" rel="noreferrer"><BookOpen size={14} /> {phase.resource.label} <ExternalLink size={12} /></a>
              <label className="phase-check"><input type="checkbox" checked={isComplete} onChange={() => onTogglePhase(phase.title)} /> <span>{isComplete ? 'Phase marked complete' : 'Mark this phase complete'}</span></label>
            </div>
          </details>
        })}</div>
      </section>

      <section className="roadmap-section projects-section">
        <div className="roadmap-section-heading"><span className="roadmap-step">04</span><div><h3>Projects for this role</h3><p>Adapt these ideas to a problem you care about; do not claim unmeasured results.</p></div></div>
        <div className="roadmap-project-grid">{roadmap.projects.map((project) => <article className="roadmap-project" key={project.title}>
          <div className="project-title-row"><h4>{project.title}</h4><span>{project.difficulty}</span></div>
          <p>{project.problem}</p>
          <div><strong>Suggested stack</strong><span>{project.stack.join(' · ') || 'Choose tools from the actual role description'}</span></div>
          <div><strong>Demonstrates</strong><span>{project.skills.join(' · ')}</span></div>
          <ul>{project.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
          <blockquote>{project.resumeLine}</blockquote>
          <span className="github-expectation"><Layers3 size={14} /> Include a README, setup steps, screenshots or sample output, tests where relevant, and known limitations.</span>
        </article>)}</div>
      </section>

      <div className="roadmap-two-column">
        <section className="roadmap-section interview-section">
          <div className="roadmap-section-heading"><span className="roadmap-step">05</span><div><h3>Interview preparation</h3><p>General practice; no company stages were retrieved</p></div></div>
          <div className="interview-note"><CircleAlert size={15} /> Company-specific stages and eligibility are not confirmed in this prototype.</div>
          <ul className="roadmap-bullet-list">{roadmap.interviewTopics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
          <h4>Mock practice</h4><p className="compact-copy">Explain one project in two minutes, answer a role scenario aloud, then review for clear reasoning, evidence, trade-offs, and what you would improve.</p>
        </section>

        <section className="roadmap-section resume-section">
          <div className="roadmap-section-heading"><span className="roadmap-step">06</span><div><h3>Resume and portfolio</h3><p>Truthful evidence over keyword stuffing</p></div></div>
          <h4>Keywords to consider</h4>
          <div className="keyword-list">{roadmap.resumeKeywords.map((keyword) => <span key={keyword}>{keyword}</span>)}</div>
          <h4>Portfolio checklist</h4>
          <ul className="roadmap-bullet-list"><li>Show a relevant project and your specific contribution.</li><li>Explain the problem, decisions, tools, and limitations.</li><li>Add a working link and concise setup instructions.</li><li>List certifications only if completed; they are optional and do not replace project evidence.</li></ul>
          <p className="resume-warning">Do not add skills, outcomes, qualifications, or experience you do not have.</p>
        </section>
      </div>

      <section className="roadmap-section assessment-section">
        <div className="roadmap-section-heading"><span className="roadmap-step">07</span><div><h3>Skills and next steps</h3><p>A transparent coverage check, not a hiring prediction</p></div></div>
        <div className="assessment-layout">
          <div className="coverage-card"><div className="coverage-label"><Target size={16} /> CURRENT SKILL COVERAGE</div><strong>{roadmap.coverage}%</strong><span>{roadmap.coverageLabel}</span><div className="coverage-track"><i style={{ width: `${roadmap.coverage}%` }} /></div><p>Calculated as {roadmap.existingSkills.length} recognized role-family skill(s) divided by {roadmap.roleSkills.length} suggested skills. Self-reported matches only; it does not measure proficiency or predict hiring.</p></div>
          <div className="assessment-columns"><div><h4>Skills you entered</h4>{roadmap.existingSkills.length ? <ul>{roadmap.existingSkills.map((item) => <li key={item}><Check size={13} /> {item}</li>)}</ul> : <p>No current skills entered yet.</p>}</div><div><h4>Suggested priorities to learn</h4>{roadmap.priorityGaps.length ? <ul>{roadmap.priorityGaps.map((item) => <li key={item}><span className="priority-dot" /> {item}</li>)}</ul> : <p>No gaps from the current checklist. Continue practising and collect feedback.</p>}</div></div>
        </div>
      </section>

      <section className="roadmap-section compare-section">
        <div className="roadmap-section-heading"><span className="roadmap-step"><Layers3 size={16} /></span><div><h3>Compare companies or roles</h3><p>Compare role-family guidance only; company requirements remain unverified.</p></div></div>
        <div className="compare-form">
          <label><span>Company</span><input value={compareCompany} onChange={(event) => onCompareFieldChange('company', event.target.value)} placeholder="Any company" /></label>
          <label><span>Role</span><input value={compareRole} onChange={(event) => onCompareFieldChange('role', event.target.value)} placeholder="Any job title" /></label>
          <button className="button button-primary" type="button" onClick={onCompare} disabled={!compareCompany.trim() || !compareRole.trim()}>Compare with this roadmap</button>
        </div>
        {comparedSkills && comparison && <div className="compare-result" aria-live="polite">
          <div className="compare-heading"><h4>{comparison.first.company} · {comparison.first.role}</h4><span>and</span><h4>{comparison.second.company} · {comparison.second.role}</h4></div>
          <p className="compare-warning">This comparison uses broad role-family recommendations only. No company-specific technologies were independently verified.</p>
          <div className="compare-columns"><div><strong>Shared role skills</strong><p>{comparedSkills.shared.length ? comparedSkills.shared.join(' · ') : 'No shared items in the current skill profiles.'}</p></div><div><strong>{comparison.first.role} focus</strong><p>{comparedSkills.firstOnly.join(' · ') || 'No additional role-family items.'}</p></div><div><strong>{comparison.second.role} focus</strong><p>{comparedSkills.secondOnly.join(' · ') || 'No additional role-family items.'}</p></div></div>
        </div>}
      </section>
      <p className="roadmap-save-note"><Check size={14} /> This roadmap and phase checklist are saved locally in this browser.</p>
    </section>
  )
}

export default RoadmapResults