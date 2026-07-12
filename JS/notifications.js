var cards = document.querySelectorAll('.notification-card');
var markAllRead = document.getElementById('mark-all-read');
var filterPills = document.querySelectorAll('.filter-pill');
var searchInput = document.getElementById('search-input');
var emptyState = document.getElementById('empty-state');
var groupsContainer = document.getElementById('groups-container');

function updateVisibility() {
  var activeFilter = document.querySelector('.filter-pill.active').getAttribute('data-filter');
  var searchText = searchInput.value.toLowerCase().trim();
  var visibleCardsCount = 0;
  
  var groupSections = document.querySelectorAll('.group-section');
  groupSections.forEach(function (section) {
    var sectionCards = section.querySelectorAll('.notification-card');
    var visibleInSection = 0;
    
    sectionCards.forEach(function (card) {
      var category = card.getAttribute('data-category');
      var contentText = card.innerText.toLowerCase();
      
      var matchFilter = (activeFilter === 'all') || 
                        (activeFilter === 'critical' && category === 'critical') ||
                        (activeFilter === 'fleet' && (category === 'fleet' || category === 'trip')) ||
                        (activeFilter === 'system' && category === 'system');
      
      var matchSearch = contentText.indexOf(searchText) > -1;
      
      if (matchFilter && matchSearch) {
        card.style.display = 'flex';
        visibleInSection++;
        visibleCardsCount++;
      } else {
        card.style.display = 'none';
      }
    });
    
    if (visibleInSection === 0) {
      section.style.display = 'none';
    } else {
      section.style.display = '';
    }
  });
  
  if (visibleCardsCount === 0) {
    groupsContainer.style.display = 'none';
    emptyState.style.display = 'flex';
  } else {
    groupsContainer.style.display = 'block';
    emptyState.style.display = 'none';
  }
}

cards.forEach(function (card) {
  card.addEventListener('click', function () {
    if (card.classList.contains('unread')) {
      card.classList.remove('unread');
      card.classList.add('read');
    }
    card.style.transform = 'scale(0.98)';
    setTimeout(function () {
      card.style.transform = 'scale(1)';
    }, 100);
  });
});

if (markAllRead) {
  markAllRead.addEventListener('click', function () {
    cards.forEach(function (card) {
      if (card.classList.contains('unread')) {
        card.classList.remove('unread');
        card.classList.add('read');
      }
    });
  });
}

filterPills.forEach(function (pill) {
  pill.addEventListener('click', function () {
    filterPills.forEach(function (p) { p.classList.remove('active'); });
    pill.classList.add('active');
    updateVisibility();
  });
});

if (searchInput) {
  searchInput.addEventListener('input', function () {
    updateVisibility();
  });
}

var toggleNotifications = document.getElementById('toggle-notifications');
var toggleArchive = document.getElementById('toggle-archive');

if (toggleNotifications && toggleArchive) {
  toggleNotifications.addEventListener('click', function () {
    toggleArchive.classList.remove('active');
    toggleNotifications.classList.add('active');
  });
  toggleArchive.addEventListener('click', function () {
    toggleNotifications.classList.remove('active');
    toggleArchive.classList.add('active');
  });
}

var fabAlert = document.getElementById('fab-alert');
if (fabAlert) {
  fabAlert.addEventListener('click', function () {
    var desc = prompt("Enter Quick Alert description:");
    if (!desc) return;
    
    var tbody = document.querySelector('#group-today .notifications-list');
    if (tbody) {
      var card = document.createElement('div');
      card.className = 'notification-card unread';
      card.setAttribute('data-category', 'critical');
      card.innerHTML = '<div class="icon-wrapper critical"><span class="material-symbols-outlined">error</span></div>' +
        '<div class="notification-content">' +
        '<div class="notification-header">' +
        '<h4 class="notification-title">Quick Operational Alert</h4>' +
        '<span class="notification-time">Just Now</span>' +
        '</div>' +
        '<p class="notification-desc">' + desc + '</p>' +
        '<div class="notification-footer"><span class="category-tag critical">Critical Alert</span></div>' +
        '</div>';
      
      tbody.insertBefore(card, tbody.firstChild);
      
      card.addEventListener('click', function () {
        if (card.classList.contains('unread')) {
          card.classList.remove('unread');
          card.classList.add('read');
        }
      });
      
      updateVisibility();
    }
  });
}
