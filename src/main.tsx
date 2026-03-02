import { createRoot } from 'react-dom/client'
import App from "@/1_app/App.tsx";
import "@/6_shared/config/i18n/i18n.ts";

createRoot(document.getElementById('root')!).render(
    <App />
)
