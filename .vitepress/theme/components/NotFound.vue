<script setup>
import { useRouter } from 'vitepress'

const router = useRouter()

const goHome = () => {
  router.go('/')
}
</script>

<template>
    <div class="NotFound">
        <h1 class="not-found-code">404</h1>
        <h2 class="not-found-title">页面不存在</h2>
        <p class="not-found-desc">抱歉，您访问的页面不存在或已被移动。</p>
        <button @click="goHome" class="not-found-button">返回首页</button>
    </div>
</template>

<style scoped>
.NotFound {
    padding: 4rem 2rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
}

.not-found-code {
    font-size: 6rem;
    font-weight: bold;
    color: var(--vp-c-brand-1);
    margin: 0;
    line-height: 1;
}

.not-found-title {
    font-size: 1.5rem;
    margin: 1rem 0;
    color: var(--vp-c-text-1);
    font-weight: 500;
}

.not-found-desc {
    font-size: 1rem;
    margin-bottom: 2rem;
    color: var(--vp-c-text-2);
}

.not-found-button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    color: #fff;
    background-color: var(--vp-c-brand-1);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.not-found-button:hover {
    background-color: var(--vp-c-brand-2);
}

@media (max-width: 768px) {
    .not-found-code {
        font-size: 4rem;
    }
    
    .not-found-title {
        font-size: 1.25rem;
    }
}
</style>