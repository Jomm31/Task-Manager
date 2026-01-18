// src/api/projectApi.js
export const projectAPI = {
    create: async (projectData) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            id: Date.now(),
            ...projectData,
            createdAt: new Date().toISOString()
        };
    },

    update: async (id, updates) => {
        await new Promise(resolve => setTimeout(resolve,500));
        return {
            id,
            ...updates,
            updatedAt: new Date().toISOString()
        }
    },

    delete: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return id;
    }
};