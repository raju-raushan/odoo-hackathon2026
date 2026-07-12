document.querySelectorAll('.toggle-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.toggle-btn').forEach(function (b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');
  });
});

var saveRecordBtn = document.getElementById('save-record-btn');
if (saveRecordBtn) {
  saveRecordBtn.addEventListener('click', function (e) {
    e.preventDefault();
    saveRecordBtn.innerHTML = '<span class="material-symbols-outlined animate-spin" style="margin-right: 8px; animation: spin 1s linear infinite;">progress_activity</span> Saving...';
    saveRecordBtn.disabled = true;
    
    // Inject keyframes if not exists
    if (!document.getElementById('spin-style')) {
      var style = document.createElement('style');
      style.id = 'spin-style';
      style.innerHTML = '@keyframes spin { 100% { transform: rotate(360deg); } }';
      document.head.appendChild(style);
    }

    setTimeout(function () {
      saveRecordBtn.innerHTML = '✓ Saved!';
      saveRecordBtn.style.background = '#16a34a';
      setTimeout(function () {
        saveRecordBtn.innerHTML = 'Save Record';
        saveRecordBtn.style.background = '';
        saveRecordBtn.disabled = false;
        
        // Mock add new record to table
        var vehicle = document.getElementById('vehicle-select').value;
        var type = document.getElementById('service-type').value || 'General Service';
        var cost = parseFloat(document.getElementById('service-cost').value || '2500').toFixed(2);
        var date = document.getElementById('service-date').value;
        var status = document.querySelector('.toggle-btn.active').getAttribute('data-status');
        
        var statusBadge = '';
        if (status === 'completed') {
          statusBadge = '<span class="maint-status-badge completed"><span class="dot"></span>Completed</span>';
        } else {
          statusBadge = '<span class="maint-status-badge in-shop"><span class="dot"></span>In Shop</span>';
        }

        var tbody = document.querySelector('#service-table tbody');
        if (tbody) {
          var tr = document.createElement('tr');
          tr.className = 'hover:bg-surface-container-lowest transition-colors group';
          tr.innerHTML = '<td><div class="vehicle-cell"><span class="material-symbols-outlined">local_shipping</span><span>' + vehicle + '</span></div></td>' +
            '<td>' + type + '</td>' +
            '<td class="text-right cost-cell">' + cost + '</td>' +
            '<td>' + statusBadge + '</td>' +
            '<td class="text-center"><button class="row-action-btn"><span class="material-symbols-outlined">more_vert</span></button></td>';
          tbody.insertBefore(tr, tbody.firstChild);
        }
      }, 1200);
    }, 1000);
  });
}

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

var fabEmergency = document.getElementById('fab-emergency');
if (fabEmergency) {
  fabEmergency.addEventListener('click', function () {
    alert('Emergency breakdown signal dispatched to nearby support units!');
  });
}
