function selectRole(el) {
  document.querySelectorAll('.role-btn').forEach(function (b) {
    b.classList.remove('active');
  });
  el.classList.add('active');
}

document.getElementById('register-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  
  var name = document.getElementById('reg-name').value.trim();
  var email = document.getElementById('reg-email').value.trim();
  var password = document.getElementById('reg-pass').value;
  var confirm = document.getElementById('reg-confirm').value;
  
  if (password !== confirm) {
    alert("Passwords do not match!");
    return;
  }
  
  // Get active role
  var activeRoleEl = document.querySelector('.role-btn.active');
  if (!activeRoleEl) {
    alert("Please select a workspace role.");
    return;
  }
  
  var roleText = activeRoleEl.querySelector('span').innerText.trim();
  // Map "Analyst" to "Financial Analyst"
  var role = roleText;
  if (role === 'Analyst') {
    role = 'Financial Analyst';
  }
  
  var btn = document.getElementById('register-btn');
  var orig = btn.innerHTML;
  btn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> Creating Account...';
  btn.disabled = true;

  try {
    const response = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password, role })
    });
    
    const result = await response.json();
    if (response.ok) {
      btn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Welcome Aboard!';
      btn.style.background = '#16a34a';
      btn.style.boxShadow = '0 8px 24px rgba(22,163,74,0.2)';
      setTimeout(function () {
        window.location.href = 'signUp.html';
      }, 1500);
    } else {
      alert("Error: " + (result.error || "Failed to register"));
      btn.innerHTML = orig;
      btn.style.background = '';
      btn.style.boxShadow = '';
      btn.disabled = false;
    }
  } catch (error) {
    alert("Network Error: Could not connect to the backend server.");
    btn.innerHTML = orig;
    btn.style.background = '';
    btn.style.boxShadow = '';
    btn.disabled = false;
  }
});
