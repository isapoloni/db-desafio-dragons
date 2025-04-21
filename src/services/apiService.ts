import { API_BASE_URL } from '../config/config';

export const apiService = {
    getDragons: async () => {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error('Erro ao buscar a lista de dragões');
        }
        return response.json();
    },

    getDragonById: async (id: string) => {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar o dragão com ID: ${id}`);
        }
        return response.json();
    },

    createDragon: async (data: object) => {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Erro ao criar o dragão');
        }
        return response.json();
    },

    updateDragon: async (id: string, data: object) => {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`Erro ao atualizar o dragão com ID: ${id}`);
        }
        return response.json();
    },

    deleteDragon: async (id: string) => {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Erro ao deletar o dragão com ID: ${id}`);
        }
        return response.json();
    },
};
