document.addEventListener('DOMContentLoaded', async () => {
    try {
      const token = await window.electronAPI.getToken();
  
      if (!token) {
        requestToken();
      } else {
        fetchRunnersStatus(token);
      }
  
      const quitButton = document.getElementById('quitButton');
      if (quitButton) {
        quitButton.addEventListener('click', () => {
          window.electronAPI.quitApp();
        });
      }
    } catch (error) {
      console.error('Error during initialization:', error);
      const content = document.getElementById('content');
      content.innerHTML = `<p>Error: ${error.message}</p>`;
    }
  });

  function requestToken() {
    const content = document.getElementById('content');
    content.innerHTML = `
      <p>Please enter your GitHub Personal Access Token (PAT):</p>
      <input type="password" id="tokenInput" placeholder="GitHub PAT">
      <button id="saveToken">Save Token</button>
    `;
  
    document.getElementById('saveToken').addEventListener('click', async () => {
      const token = document.getElementById('tokenInput').value;
      if (token) {
        try {
          await window.electronAPI.setToken(token);
          fetchRunnersStatus(token);
        } catch (error) {
          console.error('Error saving token:', error);
        }
      }
    });
  }
  
    async function fetchRunnersStatus(token) {
        const content = document.getElementById('content');
        content.innerHTML = '<p>Loading runner status...</p>';
    
        try {
        const response = await fetch('https://api.github.com/orgs/<your-org-here>/actions/runners', {
            headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            },
        });
    
        const responseBody = await response.json();
    
        if (response.ok) {
            displayRunners(responseBody.runners);
    
            // Set the timestamp after successful fetch
            const timestampDiv = document.getElementById('timestamp');
            const now = new Date();
            const formattedTime = now.toLocaleString(); // Formats the date and time based on user's locale
            timestampDiv.textContent = `Last updated: ${formattedTime}`;
        } else {
            console.error('Error fetching data:', responseBody);
            content.innerHTML = `<p>Error: ${response.status} ${response.statusText}</p><p>${responseBody.message}</p>`;
            if (response.status === 401 || response.status === 403) {
            await window.electronAPI.setToken(null);
            requestToken();
            }
        }
        } catch (error) {
        console.error('Error fetching runner status:', error);
        content.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    }
  
  function displayRunners(runners) {
    const content = document.getElementById('content');
    if (runners.length === 0) {
      content.innerHTML = '<p>No runners found.</p>';
      return;
    }
  
    // Create the table
    const table = document.createElement('table');
  
    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
  
    const nameHeader = document.createElement('th');
    nameHeader.textContent = 'Runner Name';
  
    const statusHeader = document.createElement('th');
    statusHeader.textContent = 'Status';
  
    headerRow.appendChild(nameHeader);
    headerRow.appendChild(statusHeader);
    thead.appendChild(headerRow);
    table.appendChild(thead);
  
    // Create table body
    const tbody = document.createElement('tbody');
  
    runners.forEach((runner) => {
      const row = document.createElement('tr');
  
      // Runner Name Cell
      const nameCell = document.createElement('td');
      nameCell.textContent = runner.name;
      nameCell.classList.add('runner-name');
  
      // Status Cell
      const statusCell = document.createElement('td');
      const statusBulb = document.createElement('span');
      statusBulb.classList.add('status-bulb');
  
      if (runner.status === 'online') {
        statusBulb.classList.add('status-online');
        if (runner.busy) {
          statusBulb.classList.add('status-busy');
        }
      } else {
        statusBulb.classList.add('status-offline');
      }
  
      statusCell.appendChild(statusBulb);
  
      row.appendChild(nameCell);
      row.appendChild(statusCell);
      tbody.appendChild(row);
  
      // Optional: Add click event for more details
      // row.addEventListener('click', () => {
      //   alert(`Runner: ${runner.name}\nStatus: ${runner.status}\nBusy: ${runner.busy}`);
      // });
    });
  
    table.appendChild(tbody);
    content.innerHTML = '';
    content.appendChild(table);
  }
  
  