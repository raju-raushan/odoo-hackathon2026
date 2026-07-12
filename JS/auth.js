(function () {
  var token = localStorage.getItem('token');
  var userJson = localStorage.getItem('user');
  
  var currentPath = window.location.pathname;
  var isAuthPage = currentPath.indexOf('signUp.html') !== -1 || currentPath.indexOf('register.html') !== -1;
  
  if (!token || !userJson) {
    if (!isAuthPage) {
      window.location.href = 'signUp.html';
      return;
    }
  } else {
    // If logged in and trying to access login/register, redirect to dashboard
    if (isAuthPage) {
      window.location.href = 'dashboard.html';
      return;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (userJson) {
      try {
        var user = JSON.parse(userJson);
        
        // 1. Update all topbar user-info blocks
        var userInfoEl = document.querySelector('.user-info');
        if (userInfoEl) {
          var textEl = userInfoEl.querySelector('.text');
          if (textEl) {
            textEl.innerHTML = '<p>' + user.name + '</p><p>' + user.role + '</p>';
          }
          var imgEl = userInfoEl.querySelector('img');
          if (imgEl) {
            imgEl.alt = user.name;
            imgEl.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=4b41e1&color=fff&bold=true';
          }
        }
        
        // 2. Update profile page fields if we are on profile.html
        if (currentPath.indexOf('profile.html') !== -1) {
          var profileNameInput = document.getElementById('profile-name');
          if (profileNameInput) {
            profileNameInput.value = user.name;
          }
          var profileEmailInput = document.getElementById('profile-email');
          if (profileEmailInput) {
            profileEmailInput.value = user.email;
          }
          var badgeInput = document.querySelector('.fields-grid .field input[readonly]');
          if (badgeInput) {
            badgeInput.value = 'User ID: #' + user.id;
          }
        }
      } catch (e) {
        console.error("Error setting user info:", e);
      }
    }
    
    // 3. Add logout action to the sidebar footer logout link
    var logoutLink = document.querySelector('.sidebar-footer a[href="signUp.html"]');
    if (logoutLink) {
      logoutLink.addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.clear();
        window.location.href = 'signUp.html';
      });
    }
  });
})();
