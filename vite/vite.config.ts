import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd(), '')

    return {
        plugins: [react()],
        base: "/",
        preview: {
            host: true,
            port: 5173,
            allowedHosts: ['vite', env.VITE_HOST],
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
})
