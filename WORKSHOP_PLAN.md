# GitHub Copilot Workshop Plan (90 Minutes)

**Workshop Title**: "Mastering GitHub Copilot: From Planning to Implementation"

**Target Audience**: Developers with basic to advanced GitHub Copilot knowledge

**Goal**: Help participants understand how GitHub Copilot can enhance their daily work, overcome reservations about AI-assisted development, and learn to use Copilot's features effectively.

---

## Learning Objectives

### All participants will learn:
- **Plan and Agent modes**: The modern workflow for AI-assisted development
- **The Plan-first workflow**: Use Plan mode → review → Agent mode implementation
- Using chat participants (@workspace, @terminal, @vscode) for context
- Context management and when to clear chat
- Creating and using .github/copilot-instructions.md and path-specific instruction files
- Building custom agents for specialized tasks
- Extending Copilot with MCP servers (Playwright example)
- Best practices for AI-assisted development

### Differentiation:
- **Beginners**: Guided exercises with specific prompts and templates
- **Advanced**: Open-ended challenges, create custom agents, explore MCP

---

## Workshop Structure & Timing

### **1. Introduction & Setup (5 minutes)**

**0-3 min**: Welcome, objectives, mindset
- "Today we learn the modern workflow: Plan → Review → Implement"
- Focus on Plan and Agent modes - the power duo for professional development
- Set expectations: Copilot accelerates good practices, doesn't replace thinking

**3-5 min**: Environment check
- Repo cloned, Copilot installed
- Quick app overview (task management app)

---

### **2. Understanding Plan and Agent Modes (15 minutes)**

#### **5-10 min: Demo - Plan and Agent Modes Overview**

**Brief mention of legacy modes** (1 min):
- GitHub Copilot has Ask and Edit modes from earlier versions
- **Ask mode**: Quick questions (still useful for learning)
- **Edit mode**: Single-file edits (less relevant with Agent mode)
- "We'll focus on the modern, powerful workflow instead"

**The two modes that matter** (4 min):

1. **Plan mode**: ⭐ Research and create implementation plans (no code changes)
   - Read-only codebase analysis
   - Creates structured implementation plans
   - Identifies open questions and ambiguities
   - Saves plans as `*.prompt.md` files
   - "The strategic mode - think before you code"

2. **Agent mode**: Autonomous multi-file implementation
   - Executes plans autonomously
   - Makes changes across multiple files
   - Handles complex, multi-step tasks
   - "The execution mode - makes the changes"

**Key message**: "Plan mode + Agent mode = the professional workflow"

#### **10-20 min: Demo - Plan Agent in Action**

Show the full workflow:

**Step 1 - Planning (Plan mode)**:
```
Prompt: "Add due dates to tasks including:
- Due date field in database
- Validation (must be future date)
- API endpoints to set/update due dates
- Display in UI with formatting"
```

- Show Plan agent researching codebase (read-only)
- Breaks down into steps
- Identifies open questions
- Creates `*.prompt.md` file

**Step 2 - Review & Refine**:
- Review the plan together
- Address open questions: "Store dates as ISO strings, validate in UTC"
- Iterate: "Add overdue task highlighting in the UI"

**Step 3 - Implementation (Agent mode)**:
- Switch to Agent mode
- Reference the plan: "Implement the due dates plan, start with step 1"
- Show Agent mode executing the plan autonomously

**Highlight**:
- Plan agent = no surprises, clear roadmap
- Agent mode = efficient execution
- You control the process, not just the code

#### **20-25 min: Demo - Chat Participants for Context**

Quick demos:
- **@workspace**: "Where is error handling currently implemented?"
  - Show in Plan mode for research
- **@terminal**: "Why did npm test fail?"
- **#file and #codebase**: Adding specific context

**Key point**: Chat participants help both Plan and Agent modes

---

### **3. Hands-on: The Plan-First Workflow (25 minutes)**

#### **25-30 min: Demo - Context Management**

- Show context window concepts
- **Critical rule**: "New feature = Clear chat = New context"
- Show how old context can derail Plan agent
- Demonstrate: Clear chat before starting Exercise 1

#### **30-45 min: Hands-on Exercise 1** (First Plan → Agent Experience)

**Task**: "Add input validation to all task endpoints"
- Title required (3-100 chars)
- Description optional (max 500 chars)
- Due date must be in future
- Proper error messages

**Instructions**:

1. **Plan mode** (5 min):
   - Use @workspace to understand current endpoints
   - Ask Plan agent to create implementation plan
   - Review the plan

2. **Refine** (2 min):
   - Ask questions if anything unclear
   - Request changes: "Use Joi for validation to match our patterns"

3. **Agent mode** (6 min):
   - Switch to Agent mode
   - "Implement the validation plan"
   - Review the changes

**Beginner support**: Provide sample prompts for each step

**Advanced challenge**: "Also add validation error logging"

**45 min: Quick Debrief** (2 min): How did planning first feel? What surprised you?

---

### **4. Project Context with Instruction Files (12 minutes)**

#### **45-52 min: Demo - Instruction Files**

**Part 1: Repository-wide Instructions (3 min)**

Open `.github/copilot-instructions.md`:
- Project overview and architecture
- General coding standards
- Tech stack and preferred libraries
- Testing approach
- Error handling patterns

**Part 2: Path-Specific Instructions (4 min)**

**Explain**: "New feature - targeted instructions for specific file patterns"

Show `.github/instructions/` directory structure:
```
.github/instructions/
  ├── database.instructions.md
  └── api.instructions.md
```

**Open example**: `.github/instructions/database.instructions.md`
```markdown
---
applyTo: "**/*.model.js,**/migrations/**"
---

# Database Instructions

## ORM & Patterns
- Use Sequelize ORM
- Always define indexes for foreign keys
- Use transactions for multi-table operations

## Migrations
- Never modify existing migrations
- Always include both up and down methods
- Use timestamps in migration filenames
```

**Open example**: `.github/instructions/api.instructions.md`
```markdown
---
applyTo: "src/routes/**,src/controllers/**"
---

# API Instructions

## Error Responses
- Always use consistent error format: {error: string, details?: object}
- Return appropriate HTTP status codes
- Log errors with request context

## Validation
- Use Joi for request validation
- Validate at controller level
- Return 400 for validation errors
```

**Part 3: Demo in Action (3 min)**

Make a request to Plan mode:
```
"Plan adding a new endpoint to get user's completed tasks"
```

Show Plan agent using:
- General guidance from `copilot-instructions.md`
- API-specific patterns from `api.instructions.md`
- Database patterns from `database.instructions.md`

**Highlight**: Copilot automatically applies the right instructions based on file patterns

**Part 4: When to Use What (2 min)**

**Use `.github/copilot-instructions.md` for**:
- Project overview and architecture
- Universal coding standards
- Tech stack and dependencies
- Team conventions (naming, comments)

**Use `.github/instructions/*.instructions.md` for**:
- Domain-specific patterns (database, API, frontend)
- Framework-specific conventions
- Layer-specific rules (controllers, services, models)

**Best Practices**:
- ✅ Keep instructions focused and non-conflicting
- ✅ Use descriptive names: `database.instructions.md`
- ✅ Use glob patterns strategically: `**/*.test.js`
- ✅ Combine both: general + specific = comprehensive guidance
- ❌ Avoid conflicting instructions between files

#### **52-57 min: Hands-on Exercise 2**

**Task**: "Add a task comments feature"
- Users can add/edit/delete comments on tasks
- Comments have author and timestamp
- Display chronologically

**Before you start**:
1. Check `.github/copilot-instructions.md` for general patterns
2. Check `.github/instructions/database.instructions.md` for DB patterns
3. Check `.github/instructions/api.instructions.md` for API patterns

**Implementation**:
1. **Plan mode**: Create implementation plan (notice how it references multiple instruction files)
2. **Agent mode**: Implement following the plan

**Watch for**:
- Database model following DB instructions
- API endpoints following API instructions
- Overall structure following general instructions

**Advanced challenge**: "Create a new instruction file for comment-specific rules"

---

### **5. Advanced Features: Custom Agents & MCP (25 minutes)**

#### **55-62 min: Demo - Custom Agents**

**Explain**: Custom agents are like Plan agent, but you define the specialty

Show `.github/agents/code-reviewer.agent.md`:
```markdown
You are a security-focused code reviewer. Review code for:
- SQL injection vulnerabilities
- XSS risks
- Input validation completeness
- Sensitive data exposure
- Error message information leakage

Reference @workspace copilot-instructions.md for our standards.
Provide specific line-by-line feedback.
```

**Demo**: `@code-reviewer review the task validation endpoints`

Show focused, specialized review

**When to create custom agents**:
- Code review (security, performance, accessibility)
- Testing (specific frameworks, edge cases)
- Documentation (API docs, user guides)
- Domain-specific tasks (API design, DB schemas)

#### **62-72 min: Hands-on Exercise 3** (Create a Custom Agent)

**Task**: Build a custom agent for one of these:

**Option 1 - Testing Agent**:
```markdown
You are a testing specialist using Playwright.
Create comprehensive E2E tests covering:
- Happy paths and edge cases
- Error scenarios
- Accessibility checks
```

**Option 2 - API Design Agent**:
```markdown
You are an API design expert.
Review APIs for:
- RESTful conventions
- Consistent error responses
- Proper status codes
- OpenAPI documentation
```

**Option 3 - Security Agent**:
```markdown
You are a security auditor.
Check for:
- Input sanitization
- SQL injection risks
- Authentication bypass
- Sensitive data in logs
```

**Instructions**:
1. Create `.github/agents/[your-agent].agent.md`
2. Write the agent definition
3. Test it on existing code
4. Refine based on results

**Beginner**: Provide complete templates to customize
**Advanced**: Build from scratch, test thoroughly

**72 min**: 1-2 people share their custom agent

#### **72-77 min: Demo - MCP Servers (Playwright)**

**Explain**: MCP = Model Context Protocol
- Gives Copilot access to external tools
- Playwright MCP = browser automation capabilities

**Show config** in sample app MCP settings

**Demo with Plan → Agent workflow**:

**Plan mode**:
```
Create a plan for E2E testing the task creation flow:
- Navigate to tasks page
- Fill in new task form
- Submit and verify task appears
- Test validation errors
```

**Agent mode** (referencing plan):
```
Implement the E2E test plan using Playwright MCP
```

Show Copilot generating Playwright test code

**Mention**: Other useful MCPs
- Filesystem operations
- Git operations
- Database queries
- External APIs

---

### **6. Capstone Exercise (10 minutes)**

#### **77-87 min: Full-Feature Implementation**

**Task**: "Add task priority system (High/Medium/Low)"

**Requirements**:
- Priority field in database
- Filter tasks by priority
- API validation
- Update UI to show priorities
- **Bonus**: Playwright E2E test

**Must use**:
- Plan mode first → create comprehensive plan
- Review and refine the plan
- Agent mode for implementation
- @workspace for understanding existing patterns
- copilot-instructions.md should guide implementation

**Complete freedom**: Apply everything learned

**Instructors**: Circulate, observe different approaches, help when stuck

---

### **7. Best Practices & Wrap-up (3 minutes)**

#### **87-90 min: The Golden Rules**

**The Workflow**:
```
Plan mode → Review → Refine → Agent mode → Verify
```

**When to use each mode**:
- **Plan**: Any multi-step feature or complex task (start here!) ⭐
- **Agent**: Executing approved plans from Plan mode
- **Custom agents**: Recurring specialized tasks with specific expertise
- **Ask/Edit** (legacy): Still available for quick questions or tiny edits, but Plan+Agent is the modern approach

**Chat Participants**:
- **@workspace**: Understanding codebase before planning
- **@terminal**: Debugging commands
- **#file**: Specific file context
- **#codebase**: Broad project context

**Best Practices**:
1. ⭐ **Plan first, always** - Use Plan mode for features
2. **Clear chat between tasks** - Fresh context matters
3. **Use instruction files** - Set standards once
   - copilot-instructions.md for general guidance
   - Path-specific files for domain-specific patterns
4. **Iterate on plans** - First plan is a draft
5. **Review everything** - AI misses edge cases
6. **Be specific** - "Add validation" → "Add Joi validation with custom error messages"
7. **Use custom agents** - For recurring specialized work

**Instruction Files Strategy**:
1. Start with copilot-instructions.md (universal project context)
2. Add path-specific files as patterns emerge
3. Keep them focused (one concern per file)
4. Use clear glob patterns
5. Avoid conflicts between files

**Mindset Shifts**:
- From "coding" to "architecting and directing"
- From "fixing bugs" to "planning solutions then executing"
- From "manual testing" to "AI-generated comprehensive tests"
- **You**: Architect and reviewer
- **Copilot**: Research assistant and implementer

**Comparison with Other Tools**:
- **GitHub Copilot**: Best integration with VS Code/JetBrains, Plan mode, enterprise features
- **Claude Code**: Excellent for exploration and complex reasoning, different agent types
- **Cursor**: Fast editing, good for quick iterations
- Each has strengths - use the right tool for the task

**Resources**:
- VS Code Copilot docs (plan mode, custom agents, MCP)
- GitHub awesome-copilot repo
- Practice daily for 2 weeks to build muscle memory

**Q&A**

---

## Materials Needed

### 1. Sample App (TaskFlow - Task Management System)

**Stack**:
- Backend: Node.js + Express
- Database: SQLite (simple, no external dependencies)
- Frontend: Basic HTML/JS or React (simple UI)
- Testing: Playwright (for E2E tests)

**Pre-built Features**:
- Task management (basic CRUD - create, read, update, delete tasks)
- Basic error handling
- Simple REST API structure

**Intentional Gaps** (for exercises):
- Due dates (used in demo)
- Input validation (Exercise 1)
- Comments feature (Exercise 2)
- Priority system (Capstone)

**Configuration Files**:
- `.github/copilot-instructions.md` - General project guidance
- `.github/instructions/database.instructions.md` - DB patterns
- `.github/instructions/api.instructions.md` - API patterns
- `.github/agents/code-reviewer.agent.md` - Security-focused reviewer
- `.github/agents/tester.agent.md` - Playwright testing agent
- MCP configuration for Playwright
- README.md with setup instructions

### 2. Workshop Guide (for participants)

**Contents**:
- Quick reference: Plan and Agent modes workflow
- Exercise instructions with:
  - Beginner prompts/templates
  - Advanced challenges
  - Expected outcomes
- Sample custom agent templates
- Troubleshooting common issues
- Best practices cheat sheet
- Resources and next steps

### 3. Instructor Guide

**Contents**:
- Detailed timing breakdown
- Demo scripts with example prompts
- Solution code for all exercises
- Common mistakes to watch for
- Discussion prompts for debriefs
- Backup exercises (if time permits)

### 4. Slides (Optional)

**Key Visuals**:
- Plan → Agent workflow diagram
- Legacy vs Modern modes comparison
- Decision tree: "Which mode/participant to use?"
- Instruction files structure
- Before/after examples

---

## Pre-Workshop Setup

### Participant Prerequisites:
- GitHub Copilot subscription and installed in VS Code or JetBrains IDE
- Git installed
- Node.js installed
- Basic familiarity with JavaScript/TypeScript

### Before Workshop Starts:
- Clone the sample app repository
- Run `npm install`
- Verify Copilot is working
- Quick environment check

### Instructor Setup:
- Test all demos in fresh environment
- Prepare fallback solutions if Copilot is slow
- Have example plans saved
- Test MCP configuration

---

## Success Metrics

### Participants should be able to:
- Choose the appropriate mode for different tasks
- Use Plan mode to create implementation plans
- Leverage instruction files for consistent code
- Create a basic custom agent
- Understand when to clear chat context
- Apply the Plan → Review → Implement workflow

### Behavioral Changes:
- More open to AI-assisted development
- Understand AI is a tool that amplifies skills
- Know when and how to use Copilot features
- Have confidence to experiment with Copilot in daily work

---

## Notes for Instructors

### Key Messages to Emphasize:
1. **Copilot amplifies your skills** - It doesn't replace thinking
2. **Plan before implementing** - Agent mode is powerful but needs direction
3. **Context is king** - Use @workspace, instruction files, clear chat between tasks
4. **Review everything** - AI can make mistakes, especially security and edge cases
5. **Iterate and refine** - First result might not be perfect

### Common Pitfalls to Address:
- Accepting AI code without review
- Not clearing context between tasks
- Vague prompts leading to poor results
- Overusing Agent mode without planning
- Conflicting instruction files

### Flexibility Points:
- If group is advanced, spend less time on basics, more on MCP and custom agents
- If group is struggling, provide more templates and guidance
- Adjust capstone complexity based on time and skill level
- Skip MCP demo if time is tight (nice-to-have)

---

## Post-Workshop Follow-up

### Share with Participants:
- Sample app repository (with solutions branch)
- Custom agent templates library
- Curated list of useful MCP servers
- Internal Slack/Teams channel for sharing tips
- 30-day challenge: Use Copilot daily and share learnings

### Feedback Collection:
- Quick survey: What worked? What didn't?
- Which features will you use in daily work?
- What additional training would help?

### Continuous Learning:
- Monthly "Copilot tips" session
- Internal knowledge base of custom agents
- Share success stories and patterns
- Keep instruction files updated as team learns
