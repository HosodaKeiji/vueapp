<template>
    <div class="container">
        <h2>お店を追加</h2>
        <form @submit.prevent="submitStore">
            <input v-model="name" placeholder="店名" required />
            <input v-model="genre" placeholder="ジャンル" required />
            <select v-model="priceRange" required>
                <option disabled value="">価格帯を選択</option>
                <option value="〜1000円">〜1000円</option>
                <option value="〜1500円">〜1500円</option>
                <option value="〜2000円">〜2000円</option>
                <option value="〜3000円">〜3000円</option>
                <option value="3000円以上">3000円以上</option>
            </select>
            <button type="submit" class="submit-button">追加</button>
        </form>

        <!-- ナビゲーションボタン -->
        <div class="bottom-buttons">
            <button @click="goHome">ホーム</button>
            <button @click="goList">お店一覧</button>
            <button @click="goRoulette">ルーレット</button>
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
        alert('お店を追加しました');
        name.value = genre.value = priceRange.value = '';
        message.value = '';
    } else {
        const data = await res.json();
        alert(`エラー: ${data.error}`);
        message.value = `エラー: ${data.error}`;
    }
};

// ナビゲーションメソッド
const goHome = () => router.push('/');
const goList = () => router.push('/stores');
const goRoulette = () => router.push('/roulette');

</script>

<style scoped>
.container {
    max-width: 600px;
    margin: 3rem auto;
    padding: 2rem;
    background-color: #fff9f3;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
}

input, select {
    padding: 0.8rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
}

/* 追加ボタン（メインアクション） */
.submit-button {
    padding: 0.8rem;
    font-size: 1.1rem;
    border: none;
    border-radius: 8px;
    background-color: #f97316; /* オレンジ */
    color: white;
    font-weight: bold;
    transition: background-color 0.3s ease;
}

.submit-button:hover {
    background-color: #ea580c;
}

/* 共通ナビゲーションボタンのCSS */
.bottom-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
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
