# ProofPath

ProofPath is a static, browser-only career preparation prototype. Students enter any target company and job title, describe their education and current skills, choose a preparation horizon, and get role-family learning guidance plus a place to save practice and evidence. It accepts custom employers and role titles; suggestions are conveniences, not an eligibility list.

**Research status: not collected yet.** Demo descriptions are illustrative, not real job listings, research, student activity, sign-ups, or testimonials. Research templates are in [`evidence/`](evidence/). Keep results blank until real research is collected, and quote participants only with explicit permission.

## The problem

Students at any college and stage may need to prepare for a specific job or internship but be left to connect a job listing, broad learning resources, interview practice, and examples of their own work. That can cost time, make it harder to decide what to practise, and leave students without a clear way to recall useful evidence in an interview. Job boards help people find listings; course sites teach subjects; interview tools focus on rehearsal; notes and spreadsheets hold personal information. These approaches serve different purposes, and students may need to join them up themselves. This is a product hypothesis, not a validated research finding.

## What the prototype does

- Accepts any company name and any job title. Curated autocomplete suggestions include many industries and titles; users can type a company or role that is not suggested.
- Collects education, current skills, experience level, a 1/3/6/12-month preparation horizon, and optional job-description text and source URL.
- Generates an eight-phase learning roadmap, role-family skill priorities, project ideas, interview topics, resume guidance, and a self-reported skill-coverage checklist. Recommendations change by role family, experience, education context, current skills, and timeframe.
- Labels role-family guidance separately from phrases found in user-pasted listing text. A source URL is displayed as a link only; the app does not fetch it or verify it.
- Retains the original seven-day task workflow, STAR interview task, evidence notes/links, browser progress, saved roadmaps, JSON export, and reset.
- Supports comparison of any two company/role inputs. Comparisons currently compare role-family recommendations, not verified employer technologies.

## Company data and accuracy

This project has no backend, database, search integration, AI integration, or company-career-page retrieval. The browser app does **not** attempt a live lookup. Adding a source URL does not retrieve or inspect that page. It cannot verify that a company has a role, confirm requirements, technology stacks, eligibility, or interview stages.

The roadmap engine uses local role-family guidance and a finite set of broad skill profiles. If job-description text is pasted, it checks whether selected profile skill names occur in that text. Such a phrase match is labeled as **found in pasted text · not verified**; it does not prove that the text is authentic, current, or from the named employer. All other technology guidance is labeled role-family guidance or additional recommendation. If evidence is unavailable, the interface says so instead of inventing employer-specific facts.

The suggestions cover common technical, business, design, operations, finance, marketing, and other job titles. They are not exhaustive. Unknown titles remain usable and get a general custom-role roadmap; their recommendations may be less relevant until an actual job description is supplied. The prototype does not claim every role exists at every company.

## Run locally

Prerequisites: Node.js 20.19+ or 22.12+ and npm (Vite 8 requirement).

```sh
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`. Run `npm run build` for a production static build and `npm run preview` to inspect it locally.

## Try the demo

1. Choose **Load software intern demo** for an illustrative sample and a ready-to-explore practice week, or choose another clearly marked sample role.
2. Enter any company and role, add education/current skills, select experience and preparation time, and optionally paste an actual job description. A supplied source link is not fetched.
3. Generate the roadmap. Review the unverified-company-data notice and the source labels on each skill.
4. Open phases, mark completed phases, write a seven-day task reflection, and save a task with a work link. Day seven includes a STAR writing rubric.
5. Save a roadmap to reopen it later in the same browser. Export JSON before changing plans if you want an independent backup; reset clears local workspace data.

The sample job description uses a generic sample employer and is demo content. It is never presented as real employer data or student activity.

## Data, persistence, and secrets

The prototype stores the current profile, generated roadmap, completed roadmap phases, practice tasks, saved roadmaps, and editable phrase rules in the visitor's browser `localStorage`. It does not collect sign-ups centrally, send data to a server, or require an account. Avoid entering sensitive information on a shared device. Browser data can be removed by clearing site storage; use JSON export for a backup. The source URL is stored as text and opened only when the user chooses its link.

**No API keys or environment variables are required.** There is no API integration. A genuine live retrieval feature would require a trustworthy permitted source, backend/proxy design where needed, source/date tracking, and appropriate security; it is not included here because this existing static project has no such service.

## Research findings

**Evidence status: not collected yet.** No student responses, interviews, actual response count, findings, or approved quotes are included. Do not report the app's demo or local visitor data as research. Use the forms in `evidence/`, document real dates and actual counts, remove identifying details, and request explicit permission before quoting.

- Actual response count: [not collected yet]
- Collection dates: [not collected yet]
- Findings from genuine responses: [not collected yet]
- Permission-approved quotes: [not collected yet]

## Short pitch

ProofPath helps students turn an open-ended career goal into a practical preparation path. It combines a target role and the student's own starting point with clear skill priorities, projects, interview practice, and saved evidence, while distinguishing role guidance from unverified company claims.

## 60-second live-demo script

“ProofPath lets a student enter any company and job title, not only choose from a preset pair. I’ll enter a target company, an AI/ML role, my current skills, and six months. The roadmap adapts its role-family topics and pacing. This static demo does not fetch company job listings, so I’ll paste a real posting if I have one; text matches are clearly marked unverified, and the source link itself is not inspected. I can expand a learning phase, mark it complete, compare another role, then save a practical exercise and a STAR example. The readiness display is just a transparent comparison of skills I entered against suggested role-family topics, not a hiring prediction. The roadmap stays in this browser and can be exported. No student research has been collected yet.”

## Known limitations

- No company/job API, web search, backend, database, or AI integration is present. The site cannot retrieve or verify current employer information, job availability, eligibility, hiring stages, or official technology requirements.
- Company name is contextual profile data, not a source of factual company tailoring. Role-family profiles and pasted text drive recommendations; company-specific differences require trusted job data that this prototype cannot fetch.
- Skill profiles and role suggestions are curated local data, not exhaustive taxonomies. Custom titles remain accepted but may receive a broad fallback plan.
- The role-family matcher and skill-coverage checklist are heuristic, not proficiency assessments. Readiness coverage counts recognized self-reported skill names; it does not predict interviews, offers, or placement.
- Learning plans and projects are recommendations, not accredited instruction or professional advice. Resource links may change.
- Data exists only in the current browser profile/device. No formal accessibility, security, or student usability study has been completed.
- Research has not been collected and the project has not been deployed or validated by students.

## Public URL

Not deployed yet. Add the actual public URL here after deployment: **[add deployed URL]**

## Deploy as a static site

The production output is `dist/`. Build with `npm run build`, then publish that directory on any static host. Typical Git-connected settings are `npm install` for installation, `npm run build` for build, and `dist` for the output directory. No server or secrets are needed. Add a public URL only after deployment is live.

## Checks

```sh
npm run build
npm run lint
```
