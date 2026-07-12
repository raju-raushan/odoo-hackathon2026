function animateCostValue(targetVal) {
  var el = document.getElementById('total-cost-val');
  if (!el) return;
  var current = parseFloat(el.innerText.replace(/,/g, ''));
  var target = parseFloat(targetVal);
  var diff = target - current;
  if (diff === 0) return;
  
  var steps = 25;
  var increment = diff / steps;
  var count = 0;
  
  var interval = setInterval(function () {
    current += increment;
    count++;
    if (count >= steps) {
      current = target;
      clearInterval(interval);
    }
    el.innerText = current.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }, 20);
}

var logFuelBtn = document.getElementById('log-fuel-btn');
if (logFuelBtn) {
  logFuelBtn.addEventListener('click', function () {
    var vehicle = prompt("Enter Vehicle ID (e.g. VAN-05):", "VAN-05");
    if (!vehicle) return;
    var liters = prompt("Enter Liters Filled (e.g. 50):", "50");
    if (!liters || isNaN(liters)) return;
    var cost = prompt("Enter Fuel Cost ($):", "3500");
    if (!cost || isNaN(cost)) return;
    
    // Add row to Fuel Logs Table
    var tbody = document.querySelector('#fuel-logs-table tbody');
    if (tbody) {
      var tr = document.createElement('tr');
      tr.style.background = 'rgba(75, 65, 225, 0.08)';
      tr.innerHTML = '<td class="font-bold">' + vehicle + '</td>' +
        '<td>Today</td>' +
        '<td>' + liters + ' L</td>' +
        '<td class="text-right mono">' + parseFloat(cost).toFixed(2) + '</td>';
      tbody.insertBefore(tr, tbody.firstChild);
      setTimeout(function () {
        tr.style.background = '';
      }, 800);
      
      // Update overall cost
      var currentTotal = parseFloat(document.getElementById('total-cost-val').innerText.replace(/,/g, ''));
      animateCostValue(currentTotal + parseFloat(cost));
    }
  });
}

var addExpenseBtn = document.getElementById('add-expense-btn');
if (addExpenseBtn) {
  addExpenseBtn.addEventListener('click', function () {
    var trip = prompt("Enter Trip ID (e.g. TR003):", "TR003");
    if (!trip) return;
    var vehicle = prompt("Enter Vehicle ID:", "VAN-05");
    if (!vehicle) return;
    var toll = prompt("Enter Toll cost ($):", "150");
    if (!toll || isNaN(toll)) return;
    var other = prompt("Enter Other cost ($):", "50");
    if (!other || isNaN(other)) return;
    
    var tollVal = parseFloat(toll);
    var otherVal = parseFloat(other);
    var totalVal = tollVal + otherVal;
    
    // Add row to Other Expenses Table
    var tbody = document.querySelector('#other-expenses-table tbody');
    if (tbody) {
      var tr = document.createElement('tr');
      tr.style.background = 'rgba(75, 65, 225, 0.08)';
      tr.innerHTML = '<td class="font-bold">' + trip + '</td>' +
        '<td>' + vehicle + '</td>' +
        '<td class="mono">' + tollVal.toFixed(2) + '</td>' +
        '<td class="mono">' + otherVal.toFixed(2) + '</td>' +
        '<td class="mono">0.00</td>' +
        '<td class="text-right mono font-bold">' + totalVal.toFixed(2) + '</td>' +
        '<td class="text-center"><span class="expense-badge available">AVAILABLE</span></td>';
      tbody.insertBefore(tr, tbody.firstChild);
      setTimeout(function () {
        tr.style.background = '';
      }, 800);
      
      // Update overall cost
      var currentTotal = parseFloat(document.getElementById('total-cost-val').innerText.replace(/,/g, ''));
      animateCostValue(currentTotal + totalVal);
    }
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

var trendBtn = document.getElementById('trend-btn');
if (trendBtn) {
  trendBtn.addEventListener('click', function (e) {
    e.preventDefault();
    alert("Historical Analytics window is loading...");
  });
}
