<template>
    <div>
        <div class="home-container">
            <h1>ごはんルーレット</h1>
            <div class="button-group">
                <button @click="goToAdd">お店を追加</button>
                <button @click="goToStores">お店一覧</button>
                <button @click="goToRoulette">ルーレット</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToAdd = () => {
    router.push('/add');
};

const goToStores = () => {
    router.push('/stores');
};

const goToRoulette = () => {
    router.push('/roulette');
};
</script>

<style scoped>
.home-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 70vh;
    padding: 20px;
    background-color: #fff6f1;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem; /* タイトルとボタンの間隔を調整 */
    color: #e75a3c; /* オレンジ色 */
}

.button-group {
    display: flex;
    flex-direction: column;
    gap: 0.8rem; /* ボタン間隔を調整 */
}

button {
    padding: 1rem 2rem;
    font-size: 1.2rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    background-color: #ff8a00; /* オレンジ色 */
    color: white;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #ff6700; /* ホバー時に少し濃くなる */
}
</style>