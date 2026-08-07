const toolMap = {
    base64: 'base64EncoderDecoder',
    timer: 'timerStopwatch'
};

export const loadTool = async (toolId) => {
    try {
        const moduleName = toolMap[toolId] || toolId;
        const module = await import(`./modules/${moduleName}.js`);
        return module.default;
    } catch (e) {
        console.error(`Failed to load tool module: ${toolId}`, e);
        return null;
    }
};
