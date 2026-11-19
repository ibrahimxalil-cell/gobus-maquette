const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const toast = $('#toast');
let toastTimer;
function showToast(message) {
  toast.querySelector('p').textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function switchView(viewName) {
  $$('.view').forEach(view => view.classList.remove('active'));
  const target = $(`#${viewName}-view`);
  if (target) target.classList.add('active');

  $$('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.view === viewName));
  $$('.mobile-nav button').forEach(item => item.classList.toggle('active', item.dataset.view === viewName));

  const titles = { dashboard: 'Tableau de bord', students: 'Élèves', notifications: 'Notifications', history: 'Historique' };
  $('#page-title').innerHTML = viewName === 'dashboard' ? 'Bonjour, Awa <span>👋</span>' : titles[viewName];
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

$$('[data-view]').forEach(button => {
  button.addEventListener('click', () => switchView(button.dataset.view));
});

$$('.role-switch button').forEach(button => {
  button.addEventListener('click', () => {
    $$('.role-switch button').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    if (button.dataset.role === 'parent') {
      $('#page-title').innerHTML = 'Bonjour, Mamadou <span>👋</span>';
      $$('.nav-item').forEach(item => item.disabled = false);
      showToast('Profil parent activé');
    } else {
      $('#page-title').innerHTML = 'Bonjour, Awa <span>👋</span>';
      showToast('Profil accompagnateur activé');
    }
  });
});

$('#open-students')?.addEventListener('click', () => switchView('students'));
$('#notification-button')?.addEventListener('click', () => switchView('notifications'));

$$('.filter-pills button').forEach(button => {
  button.addEventListener('click', () => {
    $$('.filter-pills button').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    $$('.student-row').forEach(row => {
      row.style.display = filter === 'all' || row.dataset.status === filter ? 'flex' : 'none';
    });
  });
});

$('#student-search')?.addEventListener('input', event => {
  const term = event.target.value.toLowerCase();
  $$('.student-row').forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(term) ? 'flex' : 'none';
  });
});

$$('.point-button').forEach(button => {
  button.addEventListener('click', () => {
    const row = button.closest('.student-row');
    row.dataset.status = 'present';
    const tag = $('.presence-tag', row);
    tag.textContent = 'À bord';
    tag.classList.remove('waiting');
    button.outerHTML = '<span>07:21</span><button class="round-action" aria-label="Menu élève">•••</button>';
    showToast(`${$('.student-info h3', row).textContent} a été pointé(e)`);
  });
});

$('#point-all')?.addEventListener('click', () => {
  $$('.student-row[data-status="waiting"]').forEach(row => {
    row.dataset.status = 'present';
    const tag = $('.presence-tag', row);
    tag.textContent = 'À bord';
    tag.classList.remove('waiting');
    const action = $('.student-action', row);
    action.innerHTML = '<span>07:21</span><button class="round-action" aria-label="Menu élève">•••</button>';
  });
  showToast('Tous les élèves ont été pointés');
});

$('#mark-read')?.addEventListener('click', () => {
  $$('.notification-row').forEach(row => row.classList.remove('unread'));
  showToast('Notifications marquées comme lues');
});

$('#center-map')?.addEventListener('click', () => {
  const bus = $('#bus-marker');
  bus.animate([{ transform: 'translate(-50%, -50%) scale(1)' }, { transform: 'translate(-50%, -50%) scale(1.25)' }, { transform: 'translate(-50%, -50%) scale(1)' }], { duration: 600 });
  showToast('Bus recentré sur la carte');
});

$('#profile-button')?.addEventListener('click', () => showToast('Compte de Awa Mamadou'));

// Petite simulation du trajet pour rendre la maquette vivante
let progress = 0;
setInterval(() => {
  if (!$('#dashboard-view').classList.contains('active')) return;
  progress = (progress + 1) % 12;
  const bus = $('#bus-marker');
  const positions = [
    [48,42],[50,40],[52,38],[54,36],[56,34],[58,32],
    [60,31],[62,30],[64,29],[66,28],[68,27],[70,26]
  ];
  const [left, top] = positions[progress];
  bus.style.left = `${left}%`;
  bus.style.top = `${top}%`;
}, 1600);
