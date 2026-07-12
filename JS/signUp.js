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

document.getElementById('signin-form').addEventListener('submit', function (e) {
  e.preventDefault();
  var btn = document.getElementById('signin-btn');
  var orig = btn.innerHTML;
  btn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> <span>Authenticating...</span>';
  btn.disabled = true;
  setTimeout(function () {
    btn.innerHTML = orig;
    btn.disabled = false;
  }, 1800);
});
