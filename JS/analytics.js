document.addEventListener('DOMContentLoaded', function () {
  var areaPath = document.getElementById('area-fill-path');
  var toggleLine = document.getElementById('toggle-line');
  var toggleArea = document.getElementById('toggle-area');

  if (toggleLine && toggleArea && areaPath) {
    toggleLine.addEventListener('click', function () {
      toggleArea.classList.remove('active');
      toggleLine.classList.add('active');
      areaPath.style.opacity = '0';
      areaPath.style.transition = 'opacity 0.3s ease';
    });

    toggleArea.addEventListener('click', function () {
      toggleLine.classList.remove('active');
      toggleArea.classList.add('active');
      areaPath.style.opacity = '1';
      areaPath.style.transition = 'opacity 0.3s ease';
    });
  }

  var mapViewport = document.querySelector('.heatmap-viewport');
  var zoomIn = document.getElementById('map-zoom-in');
  var zoomOut = document.getElementById('map-zoom-out');
  var locate = document.getElementById('map-locate');
  var zoomLevel = 100;

  if (mapViewport) {
    if (zoomIn) {
      zoomIn.addEventListener('click', function () {
        zoomLevel = Math.min(zoomLevel + 10, 160);
        mapViewport.style.backgroundSize = zoomLevel + '%';
      });
    }
    if (zoomOut) {
      zoomOut.addEventListener('click', function () {
        zoomLevel = Math.max(zoomLevel - 10, 80);
        mapViewport.style.backgroundSize = zoomLevel + '%';
      });
    }
    if (locate) {
      locate.addEventListener('click', function () {
        zoomLevel = 100;
        mapViewport.style.backgroundSize = 'cover';
        mapViewport.style.backgroundPosition = 'center';
      });
    }
  }

  var applyOptBtn = document.getElementById('apply-opt-btn');
  if (applyOptBtn) {
    applyOptBtn.addEventListener('click', function () {
      applyOptBtn.textContent = '✓ Applied';
      applyOptBtn.style.background = '#16a34a';
      applyOptBtn.style.color = '#fff';
      setTimeout(function () {
        applyOptBtn.textContent = 'Apply Optimization';
        applyOptBtn.style.background = '';
        applyOptBtn.style.color = '';
      }, 2000);
    });
  }

  var notifBtn = document.getElementById('notif-btn');
  if (notifBtn) {
    notifBtn.addEventListener('click', function () {
      window.location.href = 'notifications.html';
    });
  }

  var dispatchBtn = document.getElementById('dispatch-view-btn');
  if (dispatchBtn) {
    dispatchBtn.addEventListener('click', function () {
      window.location.href = 'trip_dispatcher.html';
    });
  }

  var newReportBtn = document.getElementById('new-report-btn');
  if (newReportBtn) {
    newReportBtn.addEventListener('click', function () {
      alert('Configuring Report Layout options...');
    });
  }

  var timeSelect = document.getElementById('time-range-select');
  if (timeSelect) {
    timeSelect.addEventListener('change', function () {
      var val = timeSelect.value;
      var rev = document.querySelector('.metric-card.revenue .metric-val');
      var util = document.querySelector('.metric-card.utilization .metric-val');
      
      if (val === 'Today') {
        if (rev) rev.innerText = '$42,500';
        if (util) util.innerText = '96.8%';
      } else if (val === 'Last 7 Days') {
        if (rev) rev.innerText = '$295,000';
        if (util) util.innerText = '95.1%';
      } else {
        if (rev) rev.innerText = '$1,284,500';
        if (util) util.innerText = '94.2%';
      }
    });
  }
});
