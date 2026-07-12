function selectFreq(el) {
  document.querySelectorAll('.freq-btn').forEach(function (b) {
    b.classList.remove('active');
  });
  el.classList.add('active');
}

function selectTheme(el) {
  document.querySelectorAll('.theme-btn').forEach(function (b) {
    b.classList.remove('active');
  });
  el.classList.add('active');
}

document.getElementById('save-btn').addEventListener('click', function () {
  var b = this;
  b.textContent = 'Saving...';
  b.disabled = true;
  setTimeout(function () {
    b.textContent = '✓ Saved!';
    b.style.background = '#16a34a';
    setTimeout(function () {
      b.textContent = 'Save Changes';
      b.style.background = '';
      b.disabled = false;
    }, 1500);
  }, 800);
});
