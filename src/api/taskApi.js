// src/api/taskApi.js
export const taskAPI = {
    create: async (taskData) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            id: Date.now(),
            ...taskData,
            createdAt: new Date().toISOString()
        };
    },

    update: async (id, updates) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            id,
            ...updates,
            updatedAt: new Date().toISOString()
        };
    },

    delete: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return id;
    }
};