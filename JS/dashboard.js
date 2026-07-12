document.querySelectorAll('.trips-table tbody tr').forEach(function (row) {
  row.addEventListener('click', function () {
    var tripId = row.cells[0] ? row.cells[0].innerText : '';
    row.style.background = 'rgba(75, 65, 225, 0.08)';
    setTimeout(function () {
      row.style.background = '';
    }, 400);
  });
});

var searchInput = document.getElementById('search-input');
if (searchInput) {
  searchInput.addEventListener('focus', function () {
    searchInput.parentElement.style.transform = 'scale(1.01)';
    searchInput.parentElement.style.transition = 'transform 0.2s';
  });
  searchInput.addEventListener('blur', function () {
    searchInput.parentElement.style.transform = 'scale(1)';
  });
}

function animateProgressBars() {
  var bars = document.querySelectorAll('.progress-fill');
  bars.forEach(function (bar) {
    var target = bar.getAttribute('data-target');
    if (target) {
      setTimeout(function () {
        bar.style.width = target + '%';
      }, 300);
    }
  });
}

function animateCounters() {
  var counters = document.querySelectorAll('.stat-value');
  counters.forEach(function (counter) {
    var text = counter.innerText;
    var isPercent = text.indexOf('%') !== -1;
    var num = parseInt(text.replace('%', ''), 10);
    if (isNaN(num)) return;
    var current = 0;
    var step = Math.max(1, Math.floor(num / 30));
    var interval = setInterval(function () {
      current += step;
      if (current >= num) {
        current = num;
        clearInterval(interval);
      }
      counter.innerText = (current < 10 && !isPercent ? '0' : '') + current + (isPercent ? '%' : '');
    }, 30);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  animateProgressBars();
  animateCounters();
});

var createTripBtn = document.getElementById('create-trip-btn');
if (createTripBtn) {
  createTripBtn.addEventListener('click', function () {
    createTripBtn.textContent = '✓ Trip Created!';
    createTripBtn.style.background = '#16a34a';
    setTimeout(function () {
      createTripBtn.innerHTML = '<span class="material-symbols-outlined">add</span> Create New Trip';
      createTripBtn.style.background = '';
    }, 1500);
  });
}

var notifBtn = document.getElementById('notif-btn');
if (notifBtn) {
  notifBtn.addEventListener('click', function () {
    window.location.href = 'notifications.html';
  });
}

