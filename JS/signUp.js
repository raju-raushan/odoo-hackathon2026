document.getElementById('password-toggle').addEventListener('click', function () {
  var pw = document.getElementById('password');
  var icon = this.querySelector('.material-symbols-outlined');
  if (pw.type === 'password') {
    pw.type = 'text';
    icon.textContent = 'visibility_off';
  } else {
    pw.type = 'password';
    icon.textContent = 'visibility';
  }
});

document.getElementById('signin-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  
  var email = document.getElementById('email').value.trim();
  var password = document.getElementById('password').value;
  var selectedRoleVal = document.getElementById('workspace-role').value;
  
  var roleMap = {
    'fleet-manager': 'Fleet Manager',
    'dispatcher': 'Dispatcher',
    'safety-officer': 'Safety Officer',
    'financial-analyst': 'Financial Analyst'
  };
  var expectedRole = roleMap[selectedRoleVal];
  
  var btn = document.getElementById('signin-btn');
  var orig = btn.innerHTML;
  btn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> <span>Authenticating...</span>';
  btn.disabled = true;

  var errorBanner = document.getElementById('error-banner');
  if (errorBanner) {
    errorBanner.style.display = 'none';
  }

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const result = await response.json();
    if (response.ok) {
      if (result.user.role !== expectedRole) {
        if (errorBanner) {
          errorBanner.style.display = 'flex';
          errorBanner.querySelector('.eb-title').innerText = "Role Mismatch";
          errorBanner.querySelector('.eb-desc').innerText = `Your account is registered as '${result.user.role}', not '${expectedRole}'.`;
        } else {
          alert(`Role Mismatch: Your account is registered as '${result.user.role}', not '${expectedRole}'.`);
        }
        btn.innerHTML = orig;
        btn.disabled = false;
        return;
      }
      
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      btn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Authenticated!';
      setTimeout(function () {
        window.location.href = 'dashboard.html';
      }, 1000);
    } else {
      if (errorBanner) {
        errorBanner.style.display = 'flex';
        errorBanner.querySelector('.eb-title').innerText = "Login Failed";
        errorBanner.querySelector('.eb-desc').innerText = result.error || "Invalid credentials.";
      } else {
        alert("Login Failed: " + (result.error || "Invalid credentials."));
      }
      btn.innerHTML = orig;
      btn.disabled = false;
    }
  } catch (error) {
    if (errorBanner) {
      errorBanner.style.display = 'flex';
      errorBanner.querySelector('.eb-title').innerText = "Network Error";
      errorBanner.querySelector('.eb-desc').innerText = "Could not connect to the backend server.";
    } else {
      alert("Network Error: Could not connect to the backend server.");
    }
    btn.innerHTML = orig;
    btn.disabled = false;
  }
});
