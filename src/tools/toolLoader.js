export const loadTool = async (toolId) => {
    try {
        const module = await import(`./modules/${toolId}.js`);
        return module.default;
    } catch (e) {
        console.error(`Failed to load tool module: ${toolId}`, e);
        return null;
    }
};
