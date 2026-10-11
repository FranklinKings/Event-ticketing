# AI Collaboration Log

## Build 1: Domain Core in the Terminal

---

### Prompt 1: Project Setup & Understanding Build 1
**What I asked:**
"Let's work on a project. Frontend: HTML, CSS, JavaScript (no framework). Backend: Node.js 22.13 or newer. Database: SQLite. Tests: Node's built-in test runner. No outside packages." Then I pasted the full capstone brief for the Event Ticketing and Booking platform and asked to focus on Build 1. I also asked: "I don't understand Build 1 and what it entails, can you tell me in a simplified way what Build 1 is?"

**What came back:**
The AI explained Build 1 in plain English: build the brain of the app (events, ticket tiers, bookings with a capacity rule, a FIFO waitlist, and fast booking lookup) that runs entirely in the terminal with no server, no database, and no website yet. It outlined the two deliverables: `npm run demo` (the full sellout-and-promotion story) and `npm run benchmark` (Map vs Array speed comparison with Big O explanation).

**What was wrong with it:**
Nothing. The explanation was clear and matched the course brief.

**What I changed:**
Nothing.

---

### Prompt 2: Environment Setup
**What I asked:**
"I don't have Node.js in my VS Code. Aside from Node.js, do I have to download any other tool? I have Git and a GitHub account." I also asked: "What's the difference between npm and nvm?" and encountered a PowerShell execution policy error when running npm.

**What came back:**
The AI clarified that Node.js is not a VS Code plugin but a separate program to install from nodejs.org. It confirmed that only Git and a GitHub account were needed beyond Node. It explained npm (Node Package Manager) vs nvm (Node Version Manager) vs npx (Node Package Execute). For the PowerShell error, it provided the fix: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`.

**What was wrong with it:**
Nothing.

**What I changed:**
Nothing. I installed Node.js v24.21.0 and fixed the PowerShell policy.

---

### Prompt 3: Git Repository Setup
**What I asked:**
"I've not yet cloned my tutor's Git repo. What do I start with?" Then: "He said we should clone his repo and create our own repo." I encountered errors: `git remote set-url origin` gave "No such remote 'origin'" and `git push -u origin main` gave "src refspec main does not match any."

**What came back:**
The AI explained that `set-url` edits an existing remote while `add` creates one, so I needed `git remote add origin <url>` instead. For the push error, it explained that Git cannot push an empty history — I needed to create at least one file and commit it first. It walked me through creating a README.md, committing it, pushing to main, and then creating the `build-1` branch.

**What was wrong with it:**
Nothing. The Git explanations were accurate.

**What I changed:**
Nothing.

---

### Prompt 4: Collaboration Style
**What I asked:**
"I have a little understanding of what the project is about. I don't want you to keep giving me random codes. I want us to collaborate like two software developers. I don't like using terminal to write my codes. I want to use files with .js extension since we're using JavaScript. Those files we created using terminal, aside the package.json, let's delete them and start afresh. I love creating files myself using the create icon."

**What came back:**
The AI agreed to a pair-programming approach: it would provide the code and explain the logic, and I would create the files myself in VS Code and verify everything. It laid out a 7-step roadmap for Build 1.

**What was wrong with it:**
Nothing. This was a workflow preference, not a code issue.

**What I changed:**
I deleted all terminal-generated files and started creating files manually in VS Code.

---

### Prompt 5: Documentation Files
**What I asked:**
"Can't I copy the documentation files and user stories from my tutor's own? Besides, did he say we should create a documentation file?"

**What came back:**
The AI confirmed I should copy `milestones.md` and `user-stories.md` directly from the tutor's repo. It clarified that `ai-log.md` is the one file I must create and maintain myself, as it is graded.

**What was wrong with it:**
Nothing.

**What I changed:**
I copied the tutor's docs and created my own `ai-log.md`.

---

### Prompt 6: Linked List Queue Implementation
**What I asked:**
"I don't understand the code." Then: "So O(n) is for list/array while O(1) is for linked list?" Then: "Can you explain each block of code before I copy it to the file, and what do I name the file?" Then: "Honestly speaking, I don't know JavaScript."

**What came back:**
The AI used a real-world analogy (a line at a bank/ATM) to explain the linked list queue. It confirmed that Array.shift() is O(n) because every element must shift forward, while a linked list dequeue is O(1) because only one pointer moves. It broke down every block of the code (Node class, constructor, enqueue, dequeue, peek, isEmpty) in plain English. It also provided a 2-minute JavaScript survival guide covering variables, objects, functions, and classes.

**What was wrong with it:**
Nothing. The analogies made the concepts clear.

**What I changed:**
Nothing. I created `src/linked-list-queue.js` and `test/linked-list-queue.test.js` manually in VS Code.

---

### Prompt 7: Debugging File Location Errors
**What I asked:**
I ran `npm test` and got `ERR_MODULE_NOT_FOUND: Cannot find module 'src/linked-list-queue.js'`. This happened three times in a row.

**What came back:**
The AI asked me to run `Get-ChildItem -Recurse -File` to list all files. The output revealed that `linked-list-queue.js` was accidentally inside `docs/src/` instead of `src/`, and the documentation files were in the root folder instead of `docs/`. The AI provided PowerShell commands to move everything to the correct locations.

**What was wrong with it:**
Nothing. The diagnostic approach was correct.

**What I changed:**
I ran the move commands to fix the folder structure:
- Moved `docs/src/linked-list-queue.js` to `src/`
- Moved `ai-log.md`, `milestones.md`, `user-stories.md` into `docs/`

After fixing, all 9 tests passed (3 queue tests + 6 domain tests).

---

### Prompt 8: Domain Core, Demo, and Benchmark
**What I asked:**
After the queue tests passed, I asked to proceed with the domain core, demo script, and benchmark script step by step.

**What came back:**
The AI provided `src/domain.js` (Store class with createEvent, addTier, book, cancel, lookup methods), `test/domain.test.js` (6 tests covering all business rules), `demo.js` (the full sellout-and-promotion story), and `benchmark.js` (Map vs Array speed comparison with Big O explanation). Each file was explained in plain English before I pasted it.

**What was wrong with it:**
Nothing. All tests passed (9/9), the demo printed the complete story correctly, and the benchmark showed Map.get as significantly faster than Array.find.

**What I changed:**
Nothing.