<template>
    <div>
        <h2>ルーレット</h2>
        <form @submit.prevent="submitStore">
            <input v-model="name" placeholder="店名" required />
            <input v-model="genre" placeholder="ジャンル" required />
            <input v-model="priceRange" placeholder="価格帯" required />
            <button type="submit">追加</button>
        </form>
        
        <!-- ナビゲーションボタン -->
        <div class="bottom-buttons">
            <button @click="goHome">ホーム</button>
            <button @click="goAdd">お店追加</button>
            <button @click="goList">お店一覧</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const name = ref('');
const genre = ref('');
const priceRange = ref('');
const message = ref('');

const submitStore = async () => {
    const res = await fetch('http://localhost:3000/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: name.value,
            genre: genre.value,
            priceRange: priceRange.value
        })
    });

    if (res.ok) {
        message.value = 'お店を追加しました';
        name.value = genre.value = priceRange.value = '';
    } else {
        const data = await res.json();
        message.value = `エラー: ${data.error}`;
    }
};

// ナビゲーションメソッド
const goHome = () => router.push('/');
const goAdd = () => router.push('/add');
const goList = () => router.push('/stores');
</script>

<style>
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