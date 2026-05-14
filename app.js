const groups = [
  { name: "Line 2 Control", members: 18, state: "Active", detail: "Gangnam to Seolleung operations" },
  { name: "Station Safety", members: 11, state: "Idle", detail: "Platform safety and crowd response" },
  { name: "Emergency Ops", members: 7, state: "Priority", detail: "Incident command and rescue" },
  { name: "Maintenance", members: 9, state: "Idle", detail: "Track, signal, and rolling stock" },
  { name: "Mutual Aid", members: 23, state: "Patched", detail: "PS-LTE inter-agency bridge" }
];

const channelRows = [
  { group: "Line 2 Control", meta: "Train 204 keyed 00:03", state: "ACTIVE" },
  { group: "Emergency Ops", meta: "Priority floor available", state: "READY" },
  { group: "Station Safety", meta: "Platform 3 crowd alert", state: "WATCH" },
  { group: "Mutual Aid", meta: "Patched to PS-LTE", state: "PATCHED" }
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const activeGroup = $("#activeGroup");
const memberCount = $("#memberCount");
const floorOwner = $("#floorOwner");
const pttButton = $("#pttButton");
const pttLabel = $("#pttLabel");
const pttHint = $("#pttHint");
const emergencyButton = $("#emergencyButton");
const emergencyBanner = $("#emergencyBanner");
const modeText = $("#modeText");
const latencyText = $("#latencyText");
const signalText = $("#signalText");
const clock = $("#clock");
const messageForm = $("#messageForm");
const messageInput = $("#messageInput");
const messageList = $("#messageList");
const a11yToggle = $("#a11yToggle");

let currentGroup = groups[0];
let emergency = false;

function renderGroups() {
  const groupList = $("#groupList");
  groupList.innerHTML = groups
    .map(
      (group) => `
        <article class="group-card ${group.name === currentGroup.name ? "is-current" : ""}">
          <div>
            <strong>${group.name}</strong>
            <p>${group.members} members · ${group.detail}</p>
          </div>
          <button type="button" data-group="${group.name}">${group.state}</button>
        </article>
      `
    )
    .join("");

  groupList.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      currentGroup = groups.find((group) => group.name === button.dataset.group) || groups[0];
      syncCurrentGroup();
      renderGroups();
      setTab("home");
    });
  });
}

function renderChannels(incident = false) {
  const channelList = $("#channelList");
  channelList.innerHTML = channelRows
    .map((row, index) => {
      const alert = incident && index === 2;
      const warning = row.state === "WATCH" || row.state === "PATCHED";
      return `
        <div class="channel-row">
          <div>
            <strong>${row.group}</strong>
            <span>${alert ? "Emergency escalation requested" : row.meta}</span>
          </div>
          <span class="channel-state ${alert ? "alert" : warning ? "warning" : ""}">
            ${alert ? "ALERT" : row.state}
          </span>
        </div>
      `;
    })
    .join("");
}

function syncCurrentGroup() {
  activeGroup.textContent = currentGroup.name;
  memberCount.textContent = currentGroup.members;
}

function setTab(tabName) {
  $$(".tab-panel").forEach((panel) => {
    panel.classList.toggle("is-active", panel.id === `tab-${tabName}`);
  });
  $$(".bottom-nav button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tab === tabName);
  });
}

function startTalking() {
  pttButton.classList.add("is-talking");
  pttLabel.textContent = "LIVE";
  pttHint.textContent = "floor granted";
  floorOwner.textContent = "You";
}

function stopTalking() {
  pttButton.classList.remove("is-talking");
  pttLabel.textContent = "PTT";
  pttHint.textContent = "press and hold";
  floorOwner.textContent = emergency ? "Unit 204" : "Idle";
}

function toggleEmergency(forceState) {
  emergency = typeof forceState === "boolean" ? forceState : !emergency;
  emergencyBanner.hidden = !emergency;
  modeText.textContent = emergency ? "Emergency" : "Normal";
  floorOwner.textContent = emergency ? "Unit 204" : "Idle";
  document.body.classList.toggle("incident-mode", emergency);
  renderChannels(emergency);
}

function addMessage(text, direction = "outgoing") {
  const message = document.createElement("div");
  message.className = `message ${direction}`;
  message.textContent = text;
  messageList.appendChild(message);
  messageList.scrollTop = messageList.scrollHeight;
}

function updateTelemetry() {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
  latencyText.textContent = `${38 + Math.floor(Math.random() * 18)} ms`;
  signalText.textContent = `LTE-R ${88 + Math.floor(Math.random() * 9)}%`;
}

pttButton.addEventListener("pointerdown", startTalking);
pttButton.addEventListener("pointerup", stopTalking);
pttButton.addEventListener("pointerleave", stopTalking);
pttButton.addEventListener("keydown", (event) => {
  if (event.code === "Space" || event.code === "Enter") {
    event.preventDefault();
    startTalking();
  }
});
pttButton.addEventListener("keyup", stopTalking);

emergencyButton.addEventListener("click", () => toggleEmergency());
$("#simulateIncident").addEventListener("click", () => {
  toggleEmergency(true);
  addMessage("Emergency escalation from Station Safety.", "incoming");
});

$$(".bottom-nav button").forEach((button) => {
  button.addEventListener("click", () => setTab(button.dataset.tab));
});

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = messageInput.value.trim();
  if (!value) return;
  addMessage(value);
  messageInput.value = "";
});

a11yToggle.addEventListener("click", () => {
  const enabled = document.body.classList.toggle("a11y-mode");
  a11yToggle.setAttribute("aria-pressed", String(enabled));
});

renderGroups();
renderChannels();
syncCurrentGroup();
updateTelemetry();
setInterval(updateTelemetry, 8000);
