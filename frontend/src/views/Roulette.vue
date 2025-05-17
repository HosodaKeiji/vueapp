<template>
    <div class="roulette-container">
        <h2>ルーレット</h2>
    
        <!-- お店選択ボタン -->
        <button @click="openModal">お店を選択</button>
    
        <!-- モーダル -->
        <div v-if="showModal" class="modal">
            <div class="modal-content">
                <h3>お店を選んでください</h3>

                <!-- ジャンル選択プルダウン -->
                <div style="margin-bottom: 1rem;">
                    <label for="genre-select">ジャンルで絞り込み:</label>
                    <select id="genre-select" v-model="selectedGenre">
                        <option value="">すべて</option>
                        <option v-for="genre in uniqueGenres" :key="genre" :value="genre">{{ genre }}</option>
                    </select>
                </div>

                <!-- 店舗リスト -->
                <ul>
                    <li v-for="store in filteredStores" :key="store.id">
                        <label>
                            <input type="checkbox" v-model="selectedStores" :value="store" />
                            {{ store.name }}
                        </label>
                    </li>
                </ul>

                <button @click="addStoresToRoulette">選択完了</button>
                <button @click="showModal = false">キャンセル</button>
            </div>
        </div>
    
        <!-- ルーレット表示 -->
        <div v-if="rouletteStores.length > 0" class="roulette-wrapper">
            <div class="roulette-pointer">▼</div>
            <div ref="wheelRef" class="roulette-wheel">
                <svg viewBox="0 0 200 200" width="300" height="300">
                <g v-for="(store, index) in rouletteStores" :key="index">
                    <path
                    :d="getSegmentPath(index, rouletteStores.length)"
                    :fill="store.color"
                    stroke="#fff"
                    stroke-width="1"
                    />
                    <text
                    :x="getTextPosition(index, rouletteStores.length).x"
                    :y="getTextPosition(index, rouletteStores.length).y"
                    dominant-baseline="middle"
                    text-anchor="middle"
                    font-size="6"
                    fill="#000"
                    >
                    {{ store.name }}
                    </text>
                </g>
                </svg>
            </div>
        </div>
    
        <!-- スタートボタン -->
        <button @click="startRoulette" :disabled="rouletteStores.length === 0">スタート</button>
    
        <!-- 結果表示 -->
        <div v-if="rouletteResult" class="roulette-result">
            <h3>選ばれたお店: {{ rouletteResult.name }}</h3>
        </div> 

        <!-- ナビゲーションボタン -->
        <div class="bottom-buttons">
            <button @click="goHome">ホーム</button>
            <button @click="goAdd">お店追加</button>
            <button @click="goList">お店一覧</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// データ定義
const stores = ref([]);
const selectedStores = ref([]);
const rouletteStores = ref([]);
const showModal = ref(false);
const rouletteResult = ref(null);
const isSpinning = ref(false);
const wheelRef = ref(null);

// APIからお店データを取得
const fetchStores = async () => {
    try {
        const res = await fetch('http://localhost:3000/api/stores');
        if (res.ok) {
        stores.value = await res.json(); // 取得したデータをstoresにセット
        } else {
        console.error('データ取得に失敗しました');
        }
    } catch (err) {
        console.error('API呼び出しに失敗しました:', err);
    }
};

// onMountedでAPIからデータを取得
onMounted(fetchStores);

// モーダルを開く処理
const openModal = () => {
    selectedStores.value = stores.value.filter(store =>
        rouletteStores.value.some(r => r.id === store.id)
    );
    showModal.value = true;
};

const selectedGenre = ref('');

// ユニークなジャンル一覧を抽出（プルダウン用）
const uniqueGenres = computed(() => {
    const genreSet = new Set(stores.value.map(store => store.genre));
    return Array.from(genreSet);
});

// 選択ジャンルでフィルタ（チェックボックスリスト用）
const filteredStores = computed(() => {
    if (!selectedGenre.value) {
        return stores.value;
    }
    return stores.value.filter(store => store.genre === selectedGenre.value);
});

// 色生成
const getRandomColor = (i) => {
    const hue = (i * 137.508) % 360;
    return `hsl(${hue}, 70%, 60%)`;
};

// モーダルで選択したお店をルーレットに追加
const addStoresToRoulette = () => {
    // 色を割り当てて追加
    rouletteStores.value = selectedStores.value.map((store, i) => ({
        ...store,
        color: getRandomColor(i),
    }));
    selectedStores.value = [];
    showModal.value = false;
};

const getSegmentPath = (index, total) => {
    const angle = (2 * Math.PI) / total;
    const startAngle = index * angle - Math.PI / 2;
    const endAngle = startAngle + angle;
    const x1 = 100 + 100 * Math.cos(startAngle);
    const y1 = 100 + 100 * Math.sin(startAngle);
    const x2 = 100 + 100 * Math.cos(endAngle);
    const y2 = 100 + 100 * Math.sin(endAngle);
    const largeArc = angle > Math.PI ? 1 : 0;

    return `M100,100 L${x1},${y1} A100,100 0 ${largeArc},1 ${x2},${y2} Z`;
};

const getTextPosition = (index, total) => {
    const angle = (2 * Math.PI) / total;
    const midAngle = index * angle + angle / 2 - Math.PI / 2;
    const radius = 60;
    const x = 100 + radius * Math.cos(midAngle);
    const y = 100 + radius * Math.sin(midAngle);
    return { x, y };
};

// ルーレット回転
const startRoulette = () => {
    if (rouletteStores.value.length === 0 || isSpinning.value) return;

    isSpinning.value = true;

    const total = rouletteStores.value.length;
    const randomIndex = Math.floor(Math.random() * total);
    const anglePerItem = 360 / total;
    const rotateAngle = 360 * 5 - randomIndex * anglePerItem - anglePerItem / 2;
    const wheel = wheelRef.value;

    // 一度 transform をリセットして再描画を待つ
    wheel.style.transition = 'none';
    wheel.style.transform = 'rotate(0deg)';
    // 次のフレームで再度回転を適用（これにより transition が効く）
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            wheel.style.transition = 'transform 4s ease-out';
            wheel.style.transform = `rotate(${rotateAngle}deg)`;
        });
    });

    setTimeout(() => {
        rouletteResult.value = rouletteStores.value[randomIndex];
        isSpinning.value = false;
        alert(`選ばれたお店は: ${rouletteResult.value.name}`);
    }, 4000);
};


// ナビゲーションメソッド
const goHome = () => router.push('/');
const goAdd = () => router.push('/add');
const goList = () => router.push('/stores');
</script>

<style scoped>
.roulette-container {
    text-align: center;
}

button {
    padding: 0.8rem 1.5rem;
    margin: 1rem;
    font-size: 1rem;
    border-radius: 6px;
    background-color: #f97316;
    color: white;
    cursor: pointer;
}

button:disabled {
    background-color: #ccc;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    text-align: left;
    width: 300px;
}

.modal-content ul {
    list-style: none;
    padding: 0;
}

/* ジャンル絞り込みセレクトボックス */
#genre-select {
    padding: 0.5rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 1rem;
    background-color: white;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg fill='gray' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    background-size: 1rem;
    cursor: pointer;
    width: 100%;
    max-width: 100%;
}

label[for="genre-select"] {
    font-weight: bold;
    margin-right: 0.5rem;
}


.roulette-wrapper {
    position: relative;
    width: 300px;
    height: 300px;
    margin: 2rem auto;
}

.roulette-wheel {
    width: 300px;
    height: 300px;
    margin: 0 auto;
    transform: rotate(0deg);
}

.roulette-pointer {
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 2rem;
    color: #f97316;
    z-index: 10;
}

.roulette-result {
    margin-top: 2rem;
    font-size: 1.2rem;
    font-weight: bold;
}

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