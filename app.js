const STORAGE_KEY = "plan-study-week-v1";

const today = new Date();

function formatDateInput(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

const demoData = {
  subjects: [
    { id: crypto.randomUUID(), name: "Biology", color: "#2563eb", goalHoursPerWeek: 6 },
    { id: crypto.randomUUID(), name: "History", color: "#f97316", goalHoursPerWeek: 4 },
    { id: crypto.randomUUID(), name: "Calculus", color: "#15803d", goalHoursPerWeek: 7 }
  ],
  tasks: [],
  sessions: []
};

demoData.tasks = [
  {
    id: crypto.randomUUID(),
    subjectId: demoData.subjects[0].id,
    title: "Review cell respiration notes",
    dueDate: formatDateInput(addDays(today, 1)),
    priority: "high",
    estimatedMinutes: 75,
    status: "planned"
  },
  {
    id: crypto.randomUUID(),
    subjectId: demoData.subjects[1].id,
    title: "Draft causes of the French Revolution outline",
    dueDate: formatDateInput(addDays(today, 3)),
    priority: "medium",
    estimatedMinutes: 60,
    status: "planned"
  },
  {
    id: crypto.randomUUID(),
    subjectId: demoData.subjects[2].id,
    title: "Solve 10 derivative practice problems",
    dueDate: formatDateInput(today),
    priority: "high",
    estimatedMinutes: 90,
    status: "done"
  }
];

demoData.sessions = [
  {
    id: crypto.randomUUID(),
    subjectId: demoData.subjects[2].id,
    title: "Derivative drills",
    date: formatDateInput(today),
    startTime: "19:00",
    durationMinutes: 90,
    status: "planned"
  },
  {
    id: crypto.randomUUID(),
    subjectId: demoData.subjects[0].id,
    title: "Quiz prep and flashcards",
    date: formatDateInput(today),
    startTime: "21:00",
    durationMinutes: 60,
    status: "planned"
  },
  {
    id: crypto.randomUUID(),
    subjectId: demoData.subjects[1].id,
    title: "Essay structure review",
    date: formatDateInput(addDays(today, 2)),
    startTime: "18:30",
    durationMinutes: 75,
    status: "planned"
  }
];

const state = loadState();

const elements = {
  heroStats: document.querySelector("#hero-stats"),
  todayDate: document.querySelector("#today-date"),
  todaySessions: document.querySelector("#today-sessions"),
  priorityTasks: document.querySelector("#priority-tasks"),
  weeklyProgress: document.querySelector("#weekly-progress"),
  subjectsList: document.querySelector("#subjects-list"),
  tasksList: document.querySelector("#tasks-list"),
  sessionsList: document.querySelector("#sessions-list"),
  subjectForm: document.querySelector("#subject-form"),
  taskForm: document.querySelector("#task-form"),
  sessionForm: document.querySelector("#session-form"),
  taskSubject: document.querySelector("#task-subject"),
  sessionSubject: document.querySelector("#session-subject"),
  taskFormNote: document.querySelector("#task-form-note"),
  sessionFormNote: document.querySelector("#session-form-note"),
  clearDataButton: document.querySelector("#clear-data-button"),
  loadDemoButton: document.querySelector("#load-demo-button"),
  emptyStateTemplate: document.querySelector("#empty-state-template")
};

bootstrap();

function bootstrap() {
  elements.todayDate.textContent = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  }).format(new Date());

  setDefaultFormDates();
  bindEvents();
  render();
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData));
    return structuredClone(demoData);
  }

  try {
    const parsed = JSON.parse(saved);
    return {
      subjects: parsed.subjects ?? [],
      tasks: parsed.tasks ?? [],
      sessions: parsed.sessions ?? []
    };
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData));
    return structuredClone(demoData);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function bindEvents() {
  elements.subjectForm.addEventListener("submit", handleSubjectSubmit);
  elements.taskForm.addEventListener("submit", handleTaskSubmit);
  elements.sessionForm.addEventListener("submit", handleSessionSubmit);
  elements.clearDataButton.addEventListener("click", handleClearPlanner);
  elements.loadDemoButton.addEventListener("click", handleLoadDemoData);
}

function handleSubjectSubmit(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  state.subjects.unshift({
    id: crypto.randomUUID(),
    name: form.get("subjectName").toString().trim(),
    goalHoursPerWeek: Number(form.get("subjectHours")),
    color: form.get("subjectColor").toString()
  });
  saveState();
  event.currentTarget.reset();
  document.querySelector("#subject-color").value = "#2563eb";
  document.querySelector("#subject-hours").value = "5";
  render();
}

function handleTaskSubmit(event) {
  event.preventDefault();
  if (!state.subjects.length) {
    return;
  }

  const form = new FormData(event.currentTarget);
  state.tasks.unshift({
    id: crypto.randomUUID(),
    title: form.get("taskTitle").toString().trim(),
    subjectId: form.get("taskSubject").toString(),
    dueDate: form.get("taskDueDate").toString(),
    priority: form.get("taskPriority").toString(),
    estimatedMinutes: Number(form.get("taskEstimate")),
    status: "planned"
  });
  saveState();
  event.currentTarget.reset();
  setDefaultFormDates();
  render();
}

function handleSessionSubmit(event) {
  event.preventDefault();
  if (!state.subjects.length) {
    return;
  }

  const form = new FormData(event.currentTarget);
  state.sessions.unshift({
    id: crypto.randomUUID(),
    title: form.get("sessionTitle").toString().trim(),
    subjectId: form.get("sessionSubject").toString(),
    date: form.get("sessionDate").toString(),
    startTime: form.get("sessionTime").toString(),
    durationMinutes: Number(form.get("sessionDuration")),
    status: "planned"
  });
  saveState();
  event.currentTarget.reset();
  setDefaultFormDates();
  render();
}

function handleClearPlanner() {
  state.subjects = [];
  state.tasks = [];
  state.sessions = [];
  saveState();
  render();
}

function handleLoadDemoData() {
  state.subjects = structuredClone(demoData.subjects);
  state.tasks = structuredClone(demoData.tasks);
  state.sessions = structuredClone(demoData.sessions);
  saveState();
  render();
}

function setDefaultFormDates() {
  document.querySelector("#task-due-date").value = formatDateInput(addDays(new Date(), 1));
  document.querySelector("#session-date").value = formatDateInput(new Date());
  document.querySelector("#session-time").value = "19:00";
}

function render() {
  renderSubjectOptions();
  renderHeroStats();
  renderTodaySections();
  renderWeeklyProgress();
  renderSubjects();
  renderTasks();
  renderSessions();
}

function renderHeroStats() {
  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter((task) => task.status === "done").length;
  const totalSessions = state.sessions.length;
  const plannedHours = Math.round(
    state.sessions.reduce((sum, session) => sum + session.durationMinutes, 0) / 60
  );

  elements.heroStats.innerHTML = `
    <div class="stat-card">
      <span>Subjects in rotation</span>
      <strong>${state.subjects.length}</strong>
    </div>
    <div class="stat-card">
      <span>Tasks completed</span>
      <strong>${completedTasks}/${totalTasks || 0}</strong>
    </div>
    <div class="stat-card">
      <span>Scheduled sessions</span>
      <strong>${totalSessions}</strong>
    </div>
    <div class="stat-card">
      <span>Planned study hours</span>
      <strong>${plannedHours}h</strong>
    </div>
  `;
}

function renderTodaySections() {
  const todayString = formatDateInput(new Date());
  const todaysSessions = state.sessions
    .filter((session) => session.date === todayString)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
  const priorityTasks = state.tasks
    .filter((task) => task.status !== "done")
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority] || a.dueDate.localeCompare(b.dueDate);
    })
    .slice(0, 4);

  fillCollection(
    elements.todaySessions,
    todaysSessions.map((session) => createSessionCard(session, true)),
    {
      title: "No sessions yet",
      copy: "Schedule a study block to shape the day ahead."
    }
  );
  fillCollection(
    elements.priorityTasks,
    priorityTasks.map((task) => createTaskCard(task, true)),
    {
      title: "Nothing urgent yet",
      copy: "Add a few high-impact tasks so your dashboard has a clear target."
    }
  );
}

function renderWeeklyProgress() {
  const completedMinutesBySubject = new Map();
  for (const session of state.sessions) {
    if (session.status !== "done") {
      continue;
    }
    completedMinutesBySubject.set(
      session.subjectId,
      (completedMinutesBySubject.get(session.subjectId) ?? 0) + session.durationMinutes
    );
  }

  fillCollection(
    elements.weeklyProgress,
    state.subjects.map((subject) => {
      const completedHours = Math.round(((completedMinutesBySubject.get(subject.id) ?? 0) / 60) * 10) / 10;
      const ratio = Math.min(100, Math.round((completedHours / subject.goalHoursPerWeek) * 100) || 0);
      const card = document.createElement("article");
      card.className = "progress-card";
      card.innerHTML = `
        <div class="progress-row">
          <span class="subject-pill" style="background:${subject.color}1a;color:${subject.color};">${subject.name}</span>
          <strong>${completedHours}h / ${subject.goalHoursPerWeek}h</strong>
        </div>
        <div class="progress-bar" aria-hidden="true">
          <div class="progress-fill" style="width:${ratio}%; background:${subject.color};"></div>
        </div>
      `;
      return card;
    }),
    {
      title: "No progress to chart",
      copy: "Complete sessions to track how close each subject is to its weekly target."
    }
  );
}

function renderSubjects() {
  fillCollection(
    elements.subjectsList,
    state.subjects.map((subject) => {
      const tasks = state.tasks.filter((task) => task.subjectId === subject.id);
      const sessions = state.sessions.filter((session) => session.subjectId === subject.id);
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <div class="card-header">
          <div>
            <h4>${subject.name}</h4>
            <p>${tasks.length} task${tasks.length === 1 ? "" : "s"} and ${sessions.length} session${sessions.length === 1 ? "" : "s"} planned.</p>
          </div>
          <span class="subject-pill" style="background:${subject.color}1a;color:${subject.color};">${subject.goalHoursPerWeek}h goal</span>
        </div>
        <div class="card-actions">
          <button class="action-button" type="button" data-action="delete-subject" data-id="${subject.id}" data-variant="danger">Remove</button>
        </div>
      `;
      card.querySelector("[data-action='delete-subject']").addEventListener("click", () => deleteSubject(subject.id));
      return card;
    }),
    {
      title: "No subjects yet",
      copy: "Create a subject to unlock tasks, sessions, and progress tracking."
    }
  );
}

function renderTasks() {
  const tasks = [...state.tasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  fillCollection(
    elements.tasksList,
    tasks.map((task) => createTaskCard(task, false)),
    {
      title: "No tasks yet",
      copy: "Add a task with a due date to build your study queue."
    }
  );
}

function renderSessions() {
  const sessions = [...state.sessions].sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`));
  fillCollection(
    elements.sessionsList,
    sessions.map((session) => createSessionCard(session, false)),
    {
      title: "No sessions planned",
      copy: "Schedule a session to make your week feel concrete."
    }
  );
}

function renderSubjectOptions() {
  const options = state.subjects.length
    ? state.subjects.map((subject) => `<option value="${subject.id}">${subject.name}</option>`).join("")
    : '<option value="">Add a subject first</option>';

  elements.taskSubject.innerHTML = options;
  elements.sessionSubject.innerHTML = options;
  elements.taskSubject.disabled = !state.subjects.length;
  elements.sessionSubject.disabled = !state.subjects.length;
  elements.taskForm.querySelector('button[type="submit"]').disabled = !state.subjects.length;
  elements.sessionForm.querySelector('button[type="submit"]').disabled = !state.subjects.length;
  elements.taskFormNote.hidden = state.subjects.length > 0;
  elements.sessionFormNote.hidden = state.subjects.length > 0;
  elements.taskFormNote.textContent = "Add a subject first, then tasks can be assigned to a focus area.";
  elements.sessionFormNote.textContent = "Add a subject first so each study block has a clear home.";
}

function createTaskCard(task, compact) {
  const subject = getSubject(task.subjectId);
  const wrapper = document.createElement("article");
  wrapper.className = `card ${task.status === "done" ? "completed" : ""}`;
  wrapper.innerHTML = `
    <div class="card-header">
      <div>
        <h4 class="task-title">${task.title}</h4>
        <p class="task-meta">${formatFriendlyDate(task.dueDate)} · ${task.estimatedMinutes} min</p>
      </div>
      <span class="priority-pill ${task.priority}">${capitalize(task.priority)}</span>
    </div>
    <div class="chip-row">
      <span class="subject-pill" style="background:${subject.color}1a;color:${subject.color};">${subject.name}</span>
      <span class="status-pill ${task.status}">${task.status === "done" ? "Done" : "Planned"}</span>
    </div>
    ${compact ? "" : `
      <div class="card-actions">
        <button class="action-button ${task.status === "done" ? "" : "is-active"}" type="button" data-action="toggle-task">
          ${task.status === "done" ? "Mark planned" : "Mark done"}
        </button>
        <button class="action-button" type="button" data-action="delete-task" data-variant="danger">Delete</button>
      </div>
    `}
  `;

  if (!compact) {
    wrapper.querySelector("[data-action='toggle-task']").addEventListener("click", () => toggleTask(task.id));
    wrapper.querySelector("[data-action='delete-task']").addEventListener("click", () => deleteTask(task.id));
  }

  return wrapper;
}

function createSessionCard(session, compact) {
  const subject = getSubject(session.subjectId);
  const wrapper = document.createElement("article");
  wrapper.className = `card ${session.status === "done" ? "completed" : ""}`;
  wrapper.innerHTML = `
    <div class="card-header">
      <div>
        <h4 class="session-title">${session.title}</h4>
        <p class="session-meta">${formatFriendlyDate(session.date)} at ${formatTime(session.startTime)} · ${session.durationMinutes} min</p>
      </div>
      <span class="status-pill ${session.status}">${session.status === "done" ? "Done" : "Planned"}</span>
    </div>
    <div class="chip-row">
      <span class="subject-pill" style="background:${subject.color}1a;color:${subject.color};">${subject.name}</span>
    </div>
    ${compact ? "" : `
      <div class="card-actions">
        <button class="action-button ${session.status === "done" ? "" : "is-active"}" type="button" data-action="toggle-session">
          ${session.status === "done" ? "Mark planned" : "Mark done"}
        </button>
        <button class="action-button" type="button" data-action="delete-session" data-variant="danger">Delete</button>
      </div>
    `}
  `;

  if (!compact) {
    wrapper.querySelector("[data-action='toggle-session']").addEventListener("click", () => toggleSession(session.id));
    wrapper.querySelector("[data-action='delete-session']").addEventListener("click", () => deleteSession(session.id));
  }

  return wrapper;
}

function fillCollection(container, nodes, emptyState) {
  container.innerHTML = "";
  if (!nodes.length) {
    const empty = elements.emptyStateTemplate.content.firstElementChild.cloneNode(true);
    empty.querySelector(".empty-title").textContent = emptyState.title;
    empty.querySelector(".empty-copy").textContent = emptyState.copy;
    container.append(empty);
    return;
  }
  container.append(...nodes);
}

function toggleTask(taskId) {
  const task = state.tasks.find((entry) => entry.id === taskId);
  if (!task) {
    return;
  }
  task.status = task.status === "done" ? "planned" : "done";
  saveState();
  render();
}

function toggleSession(sessionId) {
  const session = state.sessions.find((entry) => entry.id === sessionId);
  if (!session) {
    return;
  }
  session.status = session.status === "done" ? "planned" : "done";
  saveState();
  render();
}

function deleteTask(taskId) {
  state.tasks = state.tasks.filter((task) => task.id !== taskId);
  saveState();
  render();
}

function deleteSession(sessionId) {
  state.sessions = state.sessions.filter((session) => session.id !== sessionId);
  saveState();
  render();
}

function deleteSubject(subjectId) {
  state.subjects = state.subjects.filter((subject) => subject.id !== subjectId);
  state.tasks = state.tasks.filter((task) => task.subjectId !== subjectId);
  state.sessions = state.sessions.filter((session) => session.subjectId !== subjectId);
  saveState();
  render();
}

function getSubject(subjectId) {
  return state.subjects.find((subject) => subject.id === subjectId) ?? {
    name: "Unknown",
    color: "#64748b"
  };
}

function formatFriendlyDate(dateString) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(new Date(`${dateString}T00:00:00`));
}

function formatTime(timeString) {
  const [hours, minutes] = timeString.split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
