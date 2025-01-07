import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        host: false, // Allows accessing the server from other devices
        port: 5173, // Default port is 5173, change it if needed
    },
});
