var tabAll = document.getElementById('tab-all');
var tabDuty = document.getElementById('tab-duty');
var tabOff = document.getElementById('tab-off');
var directoryTable = document.getElementById('directory-table');

function filterDrivers(status) {
  var rows = directoryTable.querySelectorAll('tbody tr');
  rows.forEach(function (row) {
    var badge = row.querySelector('.status-badge');
    if (!badge) return;
    var rowStatus = badge.innerText.trim().toLowerCase();
    
    if (status === 'all') {
      row.style.display = '';
    } else if (status === 'duty') {
      if (rowStatus === 'active') {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    } else if (status === 'off') {
      if (rowStatus === 'off duty' || rowStatus === 'in maintenance') {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    }
  });
}

if (tabAll) {
  tabAll.addEventListener('click', function () {
    document.querySelectorAll('.tab-btn').forEach(function (btn) { btn.classList.remove('active'); });
    tabAll.classList.add('active');
    filterDrivers('all');
  });
}

if (tabDuty) {
  tabDuty.addEventListener('click', function () {
    document.querySelectorAll('.tab-btn').forEach(function (btn) { btn.classList.remove('active'); });
    tabDuty.classList.add('active');
    filterDrivers('duty');
  });
}

if (tabOff) {
  tabOff.addEventListener('click', function () {
    document.querySelectorAll('.tab-btn').forEach(function (btn) { btn.classList.remove('active'); });
    tabOff.classList.add('active');
    filterDrivers('off');
  });
}

var searchInput = document.getElementById('search-input');
if (searchInput) {
  searchInput.addEventListener('input', function () {
    var val = searchInput.value.toLowerCase().trim();
    var rows = directoryTable.querySelectorAll('tbody tr');
    rows.forEach(function (row) {
      var text = row.innerText.toLowerCase();
      if (text.indexOf(val) > -1) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
}

var registerDriverBtn = document.getElementById('register-driver-btn');
var fabAddDriver = document.getElementById('fab-add-driver');

function addNewDriver() {
  var name = prompt("Enter Driver Full Name:", "Liam Peterson");
  if (!name) return;
  var phone = prompt("Enter Mobile Number:", "+1 (555) 000-0000");
  if (!phone) return;
  var vehicle = prompt("Assign Vehicle (e.g. TRK-201):", "TRK-201");
  if (!vehicle) return;
  
  var tbody = directoryTable.querySelector('tbody');
  if (tbody) {
    var tr = document.createElement('tr');
    tr.style.background = 'rgba(75, 65, 225, 0.08)';
    tr.innerHTML = '<td>' +
      '<div class="driver-detail-cell">' +
      '<div class="driver-avatar">' +
      '<span class="material-symbols-outlined" style="font-size:36px; display:flex; align-items:center; justify-content:center; height:100%; color:var(--on-surface-variant)">person</span>' +
      '</div>' +
      '<div>' +
      '<p class="driver-name">' + name + '</p>' +
      '<p class="driver-meta">ID: TX-' + Math.floor(10000 + Math.random() * 90000) + ' &bull; ' + phone + '</p>' +
      '</div>' +
      '</div>' +
      '</td>' +
      '<td><span class="status-badge active"><span class="dot"></span>Active</span></td>' +
      '<td>' +
      '<div class="vehicle-info-cell">' +
      '<p class="vehicle-name">' + vehicle + '</p>' +
      '<p class="vehicle-meta">VIN: ...' + Math.floor(1000 + Math.random() * 9000) + '</p>' +
      '</div>' +
      '</td>' +
      '<td>' +
      '<div class="compliance-cell current">' +
      '<span class="material-symbols-outlined">verified</span>' +
      '<span>Current</span>' +
      '</div>' +
      '<p class="compliance-expiry">Expires: Oct 2026</p>' +
      '</td>' +
      '<td>' +
      '<div class="safety-rating">' +
      '<span>5.0</span>' +
      '<div class="safety-stars">' +
      '<span class="material-symbols-outlined">star</span>' +
      '<span class="material-symbols-outlined">star</span>' +
      '<span class="material-symbols-outlined">star</span>' +
      '<span class="material-symbols-outlined">star</span>' +
      '<span class="material-symbols-outlined">star</span>' +
      '</div>' +
      '</div>' +
      '</td>' +
      '<td><button class="action-btn"><span class="material-symbols-outlined">more_vert</span></button></td>';
    
    tbody.insertBefore(tr, tbody.firstChild);
    setTimeout(function () {
      tr.style.background = '';
    }, 800);
    
    var valNode = document.querySelector('.metric-card.border-secondary .metric-value');
    if (valNode) {
      var current = parseInt(valNode.innerText, 10);
      valNode.innerText = current + 1;
    }
  }
}

if (registerDriverBtn) {
  registerDriverBtn.addEventListener('click', addNewDriver);
}
if (fabAddDriver) {
  fabAddDriver.addEventListener('click', addNewDriver);
}

document.querySelectorAll('.deadline-action-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var title = btn.parentElement.querySelector('.deadline-title').innerText;
    alert("Action triggered for: " + title);
  });
});

var notifBtn = document.getElementById('notif-btn');
if (notifBtn) {
  notifBtn.addEventListener('click', function () {
    window.location.href = 'notifications.html';
  });
}

