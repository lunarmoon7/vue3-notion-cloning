<template>
  <div class="app__inner">
    <LNB />
    <div class="app__page">
      <Header />
      <div class="page__container">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app__inner {
  display: flex;
  height: 100vh;
  font-size: 14px;
  line-height: 1.4;
  font-family: 'Noto Sans KR', sans-serif;
  color: $color-font;
}

.app__page {
  flex-grow: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  .page__header {
    height: 80px;
  }
  .page__container {
    flex-grow: 1;
    overflow-y: auto;
  }
}
</style>

<script>
import LNB from '@/components/LNB';
import Header from '@/components/Header';
export default {
  components: {
    LNB,
    Header,
  },
};
</script>
