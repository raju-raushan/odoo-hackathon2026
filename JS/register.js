function selectRole(el) {
  document.querySelectorAll('.role-btn').forEach(function (b) {
    b.classList.remove('active');
  });
  el.classList.add('active');
}

document.getElementById('register-form').addEventListener('submit', function (e) {
  e.preventDefault();
  var btn = document.getElementById('register-btn');
  var orig = btn.innerHTML;
  btn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> Initializing Workspace...';
  btn.disabled = true;
  setTimeout(function () {
    btn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Welcome Aboard!';
    btn.style.background = '#16a34a';
    btn.style.boxShadow = '0 8px 24px rgba(22,163,74,0.2)';
    setTimeout(function () {
      btn.innerHTML = orig;
      btn.style.background = '';
      btn.style.boxShadow = '';
      btn.disabled = false;
    }, 2000);
  }, 1800);
});
