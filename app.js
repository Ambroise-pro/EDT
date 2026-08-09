const firebaseConfig = {
  apiKey: "AIzaSyChbqOpu-VoGGkmjYptCl0usloYQ1FtSVM",
  authDomain: "emploi-du-temps-1644e.firebaseapp.com",
  projectId: "emploi-du-temps-1644e",
  storageBucket: "emploi-du-temps-1644e.firebasestorage.app",
  messagingSenderId: "84122131462",
  appId: "1:84122131462:web:0648cc735811498c357787",
  measurementId: "G-1Q81J5JYX8",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
db.settings({
  experimentalAutoDetectLongPolling: true,
  useFetchStreams: false,
  merge: true,
});

const addDoc = (collectionRef, data) => collectionRef.add(data);
const collection = (dbRef, name) => dbRef.collection(name);
const deleteDoc = (docRef) => docRef.delete();
const doc = (dbRef, name, id) => dbRef.collection(name).doc(id);
const onSnapshot = (queryRef, callback) => queryRef.onSnapshot(callback);
const setDoc = (docRef, data, options) => docRef.set(data, options);
const updateDoc = (docRef, data) => docRef.update(data);
const serverTimestamp = () => firebase.firestore.FieldValue.serverTimestamp();

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const SLOTS = ["08:15", "09:05", "10:20", "11:10", "12:10", "13:00", "14:00", "15:00", "16:05", "16:55"];
const SLOT_BANDS = [
  { label: "08h15 à 10h00", start: "08:15", end: "10:00", slots: ["08:15", "09:05"] },
  { label: "10h20 à 12h05", start: "10:20", end: "12:05", slots: ["10:20", "11:10"] },
  { label: "12h10 à 13h55", start: "12:10", end: "13:55", slots: ["12:10", "13:00"] },
  { label: "14h00 à 16h00", start: "14:00", end: "16:00", slots: ["14:00", "15:00"] },
  { label: "16h05 à 17h50", start: "16:05", end: "17:50", slots: ["16:05", "16:55"] },
];
const SPECIAL_ASSIGNMENTS = [
  { id: "__AS__", label: "AS", type: "AS" },
  { id: "__DANSE__", label: "Danse", type: "DANSE" },
];
const LEVEL_RULES = {
  "Sixième": { weeklyHours: 4, hint: "6e: 4h/semaine (2 x 2h)", group: "SIXIEME" },
  "Cinquième": { weeklyHours: 3, hint: "5e: 3h/semaine (créneau de 3h, hebdomadaire)", group: "CINQUIEME" },
  "Quatrième": { weeklyHours: 3, hint: "4e: 3h/semaine (2h hebdo + semaine A/B possible)", group: "ALT_43" },
  "Troisième": { weeklyHours: 3, hint: "3e: 3h/semaine (2h hebdo + semaine A/B possible)", group: "ALT_43" },
  Seconde: { weeklyHours: 2, hint: "2nde/1re/Tle: 2h/semaine", group: "LYCEE" },
  "Première": { weeklyHours: 2, hint: "2nde/1re/Tle: 2h/semaine", group: "LYCEE" },
  Terminale: { weeklyHours: 2, hint: "2nde/1re/Tle: 2h/semaine", group: "LYCEE" },
};

const ui = {
  publicModeBtn: document.getElementById("publicModeBtn"),
  adminModeBtn: document.getElementById("adminModeBtn"),
  desiderataModeBtn: document.getElementById("desiderataModeBtn"),
  publicSection: document.getElementById("publicSection"),
  desiderataSection: document.getElementById("desiderataSection"),
  adminSection: document.getElementById("adminSection"),
  adminShell: document.getElementById("adminShell"),
  adminSidebarToggleBtn: document.getElementById("adminSidebarToggleBtn"),
  adminTabCreationBtn: document.getElementById("adminTabCreationBtn"),
  adminTabAssignBtn: document.getElementById("adminTabAssignBtn"),
  adminTabProgramBtn: document.getElementById("adminTabProgramBtn"),
  adminTabBusBtn: document.getElementById("adminTabBusBtn"),
  adminTabManageBtn: document.getElementById("adminTabManageBtn"),
  adminTabSwimBtn: document.getElementById("adminTabSwimBtn"),
  adminTabRecapBtn: document.getElementById("adminTabRecapBtn"),
  adminCreationPanel: document.getElementById("adminCreationPanel"),
  adminAssignPanel: document.getElementById("adminAssignPanel"),
  adminProgramPanel: document.getElementById("adminProgramPanel"),
  programSubtabProgrammingBtn: document.getElementById("programSubtabProgrammingBtn"),
  programSubtabActivityBtn: document.getElementById("programSubtabActivityBtn"),
  programSubtabLocationBtn: document.getElementById("programSubtabLocationBtn"),
  programSubtabPeriodsBtn: document.getElementById("programSubtabPeriodsBtn"),
  programSubpanelProgramming: document.getElementById("programSubpanelProgramming"),
  programSubpanelActivity: document.getElementById("programSubpanelActivity"),
  programSubpanelLocation: document.getElementById("programSubpanelLocation"),
  programSubpanelPeriods: document.getElementById("programSubpanelPeriods"),
  adminBusPanel: document.getElementById("adminBusPanel"),
  adminManagePanel: document.getElementById("adminManagePanel"),
  adminSwimPanel: document.getElementById("adminSwimPanel"),
  adminRecapPanel: document.getElementById("adminRecapPanel"),
  publicTeacherSelect: document.getElementById("publicTeacherSelect"),
  publicTeacherSummary: document.getElementById("publicTeacherSummary"),
  publicTimetableContainer: document.getElementById("publicTimetableContainer"),
  desiderataTeacherSelect: document.getElementById("desiderataTeacherSelect"),
  desiderataHint: document.getElementById("desiderataHint"),
  desiderataGridContainer: document.getElementById("desiderataGridContainer"),
  desiderataPreferredHours: document.getElementById("desiderataPreferredHours"),
  desiderataUnavailableBlocks: document.getElementById("desiderataUnavailableBlocks"),
  desiderataTargetHours: document.getElementById("desiderataTargetHours"),
  desiderataClearBtn: document.getElementById("desiderataClearBtn"),
  desiderataSaveBtn: document.getElementById("desiderataSaveBtn"),
  desiderataSubmitBtn: document.getElementById("desiderataSubmitBtn"),
  teacherForm: document.getElementById("teacherForm"),
  teacherEditSelect: document.getElementById("teacherEditSelect"),
  teacherName: document.getElementById("teacherName"),
  teacherAbbreviation: document.getElementById("teacherAbbreviation"),
  teacherMaxHours: document.getElementById("teacherMaxHours"),
  teacherColor: document.getElementById("teacherColor"),
  teacherSubmitBtn: document.getElementById("teacherSubmitBtn"),
  teacherCancelEditBtn: document.getElementById("teacherCancelEditBtn"),
  teacherConstraintsGrid: document.getElementById("teacherConstraintsGrid"),
  classForm: document.getElementById("classForm"),
  classLevel: document.getElementById("classLevel"),
  classCount: document.getElementById("classCount"),
  classWeeklyHours: document.getElementById("classWeeklyHours"),
  classRuleHint: document.getElementById("classRuleHint"),
  classCreateInfo: document.getElementById("classCreateInfo"),
  sessionError: document.getElementById("sessionError"),
  plannerTeacherSelect: document.getElementById("plannerTeacherSelect"),
  plannerShowGlobal: document.getElementById("plannerShowGlobal"),
  plannerGrid: document.getElementById("plannerGrid"),
  adminPlannerHint: null,
  adminPlannerContainer: null,
  globalWeekType: document.getElementById("globalWeekType"),
  globalPlannerLayout: document.getElementById("globalPlannerLayout"),
  globalPlannerHint: null,
  globalPlannerContainer: null,
  teachersList: document.getElementById("teachersList"),
  classesList: document.getElementById("classesList"),
  sessionsList: document.getElementById("sessionsList"),
  swimHint: document.getElementById("swimHint"),
  swimPlannerContainer: document.getElementById("swimPlannerContainer"),
  adminRecapContainer: document.getElementById("adminRecapContainer"),
  programWeekType: document.getElementById("programWeekType"),
  programDaySelect: document.getElementById("programDaySelect"),
  programHint: document.getElementById("programHint"),
  programAnnualVisualContainer: document.getElementById("programAnnualVisualContainer"),
  programPlannerContainer: document.getElementById("programPlannerContainer"),
  programActivitiesList: document.getElementById("programActivitiesList"),
  programLocationsList: document.getElementById("programLocationsList"),
  programActivityLabel: document.getElementById("programActivityLabel"),
  programActivityCode: document.getElementById("programActivityCode"),
  programActivityPreferredLocationSelect: document.getElementById("programActivityPreferredLocationSelect"),
  programAddActivityBtn: document.getElementById("programAddActivityBtn"),
  programLocationName: document.getElementById("programLocationName"),
  programAddLocationBtn: document.getElementById("programAddLocationBtn"),
  programStats: document.getElementById("programStats"),
  programTrim1Start: document.getElementById("programTrim1Start"),
  programTrim1End: document.getElementById("programTrim1End"),
  programTrim2Start: document.getElementById("programTrim2Start"),
  programTrim2End: document.getElementById("programTrim2End"),
  programTrim3Start: document.getElementById("programTrim3Start"),
  programTrim3End: document.getElementById("programTrim3End"),
  programSem1Start: document.getElementById("programSem1Start"),
  programSem1End: document.getElementById("programSem1End"),
  programSem2Start: document.getElementById("programSem2Start"),
  programSem2End: document.getElementById("programSem2End"),
  programSavePeriodsBtn: document.getElementById("programSavePeriodsBtn"),
  programPeriodsInfo: document.getElementById("programPeriodsInfo"),
  programClassPlanContainer: document.getElementById("programClassPlanContainer"),
  busHint: document.getElementById("busHint"),
  busPlannerContainer: document.getElementById("busPlannerContainer"),
  busEmailTo: document.getElementById("busEmailTo"),
  busComposeMailBtn: document.getElementById("busComposeMailBtn"),
  busCopyMailBtn: document.getElementById("busCopyMailBtn"),
  busMailPreview: document.getElementById("busMailPreview"),
  assignModal: document.getElementById("assignModal"),
  assignModalTitle: document.getElementById("assignModalTitle"),
  assignModalContext: document.getElementById("assignModalContext"),
  assignModalTeacherRow: document.getElementById("assignModalTeacherRow"),
  assignModalTeacherSelect: document.getElementById("assignModalTeacherSelect"),
  assignModalLevelSelect: document.getElementById("assignModalLevelSelect"),
  assignModalClassSelect: document.getElementById("assignModalClassSelect"),
  assignModalCadenceSelect: document.getElementById("assignModalCadenceSelect"),
  assignModalHint: document.getElementById("assignModalHint"),
  assignModalCancelBtn: document.getElementById("assignModalCancelBtn"),
  assignModalConfirmBtn: document.getElementById("assignModalConfirmBtn"),
  programRoomsModal: document.getElementById("programRoomsModal"),
  programRoomsModalTitle: document.getElementById("programRoomsModalTitle"),
  programRoomsModalContext: document.getElementById("programRoomsModalContext"),
  programRoomsModalBody: document.getElementById("programRoomsModalBody"),
  programRoomsModalCloseBtn: document.getElementById("programRoomsModalCloseBtn"),
  programPickModal: document.getElementById("programPickModal"),
  programPickModalTitle: document.getElementById("programPickModalTitle"),
  programPickModalContext: document.getElementById("programPickModalContext"),
  programPickModalList: document.getElementById("programPickModalList"),
  programPickModalCloseBtn: document.getElementById("programPickModalCloseBtn"),
};

const state = {
  teachers: [],
  classes: [],
  sessions: [],
  swimSlots: [],
  swimSlotKeys: new Set(),
  programActivities: [],
  programLocations: [],
  programPeriods: {},
  classActivityPlans: [],
  selectedProgramWeekType: "A",
  selectedProgramDay: "Lundi",
  selectedProgramSubTab: "programming",
  desiderataSlots: [],
  desiderataSlotStatus: new Map(),
  desiderataDraft: new Map(),
  desiderataDraftTeacherId: "",
  desiderataDirty: false,
  desiderataPaintStatus: null,
  desiderataPointerDown: false,
  desiderataMouseupBound: false,
  selectedPublicTeacherId: "__ALL__",
  selectedDesiderataTeacherId: "",
  editingTeacherId: "",
  selectedAdminTeacherId: "",
  selectedAdminTeacherIds: [],
  showGlobalPlanner: true,
  selectedGlobalWeekType: "A",
  selectedGlobalPlannerLayout: "GRID",
  globalPicker: null,
  assignModal: null,
  selectedAdminTab: "creation",
  adminSidebarCollapsed: false,
  programEditSessionId: "",
  programPickContext: null,
  adminPicker: null,
};

function setupModeSwitch() {
  if (ui.publicModeBtn) ui.publicModeBtn.addEventListener("click", () => setMode("public"));
  if (ui.adminModeBtn) ui.adminModeBtn.addEventListener("click", () => setMode("admin"));
  if (ui.desiderataModeBtn) ui.desiderataModeBtn.addEventListener("click", () => setMode("desiderata"));
  if (ui.adminTabCreationBtn) ui.adminTabCreationBtn.addEventListener("click", () => setAdminTab("creation"));
  if (ui.adminTabAssignBtn) ui.adminTabAssignBtn.addEventListener("click", () => setAdminTab("assign"));
  if (ui.adminTabProgramBtn) ui.adminTabProgramBtn.addEventListener("click", () => setAdminTab("program"));
  if (ui.adminTabBusBtn) ui.adminTabBusBtn.addEventListener("click", () => setAdminTab("bus"));
  if (ui.adminTabManageBtn) ui.adminTabManageBtn.addEventListener("click", () => setAdminTab("manage"));
  if (ui.adminTabSwimBtn) ui.adminTabSwimBtn.addEventListener("click", () => setAdminTab("swim"));
  if (ui.adminTabRecapBtn) ui.adminTabRecapBtn.addEventListener("click", () => setAdminTab("recap"));
}

function setupAdminSidebarToggle() {
  if (!ui.adminShell || !ui.adminSidebarToggleBtn) return;
  state.adminSidebarCollapsed = localStorage.getItem("adminSidebarCollapsed") === "1";
  applyAdminSidebarState();
  ui.adminSidebarToggleBtn.addEventListener("click", () => {
    state.adminSidebarCollapsed = !state.adminSidebarCollapsed;
    localStorage.setItem("adminSidebarCollapsed", state.adminSidebarCollapsed ? "1" : "0");
    applyAdminSidebarState();
  });
}

function applyAdminSidebarState() {
  if (!ui.adminShell || !ui.adminSidebarToggleBtn) return;
  ui.adminShell.classList.toggle("sidebar-collapsed", state.adminSidebarCollapsed);
  const icon = ui.adminSidebarToggleBtn.querySelector(".material-symbols-outlined");
  const label = ui.adminSidebarToggleBtn.querySelector("span:last-child");
  if (icon) icon.textContent = state.adminSidebarCollapsed ? "left_panel_open" : "left_panel_close";
  if (label) label.textContent = state.adminSidebarCollapsed ? "Déplier" : "Rétracter";
  ui.adminSidebarToggleBtn.title = state.adminSidebarCollapsed ? "Déplier le menu admin" : "Rétracter le menu admin";
}

function setMode(mode) {
  const isPublic = mode === "public";
  const isDesiderata = mode === "desiderata";
  if (ui.publicSection) ui.publicSection.classList.toggle("hidden", !isPublic);
  if (ui.desiderataSection) ui.desiderataSection.classList.toggle("hidden", !isDesiderata);
  if (ui.adminSection) ui.adminSection.classList.toggle("hidden", isPublic || isDesiderata);
  if (ui.publicModeBtn) ui.publicModeBtn.classList.toggle("active", isPublic);
  if (ui.desiderataModeBtn) ui.desiderataModeBtn.classList.toggle("active", isDesiderata);
  if (ui.adminModeBtn) ui.adminModeBtn.classList.toggle("active", !isPublic && !isDesiderata);
}

function setAdminTab(tab) {
  state.selectedAdminTab = tab;
  const isCreation = tab === "creation";
  const isAssign = tab === "assign";
  const isProgram = tab === "program";
  const isBus = tab === "bus";
  const isManage = tab === "manage";
  const isSwim = tab === "swim";
  const isRecap = tab === "recap";
  if (ui.adminCreationPanel) ui.adminCreationPanel.classList.toggle("hidden", !isCreation);
  if (ui.adminAssignPanel) ui.adminAssignPanel.classList.toggle("hidden", !isAssign);
  if (ui.adminProgramPanel) ui.adminProgramPanel.classList.toggle("hidden", !isProgram);
  if (ui.adminBusPanel) ui.adminBusPanel.classList.toggle("hidden", !isBus);
  if (ui.adminManagePanel) ui.adminManagePanel.classList.toggle("hidden", !isManage);
  if (ui.adminSwimPanel) ui.adminSwimPanel.classList.toggle("hidden", !isSwim);
  if (ui.adminRecapPanel) ui.adminRecapPanel.classList.toggle("hidden", !isRecap);
  if (ui.adminTabCreationBtn) ui.adminTabCreationBtn.classList.toggle("active", isCreation);
  if (ui.adminTabAssignBtn) ui.adminTabAssignBtn.classList.toggle("active", isAssign);
  if (ui.adminTabProgramBtn) ui.adminTabProgramBtn.classList.toggle("active", isProgram);
  if (ui.adminTabBusBtn) ui.adminTabBusBtn.classList.toggle("active", isBus);
  if (ui.adminTabManageBtn) ui.adminTabManageBtn.classList.toggle("active", isManage);
  if (ui.adminTabSwimBtn) ui.adminTabSwimBtn.classList.toggle("active", isSwim);
  if (ui.adminTabRecapBtn) ui.adminTabRecapBtn.classList.toggle("active", isRecap);
}

function setProgramSubTab(tab) {
  const normalized = tab === "activity" || tab === "location" || tab === "periods" ? tab : "programming";
  state.selectedProgramSubTab = normalized;
  if (ui.programSubpanelProgramming) ui.programSubpanelProgramming.classList.toggle("hidden", normalized !== "programming");
  if (ui.programSubpanelActivity) ui.programSubpanelActivity.classList.toggle("hidden", normalized !== "activity");
  if (ui.programSubpanelLocation) ui.programSubpanelLocation.classList.toggle("hidden", normalized !== "location");
  if (ui.programSubpanelPeriods) ui.programSubpanelPeriods.classList.toggle("hidden", normalized !== "periods");
  if (ui.programSubtabProgrammingBtn) ui.programSubtabProgrammingBtn.classList.toggle("active", normalized === "programming");
  if (ui.programSubtabActivityBtn) ui.programSubtabActivityBtn.classList.toggle("active", normalized === "activity");
  if (ui.programSubtabLocationBtn) ui.programSubtabLocationBtn.classList.toggle("active", normalized === "location");
  if (ui.programSubtabPeriodsBtn) ui.programSubtabPeriodsBtn.classList.toggle("active", normalized === "periods");
}

function buildConstraintsPicker() {
  if (!ui.teacherConstraintsGrid) return;
  const frag = document.createDocumentFragment();
  for (const day of DAYS) {
    const col = document.createElement("div");
    col.className = "constraint-col";
    col.innerHTML = `<h4>${day}</h4>`;

    for (const slot of SLOTS) {
      const key = toSlotKey(day, slot);
      const row = document.createElement("label");
      row.className = "check-row";
      row.innerHTML = `<input type="checkbox" value="${key}" /> <span>${slot}</span>`;
      col.appendChild(row);
    }
    frag.appendChild(col);
  }
  ui.teacherConstraintsGrid.appendChild(frag);
}

function subscribeData() {
  const qTeachers = collection(db, "teachers");
  const qClasses = collection(db, "classes");
  const qSessions = collection(db, "sessions");
  const qSwimSlots = collection(db, "swimSlots");
  const qDesiderata = collection(db, "desiderata");
  const qProgramActivities = collection(db, "programActivities");
  const qProgramLocations = collection(db, "programLocations");
  const qClassActivityPlans = collection(db, "classActivityPlans");
  const qProgramPeriods = doc(db, "planningConfig", "periods");

  onSnapshot(qTeachers, (snap) => {
    state.teachers = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "fr"));
    syncPublicTeacherSelection();
    render();
  });

  onSnapshot(qClasses, (snap) => {
    state.classes = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => {
        const levelCmp = String(a.level || "").localeCompare(String(b.level || ""), "fr");
        if (levelCmp !== 0) return levelCmp;
        return String(a.name || "").localeCompare(String(b.name || ""), "fr");
      });
    render();
  });

  onSnapshot(qSessions, (snap) => {
    state.sessions = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => {
        const dayCmp = String(a.day || "").localeCompare(String(b.day || ""), "fr");
        if (dayCmp !== 0) return dayCmp;
        return String(a.start || "").localeCompare(String(b.start || ""), "fr");
      });
    render();
  });

  onSnapshot(qSwimSlots, (snap) => {
    state.swimSlots = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((x) => x.day && x.slot);
    state.swimSlotKeys = new Set(state.swimSlots.map((s) => daySlotKey(s.day, s.slot)));
    render();
  });

  onSnapshot(qDesiderata, (snap) => {
    state.desiderataSlots = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((x) => x.teacherId && x.day && x.slot);
    state.desiderataSlotStatus = new Map(
      state.desiderataSlots.map((s) => [desiderataSlotKey(s.teacherId, s.day, s.slot), normalizeDesiderataStatus(s.status)])
    );
    syncDesiderataDraftWithPersisted();
    render();
  });

  onSnapshot(qProgramActivities, (snap) => {
    state.programActivities = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((x) => x.label)
      .sort((a, b) => String(a.label || "").localeCompare(String(b.label || ""), "fr"));
    render();
  });

  onSnapshot(qProgramLocations, (snap) => {
    state.programLocations = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((x) => x.name)
      .sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "fr"));
    render();
  });

  onSnapshot(qClassActivityPlans, (snap) => {
    state.classActivityPlans = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    render();
  });

  onSnapshot(qProgramPeriods, (snap) => {
    state.programPeriods = snap.exists ? snap.data() || {} : {};
    render();
  });
}

function setupForms() {
  if (ui.classLevel) ui.classLevel.addEventListener("change", () => applyClassRule());
  if (ui.classCount) ui.classCount.addEventListener("input", () => applyClassRule());
  if (ui.globalWeekType) {
    ui.globalWeekType.addEventListener("change", () => {
      state.selectedGlobalWeekType = normalizeWeekType(ui.globalWeekType.value);
      renderPlannerGrid();
    });
  }
  if (ui.globalPlannerLayout) {
    ui.globalPlannerLayout.addEventListener("change", () => {
      state.selectedGlobalPlannerLayout = ui.globalPlannerLayout.value === "EXCEL" ? "EXCEL" : "GRID";
      state.globalPicker = null;
      renderPlannerGrid();
    });
  }
  if (ui.programWeekType) {
    ui.programWeekType.addEventListener("change", () => {
      state.selectedProgramWeekType = normalizeWeekType(ui.programWeekType.value);
      renderProgrammingPanel();
    });
  }
  if (ui.programDaySelect) {
    ui.programDaySelect.addEventListener("change", () => {
      state.selectedProgramDay = DAYS.includes(ui.programDaySelect.value) ? ui.programDaySelect.value : "Lundi";
      renderProgrammingPanel();
    });
  }
  if (ui.programSubtabProgrammingBtn) {
    ui.programSubtabProgrammingBtn.addEventListener("click", () => setProgramSubTab("programming"));
  }
  if (ui.programSubtabActivityBtn) {
    ui.programSubtabActivityBtn.addEventListener("click", () => setProgramSubTab("activity"));
  }
  if (ui.programSubtabLocationBtn) {
    ui.programSubtabLocationBtn.addEventListener("click", () => setProgramSubTab("location"));
  }
  if (ui.programSubtabPeriodsBtn) {
    ui.programSubtabPeriodsBtn.addEventListener("click", () => setProgramSubTab("periods"));
  }
  if (ui.programAddActivityBtn) {
    ui.programAddActivityBtn.addEventListener("click", async () => {
      const label = String(ui.programActivityLabel.value || "").trim();
      const code = String(ui.programActivityCode.value || "").trim().toUpperCase();
      const preferredLocationName = String(ui.programActivityPreferredLocationSelect?.value || "").trim();
      if (!label) return;
      await addDoc(collection(db, "programActivities"), {
        label,
        code: code || label.slice(0, 3).toUpperCase(),
        preferredLocationName: preferredLocationName || null,
        createdAt: serverTimestamp(),
      });
      ui.programActivityLabel.value = "";
      ui.programActivityCode.value = "";
      if (ui.programActivityPreferredLocationSelect) ui.programActivityPreferredLocationSelect.value = "";
    });
  }
  if (ui.programAddLocationBtn) {
    ui.programAddLocationBtn.addEventListener("click", async () => {
      const name = String(ui.programLocationName.value || "").trim();
      if (!name) return;
      await addDoc(collection(db, "programLocations"), {
        name,
        createdAt: serverTimestamp(),
      });
      ui.programLocationName.value = "";
    });
  }
  if (ui.programSavePeriodsBtn) {
    ui.programSavePeriodsBtn.addEventListener("click", async () => {
      await saveProgramPeriods();
    });
  }
  if (ui.assignModalCancelBtn) {
    ui.assignModalCancelBtn.addEventListener("click", closeAssignModal);
  }
  if (ui.assignModal) {
    ui.assignModal.addEventListener("click", (e) => {
      if (e.target === ui.assignModal) closeAssignModal();
    });
  }
  if (ui.programRoomsModalCloseBtn) {
    ui.programRoomsModalCloseBtn.addEventListener("click", closeProgramRoomsModal);
  }
  if (ui.programRoomsModal) {
    ui.programRoomsModal.addEventListener("click", (e) => {
      if (e.target === ui.programRoomsModal) closeProgramRoomsModal();
    });
  }
  if (ui.programPickModalCloseBtn) {
    ui.programPickModalCloseBtn.addEventListener("click", closeProgramPickModal);
  }
  if (ui.programPickModal) {
    ui.programPickModal.addEventListener("click", (e) => {
      if (e.target === ui.programPickModal) closeProgramPickModal();
    });
  }
  if (ui.busComposeMailBtn) {
    ui.busComposeMailBtn.addEventListener("click", () => {
      composeBusEmail();
    });
  }
  if (ui.busCopyMailBtn) {
    ui.busCopyMailBtn.addEventListener("click", async () => {
      await copyBusEmailText();
    });
  }
  if (ui.busEmailTo) {
    ui.busEmailTo.addEventListener("input", () => {
      localStorage.setItem("busEmailTo", ui.busEmailTo.value || "");
    });
  }
  if (ui.assignModalTeacherSelect) {
    ui.assignModalTeacherSelect.addEventListener("change", () => {
      refreshAssignModalClassOptions();
    });
  }
  if (ui.assignModalLevelSelect) {
    ui.assignModalLevelSelect.addEventListener("change", () => {
      refreshAssignModalClassOptions();
    });
  }
  if (ui.assignModalConfirmBtn) {
    ui.assignModalConfirmBtn.addEventListener("click", async () => {
      await confirmAssignModal();
    });
  }
  if (ui.plannerTeacherSelect) {
    ui.plannerTeacherSelect.addEventListener("change", () => {
      state.selectedAdminTeacherIds = Array.from(ui.plannerTeacherSelect.selectedOptions).map((o) => o.value);
      renderPlannerGrid();
    });
  }
  if (ui.plannerShowGlobal) {
    ui.plannerShowGlobal.addEventListener("change", () => {
      state.showGlobalPlanner = ui.plannerShowGlobal.checked;
      renderPlannerGrid();
    });
  }
  if (ui.desiderataTeacherSelect) {
    ui.desiderataTeacherSelect.addEventListener("change", () => {
      state.selectedDesiderataTeacherId = ui.desiderataTeacherSelect.value;
      state.desiderataDraftTeacherId = "";
      state.desiderataDirty = false;
      renderDesiderata();
    });
  }
  if (ui.desiderataClearBtn) {
    ui.desiderataClearBtn.addEventListener("click", () => {
      state.desiderataDraft = new Map();
      state.desiderataDirty = true;
      renderDesiderata();
    });
  }
  if (ui.desiderataSaveBtn) {
    ui.desiderataSaveBtn.addEventListener("click", async () => {
      await persistDesiderataDraft("BROUILLON");
    });
  }
  if (ui.desiderataSubmitBtn) {
    ui.desiderataSubmitBtn.addEventListener("click", async () => {
      await persistDesiderataDraft("SOUMIS");
    });
  }
  if (ui.teacherEditSelect) {
    ui.teacherEditSelect.addEventListener("change", () => {
      const teacherId = ui.teacherEditSelect.value;
      if (!teacherId) {
        resetTeacherForm();
        return;
      }
      startTeacherEdit(teacherId);
    });
  }
  if (ui.teacherCancelEditBtn) {
    ui.teacherCancelEditBtn.addEventListener("click", () => {
      resetTeacherForm();
    });
  }

  if (ui.teacherForm) ui.teacherForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = ui.teacherName.value.trim();
    const abbreviation = normalizeTeacherAbbreviation(ui.teacherAbbreviation.value, name);
    const maxHours = Number(ui.teacherMaxHours.value);
    const color = normalizeHexColor(ui.teacherColor.value);

    if (!name || !abbreviation || !maxHours) return;
    try {
      if (state.editingTeacherId) {
        await updateDoc(doc(db, "teachers", state.editingTeacherId), {
          name,
          abbreviation,
          maxHours,
          color,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "teachers"), {
          name,
          abbreviation,
          maxHours,
          color,
          createdAt: serverTimestamp(),
        });
      }
      ui.sessionError.textContent = "";
      resetTeacherForm();
    } catch (error) {
      ui.sessionError.textContent =
        "Erreur Firestore: permissions insuffisantes. Déployez les règles avec `firebase deploy --only firestore:rules`.";
      console.error(error);
    }
  });

  if (ui.classForm) ui.classForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const level = ui.classLevel.value;
    const count = Number(ui.classCount.value);
    const rule = getLevelRule(level);
    const weeklyHours = Number(rule?.weeklyHours || 0);
    if (!level || !weeklyHours) return;
    if (!count || count < 1 || count > 26) {
      ui.classCreateInfo.innerHTML = `<span class="hours-over">Le nombre doit être entre 1 et 26.</span>`;
      return;
    }

    const prefix = getLevelPrefix(level);
    const existing = new Set(
      state.classes
        .filter((c) => c.level === level)
        .map((c) => String(c.name || "").toUpperCase())
    );

    const targetNames = [];
    for (let i = 0; i < count; i += 1) {
      const letter = String.fromCharCode(65 + i);
      targetNames.push(`${prefix}${letter}`);
    }

    let created = 0;
    let skipped = 0;
    for (const name of targetNames) {
      if (existing.has(name.toUpperCase())) {
        skipped += 1;
        continue;
      }
      await addDoc(collection(db, "classes"), {
        level,
        name,
        weeklyHours,
        ruleGroup: rule.group,
        createdAt: serverTimestamp(),
      });
      created += 1;
    }

    ui.classCount.value = "1";
    ui.classCreateInfo.innerHTML = `<span class="${skipped ? "hours-over" : "hours-ok"}">Créées: ${created}${skipped ? `, ignorées (déjà existantes): ${skipped}` : ""}.</span>`;
    applyClassRule();
  });

  if (ui.publicTeacherSelect) {
    ui.publicTeacherSelect.addEventListener("change", () => {
      state.selectedPublicTeacherId = ui.publicTeacherSelect.value;
      renderPublic();
    });
  }
}

function syncPublicTeacherSelection() {
  if (!state.selectedPublicTeacherId) state.selectedPublicTeacherId = "__ALL__";
  if (state.selectedPublicTeacherId === "__ALL__") return;
  if (!state.teachers.some((t) => t.id === state.selectedPublicTeacherId)) {
    state.selectedPublicTeacherId = "__ALL__";
  }
}

function syncDesiderataTeacherSelection() {
  const validIds = new Set(state.teachers.map((t) => t.id));
  if (!state.selectedDesiderataTeacherId || !validIds.has(state.selectedDesiderataTeacherId)) {
    state.selectedDesiderataTeacherId = state.teachers[0]?.id || "";
  }
}

function syncAdminTeacherSelection() {
  const validIds = new Set(state.teachers.map((t) => t.id));
  if (state.editingTeacherId && !validIds.has(state.editingTeacherId)) {
    state.editingTeacherId = "";
  }
  state.selectedAdminTeacherIds = state.selectedAdminTeacherIds.filter((id) => validIds.has(id));
  if (!state.selectedAdminTeacherIds.length && state.teachers.length) {
    state.selectedAdminTeacherIds = [state.teachers[0].id];
  }
  state.selectedAdminTeacherId = state.selectedAdminTeacherIds[0] || "";
}

function setTeacherConstraintsSelection(unavailable) {
  if (!ui.teacherConstraintsGrid) return;
  const set = new Set(Array.isArray(unavailable) ? unavailable : []);
  ui.teacherConstraintsGrid.querySelectorAll("input[type='checkbox']").forEach((el) => {
    el.checked = set.has(el.value);
  });
}

function startTeacherEdit(teacherId) {
  const teacher = state.teachers.find((t) => t.id === teacherId);
  if (!teacher) {
    resetTeacherForm();
    return;
  }
  if (!ui.teacherEditSelect || !ui.teacherName || !ui.teacherAbbreviation || !ui.teacherMaxHours || !ui.teacherColor) return;
  state.editingTeacherId = teacher.id;
  ui.teacherEditSelect.value = teacher.id;
  ui.teacherName.value = teacher.name || "";
  ui.teacherAbbreviation.value = normalizeTeacherAbbreviation(teacher.abbreviation, teacher.name || "");
  ui.teacherMaxHours.value = String(teacher.maxHours || "");
  ui.teacherColor.value = normalizeHexColor(teacher.color);
  setTeacherConstraintsSelection(teacher.unavailable || []);
  if (ui.teacherSubmitBtn) ui.teacherSubmitBtn.textContent = "Enregistrer les modifications";
  if (ui.teacherCancelEditBtn) ui.teacherCancelEditBtn.classList.remove("hidden");
}

function resetTeacherForm() {
  state.editingTeacherId = "";
  if (ui.teacherForm) ui.teacherForm.reset();
  if (ui.teacherEditSelect) ui.teacherEditSelect.value = "";
  if (ui.teacherColor) ui.teacherColor.value = "#0b7285";
  if (ui.teacherSubmitBtn) ui.teacherSubmitBtn.textContent = "Ajouter professeur";
  if (ui.teacherCancelEditBtn) ui.teacherCancelEditBtn.classList.add("hidden");
  setTeacherConstraintsSelection([]);
}

function computeTeacherHours() {
  const map = new Map();
  for (const t of state.teachers) map.set(t.id, 0);
  for (const s of state.sessions) {
    map.set(s.teacherId, (map.get(s.teacherId) || 0) + weeklyEquivalentHours(s));
  }
  return map;
}

function render() {
  syncAdminTeacherSelection();
  syncDesiderataTeacherSelection();
  renderTeacherOptions();
  renderClassOptions();
  renderPlannerGrid();
  renderTeacherList();
  renderClassList();
  renderSessionsList();
  renderSwimPlanner();
  renderProgrammingPanel();
  renderBusPanel();
  renderDesiderata();
  renderAdminSummary();
  renderPublic();
}

function renderTeacherOptions() {
  if (!ui.publicTeacherSelect || !ui.plannerTeacherSelect || !ui.desiderataTeacherSelect || !ui.teacherEditSelect) return;
  const opts = state.teachers.map((t) => `<option value="${t.id}">${escapeHtml(t.name)}</option>`).join("");
  ui.publicTeacherSelect.innerHTML = `<option value="__ALL__">Tous les enseignants</option>${opts}`;
  ui.plannerTeacherSelect.innerHTML = opts;
  ui.desiderataTeacherSelect.innerHTML = opts;
  ui.teacherEditSelect.innerHTML = `<option value="">Nouveau professeur</option>${opts}`;

  if (state.selectedPublicTeacherId) {
    ui.publicTeacherSelect.value = state.selectedPublicTeacherId;
  }
  const selected = new Set(state.selectedAdminTeacherIds);
  Array.from(ui.plannerTeacherSelect.options).forEach((opt) => {
    opt.selected = selected.has(opt.value);
  });
  ui.plannerShowGlobal.checked = state.showGlobalPlanner;
  ui.desiderataTeacherSelect.value = state.selectedDesiderataTeacherId || "";
  ui.teacherEditSelect.value = state.editingTeacherId || "";
  if (ui.teacherSubmitBtn) ui.teacherSubmitBtn.textContent = state.editingTeacherId ? "Enregistrer les modifications" : "Ajouter professeur";
  if (ui.teacherCancelEditBtn) ui.teacherCancelEditBtn.classList.toggle("hidden", !state.editingTeacherId);
}

function renderClassOptions() {
  // Classes are selected directly from planners.
}

function renderPlannerGrid() {
  const selectedSet = new Set(state.selectedAdminTeacherIds);
  if (state.adminPicker && !selectedSet.has(state.adminPicker.teacherId)) {
    state.adminPicker = null;
  }
  if (!state.showGlobalPlanner) {
    state.globalPicker = null;
  }

  const teacherCards = state.selectedAdminTeacherIds
    .map((id) => {
      const t = state.teachers.find((x) => x.id === id);
      if (!t) return "";
      return `
        <div class="card">
          <h3>Affectation rapide (${escapeHtml(t.name)})</h3>
          <p id="adminPlannerHint-${escapeHtml(id)}" class="summary-box"></p>
          <div id="adminPlannerContainer-${escapeHtml(id)}" class="table-wrap"></div>
        </div>
      `;
    })
    .join("");

  const globalCard = state.showGlobalPlanner
    ? `
      <div class="card">
        <h3>Planning général (tous les enseignants)</h3>
        <p id="globalPlannerHint" class="summary-box"></p>
        <div id="globalPlannerContainer" class="table-wrap"></div>
      </div>
    `
    : "";

  ui.plannerGrid.innerHTML = teacherCards + globalCard || `<div class="card"><p>Aucun affichage sélectionné.</p></div>`;
  const displayedCount = state.selectedAdminTeacherIds.length + (state.showGlobalPlanner ? 1 : 0);
  ui.plannerGrid.classList.toggle("compact", displayedCount >= 3);
  const columns = getPlannerColumns(displayedCount);
  ui.plannerGrid.style.gridTemplateColumns = columns > 0 ? `repeat(${columns}, minmax(0, 1fr))` : "1fr";

  const prevAdminHint = ui.adminPlannerHint;
  const prevAdminContainer = ui.adminPlannerContainer;
  const prevGlobalHint = ui.globalPlannerHint;
  const prevGlobalContainer = ui.globalPlannerContainer;
  const prevTeacherId = state.selectedAdminTeacherId;

  for (const id of state.selectedAdminTeacherIds) {
    ui.adminPlannerHint = document.getElementById(`adminPlannerHint-${id}`);
    ui.adminPlannerContainer = document.getElementById(`adminPlannerContainer-${id}`);
    if (!ui.adminPlannerHint || !ui.adminPlannerContainer) continue;
    state.selectedAdminTeacherId = id;
    renderAdminPlanner();
  }

  if (state.showGlobalPlanner) {
    ui.globalPlannerHint = document.getElementById("globalPlannerHint");
    ui.globalPlannerContainer = document.getElementById("globalPlannerContainer");
    if (ui.globalPlannerHint && ui.globalPlannerContainer) {
      renderGlobalPlanner();
    }
  }

  ui.adminPlannerHint = prevAdminHint;
  ui.adminPlannerContainer = prevAdminContainer;
  ui.globalPlannerHint = prevGlobalHint;
  ui.globalPlannerContainer = prevGlobalContainer;
  state.selectedAdminTeacherId = prevTeacherId;
}

function getPlannerColumns(displayedCount) {
  if (!displayedCount) return 1;
  if (window.innerWidth <= 1100) return 1;
  return Math.ceil(Math.sqrt(displayedCount));
}

function renderTeacherList() {
  if (!ui.teachersList) return;
  const hoursByTeacher = computeTeacherHours();
  ui.teachersList.innerHTML = state.teachers
    .map((t) => {
      const used = hoursByTeacher.get(t.id) || 0;
      const over = used > Number(t.maxHours || 0);
      const color = getTeacherColor(t);
      return `<li class="data-item">
        <div>
          <span class="teacher-color-dot" style="background:${escapeHtml(color)}"></span>
          <strong>${escapeHtml(t.name)}</strong><br>
          ${formatHours(used)}/${formatHours(t.maxHours)}h <span class="${over ? "hours-over" : "hours-ok"}">${over ? "(dépassement)" : ""}</span>
        </div>
        <button class="delete-btn" data-delete-teacher="${t.id}" type="button">Supprimer</button>
      </li>`;
    })
    .join("");

  ui.teachersList.querySelectorAll("[data-delete-teacher]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const teacherId = btn.dataset.deleteTeacher;
      const isUsed = state.sessions.some((s) => s.teacherId === teacherId);
      if (isUsed) {
        ui.sessionError.textContent = "Suppression refusée: ce professeur est utilisé dans des créneaux.";
        return;
      }
      await deleteDoc(doc(db, "teachers", btn.dataset.deleteTeacher));
    });
  });
}

function renderClassList() {
  if (!ui.classesList) return;
  const assignedByClass = new Map();
  for (const c of state.classes) assignedByClass.set(c.id, 0);
  for (const s of state.sessions) assignedByClass.set(s.classId, (assignedByClass.get(s.classId) || 0) + weeklyEquivalentHours(s));

  ui.classesList.innerHTML = state.classes
    .map((c) => {
      const used = assignedByClass.get(c.id) || 0;
      const over = used > Number(c.weeklyHours || 0);
      return `<li class="data-item">
        <div>
          <strong>${escapeHtml(c.level)} ${escapeHtml(c.name)}</strong><br>
          <span class="${over ? "hours-over" : "hours-ok"}">${formatHours(used)}/${formatHours(c.weeklyHours)}h</span>
        </div>
        <button class="delete-btn" data-delete-class="${c.id}" type="button">Supprimer</button>
      </li>`;
    })
    .join("");

  ui.classesList.querySelectorAll("[data-delete-class]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const classId = btn.dataset.deleteClass;
      const isUsed = state.sessions.some((s) => s.classId === classId);
      if (isUsed) {
        ui.sessionError.textContent = "Suppression refusée: cette classe est utilisée dans des créneaux.";
        return;
      }
      await deleteDoc(doc(db, "classes", btn.dataset.deleteClass));
    });
  });
}

function renderSessionsList() {
  if (!ui.sessionsList) return;
  ui.sessionsList.innerHTML = state.sessions
    .map((s) => {
      const teacher = state.teachers.find((t) => t.id === s.teacherId);
      const cadenceLabel = normalizeCadence(s.cadence) === "BIWEEKLY" ? ` - Semaine ${normalizeWeekType(s.weekType)}` : "";
      return `<li class="data-item">
        <div>
          <strong>${escapeHtml(s.day)} ${escapeHtml(s.start)} (${s.duration}h${escapeHtml(cadenceLabel)})</strong><br>
          ${escapeHtml(s.type)} - ${escapeHtml(teacher?.name || "Prof inconnu")} - ${escapeHtml(getClassLabelById(s.classId, true))}
        </div>
        <button class="delete-btn" data-delete-session="${s.id}" type="button">Supprimer</button>
      </li>`;
    })
    .join("");

  ui.sessionsList.querySelectorAll("[data-delete-session]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await deleteDoc(doc(db, "sessions", btn.dataset.deleteSession));
    });
  });
}

function renderAdminSummary() {
  const hoursByTeacher = computeTeacherHours();
  const rows = state.teachers.map((t) => {
    const used = hoursByTeacher.get(t.id) || 0;
    const max = Number(t.maxHours || 0);
    const over = used > max;
    const teacherSessions = state.sessions.filter((s) => s.teacherId === t.id);
    const details = teacherSessions.length
      ? teacherSessions
          .map((s) => {
            const cadence = normalizeCadence(s.cadence) === "BIWEEKLY" ? ` - Semaine ${normalizeWeekType(s.weekType)}` : "";
            const label = getClassLabelById(s.classId, true);
            const typeLabel = s.type || "EPS";
            return `${typeLabel} ${label} (${s.day} ${s.start}, ${s.duration}h${cadence})`;
          })
          .join("<br>")
      : "Aucun créneau";

    return `<tr>
      <td><strong>${escapeHtml(t.name)}</strong></td>
      <td><span class="${over ? "hours-over" : "hours-ok"}">${formatHours(used)}/${formatHours(max)}h</span></td>
      <td>${details}</td>
    </tr>`;
  });

  ui.adminRecapContainer.innerHTML = `
    <table>
      <tr>
        <th>Professeur</th>
        <th>Heures</th>
        <th>Classes / AS attribués</th>
      </tr>
      ${rows.join("") || `<tr><td colspan="3">Aucun professeur.</td></tr>`}
    </table>
  `;
}

function getProgramActivities() {
  return state.programActivities;
}

function getProgramLocations() {
  return state.programLocations;
}

function renderProgrammingPanel() {
  if (!ui.programActivitiesList || !ui.programLocationsList || !ui.programStats || !ui.programHint) return;
  if (state.programEditSessionId && !state.sessions.some((s) => s.id === state.programEditSessionId)) {
    state.programEditSessionId = "";
  }

  const activities = getProgramActivities();
  const locations = getProgramLocations();
  const staleSessionsCount = state.sessions.filter((s) => !isSessionClassCurrent(s)).length;
  const visibleSessions = getCurrentClassSessions();
  const total = visibleSessions.length;
  const programmed = visibleSessions.filter((s) => s.activityLabel && s.locationName).length;
  const pending = Math.max(0, total - programmed);

  const locationConflictCount = countLocationConflicts(visibleSessions);
  const hintParts = [];
  hintParts.push(
    locationConflictCount > 0
      ? `<span class="hours-over">${locationConflictCount} conflit(s) de salle détecté(s) sur la semaine.</span>`
      : `<span class="hours-ok">Aucun conflit de salle sur la semaine.</span>`
  );
  if (staleSessionsCount > 0) {
    hintParts.push(`<span class="hours-over">${staleSessionsCount} créneau(x) masqué(s): classes supprimées / non actuelles.</span>`);
  }
  ui.programHint.innerHTML = hintParts.join("<br>");

  ui.programStats.innerHTML = `
    <p>Programmés <strong>${total ? Math.round((programmed / total) * 100) : 0}%</strong></p>
    <p>Créneaux en attente <strong>${pending}</strong></p>
    <p>Conflits de salle <strong class="${locationConflictCount ? "hours-over" : "hours-ok"}">${locationConflictCount}</strong></p>
  `;

  const activityLocationOptions = locations
    .map((l) => `<option value="${escapeHtml(l.name)}">${escapeHtml(l.name)}</option>`)
    .join("");
  const activityItems = activities
    .map(
      (a) => `<div class="program-activity-card">
        <div class="program-activity-card-head">
          <strong>${escapeHtml(a.label)}</strong>
        </div>
        <div class="program-activity-card-grid">
          <input type="text" data-edit-program-activity-label="${escapeHtml(a.id)}" value="${escapeHtml(a.label)}" placeholder="Nom activité" />
          <input type="text" data-edit-program-activity-code="${escapeHtml(a.id)}" value="${escapeHtml(a.code || "")}" maxlength="6" placeholder="Code" />
          <select data-edit-program-activity-location="${escapeHtml(a.id)}">
            <option value="">Salle préférentielle (optionnel)</option>
            ${activityLocationOptions}
          </select>
        </div>
        <div class="program-activity-card-actions">
          <button class="secondary-btn" type="button" data-save-program-activity="${escapeHtml(a.id)}">Enregistrer</button>
          <button class="delete-btn" type="button" data-delete-program-activity="${escapeHtml(a.id)}">Suppr.</button>
        </div>
      </div>`
    )
    .join("");
  ui.programActivitiesList.innerHTML = activityItems || `<p class="slot-picker-empty">Aucune activité</p>`;
  for (const a of activities) {
    const locSel = ui.programActivitiesList.querySelector(`[data-edit-program-activity-location="${cssEscape(a.id)}"]`);
    if (locSel) locSel.value = String(a.preferredLocationName || "");
  }
  if (ui.programActivityPreferredLocationSelect) {
    ui.programActivityPreferredLocationSelect.innerHTML = `
      <option value="">Salle préférentielle (optionnel)</option>
      ${locations.map((l) => `<option value="${escapeHtml(l.name)}">${escapeHtml(l.name)}</option>`).join("")}
    `;
  }

  const locationUsage = computeLocationUsage(visibleSessions);
  const locationItems = locations
    .map((l) => {
      const percent = locationUsage.get(l.name) || 0;
      return `<div class="program-list-item">
        <span>${escapeHtml(l.name)}</span>
        <span>${percent}%</span>
        <span
          class="program-drag-pill"
          draggable="true"
          data-program-draggable="location"
          data-location-name="${escapeHtml(l.name)}"
          title="Glisser-déposer dans une séance"
        >Glisser</span>
        <button class="delete-btn" type="button" data-delete-program-location="${escapeHtml(l.id)}">Suppr.</button>
      </div>`;
    })
    .join("");
  ui.programLocationsList.innerHTML = locationItems || `<p class="slot-picker-empty">Aucun lieu</p>`;

  renderProgramPeriodsPanel();
  renderProgramClassPlans(activities);
  renderProgramAnnualVisual(activities, locations);

  bindProgrammingActions();
}

function getProgramPlanLabelsByClassId(classId) {
  const plan = getClassActivityPlan(classId) || {};
  const isAS = classId === "__AS__";
  const biweekly = !isAS && isClassBiweeklyProfile(classId);
  if (isAS) {
    return {
      h1: "Année",
      h2: "",
      h3: "",
      v1: String(plan.yearActivityLabel || ""),
      v2: "",
      v3: "",
    };
  }
  if (biweekly) {
    return {
      h1: "S1",
      h2: "S2",
      h3: "",
      v1: String(plan.s1ActivityLabel || ""),
      v2: String(plan.s2ActivityLabel || ""),
      v3: "",
    };
  }
  return {
    h1: "T1",
    h2: "T2",
    h3: "T3",
    v1: String(plan.t1ActivityLabel || ""),
    v2: String(plan.t2ActivityLabel || ""),
    v3: String(plan.t3ActivityLabel || ""),
  };
}

function renderProgramAnnualVisual(activities, locations) {
  if (!ui.programAnnualVisualContainer) return;
  const sessions = [...getCurrentClassSessions()].sort((a, b) => {
    const dayCmp = DAYS.indexOf(a.day) - DAYS.indexOf(b.day);
    if (dayCmp !== 0) return dayCmp;
    const slotCmp = String(a.start || "").localeCompare(String(b.start || ""), "fr");
    if (slotCmp !== 0) return slotCmp;
    return String(getClassLabelById(a.classId)).localeCompare(String(getClassLabelById(b.classId)), "fr");
  });
  if (!sessions.length) {
    ui.programAnnualVisualContainer.innerHTML = `<p class="slot-picker-empty">Aucun créneau pour générer la vue annuelle.</p>`;
    return;
  }

  const seen = new Set();
  const rows = [];
  let currentDay = "";
  let currentBandStart = "";
  for (const s of sessions) {
    const key = `${s.day}|${s.start}|${s.classId}|${s.teacherId}|${normalizeCadence(s.cadence)}|${normalizeWeekType(s.weekType)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (s.day !== currentDay) {
      currentDay = s.day;
      currentBandStart = "";
      rows.push(`<tr class="program-annual-day-row"><td colspan="9">${escapeHtml(currentDay)}</td></tr>`);
    }
    const teacher = state.teachers.find((t) => t.id === s.teacherId);
    const band = getBandForSlot(s.start);
    const bandLabel = band ? formatProgramBandRange(band.start, band.end) : String(s.start || "");
    const bandStart = String(band?.start || s.start || "");
    const slotStartClass = bandStart !== currentBandStart ? " annual-slot-group-start" : "";
    currentBandStart = bandStart;
    const plan = getClassActivityPlan(s.classId) || {};
    const defaultLieu = String(s.locationName || "");
    const t1Activity = getAnnualPlanDisplayValue(plan, s.classId, "t1", "activity", "");
    const t2Activity = getAnnualPlanDisplayValue(plan, s.classId, "t2", "activity", "");
    const t3Activity = getAnnualPlanDisplayValue(plan, s.classId, "t3", "activity", "");
    const t1Lieu = getAnnualPlanDisplayValue(plan, s.classId, "t1", "location", defaultLieu);
    const t2Lieu = getAnnualPlanDisplayValue(plan, s.classId, "t2", "location", defaultLieu);
    const t3Lieu = getAnnualPlanDisplayValue(plan, s.classId, "t3", "location", defaultLieu);
    const t1ActivityMeta = getAnnualPlanFieldMeta(s.classId, "t1", "activity");
    const t2ActivityMeta = getAnnualPlanFieldMeta(s.classId, "t2", "activity");
    const t3ActivityMeta = getAnnualPlanFieldMeta(s.classId, "t3", "activity");
    const t1LocationMeta = getAnnualPlanFieldMeta(s.classId, "t1", "location");
    const t2LocationMeta = getAnnualPlanFieldMeta(s.classId, "t2", "location");
    const t3LocationMeta = getAnnualPlanFieldMeta(s.classId, "t3", "location");
    const pickCell = (kind, period, value, meta) => {
      if (!meta.enabled) {
        return `<span class="annual-readonly">—</span>`;
      }
      const placeholder = kind === "activity" ? "Choisir activité" : "Choisir salle";
      return `<button
        class="annual-pick-btn"
        type="button"
        data-program-pick-cell="1"
        data-class-id="${escapeHtml(s.classId)}"
        data-period-key="${escapeHtml(period)}"
        data-kind="${escapeHtml(kind)}"
        data-day="${escapeHtml(s.day || "")}"
        data-slot="${escapeHtml(s.start || "")}"
      >${escapeHtml(value || placeholder)}</button>`;
    };
    rows.push(`<tr class="annual-slot-row${slotStartClass}">
      <td>${escapeHtml(bandLabel)}</td>
      <td>${escapeHtml(getClassLabelById(s.classId))}</td>
      <td class="annual-prof-cell" style="${escapeHtml(getTeacherBlockStyle(s.teacherId))}">${escapeHtml(getTeacherDisplayLabel(teacher))}</td>
      ${
        s.classId === "__AS__"
          ? `<td class="annual-merged-cell annual-trim-sep" colspan="6">
               <div class="annual-merged-inline">
                 ${pickCell("activity", "t1", t1Activity, t1ActivityMeta)}
                 ${pickCell("location", "t1", t1Lieu, t1LocationMeta)}
               </div>
             </td>`
          : `<td class="annual-trim-sep">
               ${pickCell("activity", "t1", t1Activity, t1ActivityMeta)}
             </td>
             <td>
               ${pickCell("location", "t1", t1Lieu, t1LocationMeta)}
             </td>
             <td class="annual-trim-sep">
               ${pickCell("activity", "t2", t2Activity, t2ActivityMeta)}
             </td>
             <td>
               ${pickCell("location", "t2", t2Lieu, t2LocationMeta)}
             </td>
             <td class="annual-trim-sep">
               ${pickCell("activity", "t3", t3Activity, t3ActivityMeta)}
             </td>
             <td>
               ${pickCell("location", "t3", t3Lieu, t3LocationMeta)}
             </td>`
      }
    </tr>`);
  }

  ui.programAnnualVisualContainer.innerHTML = `
    <table class="program-annual-table">
      <tr class="annual-head">
        <th rowspan="2">Horaire</th>
        <th rowspan="2">Classe</th>
        <th rowspan="2">Prof</th>
        <th colspan="2">Trimestre 1</th>
        <th colspan="2">Trimestre 2</th>
        <th colspan="2">Trimestre 3</th>
      </tr>
      <tr class="annual-subhead">
        <th>Activité</th>
        <th>Lieu</th>
        <th>Activité</th>
        <th>Lieu</th>
        <th>Activité</th>
        <th>Lieu</th>
      </tr>
      ${rows.join("")}
    </table>
  `;
  bindProgramAnnualVisualActions();
}

function formatProgramBandRange(start, end) {
  const toLabel = (timeValue) => {
    const [hRaw, mRaw] = String(timeValue || "").split(":");
    const h = String(Number(hRaw || 0));
    const m = String(mRaw || "00").padStart(2, "0");
    return `${h}h${m}`;
  };
  return `${toLabel(start)} - ${toLabel(end)}`;
}

function bindProgramAnnualVisualActions() {
  if (!ui.programAnnualVisualContainer) return;
  ui.programAnnualVisualContainer.querySelectorAll("[data-program-pick-cell]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const classId = String(btn.dataset.classId || "").trim();
      const periodKey = String(btn.dataset.periodKey || "").trim();
      const kind = String(btn.dataset.kind || "").trim();
      const day = String(btn.dataset.day || "").trim();
      const slot = String(btn.dataset.slot || "").trim();
      if (!classId || !periodKey || !kind) return;
      const fieldMeta = getAnnualPlanFieldMeta(classId, periodKey, kind);
      if (!fieldMeta.enabled) return;
      openProgramPickModal({
        classId,
        periodKey,
        kind,
        day,
        slot,
      });
    });
  });
}

function getClassPlanMode(classId) {
  if (classId === "__AS__") return "YEAR";
  if (isClassBiweeklyProfile(classId)) return "SEMESTER";
  return "TRIMESTER";
}

function getAnnualPlanFieldMeta(classId, periodKey, kind) {
  const activity = kind === "activity";
  const mode = getClassPlanMode(classId);
  const suffix = activity ? "ActivityLabel" : "LocationName";
  if (mode === "YEAR") {
    if (periodKey !== "t1") return { enabled: false, field: "", mode };
    return { enabled: true, field: `year${suffix}`, mode };
  }
  if (mode === "SEMESTER") {
    if (periodKey === "t1") return { enabled: true, field: `s1${suffix}`, mode };
    if (periodKey === "t2") return { enabled: true, field: `s2${suffix}`, mode };
    return { enabled: false, field: "", mode };
  }
  if (periodKey === "t1" || periodKey === "t2" || periodKey === "t3") {
    return { enabled: true, field: `${periodKey}${suffix}`, mode };
  }
  return { enabled: false, field: "", mode };
}

function getAnnualPlanDisplayValue(plan, classId, periodKey, kind, fallback = "") {
  const activity = kind === "activity";
  const mode = getClassPlanMode(classId);
  const suffix = activity ? "ActivityLabel" : "LocationName";
  if (mode === "YEAR") {
    if (periodKey !== "t1") return "";
    return String(plan[`year${suffix}`] || plan[`t1${suffix}`] || fallback || "");
  }
  if (mode === "SEMESTER") {
    if (periodKey === "t1") return String(plan[`s1${suffix}`] || plan[`t1${suffix}`] || fallback || "");
    if (periodKey === "t2") return String(plan[`s2${suffix}`] || plan[`t2${suffix}`] || fallback || "");
    return "";
  }
  if (periodKey === "t1" || periodKey === "t2" || periodKey === "t3") {
    return String(plan[`${periodKey}${suffix}`] || fallback || "");
  }
  return "";
}

function closeProgramPickModal() {
  if (!ui.programPickModal) return;
  ui.programPickModal.classList.add("hidden");
  state.programPickContext = null;
}

function openProgramPickModal(context) {
  if (!ui.programPickModal || !ui.programPickModalList || !ui.programPickModalTitle || !ui.programPickModalContext) return;
  const classId = String(context?.classId || "");
  const periodKey = String(context?.periodKey || "");
  const kind = String(context?.kind || "");
  if (!classId || !periodKey || !kind) return;
  const fieldMeta = getAnnualPlanFieldMeta(classId, periodKey, kind);
  if (!fieldMeta.enabled) return;

  state.programPickContext = {
    classId,
    periodKey,
    kind,
    field: fieldMeta.field,
    mode: fieldMeta.mode,
  };

  const sourceItems =
    kind === "activity"
      ? getProgramActivities().map((a) => ({ value: a.label, label: `${a.label}${a.code ? ` (${a.code})` : ""}` }))
      : getProgramLocations().map((l) => ({ value: l.name, label: l.name }));
  const periodLabel = periodKey === "t1" ? "Période 1" : periodKey === "t2" ? "Période 2" : "Période 3";
  const classLabel = getClassLabelById(classId);
  ui.programPickModalTitle.textContent = kind === "activity" ? "Choisir une activité" : "Choisir une salle";
  ui.programPickModalContext.textContent = `${classLabel} · ${periodLabel}${context.day && context.slot ? ` · ${context.day} ${context.slot}` : ""}`;

  const itemsHtml = sourceItems
    .map(
      (item) => `<button class="program-pick-item" type="button" data-program-pick-value="${escapeHtml(item.value)}">
      ${escapeHtml(item.label)}
    </button>`
    )
    .join("");
  const createLabel = kind === "activity" ? "Créer une activité" : "Créer une salle";
  const createPlaceholder = kind === "activity" ? "Nom de l'activité" : "Nom de la salle";
  const createButtonLabel = kind === "activity" ? "Ajouter activité" : "Ajouter salle";
  ui.programPickModalList.innerHTML = `
    <div class="program-pick-create-row">
      <label>${createLabel}</label>
      <div class="program-pick-create-controls">
        <input id="programPickCreateInput" type="text" placeholder="${escapeHtml(createPlaceholder)}" />
        <button id="programPickCreateBtn" class="secondary-btn" type="button">${createButtonLabel}</button>
      </div>
    </div>
    <button class="program-pick-item clear" type="button" data-program-pick-clear="1">Effacer</button>
    ${itemsHtml || `<p class="slot-picker-empty">${kind === "activity" ? "Aucune activité." : "Aucune salle."}</p>`}
  `;

  ui.programPickModalList.querySelectorAll("[data-program-pick-value]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await saveProgramPickValue(String(btn.dataset.programPickValue || ""));
    });
  });
  ui.programPickModalList.querySelectorAll("[data-program-pick-clear]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await saveProgramPickValue("");
    });
  });
  const createInput = ui.programPickModalList.querySelector("#programPickCreateInput");
  const createBtn = ui.programPickModalList.querySelector("#programPickCreateBtn");
  const handleCreate = async () => {
    const raw = String(createInput?.value || "").trim();
    if (!raw) return;
    try {
      if (kind === "activity") {
        const existing = getProgramActivities().find((a) => String(a.label || "").toLowerCase() === raw.toLowerCase());
        if (!existing) {
          await addDoc(collection(db, "programActivities"), {
            label: raw,
            code: raw.slice(0, 3).toUpperCase(),
            preferredLocationName: null,
            createdAt: serverTimestamp(),
          });
        }
      } else {
        const existing = getProgramLocations().find((l) => String(l.name || "").toLowerCase() === raw.toLowerCase());
        if (!existing) {
          await addDoc(collection(db, "programLocations"), {
            name: raw,
            createdAt: serverTimestamp(),
          });
        }
      }
      await saveProgramPickValue(raw);
    } catch (error) {
      ui.sessionError.textContent = `Erreur création: ${error?.message || "création impossible."}`;
    }
  };
  if (createBtn) createBtn.addEventListener("click", handleCreate);
  if (createInput) {
    createInput.addEventListener("keydown", async (e) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      await handleCreate();
    });
  }
  ui.programPickModal.classList.remove("hidden");
  if (createInput) createInput.focus();
}

async function saveProgramPickValue(value) {
  const ctx = state.programPickContext;
  if (!ctx?.classId || !ctx.field) return;
  let autoPickedLocation = "";
  const payload = {
    classId: ctx.classId,
    mode: ctx.mode,
    [ctx.field]: value || null,
    updatedAt: serverTimestamp(),
  };

  if (ctx.mode === "YEAR") {
    if (ctx.kind === "activity") payload.t1ActivityLabel = value || null;
    if (ctx.kind === "location") payload.t1LocationName = value || null;
  }
  if (ctx.mode === "SEMESTER") {
    if (ctx.field === "s1ActivityLabel") payload.t1ActivityLabel = value || null;
    if (ctx.field === "s1LocationName") payload.t1LocationName = value || null;
    if (ctx.field === "s2ActivityLabel") payload.t2ActivityLabel = value || null;
    if (ctx.field === "s2LocationName") payload.t2LocationName = value || null;
  }

  if (ctx.kind === "activity" && value) {
    const activity = getProgramActivities().find((a) => a.label === value);
    const preferred = String(activity?.preferredLocationName || "").trim();
    const locationMeta = getAnnualPlanFieldMeta(ctx.classId, ctx.periodKey, "location");
    if (preferred && locationMeta.enabled && locationMeta.field) {
      const currentPlan = getClassActivityPlan(ctx.classId) || {};
      const currentLocation = String(currentPlan[locationMeta.field] || "").trim();
      if (!currentLocation) {
        payload[locationMeta.field] = preferred;
        autoPickedLocation = preferred;
        if (ctx.mode === "YEAR") {
          payload.t1LocationName = preferred;
        }
        if (ctx.mode === "SEMESTER") {
          if (locationMeta.field === "s1LocationName") payload.t1LocationName = preferred;
          if (locationMeta.field === "s2LocationName") payload.t2LocationName = preferred;
        }
      }
    }
  }

  try {
    await setDoc(doc(db, "classActivityPlans", ctx.classId), payload, { merge: true });
    const chosenLocation =
      ctx.kind === "location" ? String(value || "").trim() : String(autoPickedLocation || "").trim();
    const locationConflicts = chosenLocation
      ? getAnnualPeriodLocationConflicts(ctx.classId, ctx.periodKey, chosenLocation)
      : [];
    if (locationConflicts.length) {
      ui.sessionError.textContent = `Alerte salle: "${chosenLocation}" déjà utilisée sur ce créneau par ${locationConflicts.length} classe(s).`;
    } else if (ctx.kind === "activity" && autoPickedLocation) {
      ui.sessionError.textContent = `Programmation annuelle enregistrée. Salle préférentielle appliquée: ${autoPickedLocation}.`;
    } else {
      ui.sessionError.textContent = "Programmation annuelle enregistrée.";
    }
    closeProgramPickModal();
  } catch (error) {
    ui.sessionError.textContent = `Erreur programmation annuelle: ${error?.message || "mise à jour impossible."}`;
  }
}

function renderProgramPeriodsPanel() {
  if (
    !ui.programTrim1Start ||
    !ui.programTrim1End ||
    !ui.programTrim2Start ||
    !ui.programTrim2End ||
    !ui.programTrim3Start ||
    !ui.programTrim3End ||
    !ui.programSem1Start ||
    !ui.programSem1End ||
    !ui.programSem2Start ||
    !ui.programSem2End ||
    !ui.programPeriodsInfo
  ) {
    return;
  }
  const p = state.programPeriods || {};
  ui.programTrim1Start.value = String(p.t1Start || "");
  ui.programTrim1End.value = String(p.t1End || "");
  ui.programTrim2Start.value = String(p.t2Start || "");
  ui.programTrim2End.value = String(p.t2End || "");
  ui.programTrim3Start.value = String(p.t3Start || "");
  ui.programTrim3End.value = String(p.t3End || "");
  ui.programSem1Start.value = String(p.s1Start || "");
  ui.programSem1End.value = String(p.s1End || "");
  ui.programSem2Start.value = String(p.s2Start || "");
  ui.programSem2End.value = String(p.s2End || "");

  const hasTrimesters = p.t1Start && p.t1End && p.t2Start && p.t2End && p.t3Start && p.t3End;
  const hasSemesters = p.s1Start && p.s1End && p.s2Start && p.s2End;
  const hasAll = hasTrimesters && hasSemesters;
  ui.programPeriodsInfo.innerHTML = hasAll
    ? `<span class="hours-ok">Trimestres et semestres configurés.</span>`
    : `<span>${hasTrimesters && !hasSemesters ? "Trimestres configurés, semestres incomplets." : "Renseignez les 3 trimestres et les 2 semestres."}</span>`;
}

function getClassActivityPlan(classId) {
  return state.classActivityPlans.find((x) => (x.classId || x.id) === classId) || null;
}

function isClassBiweeklyProfile(classId) {
  return state.sessions.some((s) => s.classId === classId && normalizeCadence(s.cadence) === "BIWEEKLY");
}

function renderProgramClassPlans(activities) {
  if (!ui.programClassPlanContainer) return;
  const classes = [...state.classes].sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "fr"));
  const rowsData = [...classes, { id: "__AS__", name: "AS", level: "Activités", __isAS: true }];
  if (!rowsData.length) {
    ui.programClassPlanContainer.innerHTML = `<p class="slot-picker-empty">Aucune classe.</p>`;
    return;
  }
  const activityOptions = activities
    .map((a) => `<option value="${escapeHtml(a.label)}">${escapeHtml(a.label)}</option>`)
    .join("");

  const rows = rowsData
    .map((c) => {
      if (c.__isAS) {
        return `<tr>
          <td><strong>${escapeHtml(c.name)}</strong></td>
          <td>ANNUEL</td>
          <td colspan="2">
            <label>Année scolaire</label>
            <select data-class-plan-year="${escapeHtml(c.id)}">
              <option value="">Activité</option>
              ${activityOptions}
            </select>
          </td>
          <td><button class="secondary-btn" type="button" data-save-class-plan="${escapeHtml(c.id)}">Enregistrer</button></td>
        </tr>`;
      }
      const biweekly = isClassBiweeklyProfile(c.id);
      const mode = biweekly ? "SEMESTRE" : "TRIMESTRE";
      const plan = getClassActivityPlan(c.id) || {};
      if (biweekly) {
        return `<tr>
          <td><strong>${escapeHtml(c.name)}</strong></td>
          <td>${escapeHtml(mode)}</td>
          <td>
            <label>S1</label>
            <select data-class-plan-s1="${escapeHtml(c.id)}">
              <option value="">Activité</option>
              ${activityOptions}
            </select>
          </td>
          <td>
            <label>S2</label>
            <select data-class-plan-s2="${escapeHtml(c.id)}">
              <option value="">Activité</option>
              ${activityOptions}
            </select>
          </td>
          <td><button class="secondary-btn" type="button" data-save-class-plan="${escapeHtml(c.id)}">Enregistrer</button></td>
        </tr>`;
      }
      return `<tr>
        <td><strong>${escapeHtml(c.name)}</strong></td>
        <td>${escapeHtml(mode)}</td>
        <td>
          <label>T1</label>
          <select data-class-plan-t1="${escapeHtml(c.id)}">
            <option value="">Activité</option>
            ${activityOptions}
          </select>
        </td>
        <td>
          <label>T2</label>
          <select data-class-plan-t2="${escapeHtml(c.id)}">
            <option value="">Activité</option>
            ${activityOptions}
          </select>
        </td>
        <td>
          <label>T3</label>
          <select data-class-plan-t3="${escapeHtml(c.id)}">
            <option value="">Activité</option>
            ${activityOptions}
          </select>
          <button class="secondary-btn" type="button" data-save-class-plan="${escapeHtml(c.id)}">Enregistrer</button>
        </td>
      </tr>`;
    })
    .join("");

  ui.programClassPlanContainer.innerHTML = `
    <table class="program-class-plan-table">
      <tr>
        <th>Classe</th>
        <th>Mode</th>
        <th>Période 1</th>
        <th>Période 2</th>
        <th>Période 3 / Action</th>
      </tr>
      ${rows}
    </table>
  `;

  for (const c of rowsData) {
    const plan = getClassActivityPlan(c.id) || {};
    if (c.__isAS) {
      const yearly = ui.programClassPlanContainer.querySelector(`[data-class-plan-year="${cssEscape(c.id)}"]`);
      if (yearly) yearly.value = String(plan.yearActivityLabel || "");
      continue;
    }
    if (isClassBiweeklyProfile(c.id)) {
      const s1 = ui.programClassPlanContainer.querySelector(`[data-class-plan-s1="${cssEscape(c.id)}"]`);
      const s2 = ui.programClassPlanContainer.querySelector(`[data-class-plan-s2="${cssEscape(c.id)}"]`);
      if (s1) s1.value = String(plan.s1ActivityLabel || "");
      if (s2) s2.value = String(plan.s2ActivityLabel || "");
    } else {
      const t1 = ui.programClassPlanContainer.querySelector(`[data-class-plan-t1="${cssEscape(c.id)}"]`);
      const t2 = ui.programClassPlanContainer.querySelector(`[data-class-plan-t2="${cssEscape(c.id)}"]`);
      const t3 = ui.programClassPlanContainer.querySelector(`[data-class-plan-t3="${cssEscape(c.id)}"]`);
      if (t1) t1.value = String(plan.t1ActivityLabel || "");
      if (t2) t2.value = String(plan.t2ActivityLabel || "");
      if (t3) t3.value = String(plan.t3ActivityLabel || "");
    }
  }
  bindProgramClassPlanActions();
}

async function saveProgramPeriods() {
  const payload = {
    t1Start: String(ui.programTrim1Start?.value || ""),
    t1End: String(ui.programTrim1End?.value || ""),
    t2Start: String(ui.programTrim2Start?.value || ""),
    t2End: String(ui.programTrim2End?.value || ""),
    t3Start: String(ui.programTrim3Start?.value || ""),
    t3End: String(ui.programTrim3End?.value || ""),
    s1Start: String(ui.programSem1Start?.value || ""),
    s1End: String(ui.programSem1End?.value || ""),
    s2Start: String(ui.programSem2Start?.value || ""),
    s2End: String(ui.programSem2End?.value || ""),
    updatedAt: serverTimestamp(),
  };
  try {
    await setDoc(doc(db, "planningConfig", "periods"), payload);
    ui.sessionError.textContent = "Dates des trimestres enregistrées.";
  } catch (error) {
    ui.sessionError.textContent = `Erreur trimestres: ${error?.message || "mise à jour impossible."}`;
  }
}

function bindProgramClassPlanActions() {
  if (!ui.programClassPlanContainer) return;
  ui.programClassPlanContainer.querySelectorAll("[data-save-class-plan]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const classId = btn.dataset.saveClassPlan;
      if (!classId) return;
      if (classId === "__AS__") {
        try {
          const yearly = String(
            ui.programClassPlanContainer.querySelector(`[data-class-plan-year="${cssEscape(classId)}"]`)?.value || ""
          ).trim();
          await setDoc(doc(db, "classActivityPlans", classId), {
            classId,
            mode: "YEAR",
            yearActivityLabel: yearly || null,
            updatedAt: serverTimestamp(),
          });
          ui.sessionError.textContent = "Plan d'activités AS (annuel) enregistré.";
        } catch (error) {
          ui.sessionError.textContent = `Erreur plan d'activités AS: ${error?.message || "mise à jour impossible."}`;
        }
        return;
      }
      const biweekly = isClassBiweeklyProfile(classId);
      try {
        if (biweekly) {
          const s1 = String(
            ui.programClassPlanContainer.querySelector(`[data-class-plan-s1="${cssEscape(classId)}"]`)?.value || ""
          ).trim();
          const s2 = String(
            ui.programClassPlanContainer.querySelector(`[data-class-plan-s2="${cssEscape(classId)}"]`)?.value || ""
          ).trim();
          await setDoc(doc(db, "classActivityPlans", classId), {
            classId,
            mode: "SEMESTER",
            s1ActivityLabel: s1 || null,
            s2ActivityLabel: s2 || null,
            updatedAt: serverTimestamp(),
          });
        } else {
          const t1 = String(
            ui.programClassPlanContainer.querySelector(`[data-class-plan-t1="${cssEscape(classId)}"]`)?.value || ""
          ).trim();
          const t2 = String(
            ui.programClassPlanContainer.querySelector(`[data-class-plan-t2="${cssEscape(classId)}"]`)?.value || ""
          ).trim();
          const t3 = String(
            ui.programClassPlanContainer.querySelector(`[data-class-plan-t3="${cssEscape(classId)}"]`)?.value || ""
          ).trim();
          await setDoc(doc(db, "classActivityPlans", classId), {
            classId,
            mode: "TRIMESTER",
            t1ActivityLabel: t1 || null,
            t2ActivityLabel: t2 || null,
            t3ActivityLabel: t3 || null,
            updatedAt: serverTimestamp(),
          });
        }
        ui.sessionError.textContent = "Plan d'activités de la classe enregistré.";
      } catch (error) {
        ui.sessionError.textContent = `Erreur plan d'activités: ${error?.message || "mise à jour impossible."}`;
      }
    });
  });
}

function renderBusPanel() {
  if (!ui.busPlannerContainer || !ui.busHint) return;
  const dayBlocks = DAYS.map((day) => {
    const sessions = state.sessions
      .filter((s) => s.day === day)
      .sort((a, b) => String(a.start || "").localeCompare(String(b.start || ""), "fr"));
    if (!sessions.length) {
      return `<div class="card bus-day-card">
        <h4>${escapeHtml(day)}</h4>
        <p class="slot-picker-empty">Aucune activité prévue.</p>
      </div>`;
    }

    const rows = sessions
      .map((s) => {
        const teacher = state.teachers.find((t) => t.id === s.teacherId);
        const classLabel = getClassLabelById(s.classId);
        const cadenceLabel = normalizeCadence(s.cadence) === "BIWEEKLY" ? `Semaine ${normalizeWeekType(s.weekType)}` : "Hebdo";
        const activityLabel = s.activityLabel || s.type || "Activité";
        const needsBus = Boolean(s.busRequired);
        return `<tr>
          <td>${escapeHtml(s.start)} (${Number(s.duration || 1)}h)</td>
          <td>${escapeHtml(getTeacherDisplayLabel(teacher))}</td>
          <td>${escapeHtml(classLabel)}</td>
          <td>${escapeHtml(activityLabel)} <small>${escapeHtml(cadenceLabel)}</small></td>
          <td><label class="check-row bus-check"><input type="checkbox" data-bus-required="${escapeHtml(s.id)}" ${needsBus ? "checked" : ""} /><span>Bus</span></label></td>
          <td><input type="time" data-bus-outbound-time="${escapeHtml(s.id)}" value="${escapeHtml(String(s.busOutboundTime || ""))}" /></td>
          <td><input type="time" data-bus-return-time="${escapeHtml(s.id)}" value="${escapeHtml(String(s.busReturnTime || ""))}" /></td>
          <td><input type="text" data-bus-outbound-dropoff="${escapeHtml(s.id)}" placeholder="Lieu dépose aller" value="${escapeHtml(String(s.busOutboundDropoff || ""))}" /></td>
          <td><input type="text" data-bus-return-dropoff="${escapeHtml(s.id)}" placeholder="Lieu dépose retour" value="${escapeHtml(String(s.busReturnDropoff || ""))}" /></td>
          <td><button class="secondary-btn" type="button" data-bus-save="${escapeHtml(s.id)}">Enregistrer</button></td>
        </tr>`;
      })
      .join("");

    return `<div class="card bus-day-card">
      <h4>${escapeHtml(day)}</h4>
      <div class="table-wrap">
        <table class="bus-table">
          <tr>
            <th>Créneau</th>
            <th>Prof</th>
            <th>Classe</th>
            <th>Activité</th>
            <th>Besoin bus</th>
            <th>Aller</th>
            <th>Retour</th>
            <th>Dépose aller</th>
            <th>Dépose retour</th>
            <th>Action</th>
          </tr>
          ${rows}
        </table>
      </div>
    </div>`;
  }).join("");

  const withBus = state.sessions.filter((s) => Boolean(s.busRequired)).length;
  ui.busHint.innerHTML = `<strong>${withBus}</strong> activité(s) marquée(s) avec transport bus.`;
  if (ui.busMailPreview) {
    const mailSessions = getBusSessionsForMail();
    const missing = getBusMissingFields(mailSessions);
    if (!mailSessions.length) {
      ui.busMailPreview.innerHTML = "Aucune commande bus à envoyer.";
    } else if (missing.length) {
      ui.busMailPreview.innerHTML = `<span class="hours-over">${missing.length} ligne(s) bus incomplète(s). Complétez avant envoi de l'email.</span>`;
    } else {
      ui.busMailPreview.innerHTML = `<span class="hours-ok">Commande prête: ${mailSessions.length} activité(s) prêtes à envoyer par email.</span>`;
    }
  }
  ui.busPlannerContainer.innerHTML = dayBlocks;
  bindBusActions();
}

function bindBusActions() {
  if (!ui.busPlannerContainer) return;
  ui.busPlannerContainer.querySelectorAll("[data-bus-save]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const sessionId = btn.dataset.busSave;
      if (!sessionId) return;
      const requiredEl = ui.busPlannerContainer.querySelector(`[data-bus-required="${cssEscape(sessionId)}"]`);
      const outboundEl = ui.busPlannerContainer.querySelector(`[data-bus-outbound-time="${cssEscape(sessionId)}"]`);
      const returnEl = ui.busPlannerContainer.querySelector(`[data-bus-return-time="${cssEscape(sessionId)}"]`);
      const outboundDropEl = ui.busPlannerContainer.querySelector(`[data-bus-outbound-dropoff="${cssEscape(sessionId)}"]`);
      const returnDropEl = ui.busPlannerContainer.querySelector(`[data-bus-return-dropoff="${cssEscape(sessionId)}"]`);
      const payload = {
        busRequired: Boolean(requiredEl?.checked),
        busOutboundTime: String(outboundEl?.value || "").trim() || null,
        busReturnTime: String(returnEl?.value || "").trim() || null,
        busOutboundDropoff: String(outboundDropEl?.value || "").trim() || null,
        busReturnDropoff: String(returnDropEl?.value || "").trim() || null,
        updatedAt: serverTimestamp(),
      };
      try {
        await updateDoc(doc(db, "sessions", sessionId), payload);
        ui.sessionError.textContent = "Transport bus enregistré.";
      } catch (error) {
        ui.sessionError.textContent = `Erreur transport bus: ${error?.message || "mise à jour impossible."}`;
      }
    });
  });
}

function getBusSessionsForMail() {
  return state.sessions
    .filter((s) => Boolean(s.busRequired))
    .sort((a, b) => {
      const dayCmp = DAYS.indexOf(a.day) - DAYS.indexOf(b.day);
      if (dayCmp !== 0) return dayCmp;
      return String(a.start || "").localeCompare(String(b.start || ""), "fr");
    });
}

function getBusMissingFields(sessions) {
  return sessions
    .map((s) => {
      const missing = [];
      if (!String(s.busOutboundTime || "").trim()) missing.push("horaire aller");
      if (!String(s.busReturnTime || "").trim()) missing.push("horaire retour");
      if (!String(s.busOutboundDropoff || "").trim()) missing.push("dépose aller");
      if (!String(s.busReturnDropoff || "").trim()) missing.push("dépose retour");
      if (!missing.length) return null;
      return `${s.day} : ${missing.join(", ")}`;
    })
    .filter(Boolean);
}

function buildBusEmailPayload() {
  const to = String(ui.busEmailTo?.value || "").trim();
  const sessions = getBusSessionsForMail();
  const missing = getBusMissingFields(sessions);
  const subject = "Commande bus EPS";

  const grouped = new Map();
  for (const d of DAYS) grouped.set(d, []);
  for (const s of sessions) grouped.get(s.day)?.push(s);

  const lines = [];
  lines.push("Bonjour Cathy,");
  lines.push("");
  lines.push("Voici la commande de bus EPS.");
  lines.push("");
  for (const day of DAYS) {
    const daySessions = grouped.get(day) || [];
    if (!daySessions.length) continue;
    lines.push(`${day}`);
    for (const s of daySessions) {
      lines.push(`- Aller: ${s.busOutboundTime || "à préciser"} -> ${s.busOutboundDropoff || "à préciser"}`);
      lines.push(`  Retour: ${s.busReturnTime || "à préciser"} -> ${s.busReturnDropoff || "à préciser"}`);
    }
    lines.push("");
  }
  lines.push("Merci.");

  return {
    to,
    subject,
    body: lines.join("\n"),
    sessionsCount: sessions.length,
    missing,
  };
}

function composeBusEmail() {
  const payload = buildBusEmailPayload();
  if (!payload.to) {
    ui.sessionError.textContent = "Renseignez l'email de Cathy avant envoi.";
    return;
  }
  if (!payload.sessionsCount) {
    ui.sessionError.textContent = "Aucune activité avec bus.";
    return;
  }
  if (payload.missing.length) {
    const preview = payload.missing.slice(0, 4).join(" | ");
    ui.sessionError.textContent = `Complétez les infos bus manquantes (${payload.missing.length}) avant envoi: ${preview}`;
    return;
  }

  const mailto = `mailto:${encodeURIComponent(payload.to)}?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(payload.body)}`;
  ui.sessionError.textContent = `Email prêt pour ${payload.sessionsCount} ligne(s) bus.`;
  window.location.href = mailto;
}

async function copyBusEmailText() {
  const payload = buildBusEmailPayload();
  if (!payload.sessionsCount) {
    ui.sessionError.textContent = "Aucune activité avec bus.";
    return;
  }
  try {
    await navigator.clipboard.writeText(payload.body);
    ui.sessionError.textContent = "Texte de la commande bus copié.";
  } catch (error) {
    ui.sessionError.textContent = `Copie impossible: ${error?.message || "presse-papiers indisponible."}`;
  }
}

function renderProgramSessionRow(session, activities, locations, bandStart, segment = "full") {
  const teacher = state.teachers.find((t) => t.id === session.teacherId);
  const startBand = getBandForSlot(session.start);
  const isStartSlot = startBand ? startBand.start === bandStart : String(session.start || "") === String(bandStart || "");
  const isOneHourSession = Number(session.duration || 0) <= 1;
  const activityText = session.activityLabel || "Activité non définie";
  const locationText = session.locationName || "Lieu non défini";
  const cadenceText = normalizeCadence(session.cadence) === "BIWEEKLY" ? `Semaine ${normalizeWeekType(session.weekType)}` : "Hebdo";
  const segClass = segment === "full" ? "" : ` band-seg-${segment}`;
  const isAS = isASLike(session);
  const hasProgramData = Boolean(String(session.activityLabel || "").trim()) && Boolean(String(session.locationName || "").trim());
  const isEditMode = state.programEditSessionId === session.id;

  if (!isStartSlot && !isOneHourSession) {
    return `
      <div class="program-session-row${segClass}" data-program-drop-session="${escapeHtml(session.id)}">
        <div class="program-session-line">${escapeHtml(getClassLabelById(session.classId))} - ${escapeHtml(getTeacherDisplayLabel(teacher))}</div>
        <div class="program-session-line">${escapeHtml(activityText)} · ${escapeHtml(locationText)} · ${escapeHtml(cadenceText)}</div>
      </div>
    `;
  }

  if (isAS && hasProgramData && !isEditMode) {
    return `
      <div class="program-session-row${segClass}" data-program-toggle-edit="${escapeHtml(session.id)}" title="Cliquer pour modifier activité/salle">
        <div class="program-session-line">${escapeHtml(getClassLabelById(session.classId))} - ${escapeHtml(getTeacherDisplayLabel(teacher))}</div>
        <div class="program-session-line">${escapeHtml(activityText)} · ${escapeHtml(locationText)} · ${escapeHtml(cadenceText)}</div>
      </div>
    `;
  }

  const activityOptions = activities
    .map((a) => `<option value="${escapeHtml(a.label)}" ${session.activityLabel === a.label ? "selected" : ""}>${escapeHtml(a.label)} (${escapeHtml(a.code || "")})</option>`)
    .join("");
  const locationOptions = locations
    .map((l) => `<option value="${escapeHtml(l.name)}" ${session.locationName === l.name ? "selected" : ""}>${escapeHtml(l.name)}</option>`)
    .join("");
  return `
    <div class="program-session-row${segClass}" data-program-drop-session="${escapeHtml(session.id)}">
      <div class="program-session-line">${escapeHtml(getClassLabelById(session.classId))} - ${escapeHtml(getTeacherDisplayLabel(teacher))}</div>
      <div class="program-session-controls">
        <select data-program-activity="${escapeHtml(session.id)}">
          <option value="">Activité</option>
          ${activityOptions}
        </select>
        <select data-program-location="${escapeHtml(session.id)}">
          <option value="">Lieu</option>
          ${locationOptions}
        </select>
        <button class="program-save-btn" data-program-save="${escapeHtml(session.id)}" type="button">OK</button>
      </div>
    </div>
  `;
}

function computeLocationUsage(visibleSessions) {
  const map = new Map();
  const total = Math.max(1, visibleSessions.length);
  for (const s of visibleSessions) {
    if (!s.locationName) continue;
    map.set(s.locationName, (map.get(s.locationName) || 0) + 1);
  }
  for (const [name, count] of map.entries()) {
    map.set(name, Math.round((count / total) * 100));
  }
  return map;
}

function countLocationConflicts(visibleSessions) {
  let conflicts = 0;
  for (let i = 0; i < visibleSessions.length; i += 1) {
    const a = visibleSessions[i];
    if (!a.locationName) continue;
    for (let j = i + 1; j < visibleSessions.length; j += 1) {
      const b = visibleSessions[j];
      if (!b.locationName) continue;
      if (a.locationName !== b.locationName) continue;
      if (a.day !== b.day) continue;
      if (String(a.classId || "") === String(b.classId || "")) continue;
      if (!sessionsConflict(a, b)) continue;
      conflicts += 1;
    }
  }
  return conflicts;
}

function getLocationConflictsForSession(sessionId, locationName) {
  const target = getCurrentClassSessions().find((s) => s.id === sessionId);
  if (!target || !locationName) return [];
  const candidate = {
    day: target.day,
    start: target.start,
    duration: Number(target.duration || 0),
    cadence: target.cadence,
    weekType: target.weekType,
  };
  return getCurrentClassSessions().filter((s) => {
    if (s.id === sessionId) return false;
    if (!s.locationName || s.locationName !== locationName) return false;
    if (String(s.classId || "") === String(target.classId || "")) return false;
    return sessionsConflict(candidate, s);
  });
}

function getBusyLocationsForSlot(day, slot, weekType) {
  const visibleSessions = getCurrentClassSessions().filter((s) => isSessionVisibleForWeek(s, weekType) && s.day === day);
  const band = getBandForSlot(slot);
  const targetKeys = (band ? band.slots : [slot]).map((s) => toSlotKey(day, s));
  const busy = new Map();
  for (const s of visibleSessions) {
    const covered = getCoveredSlots(s.day, s.start, Number(s.duration || 0));
    if (!targetKeys.some((k) => covered.includes(k))) continue;
    if (!s.locationName) continue;
    const teacher = state.teachers.find((t) => t.id === s.teacherId);
    const line = `${getTeacherDisplayLabel(teacher)} - ${getClassLabelById(s.classId)}`;
    const list = busy.get(s.locationName) || [];
    list.push(line);
    busy.set(s.locationName, list);
  }
  return busy;
}

function getPlannedLocationForSessionPeriod(session, periodKey) {
  const plan = getClassActivityPlan(session.classId) || {};
  return String(
    getAnnualPlanDisplayValue(plan, session.classId, periodKey, "location", String(session.locationName || "")) || ""
  ).trim();
}

function getAnnualPeriodLocationConflicts(classId, periodKey, locationName) {
  const targetLocation = String(locationName || "").trim();
  if (!classId || !periodKey || !targetLocation) return [];
  const sessions = getCurrentClassSessions();
  const targets = sessions.filter((s) => s.classId === classId);
  if (!targets.length) return [];

  const details = [];
  for (const target of targets) {
    const candidate = {
      day: target.day,
      start: target.start,
      duration: Number(target.duration || 0),
      cadence: target.cadence,
      weekType: target.weekType,
    };
    for (const other of sessions) {
      if (String(other.classId || "") === String(classId)) continue;
      if (!sessionsConflict(candidate, other)) continue;
      const otherLocation = getPlannedLocationForSessionPeriod(other, periodKey);
      if (otherLocation !== targetLocation) continue;
      const otherBand = getBandForSlot(other.start);
      const otherRange = otherBand ? formatProgramBandRange(otherBand.start, otherBand.end) : String(other.start || "");
      details.push(`${other.day} ${otherRange} - ${getClassLabelById(other.classId)}`);
    }
  }
  return Array.from(new Set(details));
}

function closeProgramRoomsModal() {
  if (!ui.programRoomsModal) return;
  ui.programRoomsModal.classList.add("hidden");
}

function openProgramRoomsModal(day, slot, weekType) {
  if (!ui.programRoomsModal || !ui.programRoomsModalBody) return;
  const locations = getProgramLocations();
  const busy = getBusyLocationsForSlot(day, slot, weekType);
  const available = locations.filter((l) => !busy.has(l.name));

  const busyHtml = Array.from(busy.entries())
    .map(([name, users]) => `<li><strong>${escapeHtml(name)}</strong> : ${escapeHtml(users.join(" | "))}</li>`)
    .join("");
  const availableHtml = available.map((l) => `<li>${escapeHtml(l.name)}</li>`).join("");

  ui.programRoomsModalTitle.textContent = "Salles disponibles";
  ui.programRoomsModalContext.textContent = `${day} ${slot} (Semaine ${weekType})`;
  ui.programRoomsModalBody.innerHTML = `
    <p><strong>Disponibles (${available.length})</strong></p>
    <ul>${availableHtml || "<li>Aucune salle libre</li>"}</ul>
    <p><strong>Occupées (${busy.size})</strong></p>
    <ul>${busyHtml || "<li>Aucune salle occupée</li>"}</ul>
  `;
  ui.programRoomsModal.classList.remove("hidden");
}

function bindProgrammingActions() {
  if (ui.programPlannerContainer) {
    ui.programPlannerContainer.querySelectorAll("[data-program-toggle-edit]").forEach((row) => {
      row.addEventListener("click", () => {
        const sessionId = row.dataset.programToggleEdit;
        if (!sessionId) return;
        state.programEditSessionId = sessionId;
        renderProgrammingPanel();
      });
    });

    ui.programPlannerContainer.querySelectorAll(".program-slot-cell").forEach((cell) => {
      cell.addEventListener("click", (e) => {
        if (e.target.closest("button,select,input")) return;
        if (e.target.closest("[data-program-toggle-edit]")) return;
        const day = cell.dataset.programDay;
        const slot = cell.dataset.programSlot;
        const week = normalizeWeekType(cell.dataset.programWeek);
        if (!day || !slot) return;
        openProgramRoomsModal(day, slot, week);
      });
    });
  }

  ui.programLocationsList.querySelectorAll("[data-program-draggable]").forEach((el) => {
    el.addEventListener("dragstart", (e) => {
      const type = el.dataset.programDraggable;
      if (!type || !e.dataTransfer) return;
      const payload = {
        type,
        name: String(el.dataset.locationName || ""),
      };
      e.dataTransfer.setData("application/json", JSON.stringify(payload));
      e.dataTransfer.effectAllowed = "copy";
    });
  });
  if (ui.programPlannerContainer) {
    ui.programPlannerContainer.querySelectorAll("[data-program-drop-session]").forEach((row) => {
      row.addEventListener("dragover", (e) => {
        if (!e.dataTransfer) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
        row.classList.add("program-drop-target");
      });
      row.addEventListener("dragleave", () => {
        row.classList.remove("program-drop-target");
      });
      row.addEventListener("drop", async (e) => {
        e.preventDefault();
        row.classList.remove("program-drop-target");
        const sessionId = row.dataset.programDropSession;
        if (!sessionId || !e.dataTransfer) return;
        const raw = e.dataTransfer.getData("application/json");
        if (!raw) return;
        let payload = null;
        try {
          payload = JSON.parse(raw);
        } catch {
          return;
        }
        try {
          if (payload?.type === "activity") {
            const session = state.sessions.find((s) => s.id === sessionId);
            const existingLocation = String(session?.locationName || "").trim();
            const preferredLocation = String(payload.preferredLocationName || "").trim();
            const autoLocation = existingLocation ? "" : preferredLocation;
            const conflicts = autoLocation ? getLocationConflictsForSession(sessionId, autoLocation) : [];
            await updateDoc(doc(db, "sessions", sessionId), {
              activityLabel: String(payload.label || "") || null,
              activityCode: String(payload.code || "") || null,
              locationName: autoLocation || session?.locationName || null,
              updatedAt: serverTimestamp(),
            });
            if (state.programEditSessionId === sessionId) state.programEditSessionId = "";
            if (autoLocation && conflicts.length) {
              ui.sessionError.textContent = `Activité affectée. Alerte: la salle "${autoLocation}" est déjà utilisée sur ce créneau par ${conflicts.length} autre(s) séance(s).`;
            } else if (autoLocation) {
              ui.sessionError.textContent = `Activité affectée. Salle préférentielle appliquée: ${autoLocation}.`;
            } else {
              ui.sessionError.textContent = "Activité affectée par glisser-déposer.";
            }
          } else if (payload?.type === "location") {
            const locationName = String(payload.name || "");
            const conflicts = locationName ? getLocationConflictsForSession(sessionId, locationName) : [];
            await updateDoc(doc(db, "sessions", sessionId), {
              locationName: locationName || null,
              updatedAt: serverTimestamp(),
            });
            if (state.programEditSessionId === sessionId) state.programEditSessionId = "";
            ui.sessionError.textContent = conflicts.length
              ? `Alerte: la salle "${locationName}" est déjà utilisée sur ce créneau par ${conflicts.length} autre(s) séance(s).`
              : "Lieu affecté par glisser-déposer.";
          }
        } catch (error) {
          ui.sessionError.textContent = `Erreur drag & drop: ${error?.message || "affectation impossible."}`;
        }
      });
    });

    ui.programPlannerContainer.querySelectorAll("[data-program-save]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const sessionId = btn.dataset.programSave;
        if (!sessionId) return;
        const activitySel = ui.programPlannerContainer.querySelector(`[data-program-activity="${cssEscape(sessionId)}"]`);
        const locationSel = ui.programPlannerContainer.querySelector(`[data-program-location="${cssEscape(sessionId)}"]`);
        const activityLabel = String(activitySel?.value || "").trim();
        const locationName = String(locationSel?.value || "").trim();
        const activity = getProgramActivities().find((a) => a.label === activityLabel);
        const session = state.sessions.find((s) => s.id === sessionId);
        const preferredLocation = String(activity?.preferredLocationName || "").trim();
        const finalLocationName = locationName || String(session?.locationName || "").trim() || preferredLocation || "";
        const conflicts = finalLocationName ? getLocationConflictsForSession(sessionId, finalLocationName) : [];
        try {
          await updateDoc(doc(db, "sessions", sessionId), {
            activityLabel: activityLabel || null,
            activityCode: activity?.code || null,
            locationName: finalLocationName || null,
            updatedAt: serverTimestamp(),
          });
          if (state.programEditSessionId === sessionId) state.programEditSessionId = "";
          if (conflicts.length) {
            ui.sessionError.textContent = `Alerte: la salle "${finalLocationName}" est déjà utilisée sur ce créneau par ${conflicts.length} autre(s) séance(s).`;
          } else if (!locationName && preferredLocation) {
            ui.sessionError.textContent = `Programmation enregistrée. Salle préférentielle appliquée: ${preferredLocation}.`;
          } else {
            ui.sessionError.textContent = "Programmation enregistrée.";
          }
        } catch (error) {
          ui.sessionError.textContent = `Erreur programmation: ${error?.message || "mise à jour impossible."}`;
        }
      });
    });
  }

  ui.programActivitiesList.querySelectorAll("[data-save-program-activity]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = String(btn.dataset.saveProgramActivity || "").trim();
      if (!id) return;
      const label = String(ui.programActivitiesList.querySelector(`[data-edit-program-activity-label="${cssEscape(id)}"]`)?.value || "").trim();
      const code = String(ui.programActivitiesList.querySelector(`[data-edit-program-activity-code="${cssEscape(id)}"]`)?.value || "")
        .trim()
        .toUpperCase();
      const preferredLocationName = String(
        ui.programActivitiesList.querySelector(`[data-edit-program-activity-location="${cssEscape(id)}"]`)?.value || ""
      ).trim();
      if (!label) {
        ui.sessionError.textContent = "Le nom de l'activité est obligatoire.";
        return;
      }
      try {
        await updateDoc(doc(db, "programActivities", id), {
          label,
          code: code || label.slice(0, 3).toUpperCase(),
          preferredLocationName: preferredLocationName || null,
          updatedAt: serverTimestamp(),
        });
        ui.sessionError.textContent = "Activité mise à jour.";
      } catch (error) {
        ui.sessionError.textContent = `Erreur mise à jour activité: ${error?.message || "mise à jour impossible."}`;
      }
    });
  });

  ui.programActivitiesList.querySelectorAll("[data-delete-program-activity]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.deleteProgramActivity;
      if (!id) return;
      try {
        await deleteDoc(doc(db, "programActivities", id));
      } catch (error) {
        ui.sessionError.textContent = `Erreur suppression activité: ${error?.message || "suppression impossible."}`;
      }
    });
  });

  ui.programLocationsList.querySelectorAll("[data-delete-program-location]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.deleteProgramLocation;
      if (!id) return;
      try {
        await deleteDoc(doc(db, "programLocations", id));
      } catch (error) {
        ui.sessionError.textContent = `Erreur suppression lieu: ${error?.message || "suppression impossible."}`;
      }
    });
  });
}

function renderPublic() {
  const allMode = state.selectedPublicTeacherId === "__ALL__";
  const teacher = state.teachers.find((t) => t.id === state.selectedPublicTeacherId);
  if (!allMode && !teacher) {
    ui.publicTeacherSummary.innerHTML = "Aucun professeur disponible.";
    ui.publicTimetableContainer.innerHTML = "";
    return;
  }

  const sessions = allMode ? state.sessions : state.sessions.filter((s) => s.teacherId === teacher.id);
  if (allMode) {
    ui.publicTeacherSummary.innerHTML = `<strong>Vue globale</strong><br>${state.teachers.length} enseignants affichés`;
  } else {
    const used = sessions.reduce((acc, s) => acc + weeklyEquivalentHours(s), 0);
    const over = used > Number(teacher.maxHours || 0);
    ui.publicTeacherSummary.innerHTML = `
      <strong>${escapeHtml(teacher.name)}</strong><br>
      Heures planifiées (équivalent hebdo): <span class="${over ? "hours-over" : "hours-ok"}">${formatHours(used)}/${formatHours(teacher.maxHours)}h</span>
    `;
  }

  const grid = new Map();
  for (const day of DAYS) for (const band of SLOT_BANDS) grid.set(toSlotKey(day, band.start), []);
  for (const s of sessions) {
    const prof = state.teachers.find((t) => t.id === s.teacherId);
    const blockStyle = getTeacherBlockStyle(s.teacherId);
    const segments = getSessionBandSegments(s);
    const cadenceTag = normalizeCadence(s.cadence) === "BIWEEKLY" ? ` (${normalizeWeekType(s.weekType)})` : "";
    const teacherLabel = getTeacherDisplayLabel(prof);
    const classLabel = getClassLabelById(s.classId);
    const text = allMode
      ? `${teacherLabel} - ${classLabel}${cadenceTag}`
      : `${classLabel}${cadenceTag}`;
    const css = "slot-block";
    for (const seg of segments) {
      const blockClass = `${css}${normalizeCadence(s.cadence) === "BIWEEKLY" ? ` biweekly-half biweekly-${normalizeWeekType(s.weekType).toLowerCase()}` : ""}`;
      const segClass = seg.segment === "full" ? "" : ` band-seg-${seg.segment}`;
      grid
        .get(toSlotKey(seg.day, seg.bandStart))
        ?.push(`<div class="${blockClass}${segClass}" style="${escapeHtml(blockStyle)}">${escapeHtml(text)}</div>`);
    }
  }

  const head = `<tr><th>Heure</th>${DAYS.map((d) => `<th>${d}</th>`).join("")}</tr>`;
  const rows = SLOT_BANDS.map((band) => {
    const cells = DAYS.map((day) => {
      const key = toSlotKey(day, band.start);
      const swimClass = hasSwimSlot(day, band.slots[0]) || hasSwimSlot(day, band.slots[1]) ? " slot-swim" : "";
      return `<td class="slot${swimClass}">${(grid.get(key) || []).join("")}</td>`;
    }).join("");
    return `<tr><th>${band.label}</th>${cells}</tr>`;
  }).join("");

  ui.publicTimetableContainer.innerHTML = `<table>${head}${rows}</table>`;
}

function renderAdminPlanner() {
  const container = ui.adminPlannerContainer;
  if (!container) return;
  const teacher = state.teachers.find((t) => t.id === state.selectedAdminTeacherId);
  if (!teacher) {
    ui.adminPlannerHint.textContent = "Sélectionnez un professeur.";
    container.innerHTML = "";
    return;
  }

  const usedHours = state.sessions
    .filter((s) => s.teacherId === teacher.id)
    .reduce((acc, s) => acc + weeklyEquivalentHours(s), 0);
  const maxHours = Number(teacher.maxHours || 0);
  const over = usedHours > maxHours;
  ui.adminPlannerHint.innerHTML = `
    Heures attribuées: <span class="${over ? "hours-over" : "hours-ok"}">${formatHours(usedHours)}/${formatHours(maxHours)}h</span><br>
    Classes avec heures restantes: ${getUnassignedClasses().length}. Cliquez un créneau libre pour pré-remplir l'affectation.
  `;

  const sessions = state.sessions.filter((s) => s.teacherId === teacher.id);
  const grid = new Map();
  for (const day of DAYS) for (const band of SLOT_BANDS) grid.set(toSlotKey(day, band.start), []);
  for (const s of sessions) {
    const blockStyle = getTeacherBlockStyle(s.teacherId);
    const segments = getSessionBandSegments(s);
    const cadenceTag = normalizeCadence(s.cadence) === "BIWEEKLY" ? ` (${normalizeWeekType(s.weekType)})` : "";
    const text = `${getClassLabelById(s.classId)}${cadenceTag}`;
    const css = "slot-block";
    for (const seg of segments) {
      const segClass = seg.segment === "full" ? "" : ` band-seg-${seg.segment}`;
      grid
        .get(toSlotKey(seg.day, seg.bandStart))
        ?.push(
          renderSessionBlockHtml({
            sessionId: s.id,
            text,
            style: blockStyle,
            className: `${css}${segClass}`,
            cadence: s.cadence,
            weekType: s.weekType,
          })
        );
    }
  }

  const head = `<tr><th>Heure</th>${DAYS.map((d) => `<th>${d}</th>`).join("")}</tr>`;
  const rows = SLOT_BANDS
    .map((band) => {
      const cells = DAYS.map((day) => {
        const key = toSlotKey(day, band.start);
        const blocks = grid.get(key) || [];
        const swimClass = hasSwimSlot(day, band.slots[0]) || hasSwimSlot(day, band.slots[1]) ? " slot-swim" : "";
        const desiderataPreferredClass =
          hasDesiderataSlot(teacher.id, day, band.slots[0]) || hasDesiderataSlot(teacher.id, day, band.slots[1])
            ? " slot-desiderata"
            : "";
        const desiderataUnavailableClass =
          hasDesiderataUnavailableSlot(teacher.id, day, band.slots[0]) ||
          hasDesiderataUnavailableSlot(teacher.id, day, band.slots[1])
          ? " slot-desiderata-unavailable"
          : "";
        const desiderataClass = `${desiderataPreferredClass}${desiderataUnavailableClass}`;
        if (blocks.length) {
          return `<td class="slot${swimClass}${desiderataClass}">${blocks.join("")}<button class="slot-action slot-add-inline" data-teacher-id="${escapeHtml(teacher.id)}" data-day="${escapeHtml(day)}" data-slot="${escapeHtml(band.start)}" type="button">+</button></td>`;
        }
        return `<td class="slot${swimClass}${desiderataClass}"><button class="slot-action" data-teacher-id="${escapeHtml(teacher.id)}" data-day="${escapeHtml(day)}" data-slot="${escapeHtml(band.start)}" type="button">+</button></td>`;
      }).join("");
      return `<tr><th>${band.label}</th>${cells}</tr>`;
    })
    .join("");

  container.innerHTML = `<table>${head}${rows}</table>`;
  container.querySelectorAll(".slot-action").forEach((btn) => {
    btn.addEventListener("click", () => {
      openAssignModal({
        source: "teacher",
        teacherId: btn.dataset.teacherId,
        day: btn.dataset.day,
        slot: btn.dataset.slot,
        weekType: "A",
      });
    });
  });
  bindSessionRemoveButtons(container);
}

function renderGlobalPlanner() {
  const container = ui.globalPlannerContainer;
  if (!container) return;
  const weekType = "A";
  const layout = state.selectedGlobalPlannerLayout === "EXCEL" ? "EXCEL" : "GRID";
  if (ui.globalWeekType) ui.globalWeekType.value = weekType;
  ui.globalPlannerLayout.value = layout;
  if (layout === "EXCEL") {
    renderGlobalPlannerExcel(weekType);
    return;
  }

  const grid = new Map();
  for (const day of DAYS) for (const band of SLOT_BANDS) grid.set(toSlotKey(day, band.start), []);

  for (const s of state.sessions) {
    const teacher = state.teachers.find((t) => t.id === s.teacherId);
    const blockStyle = getTeacherBlockStyle(s.teacherId);
    const segments = getSessionBandSegments(s);
    const cadenceTag = normalizeCadence(s.cadence) === "BIWEEKLY" ? ` (${normalizeWeekType(s.weekType)})` : "";
    const label = `${getTeacherDisplayLabel(teacher)} - ${getClassLabelById(s.classId)}${cadenceTag}`;
    for (const seg of segments) {
      grid.get(toSlotKey(seg.day, seg.bandStart))?.push({
        sessionId: s.id,
        teacherId: s.teacherId,
        classId: s.classId,
        label,
        type: s.type,
        blockStyle,
        cadence: s.cadence,
        weekType: s.weekType,
        segment: seg.segment,
      });
    }
  }

  let conflictsCount = 0;
  const conflictDetails = [];
  const head = `<tr><th>Heure</th>${DAYS.map((d) => `<th>${d}</th>`).join("")}</tr>`;
  const rows = SLOT_BANDS.map((band) => {
    const cells = DAYS.map((day) => {
      const key = toSlotKey(day, band.start);
      const entries = grid.get(key) || [];
      const hasSwim = hasSwimSlot(day, band.slots[0]) || hasSwimSlot(day, band.slots[1]);
      if (!entries.length) return `<td class="slot${hasSwim ? " slot-swim" : ""}">${renderGlobalEmptyCell(day, band.start, weekType)}</td>`;

      const reasonSet = new Set();
      for (let i = 0; i < entries.length; i += 1) {
        for (let j = i + 1; j < entries.length; j += 1) {
          const a = entries[i];
          const b = entries[j];
          const sameTeacher = a.teacherId === b.teacherId;
          const sameRealClass =
            a.classId === b.classId && !isSpecialAssignmentId(a.classId) && !isSpecialAssignmentId(b.classId);
          const bothAS = isASLike(a) && isASLike(b);
          if (!sameTeacher && !sameRealClass) continue;
          if (bothAS) continue;
          if (
            !sessionsCanOccurSameWeek(
              { cadence: a.cadence, weekType: a.weekType },
              { cadence: b.cadence, weekType: b.weekType }
            )
          ) {
            continue;
          }
          if (sameTeacher) {
            const teacher = state.teachers.find((t) => t.id === a.teacherId);
            reasonSet.add(`enseignant ${getTeacherDisplayLabel(teacher)}`);
          }
          if (sameRealClass) {
            reasonSet.add(`classe ${getClassLabelById(a.classId)}`);
          }
        }
      }

      let cellConflict = false;
      const blocks = entries
        .map((e) => {
          const conflict = entries.some((other) => {
            if (other.sessionId === e.sessionId) return false;
            const sameTeacher = other.teacherId === e.teacherId;
            const sameRealClass =
              other.classId === e.classId && !isSpecialAssignmentId(other.classId) && !isSpecialAssignmentId(e.classId);
            const bothAS = isASLike(other) && isASLike(e);
            const sameTeacherOrClass = sameTeacher || sameRealClass;
            if (!sameTeacherOrClass) return false;
            if (bothAS) return false;
            return sessionsCanOccurSameWeek(
              { cadence: e.cadence, weekType: e.weekType },
              { cadence: other.cadence, weekType: other.weekType }
            );
          });
          if (conflict) cellConflict = true;
          const baseClass = "slot-block";
          const segClass = e.segment === "full" ? "" : ` band-seg-${e.segment}`;
          return renderSessionBlockHtml({
            sessionId: e.sessionId,
            text: e.label,
            style: e.blockStyle,
            className: `${baseClass}${segClass}${conflict ? " conflict-block" : ""}`,
            cadence: e.cadence,
            weekType: e.weekType,
          });
        })
        .join("");

      if (cellConflict) {
        conflictsCount += 1;
        const reasonText = Array.from(reasonSet).join(", ");
        conflictDetails.push(`${day} ${band.label}: ${reasonText || "conflit de superposition"}`);
      }
      const swimClass = hasSwim ? " slot-swim" : "";
      return `<td class="slot${cellConflict ? " slot-conflict" : ""}${swimClass}">${blocks}<button class="slot-action slot-add-inline global-slot-action" data-day="${escapeHtml(day)}" data-slot="${escapeHtml(band.start)}" type="button">+</button></td>`;
    }).join("");
    return `<tr><th>${band.label}</th>${cells}</tr>`;
  }).join("");

  if (conflictsCount > 0) {
    const shown = conflictDetails.slice(0, 4).map((x) => `<li>${escapeHtml(x)}</li>`).join("");
    const more = conflictDetails.length > 4 ? `<p>+${conflictDetails.length - 4} autre(s) conflit(s).</p>` : "";
    ui.globalPlannerHint.innerHTML = `
      <span class="hours-over">${conflictsCount} créneau(x) en conflit détecté(s)</span> (vue conjointe semaines A + B).<br>
      <strong>Détail :</strong>
      <ul>${shown}</ul>
      ${more}
    `;
  } else {
    ui.globalPlannerHint.innerHTML = `<span class="hours-ok">Aucun conflit détecté</span> (vue conjointe semaines A + B).`;
  }
  container.innerHTML = `<table>${head}${rows}</table>`;
  bindGlobalPlannerActions(weekType, container);
  bindSessionRemoveButtons(container);
}

function renderGlobalPlannerExcel(weekType) {
  const dayHeaders = DAYS.map(
    (day) =>
      `<th colspan="3">${day}</th>`
  ).join("");
  const subHeaders = DAYS.map(() => "<th>N</th><th>Sem. paire</th><th>Sem. impaire</th>").join("");

  const bands = [
    { label: "08h15 à 10h00", start: "08:15", endExclusive: "10:20" },
    { label: "10h20 à 12h05", start: "10:20", endExclusive: "12:10" },
    { label: "12h10 à 13h55", start: "12:10", endExclusive: "14:00" },
    { label: "14h00 à 16h00", start: "14:00", endExclusive: "16:05" },
    { label: "16h05 à 17h50", start: "16:05", endExclusive: "23:59" },
  ];

  const keyFor = (day, bucket, start) => `${day}|${bucket}|${start}`;
  const buckets = ["N", "PAIR", "IMPAIR"];
  const cellMap = new Map();
  for (const day of DAYS) {
    for (const b of buckets) {
      for (const band of bands) {
        cellMap.set(keyFor(day, b, band.start), []);
      }
    }
  }

  for (const s of state.sessions) {
    const teacher = state.teachers.find((t) => t.id === s.teacherId);
    const bucket = normalizeCadence(s.cadence) === "WEEKLY" ? "N" : normalizeWeekType(s.weekType) === "A" ? "PAIR" : "IMPAIR";
    const start = String(s.start || "");
    const band = bands.find((b) => start >= b.start && start < b.endExclusive);
    if (!band) continue;
    const key = keyFor(s.day, bucket, band.start);
    if (!cellMap.has(key)) continue;
    const code = getTeacherDisplayLabel(teacher);
    cellMap.get(key).push({
      sessionId: s.id,
      teacherId: s.teacherId,
      classId: s.classId,
      type: s.type,
      label: `${getClassLabelById(s.classId)} - ${code}`,
      style: getTeacherBlockStyle(s.teacherId),
    });
  }

  let conflictsCount = 0;
  const conflictDetails = [];
  const rows = bands
    .map((band) => {
      const cells = DAYS.map((day) => {
        return buckets
          .map((bucket) => {
            const entries = cellMap.get(keyFor(day, bucket, band.start)) || [];
            if (!entries.length) return `<td class="slot"></td>`;

            const reasonSet = new Set();
            let cellConflict = false;
            const html = entries
              .map((e) => {
                const conflict = entries.some((other) => {
                  if (other.sessionId === e.sessionId) return false;
                  const sameTeacher = other.teacherId === e.teacherId;
                  const sameRealClass =
                    other.classId === e.classId &&
                    !isSpecialAssignmentId(other.classId) &&
                    !isSpecialAssignmentId(e.classId);
                  const bothAS = isASLike(other) && isASLike(e);
                  if (!sameTeacher && !sameRealClass) return false;
                  if (bothAS) return false;
                  return true;
                });
                if (conflict) cellConflict = true;
                return renderSessionBlockHtml({
                  sessionId: e.sessionId,
                  text: e.label,
                  style: e.style,
                  className: `slot-block${conflict ? " conflict-block" : ""}`,
                  cadence: bucket === "N" ? "WEEKLY" : "BIWEEKLY",
                  weekType: bucket === "PAIR" ? "A" : bucket === "IMPAIR" ? "B" : "A",
                });
              })
              .join("");
            if (cellConflict) conflictsCount += 1;
            if (cellConflict) {
              for (let i = 0; i < entries.length; i += 1) {
                for (let j = i + 1; j < entries.length; j += 1) {
                  const a = entries[i];
                  const b = entries[j];
                  const sameTeacher = a.teacherId === b.teacherId;
                  const sameRealClass =
                    a.classId === b.classId && !isSpecialAssignmentId(a.classId) && !isSpecialAssignmentId(b.classId);
                  const bothAS = isASLike(a) && isASLike(b);
                  if (!sameTeacher && !sameRealClass) continue;
                  if (bothAS) continue;
                  if (sameTeacher) {
                    const teacher = state.teachers.find((t) => t.id === a.teacherId);
                    reasonSet.add(`enseignant ${getTeacherDisplayLabel(teacher)}`);
                  }
                  if (sameRealClass) {
                    reasonSet.add(`classe ${getClassLabelById(a.classId)}`);
                  }
                }
              }
              const reasons = Array.from(reasonSet).join(", ");
              const bucketLabel = bucket === "N" ? "Hebdo" : bucket === "PAIR" ? "Sem. A" : "Sem. B";
              conflictDetails.push(`${day} ${band.label} (${bucketLabel}) : ${reasons || "conflit de superposition"}`);
            }
            return `<td class="slot${cellConflict ? " slot-conflict" : ""}">${html}</td>`;
          })
          .join("");
      }).join("");
      return `<tr><th>${band.label}</th>${cells}</tr>`;
    })
    .join("");

  if (conflictsCount > 0) {
    const shown = conflictDetails.slice(0, 4).map((x) => `<li>${escapeHtml(x)}</li>`).join("");
    const more = conflictDetails.length > 4 ? `<p>+${conflictDetails.length - 4} autre(s) conflit(s).</p>` : "";
    ui.globalPlannerHint.innerHTML = `
      <span class="hours-over">${conflictsCount} créneau(x) en conflit détecté(s)</span> (vue type Excel).<br>
      <strong>Détail :</strong>
      <ul>${shown}</ul>
      ${more}
    `;
  } else {
    ui.globalPlannerHint.innerHTML = `<span class="hours-ok">Aucun conflit détecté</span> (vue type Excel).`;
  }

  const container = ui.globalPlannerContainer;
  if (!container) return;
  container.innerHTML = `
    <table class="excel-like-table">
      <tr><th rowspan="2">Horaire</th>${dayHeaders}</tr>
      <tr>${subHeaders}</tr>
      ${rows}
    </table>
  `;
  state.globalPicker = null;
  bindSessionRemoveButtons(container);
}

function renderGlobalEmptyCell(day, slot, weekType) {
  return `<button class="slot-action global-slot-action" data-day="${escapeHtml(day)}" data-slot="${escapeHtml(slot)}" type="button">+</button>`;
}

function bindGlobalPlannerActions(weekType, container) {
  container.querySelectorAll(".global-slot-action").forEach((btn) => {
    btn.addEventListener("click", () => {
      openAssignModal({
        source: "global",
        teacherId: "",
        day: btn.dataset.day,
        slot: btn.dataset.slot,
        weekType,
      });
    });
  });
}

function openAssignModal({ source, teacherId, day, slot, weekType }) {
  if (!ui.assignModal) return;
  state.assignModal = {
    source: source === "global" ? "global" : "teacher",
    teacherId: teacherId || "",
    day: day || "",
    slot: slot || "",
    weekType: normalizeWeekType(weekType || state.selectedGlobalWeekType),
  };

  ui.assignModalTitle.textContent =
    state.assignModal.source === "teacher" ? "Affectation rapide professeur" : "Affectation planning général";
  ui.assignModalContext.textContent = `${state.assignModal.day} ${state.assignModal.slot}`;

  const teacherOptions = state.teachers
    .map((t) => `<option value="${escapeHtml(t.id)}">${escapeHtml(t.name)}</option>`)
    .join("");
  ui.assignModalTeacherSelect.innerHTML = teacherOptions;
  ui.assignModalTeacherRow.classList.toggle("hidden", state.assignModal.source === "teacher");
  if (state.assignModal.source === "teacher") {
    ui.assignModalTeacherSelect.value = state.assignModal.teacherId;
  } else {
    ui.assignModalTeacherSelect.value = state.assignModal.teacherId || state.teachers[0]?.id || "";
    state.assignModal.teacherId = ui.assignModalTeacherSelect.value || "";
  }

  const suggested = getSuggestedCadenceForTeacherSlot(
    state.assignModal.teacherId || ui.assignModalTeacherSelect.value,
    state.assignModal.day,
    state.assignModal.slot
  );
  ui.assignModalCadenceSelect.value = suggested === "AUTO" ? "WEEKLY" : suggested;
  ui.assignModalHint.textContent = "";
  refreshAssignModalClassOptions();
  ui.assignModal.classList.remove("hidden");
}

function closeAssignModal() {
  if (!ui.assignModal) return;
  ui.assignModal.classList.add("hidden");
  state.assignModal = null;
}

function refreshAssignModalClassOptions() {
  if (!state.assignModal) return;
  const teacherId =
    state.assignModal.source === "teacher" ? state.assignModal.teacherId : String(ui.assignModalTeacherSelect.value || "");
  state.assignModal.teacherId = teacherId;
  const day = state.assignModal.day;
  const slot = state.assignModal.slot;
  const weekType = state.assignModal.source === "teacher" ? "A" : state.assignModal.weekType;
  const classes = getAvailableClassesForGlobalPicker(teacherId, day, slot, weekType);
  const levelMap = new Map();
  for (const c of classes) {
    const level = isSpecialAssignmentId(c.id) ? "Activités" : String(c.level || "Autres");
    const arr = levelMap.get(level) || [];
    arr.push(c);
    levelMap.set(level, arr);
  }
  const levels = Array.from(levelMap.keys()).sort((a, b) => {
    if (a === "Activités") return 1;
    if (b === "Activités") return -1;
    return a.localeCompare(b, "fr");
  });

  const prevLevel = ui.assignModalLevelSelect.value;
  const selectedLevel = levels.includes(prevLevel) ? prevLevel : levels[0] || "";
  ui.assignModalLevelSelect.innerHTML = levels
    .map((level) => `<option value="${escapeHtml(level)}">${escapeHtml(level)}</option>`)
    .join("");
  ui.assignModalLevelSelect.disabled = !levels.length;
  ui.assignModalLevelSelect.value = selectedLevel;

  const classPool = selectedLevel ? levelMap.get(selectedLevel) || [] : [];
  const options = classPool
    .map((c) => {
      if (isSpecialAssignmentId(c.id)) {
        return `<option value="${escapeHtml(c.id)}">${escapeHtml(getClassLabelById(c.id))} (illimité)</option>`;
      }
      const remaining = Math.max(0, Number(c.weeklyHours || 0) - getAssignedHoursForClass(c.id));
      return `<option value="${escapeHtml(c.id)}">${escapeHtml(c.name)} (${formatHours(remaining)}h)</option>`;
    })
    .join("");
  ui.assignModalClassSelect.innerHTML = options || `<option value="">Aucune classe disponible</option>`;
  ui.assignModalClassSelect.disabled = !options;
}

async function confirmAssignModal() {
  if (!state.assignModal) return;
  const classId = String(ui.assignModalClassSelect.value || "");
  const cadencePreference = String(ui.assignModalCadenceSelect.value || "WEEKLY");
  if (!classId) {
    ui.assignModalHint.textContent = "Aucune classe disponible sur ce créneau.";
    return;
  }
  const { source, teacherId, day, slot, weekType } = state.assignModal;
  try {
    const result =
      source === "teacher"
        ? await quickAssignFromPlanner(teacherId, day, slot, classId, cadencePreference)
        : await quickAssignFromGlobal(
            day,
            slot,
            String(ui.assignModalTeacherSelect.value || ""),
            classId,
            weekType,
            cadencePreference
          );
    ui.sessionError.textContent = result.ok ? result.message : result.error;
    if (result.ok) {
      closeAssignModal();
      renderPlannerGrid();
    } else {
      ui.assignModalHint.textContent = result.error || "Affectation impossible.";
    }
  } catch (error) {
    ui.assignModalHint.textContent = `Erreur: ${error?.message || "affectation impossible."}`;
  }
}

function toSlotKey(day, slot) {
  return `${day}|${slot}`;
}

function getBandForSlot(slot) {
  return SLOT_BANDS.find((b) => b.slots.includes(slot)) || null;
}

function getSessionBandSegments(session) {
  const segments = [];
  const covered = getCoveredSlots(session.day, session.start, Number(session.duration || 0));
  for (const band of SLOT_BANDS) {
    const topKey = toSlotKey(session.day, band.slots[0]);
    const bottomKey = toSlotKey(session.day, band.slots[1]);
    const hasTop = covered.includes(topKey);
    const hasBottom = covered.includes(bottomKey);
    if (!hasTop && !hasBottom) continue;
    const segment = hasTop && hasBottom ? "full" : hasTop ? "top" : "bottom";
    segments.push({ day: session.day, bandStart: band.start, segment });
  }
  return segments;
}

function renderSessionBlockHtml({ sessionId, text, style, className, cadence, weekType }) {
  const biClass =
    normalizeCadence(cadence) === "BIWEEKLY"
      ? ` biweekly-half biweekly-${normalizeWeekType(weekType).toLowerCase()}`
      : "";
  return `
    <div class="${className}${biClass}" style="${escapeHtml(style)}">
      <div class="session-block-row">
        <span>${escapeHtml(text)}</span>
        <button class="session-remove-btn" data-session-id="${escapeHtml(sessionId)}" type="button" title="Désaffecter">x</button>
      </div>
    </div>
  `;
}

function bindSessionRemoveButtons(container) {
  container.querySelectorAll(".session-remove-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const sessionId = btn.dataset.sessionId;
      if (!sessionId) return;
      await deleteDoc(doc(db, "sessions", sessionId));
    });
  });
}

function getCoveredSlots(day, start, duration) {
  const startIndex = SLOTS.indexOf(start);
  if (startIndex < 0) return [];
  const covered = [];
  for (let i = 0; i < duration; i += 1) {
    const slot = SLOTS[startIndex + i];
    if (!slot) return [];
    covered.push(toSlotKey(day, slot));
  }
  return covered;
}

function slotsOverlap(a, b) {
  const setB = new Set(b);
  return a.some((x) => setB.has(x));
}

function getSuggestedCadenceForTeacherSlot(teacherId, day, slot) {
  if (!teacherId || !day || !slot) return "AUTO";
  const targetKey = toSlotKey(day, slot);
  let hasWeekly = false;
  let hasA = false;
  let hasB = false;
  for (const s of state.sessions) {
    if (s.teacherId !== teacherId) continue;
    const covered = getCoveredSlots(s.day, s.start, Number(s.duration || 0));
    if (!covered.includes(targetKey)) continue;
    const cadence = normalizeCadence(s.cadence);
    if (cadence === "WEEKLY") {
      hasWeekly = true;
      break;
    }
    if (normalizeWeekType(s.weekType) === "A") hasA = true;
    if (normalizeWeekType(s.weekType) === "B") hasB = true;
  }
  if (hasWeekly) return "AUTO";
  if (hasA && !hasB) return "WEEK_B";
  if (hasB && !hasA) return "WEEK_A";
  return "AUTO";
}

async function quickAssignFromPlanner(teacherId, day, slot, classId, cadencePreference = "AUTO") {
  if (!teacherId) return { ok: false, error: "Aucun professeur sélectionné." };
  const proposal = buildBestSessionProposal(teacherId, classId, day, slot, "A", cadencePreference);
  if (!proposal.ok) return proposal;
  const createResult = await createSession(proposal.session);
  if (!createResult.ok) return createResult;
  const classLabel = getClassLabelById(classId, true);

  const warning = getLateCollegeWarning(classId, proposal.session.start);
  return {
    ok: true,
    message: `Affecté: ${classLabel} -> ${day} ${proposal.session.start} (${proposal.session.cadence === "BIWEEKLY" ? `Semaine ${proposal.session.weekType}` : "hebdo"}).${warning ? ` ${warning}` : ""}`,
  };
}

async function quickAssignFromGlobal(day, slot, teacherId, classId, weekType, cadencePreference = "AUTO") {
  const proposal = buildBestSessionProposal(teacherId, classId, day, slot, weekType, cadencePreference);
  if (!proposal.ok) return proposal;

  const createResult = await createSession(proposal.session);
  if (!createResult.ok) return createResult;
  const classLabel = getClassLabelById(classId, true);

  const warning = getLateCollegeWarning(classId, proposal.session.start);
  return {
    ok: true,
    message: `Affecté: ${classLabel} -> ${day} ${proposal.session.start}.${warning ? ` ${warning}` : ""}`,
  };
}

function validateSession(payload) {
  const { teacherId, classId, type, day, start, duration } = payload;
  const cadence = normalizeCadence(payload.cadence);
  const weekType = normalizeWeekType(payload.weekType);

  if (!teacherId || !classId || !type || !day || !start || !duration) {
    return { ok: false, error: "Informations incomplètes pour créer le créneau." };
  }

  const teacher = state.teachers.find((t) => t.id === teacherId);
  const special = getSpecialAssignmentById(classId);
  const cls = state.classes.find((c) => c.id === classId);
  if (!teacher) return { ok: false, error: "Professeur introuvable." };
  if (!cls && !special) return { ok: false, error: "Classe introuvable." };

  const plannedSlots = getCoveredSlots(day, start, Number(duration));
  if (!plannedSlots.length) return { ok: false, error: "Créneau invalide (fin de journée dépassée)." };

  if (type === "EPS" && cls) {
    const rule = getLevelRule(cls.level);
    if (rule?.group === "CINQUIEME") {
      if (Number(duration) !== 3) return { ok: false, error: "Règle EPS 5e: une séance doit durer 3h." };
      if (cadence !== "WEEKLY") return { ok: false, error: "Règle EPS 5e: la planification se fait toutes les semaines." };
    } else {
      if (Number(duration) !== 2) return { ok: false, error: "Règle EPS: une séance EPS doit durer 2h." };
    }
    if ((rule?.group === "SIXIEME" || rule?.group === "LYCEE") && cadence !== "WEEKLY") {
      return { ok: false, error: "Règle EPS: ce niveau doit être planifié chaque semaine." };
    }
    if (rule?.group !== "ALT_43" && cadence === "BIWEEKLY") {
      return { ok: false, error: "Les créneaux Semaine A/B sont autorisés uniquement pour les classes de 4e et 3e." };
    }
  }

  const candidate = { day, start, duration: Number(duration), cadence, weekType };
  const isUnavailable = plannedSlots.some((slotKey) => (teacher.unavailable || []).includes(slotKey));
  if (isUnavailable) return { ok: false, error: "Conflit: professeur indisponible sur ce créneau." };

  const teacherConflict = state.sessions.some((s) => s.teacherId === teacherId && sessionsConflict(candidate, s));
  if (teacherConflict) return { ok: false, error: "Conflit: ce professeur a déjà un cours sur ce créneau." };

  if (!special) {
    const classConflict = state.sessions.some((s) => s.classId === classId && sessionsConflict(candidate, s));
    if (classConflict) return { ok: false, error: "Conflit: cette classe est déjà occupée sur ce créneau." };
  }

  // Règle métier: pour une même classe avec le même enseignant, les débuts de cours
  // doivent être espacés d'au moins 24h lorsqu'ils peuvent avoir lieu la même semaine.
  const minGapConflict = state.sessions.some((s) => {
    if (special || isSpecialAssignmentId(s.classId)) return false;
    if (s.classId !== classId || s.teacherId !== teacherId || s.type !== "EPS") return false;
    if (!sessionsCanOccurSameWeek(candidate, s)) return false;
    const diffHours = Math.abs(toWeekStartHour(candidate.day, candidate.start) - toWeekStartHour(s.day, s.start));
    return diffHours < 24;
  });
  if (minGapConflict) {
    return {
      ok: false,
      error: "Conflit: pour une classe avec le même enseignant, il faut au moins 24h entre les débuts des cours.",
    };
  }

  return { ok: true, normalized: { teacherId, classId, type, day, start, duration: Number(duration), cadence, weekType } };
}

async function createSession(payload) {
  const check = validateSession(payload);
  if (!check.ok) return check;

  const s = check.normalized;
  try {
    await addDoc(collection(db, "sessions"), {
      teacherId: s.teacherId,
      classId: s.classId,
      type: s.type,
      day: s.day,
      start: s.start,
      duration: s.duration,
      cadence: s.cadence,
      weekType: s.cadence === "BIWEEKLY" ? s.weekType : null,
      createdAt: serverTimestamp(),
    });
    return { ok: true };
  } catch (error) {
    const code = String(error?.code || "");
    if (code.includes("permission-denied")) {
      return {
        ok: false,
        error: "Permission Firestore refusée. Déployez les règles: `firebase deploy --only firestore:rules`.",
      };
    }
    return { ok: false, error: `Erreur Firestore: ${error?.message || "écriture impossible."}` };
  }
}

function sessionsConflict(a, b) {
  const aSlots = getCoveredSlots(a.day, a.start, Number(a.duration || 0));
  const bSlots = getCoveredSlots(b.day, b.start, Number(b.duration || 0));
  if (!slotsOverlap(aSlots, bSlots)) return false;

  const aCadence = normalizeCadence(a.cadence);
  const bCadence = normalizeCadence(b.cadence);
  if (aCadence === "WEEKLY" || bCadence === "WEEKLY") return true;
  return normalizeWeekType(a.weekType) === normalizeWeekType(b.weekType);
}

function weeklyEquivalentHours(session) {
  const duration = Number(session?.duration || 0);
  return normalizeCadence(session?.cadence) === "BIWEEKLY" ? duration / 2 : duration;
}

function isSessionVisibleForWeek(session, weekType) {
  const cadence = normalizeCadence(session?.cadence);
  if (cadence === "WEEKLY") return true;
  return normalizeWeekType(session?.weekType) === normalizeWeekType(weekType);
}

function normalizeCadence(cadence) {
  return cadence === "BIWEEKLY" ? "BIWEEKLY" : "WEEKLY";
}

function normalizeWeekType(weekType) {
  return weekType === "B" ? "B" : "A";
}

function sessionsCanOccurSameWeek(a, b) {
  const aCadence = normalizeCadence(a?.cadence);
  const bCadence = normalizeCadence(b?.cadence);
  if (aCadence === "WEEKLY" || bCadence === "WEEKLY") return true;
  return normalizeWeekType(a?.weekType) === normalizeWeekType(b?.weekType);
}

function toWeekStartHour(day, start) {
  const dayIndex = Math.max(0, DAYS.indexOf(day));
  const [hStr, mStr] = String(start || "00:00").split(":");
  const hour = Number(hStr || 0);
  const minute = Number(mStr || 0);
  return dayIndex * 24 + hour + minute / 60;
}

function getLateCollegeWarning(classId, start) {
  const cls = state.classes.find((c) => c.id === classId);
  if (!cls) return "";
  const rule = getLevelRule(cls.level);
  const isCollege = rule?.group === "SIXIEME" || rule?.group === "CINQUIEME" || rule?.group === "ALT_43";
  if (!isCollege) return "";
  const [hourStr] = String(start || "00:00").split(":");
  const hour = Number(hourStr || 0);
  if (hour <= 16) return "";
  return `Alerte: ${cls.level} ${cls.name} est placé après 16h.`;
}

function formatHours(value) {
  const n = Number(value || 0);
  return Number.isInteger(n) ? String(n) : n.toFixed(1).replace(".", ",");
}

function getLevelRule(level) {
  return LEVEL_RULES[level] || null;
}

function getLevelPrefix(level) {
  const mapping = {
    "Sixième": "6",
    "Cinquième": "5",
    "Quatrième": "4",
    "Troisième": "3",
    Seconde: "2",
    "Première": "1",
    Terminale: "T",
  };
  return mapping[level] || "";
}

function getUnassignedClasses() {
  const assignedByClass = new Map();
  for (const c of state.classes) assignedByClass.set(c.id, 0);
  for (const s of state.sessions) {
    assignedByClass.set(s.classId, (assignedByClass.get(s.classId) || 0) + weeklyEquivalentHours(s));
  }
  return state.classes.filter((c) => (assignedByClass.get(c.id) || 0) < Number(c.weeklyHours || 0));
}

function getSpecialAssignmentById(id) {
  return SPECIAL_ASSIGNMENTS.find((x) => x.id === id) || null;
}

function isSpecialAssignmentId(id) {
  return Boolean(getSpecialAssignmentById(id));
}

function isSessionClassCurrent(session) {
  if (!session) return false;
  if (isSpecialAssignmentId(session.classId)) return true;
  return state.classes.some((c) => c.id === session.classId);
}

function getCurrentClassSessions() {
  return state.sessions.filter((s) => isSessionClassCurrent(s));
}

function isASLike(entry) {
  if (!entry) return false;
  return String(entry.type || "").toUpperCase() === "AS" || String(entry.classId || "") === "__AS__";
}

function getClassLabelById(classId, withLevel = false) {
  const special = getSpecialAssignmentById(classId);
  if (special) return special.label;
  const cls = state.classes.find((c) => c.id === classId);
  if (!cls) return "Classe inconnue";
  return withLevel ? `${cls.level} ${cls.name}` : cls.name;
}

function getPlannerAssignableOptions() {
  const classes = getUnassignedClasses().map((c) => {
    const remaining = Math.max(0, Number(c.weeklyHours || 0) - getAssignedHoursForClass(c.id));
    return {
      id: c.id,
      label: `${c.level} ${c.name} (${formatHours(remaining)}h restantes)`,
    };
  });
  const specials = SPECIAL_ASSIGNMENTS.map((s) => ({
    id: s.id,
    label: `${s.label} (illimité)`,
  }));
  return [...specials, ...classes];
}

function getAvailableClassesForGlobalPicker(teacherId, day, slot, weekType) {
  if (!teacherId) return [];
  const regular = state.classes.filter((c) => {
    const remaining = Number(c.weeklyHours || 0) - getAssignedHoursForClass(c.id);
    if (remaining <= 0) return false;
    return canAssignClassInTeacherSlot(teacherId, c.id, day, slot, weekType);
  });
  const specials = SPECIAL_ASSIGNMENTS.filter((s) => canAssignClassInTeacherSlot(teacherId, s.id, day, slot, weekType));
  return [...specials, ...regular];
}

function canAssignClassInTeacherSlot(teacherId, classId, day, slot, weekType) {
  const suggested = getSuggestedCadenceForTeacherSlot(teacherId, day, slot);
  const candidates = [suggested, "AUTO", "WEEKLY", "WEEK_A", "WEEK_B"];
  const seen = new Set();
  for (const pref of candidates) {
    const normalized = normalizeCadencePreference(pref);
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    if (buildBestSessionProposal(teacherId, classId, day, slot, weekType, normalized, true).ok) return true;
  }
  return false;
}

function buildBestSessionProposal(teacherId, classId, day, slot, weekType, cadencePreference = "AUTO", silent = false) {
  const special = getSpecialAssignmentById(classId);
  if (special) {
    const duration = special.type === "AS" ? 1 : 2;
    const normalizedPref = normalizeCadencePreference(cadencePreference);
    const band = getBandForSlot(slot);
    const candidateStarts =
      duration === 1 && band ? [band.slots[0], band.slots[1]] : [slot];
    const proposals = [];
    for (const start of candidateStarts) {
      if (normalizedPref === "WEEK_A" || normalizedPref === "WEEK_B") {
        proposals.push({
          teacherId,
          classId,
          type: special.type,
          day,
          start,
          duration,
          cadence: "BIWEEKLY",
          weekType: normalizedPref === "WEEK_A" ? "A" : "B",
        });
      } else {
        proposals.push({
          teacherId,
          classId,
          type: special.type,
          day,
          start,
          duration,
          cadence: "WEEKLY",
          weekType: normalizeWeekType(weekType),
        });
      }
    }
    for (const p of proposals) {
      const check = validateSession(p);
      if (check.ok) return { ok: true, session: p };
    }
    const fallback = validateSession(proposals[0]);
    return { ok: false, error: fallback.error || "Affectation impossible sur ce créneau." };
  }

  const cls = state.classes.find((c) => c.id === classId);
  if (!cls) return { ok: false, error: "Classe indisponible." };
  const rule = getLevelRule(cls.level);
  const remaining = Math.max(0, Number(cls.weeklyHours || 0) - getAssignedHoursForClass(cls.id));
  const firstAssignment = getAssignedHoursForClass(cls.id) === 0;
  const normalizedPref = normalizeCadencePreference(cadencePreference);

  if (!silent && rule?.group === "ALT_43" && firstAssignment && normalizedPref === "AUTO") {
    return { ok: false, error: "Pour une 4e/3e non encore affectée, choisissez: toutes les semaines, Semaine A ou Semaine B." };
  }
  if (!silent && rule?.group !== "ALT_43" && (normalizedPref === "WEEK_A" || normalizedPref === "WEEK_B")) {
    return { ok: false, error: "Semaine A/B est disponible uniquement pour les classes de 4e et 3e." };
  }
  if (rule?.group === "CINQUIEME") {
    const proposal = {
      teacherId,
      classId,
      type: "EPS",
      day,
      start: slot,
      duration: 3,
      cadence: "WEEKLY",
      weekType: normalizeWeekType(weekType),
    };
    const check = validateSession(proposal);
    if (check.ok) return { ok: true, session: proposal };
    return { ok: false, error: check.error || "Affectation impossible pour cette classe de 5e." };
  }

  const proposals = [];
  if (normalizedPref === "WEEKLY") {
    proposals.push({
      teacherId,
      classId,
      type: "EPS",
      day,
      start: slot,
      duration: 2,
      cadence: "WEEKLY",
      weekType: normalizeWeekType(weekType),
    });
  } else if (normalizedPref === "WEEK_A" || normalizedPref === "WEEK_B") {
    proposals.push({
      teacherId,
      classId,
      type: "EPS",
      day,
      start: slot,
      duration: 2,
      cadence: "BIWEEKLY",
      weekType: normalizedPref === "WEEK_A" ? "A" : "B",
    });
  } else if (rule?.group === "ALT_43" && remaining <= 1) {
    proposals.push({
      teacherId,
      classId,
      type: "EPS",
      day,
      start: slot,
      duration: 2,
      cadence: "BIWEEKLY",
      weekType: normalizeWeekType(weekType),
    });
    proposals.push({
      teacherId,
      classId,
      type: "EPS",
      day,
      start: slot,
      duration: 2,
      cadence: "BIWEEKLY",
      weekType: normalizeWeekType(weekType) === "A" ? "B" : "A",
    });
  } else {
    proposals.push({
      teacherId,
      classId,
      type: "EPS",
      day,
      start: slot,
      duration: 2,
      cadence: "WEEKLY",
      weekType: normalizeWeekType(weekType),
    });
  }

  for (const p of proposals) {
    const check = validateSession(p);
    if (check.ok) return { ok: true, session: p };
  }
  const fallback = validateSession(proposals[0]);
  return { ok: false, error: fallback.error || "Affectation impossible sur ce créneau." };
}

function normalizeCadencePreference(value) {
  if (value === "WEEKLY") return "WEEKLY";
  if (value === "WEEK_A") return "WEEK_A";
  if (value === "WEEK_B") return "WEEK_B";
  return "AUTO";
}

function daySlotKey(day, slot) {
  return `${day}|${slot}`;
}

function hasSwimSlot(day, slot) {
  return state.swimSlotKeys.has(daySlotKey(day, slot));
}

function swimSlotDocId(day, slot) {
  return `${day}__${slot}`;
}

async function toggleSwimSlot(day, slot) {
  if (!day || !slot) return;
  const band = getBandForSlot(slot);
  const targetSlots = band ? band.slots : [slot];
  const isMarked = targetSlots.every((s) => hasSwimSlot(day, s));
  if (isMarked) {
    const toDelete = state.swimSlots.filter((s) => s.day === day && targetSlots.includes(s.slot)).map((s) => s.id);
    if (!toDelete.length) {
      await Promise.all(targetSlots.map((s) => deleteDoc(doc(db, "swimSlots", swimSlotDocId(day, s)))));
      return;
    }
    await Promise.all(toDelete.map((id) => deleteDoc(doc(db, "swimSlots", id))));
    return;
  }
  await Promise.all(
    targetSlots.map((s) =>
      setDoc(doc(db, "swimSlots", swimSlotDocId(day, s)), {
        day,
        slot: s,
        createdAt: serverTimestamp(),
      })
    )
  );
}

function renderSwimPlanner() {
  const markedCount = state.swimSlotKeys.size;
  ui.swimHint.textContent = `Repère visuel global: cliquez sur un créneau pour afficher/retirer l'icône nageur. Créneaux marqués: ${markedCount}.`;

  const head = `<tr><th>Heure</th>${DAYS.map((d) => `<th>${d}</th>`).join("")}</tr>`;
  const rows = SLOT_BANDS.map((band) => {
    const cells = DAYS.map((day) => {
      const marked = hasSwimSlot(day, band.slots[0]) || hasSwimSlot(day, band.slots[1]);
      return `<td class="slot${marked ? " slot-swim" : ""}">
        <button class="swim-toggle${marked ? " active" : ""}" data-day="${escapeHtml(day)}" data-slot="${escapeHtml(band.start)}" type="button">
          ${marked ? "Natation" : "-"}
        </button>
      </td>`;
    }).join("");
    return `<tr><th>${band.label}</th>${cells}</tr>`;
  }).join("");

  ui.swimPlannerContainer.innerHTML = `<table>${head}${rows}</table>`;
  ui.swimPlannerContainer.querySelectorAll(".swim-toggle").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await toggleSwimSlot(btn.dataset.day, btn.dataset.slot);
    });
  });
}

function desiderataSlotKey(teacherId, day, slot) {
  return `${teacherId}|${day}|${slot}`;
}

function rawSlotKey(day, slot) {
  return `${day}|${slot}`;
}

function normalizeDesiderataStatus(status) {
  return status === "UNAVAILABLE" ? "UNAVAILABLE" : "PREFERRED";
}

function splitRawSlotKey(key) {
  const [day, slot] = String(key || "").split("|");
  return { day, slot };
}

function nextDesiderataStatus(current) {
  if (current === "PREFERRED") return "UNAVAILABLE";
  if (current === "UNAVAILABLE") return null;
  return "PREFERRED";
}

function getPersistedDesiderataForTeacher(teacherId) {
  const map = new Map();
  if (!teacherId) return map;
  for (const s of state.desiderataSlots) {
    if (s.teacherId !== teacherId) continue;
    map.set(rawSlotKey(s.day, s.slot), normalizeDesiderataStatus(s.status));
  }
  return map;
}

function syncDesiderataDraftWithPersisted() {
  const teacherId = state.selectedDesiderataTeacherId;
  if (!teacherId) return;
  if (state.desiderataDirty && state.desiderataDraftTeacherId === teacherId) return;
  state.desiderataDraftTeacherId = teacherId;
  state.desiderataDraft = getPersistedDesiderataForTeacher(teacherId);
}

function hasDesiderataSlot(teacherId, day, slot) {
  return state.desiderataSlotStatus.get(desiderataSlotKey(teacherId, day, slot)) === "PREFERRED";
}

function hasDesiderataUnavailableSlot(teacherId, day, slot) {
  return state.desiderataSlotStatus.get(desiderataSlotKey(teacherId, day, slot)) === "UNAVAILABLE";
}

function desiderataDocId(teacherId, day, slot) {
  return `${teacherId}__${day}__${slot}`;
}

function setDesiderataDraftStatus(day, slot, status) {
  const band = getBandForSlot(slot);
  const targetSlots = band ? band.slots : [slot];
  for (const s of targetSlots) {
    const key = rawSlotKey(day, s);
    if (!status) state.desiderataDraft.delete(key);
    else state.desiderataDraft.set(key, status);
  }
  state.desiderataDirty = true;
}

async function persistDesiderataDraft(mode = "BROUILLON") {
  const teacherId = state.selectedDesiderataTeacherId;
  if (!teacherId) return;
  const persisted = getPersistedDesiderataForTeacher(teacherId);
  const draft = state.desiderataDraft;
  const all = new Set([...persisted.keys(), ...draft.keys()]);
  const batch = db.batch();
  let writes = 0;

  for (const key of all) {
    const oldStatus = persisted.get(key) || null;
    const newStatus = draft.get(key) || null;
    if (oldStatus === newStatus) continue;
    const { day, slot } = splitRawSlotKey(key);
    if (!day || !slot) continue;
    const ref = doc(db, "desiderata", desiderataDocId(teacherId, day, slot));
    if (!newStatus) {
      batch.delete(ref);
    } else {
      batch.set(ref, {
        teacherId,
        day,
        slot,
        status: newStatus,
        submissionMode: mode,
        updatedAt: serverTimestamp(),
      });
    }
    writes += 1;
  }

  if (!writes) {
    ui.desiderataHint.textContent = "Aucun changement à enregistrer.";
    return;
  }

  try {
    await batch.commit();
    state.desiderataDirty = false;
    ui.desiderataHint.textContent =
      mode === "SOUMIS" ? "Désidérata soumis avec succès." : "Brouillon des désidérata sauvegardé.";
  } catch (error) {
    ui.desiderataHint.textContent = `Erreur Firestore: ${error?.message || "écriture impossible."}`;
  }
}

function renderDesiderata() {
  const teacher = state.teachers.find((t) => t.id === state.selectedDesiderataTeacherId);
  if (!teacher) {
    ui.desiderataHint.textContent = "Aucun professeur disponible.";
    if (ui.desiderataPreferredHours) ui.desiderataPreferredHours.textContent = "0h";
    if (ui.desiderataUnavailableBlocks) ui.desiderataUnavailableBlocks.textContent = "0";
    if (ui.desiderataTargetHours) ui.desiderataTargetHours.textContent = "0h";
    ui.desiderataGridContainer.innerHTML = "";
    return;
  }

  if (state.desiderataDraftTeacherId !== teacher.id || !state.desiderataDirty) {
    syncDesiderataDraftWithPersisted();
  }

  const preferredCount = Array.from(state.desiderataDraft.values()).filter((s) => s === "PREFERRED").length;
  const unavailableCount = Array.from(state.desiderataDraft.values()).filter((s) => s === "UNAVAILABLE").length;
  if (ui.desiderataPreferredHours) ui.desiderataPreferredHours.textContent = `${preferredCount}h`;
  if (ui.desiderataUnavailableBlocks) ui.desiderataUnavailableBlocks.textContent = String(unavailableCount);
  if (ui.desiderataTargetHours) ui.desiderataTargetHours.textContent = `${formatHours(teacher.maxHours || 0)}h`;
  if (!state.desiderataDirty) {
    ui.desiderataHint.textContent = `${teacher.name}: cliquez pour alterner Préféré / Indisponible / Neutre.`;
  }

  const head = `<tr><th>Heure</th>${DAYS.map((d) => `<th>${d}</th>`).join("")}</tr>`;
  const rows = SLOT_BANDS.map((band) => {
    const cells = DAYS.map((day) => {
      const topStatus = state.desiderataDraft.get(rawSlotKey(day, band.slots[0])) || null;
      const bottomStatus = state.desiderataDraft.get(rawSlotKey(day, band.slots[1])) || null;
      const unified = topStatus === bottomStatus ? topStatus : topStatus || bottomStatus;
      const cls = unified === "PREFERRED" ? " active" : unified === "UNAVAILABLE" ? " unavailable" : "";
      const text = unified === "PREFERRED" ? "★" : unified === "UNAVAILABLE" ? "⛔" : "•";
      return `<td class="slot">
        <button class="desiderata-toggle${cls}" data-day="${escapeHtml(day)}" data-slot="${escapeHtml(band.start)}" data-status="${escapeHtml(unified || "")}" type="button">
          ${text}
        </button>
      </td>`;
    }).join("");
    return `<tr><th>${band.label}</th>${cells}</tr>`;
  }).join("");

  ui.desiderataGridContainer.innerHTML = `<table>${head}${rows}</table>`;

  const applyStatusToButton = (btn, forcedStatus = null, explicit = false) => {
    const day = btn.dataset.day;
    const slot = btn.dataset.slot;
    const current = btn.dataset.status || null;
    const next = explicit ? forcedStatus : forcedStatus === null ? nextDesiderataStatus(current) : forcedStatus;
    setDesiderataDraftStatus(day, slot, next);
    btn.dataset.status = next || "";
    btn.classList.toggle("active", next === "PREFERRED");
    btn.classList.toggle("unavailable", next === "UNAVAILABLE");
    btn.textContent = next === "PREFERRED" ? "★" : next === "UNAVAILABLE" ? "⛔" : "•";
  };

  if (!state.desiderataMouseupBound) {
    window.addEventListener("mouseup", () => {
      state.desiderataPointerDown = false;
      state.desiderataPaintStatus = null;
    });
    state.desiderataMouseupBound = true;
  }

  ui.desiderataGridContainer.querySelectorAll(".desiderata-toggle").forEach((btn) => {
    btn.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      state.desiderataPointerDown = true;
      const current = btn.dataset.status || null;
      state.desiderataPaintStatus = nextDesiderataStatus(current);
      applyStatusToButton(btn, state.desiderataPaintStatus, true);
      renderDesiderata();
    });
    btn.addEventListener("mouseenter", () => {
      if (!state.desiderataPointerDown) return;
      applyStatusToButton(btn, state.desiderataPaintStatus, true);
      renderDesiderata();
    });
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  });
}

function getAssignedHoursForClass(classId) {
  if (isSpecialAssignmentId(classId)) return 0;
  return state.sessions
    .filter((s) => s.classId === classId)
    .reduce((acc, s) => acc + weeklyEquivalentHours(s), 0);
}

function cssEscape(value) {
  if (window.CSS && typeof window.CSS.escape === "function") {
    return window.CSS.escape(value);
  }
  return String(value).replace(/["\\]/g, "\\$&");
}

function normalizeHexColor(value) {
  const color = String(value || "").trim();
  if (/^#[0-9a-fA-F]{6}$/.test(color)) return color.toLowerCase();
  return "#0b7285";
}

function hashString(input) {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) h = (h << 5) - h + input.charCodeAt(i);
  return Math.abs(h);
}

function fallbackColorForTeacher(teacher) {
  const palette = ["#0b7285", "#1971c2", "#2b8a3e", "#c92a2a", "#a61e4d", "#5f3dc4", "#e67700", "#087f5b"];
  const seed = `${teacher?.id || ""}|${teacher?.name || ""}`;
  return palette[hashString(seed) % palette.length];
}

function getTeacherColor(teacher) {
  return normalizeHexColor(teacher?.color || fallbackColorForTeacher(teacher));
}

function getTeacherColorById(teacherId) {
  const teacher = state.teachers.find((t) => t.id === teacherId);
  return getTeacherColor(teacher);
}

function getTeacherBlockStyle(teacherId) {
  const color = getTeacherColorById(teacherId);
  return `background:${color}22;border-left:4px solid ${color};`;
}

function teacherShortCode(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "PROF";
  if (parts.length === 1) return parts[0].slice(0, 3).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function normalizeTeacherAbbreviation(value, fallbackName = "") {
  const raw = String(value || "")
    .trim()
    .replace(/\s+/g, "")
    .toUpperCase()
    .slice(0, 8);
  if (raw) return raw;
  return teacherShortCode(fallbackName);
}

function getTeacherDisplayLabel(teacher) {
  return normalizeTeacherAbbreviation(teacher?.abbreviation, teacher?.name || "PROF");
}

function applyClassRule() {
  const rule = getLevelRule(ui.classLevel.value);
  if (!rule) {
    ui.classWeeklyHours.value = "";
    ui.classRuleHint.textContent = "Sélectionnez un niveau pour appliquer la règle horaire.";
    ui.classCreateInfo.textContent = "Choisissez un niveau et un nombre de classes à générer.";
    return;
  }
  ui.classWeeklyHours.value = String(rule.weeklyHours);
  ui.classRuleHint.textContent = rule.hint;
  const prefix = getLevelPrefix(ui.classLevel.value);
  const count = Math.max(1, Math.min(26, Number(ui.classCount.value || 1)));
  const preview = Array.from({ length: count }, (_, i) => `${prefix}${String.fromCharCode(65 + i)}`).join(", ");
  ui.classCreateInfo.textContent = `Aperçu génération: ${preview}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function ensureRuntimeEnvironment() {
  if (window.location.protocol !== "file:") return true;

  const msg = "Mode fichier détecté. Ouvrez l'application via http://localhost (serveur web local), pas en file://.";
  ui.publicTeacherSummary.textContent = msg;
  ui.publicTimetableContainer.innerHTML = "";
  ui.sessionError.textContent = msg;
  if (ui.plannerGrid) {
    ui.plannerGrid.innerHTML = `<div class="card"><p>${escapeHtml(msg)}</p></div>`;
  }
  console.error(msg);
  return false;
}

function init() {
  setupModeSwitch();
  setupAdminSidebarToggle();
  buildConstraintsPicker();
  setupForms();
  if (ui.busEmailTo) ui.busEmailTo.value = localStorage.getItem("busEmailTo") || "";
  resetTeacherForm();
  setAdminTab("creation");
  setProgramSubTab("programming");
  applyClassRule();
  if (!ensureRuntimeEnvironment()) return;
  subscribeData();
}

init();
