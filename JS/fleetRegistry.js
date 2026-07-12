document.addEventListener('DOMContentLoaded', () => {
  // Real-time Search Filter for Vehicles
  const searchInput = document.getElementById('search-input');
  const tableRows = document.querySelectorAll('.table-row');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      tableRows.forEach(row => {
        const regNum = row.querySelector('.reg-number').textContent.toLowerCase();
        const model = row.cells[1].textContent.toLowerCase();
        const type = row.cells[2].textContent.toLowerCase();
        
        if (regNum.includes(query) || model.includes(query) || type.includes(query)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });

    // Search focus styling wrapper
    const searchBox = searchInput.closest('.search-box');
    if (searchBox) {
      searchInput.addEventListener('focus', () => {
        searchBox.style.boxShadow = '0 0 0 2px rgba(75, 65, 225, 0.2)';
        searchBox.style.borderRadius = '8px';
      });
      searchInput.addEventListener('blur', () => {
        searchBox.style.boxShadow = '';
      });
    }
  }

  // Row Details Viewer Click Handler
  tableRows.forEach(row => {
    row.addEventListener('click', () => {
      const reg = row.querySelector('.reg-number').textContent;
      const model = row.cells[1].textContent;
      const status = row.querySelector('.status-pill').textContent.trim();
      
      console.log(`Vehicle details requested for: ${reg} (${model}) - Status: ${status}`);
      // Visual feedback ripple/active effect
      row.style.backgroundColor = 'rgba(75, 65, 225, 0.1)';
      setTimeout(() => {
        row.style.backgroundColor = '';
      }, 300);
    });
  });

  // Action Buttons
  const filterBtn = document.getElementById('filter-btn');
  if (filterBtn) {
    filterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      alert('Filter settings opened (Placeholder for operations filter drawer).');
    });
  }

  const addVehicleBtn = document.getElementById('add-vehicle-btn');
  const fabAddBtn = document.getElementById('fab-add-btn');
  
  const handleAddVehicle = (e) => {
    e.stopPropagation();
    const reg = prompt('Enter vehicle registration number (e.g., TX-123-A):');
    if (reg) {
      alert(`Vehicle registration initiated for ${reg}. Proceeding to registration wizard...`);
      window.location.href = 'register.html';
    }
  };

  if (addVehicleBtn) addVehicleBtn.addEventListener('click', handleAddVehicle);
  if (fabAddBtn) fabAddBtn.addEventListener('click', handleAddVehicle);

  // Pagination Active States
  const paginationButtons = document.querySelectorAll('.pagination-btn');
  paginationButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!btn.disabled && !btn.classList.contains('active')) {
        paginationButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        console.log(`Loading fleet entries for page ${btn.textContent}...`);
      }
    });
  });
});
