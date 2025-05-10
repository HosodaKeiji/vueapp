import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.ts';  // Vue Router のインポート

createApp(App)
  .use(router)  // Vue Router を登録
  .mount('#app');  // アプリケーションをマウント
