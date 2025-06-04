// Placeholder for the API key - in a real scenario, this would be securely managed
const MCP_SERVER_API_KEY_FOR_WEBAPP = null; // Or get it from a secure source/config

function getAuthHeaders() {
    const headers = {
        'Content-Type': 'application/json', // Usually for POST/PUT, but good to have a base
    };
    if (MCP_SERVER_API_KEY_FOR_WEBAPP) {
        headers['Authorization'] = `Bearer ${MCP_SERVER_API_KEY_FOR_WEBAPP}`;
    }
    // For DELETE requests, Content-Type might not be needed if there's no body.
    // If a specific request doesn't need Content-Type, it can be omitted when calling fetch.
    return headers;
}

const PROVIDERS = [
    { value: "openrouter", label: "OpenRouter" },
    { value: "anthropic", label: "Anthropic" },
    { value: "gemini", label: "Google Gemini" },
    { value: "deepseek", label: "DeepSeek" },
    { value: "openai-native", label: "OpenAI" },
    { value: "openai", label: "OpenAI Compatible" },
    { value: "vertex", label: "GCP Vertex AI" },
    { value: "bedrock", label: "Amazon Bedrock" },
    { value: "glama", label: "Glama" },
    { value: "vscode-lm", label: "VS Code LM API" },
    { value: "mistral", label: "Mistral" },
    { value: "lmstudio", label: "LM Studio" },
    { value: "ollama", label: "Ollama" },
    { value: "unbound", label: "Unbound" },
    { value: "requesty", label: "Requesty" },
    { value: "human-relay", label: "Human Relay" },
    { value: "xai", label: "xAI (Grok)" },
    { value: "groq", label: "Groq" },
    { value: "chutes", label: "Chutes AI" },
    { value: "litellm", label: "LiteLLM" },
].sort((a, b) => a.label.localeCompare(b.label));

const providerModels = {
    "anthropic": ["claude-sonnet-4-20250514", "claude-opus-4-20250514", "claude-3-7-sonnet-20250219:thinking", "claude-3-7-sonnet-20250219", "claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022", "claude-3-opus-20240229", "claude-3-haiku-20240307"],
    "bedrock": ["amazon.nova-pro-v1:0", "amazon.nova-pro-latency-optimized-v1:0", "amazon.nova-lite-v1:0", "amazon.nova-micro-v1:0", "anthropic.claude-sonnet-4-20250514-v1:0", "anthropic.claude-opus-4-20250514-v1:0", "anthropic.claude-3-7-sonnet-20250219-v1:0", "anthropic.claude-3-5-sonnet-20241022-v2:0", "anthropic.claude-3-5-haiku-20241022-v1:0", "anthropic.claude-3-5-sonnet-20240620-v1:0", "anthropic.claude-3-opus-20240229-v1:0", "anthropic.claude-3-sonnet-20240229-v1:0", "anthropic.claude-3-haiku-20240307-v1:0", "anthropic.claude-2-1-v1:0", "anthropic.claude-2-0-v1:0", "anthropic.claude-instant-v1:0", "deepseek.r1-v1:0", "meta.llama3-3-70b-instruct-v1:0", "meta.llama3-2-90b-instruct-v1:0", "meta.llama3-2-11b-instruct-v1:0", "meta.llama3-2-3b-instruct-v1:0", "meta.llama3-2-1b-instruct-v1:0", "meta.llama3-1-405b-instruct-v1:0", "meta.llama3-1-70b-instruct-v1:0", "meta.llama3-1-70b-instruct-latency-optimized-v1:0", "meta.llama3-1-8b-instruct-v1:0", "meta.llama3-70b-instruct-v1:0", "meta.llama3-8b-instruct-v1:0", "amazon.titan-text-lite-v1:0", "amazon.titan-text-express-v1:0", "amazon.titan-text-embeddings-v1:0", "amazon.titan-text-embeddings-v2:0"],
    "chutes": ["deepseek-ai/DeepSeek-R1-0528", "deepseek-ai/DeepSeek-R1", "deepseek-ai/DeepSeek-V3", "unsloth/Llama-3.3-70B-Instruct", "chutesai/Llama-4-Scout-17B-16E-Instruct", "unsloth/Mistral-Nemo-Instruct-2407", "unsloth/gemma-3-12b-it", "NousResearch/DeepHermes-3-Llama-3-8B-Preview", "unsloth/gemma-3-4b-it", "nvidia/Llama-3_3-Nemotron-Super-49B-v1", "nvidia/Llama-3_1-Nemotron-Ultra-253B-v1", "chutesai/Llama-4-Maverick-17B-128E-Instruct-FP8", "deepseek-ai/DeepSeek-V3-Base", "deepseek-ai/DeepSeek-R1-Zero", "deepseek-ai/DeepSeek-V3-0324", "Qwen/Qwen3-235B-A22B", "Qwen/Qwen3-32B", "Qwen/Qwen3-30B-A3B", "Qwen/Qwen3-14B", "Qwen/Qwen3-8B", "microsoft/MAI-DS-R1-FP8", "tngtech/DeepSeek-R1T-Chimera"],
    "deepseek": ["deepseek-chat", "deepseek-reasoner"],
    "gemini": ["gemini-2.5-flash-preview-04-17:thinking", "gemini-2.5-flash-preview-04-17", "gemini-2.5-flash-preview-05-20:thinking", "gemini-2.5-flash-preview-05-20", "gemini-2.5-pro-exp-03-25", "gemini-2.5-pro-preview-03-25", "gemini-2.5-pro-preview-05-06", "gemini-2.0-flash-001", "gemini-2.0-flash-lite-preview-02-05", "gemini-2.0-pro-exp-02-05", "gemini-2.0-flash-thinking-exp-01-21", "gemini-2.0-flash-thinking-exp-1219", "gemini-2.0-flash-exp", "gemini-1.5-flash-002", "gemini-1.5-flash-exp-0827", "gemini-1.5-flash-8b-exp-0827", "gemini-1.5-pro-002", "gemini-1.5-pro-exp-0827", "gemini-exp-1206"],
    "glama": ["anthropic/claude-3-7-sonnet"],
    "groq": ["llama-3.1-8b-instant", "llama-3.3-70b-versatile", "meta-llama/llama-4-scout-17b-16e-instruct", "meta-llama/llama-4-maverick-17b-128e-instruct", "mistral-saba-24b", "qwen-qwq-32b", "deepseek-r1-distill-llama-70b"],
    "litellm": ["claude-3-7-sonnet-20250219", "claude-3-5-sonnet-latest", "claude-opus-4-20250514", "claude-sonnet-4-20250514", "claude-3-7-sonnet-latest", "claude-3-7-sonnet-20250219", "claude-3-5-sonnet-20241022", "vertex_ai/claude-3-5-sonnet", "vertex_ai/claude-3-5-sonnet-v2", "vertex_ai/claude-3-5-sonnet-v2@20241022", "vertex_ai/claude-3-7-sonnet@20250219", "vertex_ai/claude-opus-4@20250514", "vertex_ai/claude-sonnet-4@20250514", "openrouter/anthropic/claude-3.5-sonnet", "openrouter/anthropic/claude-3.5-sonnet:beta", "openrouter/anthropic/claude-3.7-sonnet", "openrouter/anthropic/claude-3.7-sonnet:beta", "anthropic.claude-opus-4-20250514-v1:0", "anthropic.claude-sonnet-4-20250514-v1:0", "anthropic.claude-3-7-sonnet-20250219-v1:0", "anthropic.claude-3-5-sonnet-20241022-v2:0", "us.anthropic.claude-3-5-sonnet-20241022-v2:0", "us.anthropic.claude-3-7-sonnet-20250219-v1:0", "us.anthropic.claude-opus-4-20250514-v1:0", "us.anthropic.claude-sonnet-4-20250514-v1:0", "eu.anthropic.claude-3-5-sonnet-20241022-v2:0", "eu.anthropic.claude-3-7-sonnet-20250219-v1:0", "eu.anthropic.claude-opus-4-20250514-v1:0", "eu.anthropic.claude-sonnet-4-20250514-v1:0", "snowflake/claude-3-5-sonnet"],
    "lmstudio": [],
    "mistral": ["codestral-latest", "mistral-large-latest", "ministral-8b-latest", "ministral-3b-latest", "mistral-small-latest", "pixtral-large-latest"],
    "openai-native": ["gpt-4.1", "gpt-4.1-mini", "gpt-4.1-nano", "o3", "o3-high", "o3-low", "o4-mini", "o4-mini-high", "o4-mini-low", "o3-mini", "o3-mini-high", "o3-mini-low", "o1", "o1-preview", "o1-mini", "gpt-4.5-preview", "gpt-4o", "gpt-4o-mini"],
    "openrouter": ["anthropic/claude-sonnet-4", "anthropic/claude-3-haiku", "anthropic/claude-3-haiku:beta", "anthropic/claude-3-opus", "anthropic/claude-3-opus:beta", "anthropic/claude-3-sonnet", "anthropic/claude-3-sonnet:beta", "anthropic/claude-3.5-haiku", "anthropic/claude-3.5-haiku-20241022", "anthropic/claude-3.5-haiku-20241022:beta", "anthropic/claude-3.5-haiku:beta", "anthropic/claude-3.5-sonnet", "anthropic/claude-3.5-sonnet-20240620", "anthropic/claude-3.5-sonnet-20240620:beta", "anthropic/claude-3.5-sonnet:beta", "anthropic/claude-3.7-sonnet", "anthropic/claude-3.7-sonnet:beta", "anthropic/claude-3.7-sonnet:thinking", "anthropic/claude-sonnet-4", "anthropic/claude-opus-4", "google/gemini-2.5-pro-preview", "google/gemini-2.5-flash-preview", "google/gemini-2.5-flash-preview:thinking", "google/gemini-2.5-flash-preview-05-20", "google/gemini-2.5-flash-preview-05-20:thinking", "google/gemini-2.0-flash-001", "google/gemini-flash-1.5", "google/gemini-flash-1.5-8b"],
    "requesty": ["coding/claude-4-sonnet"],
    "unbound": ["anthropic/claude-3-7-sonnet-20250219"],
    "vertex": ["gemini-2.5-flash-preview-05-20:thinking", "gemini-2.5-flash-preview-05-20", "gemini-2.5-flash-preview-04-17:thinking", "gemini-2.5-flash-preview-04-17", "gemini-2.5-pro-preview-03-25", "gemini-2.5-pro-preview-05-06", "gemini-2.5-pro-exp-03-25", "gemini-2.0-pro-exp-02-05", "gemini-2.0-flash-001", "gemini-2.0-flash-lite-001", "gemini-2.0-flash-thinking-exp-01-21", "gemini-1.5-flash-002", "gemini-1.5-pro-002", "claude-sonnet-4@20250514", "claude-opus-4@20250514", "claude-3-7-sonnet@20250219:thinking", "claude-3-7-sonnet@20250219", "claude-3-5-sonnet-v2@20241022", "claude-3-5-sonnet@20240620", "claude-3-5-haiku@20241022", "claude-3-opus@20240229", "claude-3-haiku@20240307"],
    "vscode-lm": ["gpt-3.5-turbo", "gpt-4o-mini", "gpt-4", "gpt-4-0125-preview", "gpt-4o", "o1", "o3-mini", "claude-3.5-sonnet", "gemini-2.0-flash-001", "gemini-2.5-pro", "o4-mini", "gpt-4.1"],
    "xai": ["grok-3-beta", "grok-3-fast-beta", "grok-3-mini-beta", "grok-3-mini-fast-beta", "grok-3", "grok-3-fast", "grok-3-mini", "grok-3-mini-fast", "grok-2-latest", "grok-2", "grok-2-1212", "grok-2-vision-latest", "grok-2-vision", "grok-2-vision-1212", "grok-vision-beta", "grok-beta"],
    "openai": [], // No specific model list found for "OpenAI Compatible"
    "ollama": [], // No ollama.ts file
    "human-relay": [], // No human-relay file
};

document.addEventListener('DOMContentLoaded', () => {
    const chainsContainer = document.getElementById('chains-container');
    const modalContainer = document.getElementById('modal-container');
    const modalBody = document.getElementById('modal-body');
    const closeButton = document.querySelector('.close-button');

    async function fetchChains() {
        try {
            const response = await fetch('http://localhost:3001/api/logic-explorer/chains', { headers: getAuthHeaders() });
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
            const response = await fetch(`http://localhost:3001/api/logic-explorer/chains/${chainId}`, { headers: getAuthHeaders() });
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
    const llmConfigsList = document.getElementById('llm-configs-list');
    const addLlmConfigForm = document.getElementById('add-llm-config-form');
    const llmProviderSelect = document.getElementById('llm-provider');
    const llmModelSelect = document.getElementById('llm-model-select');
    // const llmApiKeyInput = document.getElementById('llm-api-key'); // Removed as API key input is removed
    // const llmApiKeyNote = document.createElement('p'); // Removed
    // llmApiKeyNote.innerHTML = '<em>Note: API keys are stored securely on the server. You will receive an API Key ID.</em>'; // Removed
    // llmApiKeyNote.style.fontSize = '0.8em'; // Removed
    // llmApiKeyNote.style.color = '#666'; // Removed
    // llmApiKeyInput.parentNode.insertBefore(llmApiKeyNote, llmApiKeyInput.nextSibling); // Removed

    // Populate provider dropdown
    function populateProviders() {
        llmProviderSelect.innerHTML = '<option value="">Select Provider</option>'; // Clear existing options and add default
        PROVIDERS.forEach(provider => {
            const option = document.createElement('option');
            option.value = provider.value;
            option.textContent = provider.label;
            llmProviderSelect.appendChild(option);
        });
    }

    function populateModelsForProvider(selectedProviderValue) {
        llmModelSelect.innerHTML = ''; // Clear existing options
        llmModelSelect.disabled = true; // Disable until models are loaded or if no provider selected

        if (!selectedProviderValue) {
            llmModelSelect.innerHTML = '<option value="">Select a provider first</option>';
            return;
        }

        const models = providerModels[selectedProviderValue];

        if (models && models.length > 0) {
            llmModelSelect.disabled = false;
            models.forEach(model => {
                const option = document.createElement('option');
                option.value = model;
                option.textContent = model;
                llmModelSelect.appendChild(option);
            });
        } else {
            llmModelSelect.innerHTML = '<option value="">No predefined models for this provider</option>';
        }
    }

    llmProviderSelect.addEventListener('change', () => {
        populateModelsForProvider(llmProviderSelect.value);
    });

    // Initial calls
    populateProviders();
    populateModelsForProvider(llmProviderSelect.value);

    async function fetchAndRenderLlmConfigs() {
        console.log("fetchAndRenderLlmConfigs: Fetching all LLM configurations...");
        try {
            const response = await fetch('http://localhost:3001/api/llm-config', { headers: getAuthHeaders() });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const configs = await response.json();
            console.log("fetchAndRenderLlmConfigs: Received configs:", JSON.stringify(configs, null, 2)); // Log the raw data received
            llmConfigsList.innerHTML = ''; // Clear existing content

            if (configs.length === 0) {
                llmConfigsList.innerHTML = '<p>No LLM configurations found.</p>';
                return;
            }

            configs.forEach(config => {
                const configItem = document.createElement('div');
                configItem.classList.add('llm-config-item');
                let buttonsHtml = '';
                let activeStatusText = (config.is_active === true || config.is_active === 1) ? 'Yes' : 'No';
                let specialNotes = '';

                if (config.is_default && config.is_immutable) {
                    specialNotes = ' (Default, Immutable)';
                    // For the default, "Active" means no other user config is active.
                    // The activate button is not shown. Delete button is not shown.
                } else {
                    buttonsHtml = `
                        <button data-id="${config.id}" class="activate-llm-config">Activate</button>
                        <button data-id="${config.id}" class="delete-llm-config">Delete</button>
                    `;
                }
                
                // If it's the default and active, make it clear it's the active default
                if (config.is_default && (config.is_active === true || config.is_active === 1)) {
                    activeStatusText = 'Yes (Implicitly Active Default)';
                }


                configItem.innerHTML = `
                    <p><strong>ID:</strong> ${config.id}</p>
                    <p><strong>Provider:</strong> ${config.provider}${specialNotes}</p>
                    <p><strong>Model:</strong> ${config.model}</p>
                    <p><strong>Active:</strong> ${activeStatusText}</p>
                    ${buttonsHtml}
                `;
                llmConfigsList.appendChild(configItem);
            });
        } catch (error) {
            console.error('Error fetching LLM configurations:', error);
            llmConfigsList.innerHTML = `<p>Error loading LLM configurations: ${error.message}</p>`;
        }
    }

    addLlmConfigForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const provider = llmProviderSelect.value;
        const model = llmModelSelect.value;
        // const apiKey = llmApiKeyInput.value; // Removed as API key input is removed

        try {
            const response = await fetch('http://localhost:3001/api/llm-config', {
                method: 'POST',
                headers: getAuthHeaders(), // Uses the helper for auth + content-type
                body: JSON.stringify({ provider: provider, model: model }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
            }

            const result = await response.json();
            console.log('LLM Configuration saved:', result);
            const selectedProvider = PROVIDERS.find(p => p.value === provider);
            const providerName = selectedProvider ? selectedProvider.label : provider;
            const envVarName = provider.toUpperCase() + "_API_KEY";
            alert(`LLM Configuration for ${providerName} saved successfully. Ensure ${envVarName} is set in your logic-mcp/.env file for it to be used.`);

            llmProviderSelect.value = '';
            llmModelSelect.innerHTML = '<option value="">Select a provider first</option>';
            llmModelSelect.disabled = true;
            // llmApiKeyInput.value = ''; // Removed

            fetchAndRenderLlmConfigs();

        } catch (error) {
            console.error('Error saving LLM configuration:', error);
            alert(`Error saving LLM configuration: ${error.message}`);
        }
    });

    // Initial load for LLM configurations
    fetchAndRenderLlmConfigs();

    // Event listener for deleting individual LLM configurations
    llmConfigsList.addEventListener('click', async (event) => {
        if (event.target.classList.contains('delete-llm-config')) {
            const configId = event.target.dataset.id;
            if (confirm(`Are you sure you want to delete this LLM configuration (ID: ${configId})?`)) {
                try {
                    const response = await fetch(`http://localhost:3001/api/llm-config/${configId}`, {
                        method: 'DELETE',
                        headers: getAuthHeaders(), // Only auth header needed, no Content-Type for empty body
                    });

                    if (response.ok) { // Status 204 No Content is also OK
                        console.log(`LLM Configuration ${configId} deleted successfully.`);
                        fetchAndRenderLlmConfigs(); // Refresh the list
                    } else {
                        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
                        throw new Error(`HTTP error! status: ${response.status}, Message: ${errorData.message || response.statusText}`);
                    }
                } catch (error) {
                    console.error(`Error deleting LLM configuration ${configId}:`, error);
                    alert(`Error deleting LLM configuration: ${error.message}`);
                }
            }
        }
        // Add logic for activate button if not already present or if it needs auth headers
        if (event.target.classList.contains('activate-llm-config')) {
            const configId = event.target.dataset.id;
            // Assuming activation logic might also need auth headers if it's a POST/PUT
            // For now, this is just a placeholder if activation needs to be secured
            console.log(`Activate button clicked for ${configId}.`);
            try {
                const response = await fetch(`http://localhost:3001/api/llm-config/${configId}/activate`, {
                    method: 'PATCH', // Changed from POST to PATCH to match the server endpoint
                    headers: getAuthHeaders(),
                });
                if (response.ok) { // Status 200 or 204 are typical for successful activation
                    console.log(`LLM Configuration ${configId} activated successfully.`);
                    fetchAndRenderLlmConfigs(); // Refresh the list
                } else {
                    const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response or no content' }));
                    console.error(`Error activating LLM configuration ${configId}:`, response.status, errorData.message || response.statusText);
                    alert(`Error activating LLM configuration: ${errorData.message || response.statusText}`);
                }
            } catch (error) {
                console.error(`Network or other error activating LLM configuration ${configId}:`, error);
                alert(`Error activating LLM configuration: ${error.message}`);
            }
        }
    });

    // Event listener for "Clear All LLM Configurations" button
    const clearAllLlmConfigsBtn = document.getElementById('clear-all-llm-configs-btn');
    if (clearAllLlmConfigsBtn) {
        clearAllLlmConfigsBtn.addEventListener('click', async () => {
            if (confirm("Are you sure you want to delete ALL LLM configurations? This cannot be undone.")) {
                try {
                    const response = await fetch('http://localhost:3001/api/llm-config/all', {
                        method: 'DELETE',
                        headers: getAuthHeaders(),
                    });

                    if (response.ok) {
                        console.log('All LLM configurations deleted successfully.');
                        fetchAndRenderLlmConfigs(); // Refresh the list
                    } else {
                        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
                        throw new Error(`HTTP error! status: ${response.status}, Message: ${errorData.message || response.statusText}`);
                    }
                } catch (error) {
                    console.error('Error clearing all LLM configurations:', error);
                    alert(`Error clearing all LLM configurations: ${error.message}`);
                }
            }
        });
    }

    // Event listener for "Clear All Logic Chains" button
    const clearAllLogicChainsBtn = document.getElementById('clear-all-logic-chains-btn');
    if (clearAllLogicChainsBtn) {
        clearAllLogicChainsBtn.addEventListener('click', async () => {
            if (confirm("Are you sure you want to delete ALL logic chains and their operations? This cannot be undone.")) {
                try {
                    const response = await fetch('http://localhost:3001/api/logic-explorer/chains/all', {
                        method: 'DELETE',
                        headers: getAuthHeaders(),
                    });

                    if (response.ok) {
                        console.log('All logic chains deleted successfully.');
                        fetchChains().then(renderChains); // Refresh the list
                    } else {
                        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
                        throw new Error(`HTTP error! status: ${response.status}, Message: ${errorData.message || response.statusText}`);
                    }
                } catch (error) {
                    console.error('Error clearing all logic chains:', error);
                    alert(`Error clearing all logic chains: ${error.message}`);
                }
            }
        });
    }
});