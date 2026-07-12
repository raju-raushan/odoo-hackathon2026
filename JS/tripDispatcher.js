document.addEventListener('DOMContentLoaded', () => {
  const dispatchForm = document.getElementById('dispatchForm');
  const weightInput = document.getElementById('cargoWeight');
  const vehicleSelect = document.getElementById('vehicleSelector');
  const warning = document.getElementById('weightWarning');
  const capacityIndicator = document.getElementById('capacityIndicator');
  const stepperSteps = document.querySelectorAll('.stepper .step');
  const liveBoardTableBody = document.querySelector('table tbody');
  const activeCountBadge = document.getElementById('active-trips-count');

  // Weight validation logic
  function validateWeight() {
    if (!vehicleSelect || !weightInput || !capacityIndicator || !warning) return;
    
    const maxCap = parseInt(vehicleSelect.value) || 0;
    const currentWeight = parseInt(weightInput.value) || 0;
    
    capacityIndicator.textContent = `${currentWeight.toLocaleString()} / ${maxCap.toLocaleString()}kg`;
    
    if (currentWeight > maxCap) {
      warning.classList.remove('hidden');
      weightInput.classList.add('input-error');
      // Advance step indicator to show draft error state or similar if needed
    } else {
      warning.classList.add('hidden');
      weightInput.classList.remove('input-error');
    }
  }

  if (weightInput && vehicleSelect) {
    weightInput.addEventListener('input', validateWeight);
    vehicleSelect.addEventListener('change', validateWeight);
    // Run validation initially
    validateWeight();
  }

  // Monitor inputs to advance draft stepper state
  const formInputs = dispatchForm ? dispatchForm.querySelectorAll('input') : [];
  function updateStepperProgress() {
    let filledCount = 0;
    formInputs.forEach(input => {
      if (input.value.trim() !== '') {
        filledCount++;
      }
    });

    if (filledCount >= 3) {
      // Step 2 active (ready to dispatch)
      stepperSteps.forEach((step, idx) => {
        if (idx === 1) {
          step.classList.remove('disabled');
          step.classList.add('active');
        }
      });
    } else {
      stepperSteps.forEach((step, idx) => {
        if (idx > 0) {
          step.classList.remove('active');
          step.classList.add('disabled');
        }
      });
    }
  }

  formInputs.forEach(input => {
    input.addEventListener('input', updateStepperProgress);
  });

  // Trip Dispatch Form Submission
  if (dispatchForm) {
    dispatchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const maxCap = parseInt(vehicleSelect.value) || 0;
      const currentWeight = parseInt(weightInput.value) || 0;
      
      if (currentWeight > maxCap) {
        alert('Cannot dispatch trip. Cargo weight exceeds vehicle capacity.');
        return;
      }

      const source = dispatchForm.querySelector('input[value="Warehouse A-12"]').value || 'Source';
      const destInput = dispatchForm.querySelector('input[placeholder="Enter port/hub"]');
      const destination = destInput ? destInput.value : 'Destination';
      
      if (!destination.trim()) {
        alert('Please enter a destination.');
        return;
      }

      const selectedVehicleText = vehicleSelect.options[vehicleSelect.selectedIndex].text.split('(')[0].trim();
      const tripId = `TR00${Math.floor(Math.random() * 900) + 100}`;

      // Create a new row in the live board table
      if (liveBoardTableBody) {
        const newRow = document.createElement('tr');
        newRow.className = 'table-row';
        newRow.innerHTML = `
          <td class="p-lg">
            <div class="trip-id-cell">
              <div class="indicator-line"></div>
              <div>
                <p class="id-text">${tripId}</p>
                <p class="class-text">Class: Regular</p>
              </div>
            </div>
          </td>
          <td class="p-lg">
            <div class="asset-cell">
              <div class="icon-box">
                <span class="material-symbols-outlined text-primary">local_shipping</span>
              </div>
              <div>
                <p class="name">${selectedVehicleText}</p>
                <p class="driver">Marcus Thorne</p>
              </div>
            </div>
          </td>
          <td class="p-lg">
            <div class="status-wrap">
              <div class="status-pill dispatched">
                Dispatched
              </div>
              <p class="route-info">${source} → ${destination}</p>
            </div>
          </td>
          <td class="p-lg text-right">
            <div class="progress-wrap">
              <div class="progress-header">
                <span>0%</span>
                <span>Calculating ETA</span>
              </div>
              <div class="progress-bar-bg">
                <div class="progress-bar-fg" style="width: 0%"></div>
              </div>
            </div>
          </td>
          <td class="p-lg text-right">
            <button class="btn-action-table">
              <span class="material-symbols-outlined">more_vert</span>
            </button>
          </td>
        `;

        // Add row highlighting capability to new row
        newRow.addEventListener('click', () => {
          console.log(`Focused new trip row: ${tripId}`);
        });

        liveBoardTableBody.insertBefore(newRow, liveBoardTableBody.firstChild);
        
        // Update active badge count
        if (activeCountBadge) {
          const currentCount = parseInt(activeCountBadge.textContent.replace(/\D/g,'')) || 0;
          activeCountBadge.textContent = `${currentCount + 1} Active`;
        }

        // Reset destination field and dispatch stepper
        if (destInput) destInput.value = '';
        if (weightInput) weightInput.value = '0';
        validateWeight();
        
        alert(`Trip ${tripId} successfully dispatched to ${destination}!`);
      }
    });
  }

  // Row selection handler
  const tableRows = document.querySelectorAll('table tbody tr');
  tableRows.forEach(row => {
    row.addEventListener('click', () => {
      const idCell = row.querySelector('.id-text');
      if (idCell) {
        console.log(`Focused trip row: ${idCell.textContent}`);
      }
    });
  });

  const notifBtn = document.getElementById('notif-btn');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      window.location.href = 'notifications.html';
    });
  }
});
