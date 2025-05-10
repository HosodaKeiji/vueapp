<template>
    <div class="store-list-container">
        <h2>お店一覧</h2>
        <ul v-if="stores.length > 0" class="store-list">
            <li v-for="store in stores" :key="store.id" class="store-item">
                <span class="store-text">
                <strong>{{ store.name }}</strong>（{{ store.genre }} / {{ store.priceRange }}）
                </span>
                <button class="delete-button" @click="confirmDelete(store.id)">🗑️</button>
            </li>
        </ul>
        <p v-else>お店が登録されていません。</p>

        <!-- ナビゲーションボタン -->
        <div class="bottom-buttons">
            <button @click="goHome">ホーム</button>
            <button @click="goAdd">お店追加</button>
            <button @click="goRoulette">ルーレット</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const stores = ref([]);

const fetchStores = async () => {
    try {
        const res = await fetch('http://localhost:3000/api/stores');
        if (res.ok) {
            stores.value = await res.json();
        } else {
            console.error('データ取得に失敗しました');
        }
        } catch (err) {
        console.error('通信エラー:', err);
    }
};

onMounted(fetchStores);

const confirmDelete = (id) => {
    if (confirm('本当にこのお店を削除しますか？')) {
        removeStore(id);
    }
};

const removeStore = async (id) => {
    try {
        const res = await fetch(`http://localhost:3000/api/stores/${id}`, {
        method: 'DELETE',
        });

        if (res.ok) {
        stores.value = stores.value.filter(store => store.id !== id);
        alert('お店を削除しました');
        } else {
        const data = await res.json();
        alert(`削除失敗: ${data.error}`);
        }
    } catch (err) {
        alert('通信エラー: 削除できませんでした');
        console.error(err);
    }
};


// ナビゲーションメソッド
const goHome = () => router.push('/');
const goAdd = () => router.push('/add');
const goRoulette = () => router.push('/roulette');
</script>

<style scoped>
.store-list-container {
    max-width: 600px;
    margin: 3rem auto;
    padding: 2rem;
    background-color: #fff9f3;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.store-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.store-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    font-size: 1.1rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.5rem;
}

.store-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.delete-button {
    background: none;
    border: none;
    color: #ef4444;
    font-size: 1.3rem;
    cursor: pointer;
    transition: color 0.3s;
    margin-left: 1rem;
    outline: none; 
}

.delete-button:hover {
    color: #be123c;
}

h2 {
    text-align: center;
    margin-bottom: 1.5rem;
}

li {
    margin-bottom: 1rem;
    font-size: 1.1rem;
}

/* 共通ナビゲーションボタンのCSS */
.bottom-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 3rem;
}

.bottom-buttons button {
    padding: 0.6rem 1.5rem;
    font-size: 1rem;
    border: 2px solid #f97316;
    background-color: white;
    color: #f97316;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
    min-width: 120px;
    text-align: center;
}

.bottom-buttons button:hover {
    background-color: #f97316;
    color: white;
}
</style>

やること
削除のAPIの作成