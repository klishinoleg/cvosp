import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
        plugins: [react()],
        base: "/",
        preview: {
            host: true,
            port: 5173,
            allowedHosts: ['vite', 'localhost', '127.0.0.1'],
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        vendor: ['react', 'react-dom'],
                        icons: ['@ant-design/icons'],
                    }
                }
            }
        }
    }
)
