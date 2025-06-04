document.addEventListener('DOMContentLoaded', () => {
    const chainsContainer = document.getElementById('chains-container');
    const modalContainer = document.getElementById('modal-container');
    const modalBody = document.getElementById('modal-body');
    const closeButton = document.querySelector('.close-button');

    async function fetchChains() {
        try {
            const response = await fetch('http://localhost:3001/api/logic-explorer/chains');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching logic chains:', error);
            chainsContainer.innerHTML = `<p>Error loading chains: ${error.message}</p>`;
            return [];
        }
    }

    function renderChains(chains) {
        chainsContainer.innerHTML = ''; // Clear existing content
        if (chains.length === 0) {
            chainsContainer.innerHTML = '<p>No logic chains found.</p>';
            return;
        }

        chains.forEach(chain => {
            const chainCard = document.createElement('div');
            chainCard.classList.add('chain-card');
            chainCard.innerHTML = `
                <h3>Chain ID: ${chain.chain_id}</h3>
                <p>Name: ${chain.chain_name || 'N/A'}</p>
                <p>Operations: ${chain.operation_count || 0}</p>
            `;
            chainCard.addEventListener('click', () => {
                console.log('Chain clicked:', chain.chain_id);
                fetchAndDisplayOperations(chain.chain_id);
            });
            chainsContainer.appendChild(chainCard);
        });
    }

    async function fetchAndDisplayOperations(chainId) {
        try {
            const response = await fetch(`http://localhost:3001/api/logic-explorer/chains/${chainId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const chainDetails = await response.json();
            renderOperationsInModal(chainDetails.operations);
            modalContainer.style.display = 'block';
        } catch (error) {
            console.error(`Error fetching operations for chain ${chainId}:`, error);
            modalBody.innerHTML = `<p>Error loading operations: ${error.message}</p>`;
            modalContainer.style.display = 'block';
        }
    }

    function renderOperationsInModal(operations) {
        modalBody.innerHTML = ''; // Clear previous content
        if (!operations || operations.length === 0) {
            modalBody.innerHTML = '<p>No operations found for this chain.</p>';
            return;
        }

        operations.forEach(operation => {
            const operationCard = document.createElement('div');
            operationCard.classList.add('operation-card');

            const startTime = operation.start_time ? new Date(operation.start_time).toLocaleString() : 'N/A';
            const endTime = operation.end_time ? new Date(operation.end_time).toLocaleString() : (operation.status === 'IN_PROGRESS' ? 'In Progress' : 'N/A');

            const formatJson = (data) => {
                if (data === null || data === undefined) {
                    return 'N/A';
                }
                try {
                    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
                    return `<pre>${JSON.stringify(parsedData, null, 2)}</pre>`;
                } catch (e) {
                    return `<pre>${data}</pre>`; // Not JSON, display as is within pre
                }
            };

            operationCard.innerHTML = `
                <h4>Operation ID: ${operation.operation_id}</h4>
                <p><strong>Operation Name:</strong> ${operation.operation_name || 'N/A'}</p>
                <p><strong>Primitive:</strong> ${operation.primitive_name || 'N/A'}</p>
                <p><strong>Status:</strong> ${operation.status || 'N/A'}</p>
                <p><strong>Start Time:</strong> ${startTime}</p>
                <p><strong>End Time:</strong> ${endTime}</p>
                <p><strong>Input Data:</strong> ${formatJson(operation.input_data)}</p>
                <p><strong>Output Data:</strong> ${formatJson(operation.output_data)}</p>
                <p><strong>Context:</strong> ${formatJson(operation.context)}</p>
            `;
            modalBody.appendChild(operationCard);
        });
    }

    // Modal close logic
    closeButton.addEventListener('click', () => {
        modalContainer.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modalContainer) {
            modalContainer.style.display = 'none';
        }
    });

    // Initial load
    fetchChains().then(chains => {
        renderChains(chains);
    });
});