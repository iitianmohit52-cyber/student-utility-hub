import { showAlert, hideAlert } from '../../utils/alerts.js';
import { withErrorBoundary } from '../../utils/errorHandler.js';
import { tools } from '../toolRegistry.js';

/**
 * ToolFactory.js
 * Standardized wrapper for all tools to ensure consistent layout, error handling, and lifecycle.
 *
 * @param {string} toolId - The ID of the tool (must exist in registry).
 * @param {Function} setupFn - Function that receives { container, ui, utils, registryData } and builds the tool.
 * @returns {Function} - A standard tool function that can be consumed by toolLoader/Modal.js.
 */
export const createTool = (toolId, setupFn) => {
    return (container) => {
        const registryData = tools.find(t => t.id === toolId);
        
        if (!registryData) {
            console.error(`ToolFactory Error: Tool ID '${toolId}' not found in registry.`);
            container.innerHTML = '<p style="color:var(--danger);">Tool configuration missing.</p>';
            return;
        }

        // Setup the workspace wrapper
        container.innerHTML = '';
        const toolWrapper = document.createElement('div');
        toolWrapper.className = `tool-factory-wrapper tool-${toolId}`;
        toolWrapper.style.animation = 'fadeIn 0.3s ease-out';
        
        // Add a standard tool header (optional, since Modal already has breadcrumbs, but good for standalone)
        const header = document.createElement('div');
        header.className = 'tool-header';
        header.innerHTML = `
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem; text-align: center;">${registryData.icon}</div>
            <p style="text-align: center; color: var(--text-secondary); max-width: 600px; margin: 0 auto 2rem auto;">
                ${registryData.description}
            </p>
        `;
        toolWrapper.appendChild(header);

        // Content Area
        const contentArea = document.createElement('div');
        contentArea.className = 'tool-content-area';
        toolWrapper.appendChild(contentArea);
        
        container.appendChild(toolWrapper);

        // Execute the tool logic within an error boundary
        withErrorBoundary(() => {
            setupFn({
                container: contentArea,
                registryData,
                // Provide scoped alert access
                showAlert: (msg, type) => showAlert(msg, type),
                hideAlert: () => hideAlert()
            });
        }, contentArea, toolId);
        
        // Return cleanup hook if needed
        return () => {
            // Future cleanup logic
        };
    };
};
