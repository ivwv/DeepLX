<template>
  <div class="hero">
    <h1 class="hero-title">DeepLX</h1>
    <p class="hero-subtitle">Translation model based on DeepLX</p>
    <p class="hero-description">
      Send a POST request to
      <code
        style="background-color: #333; color: #fff; padding: 0.25rem 0.5rem; border-radius: 0.25rem"
        >/translate</code
      >
      with the text you want to translate.
      <br />
      For more information, check out the
      <a
        href="https://github.com/ivwv/DeepLX"
        target="_blank"
        rel="noopener noreferrer"
        style="color: #3498db"
        >GitHub repo</a
      >.
    </p>
  </div>
</template>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #fff;
}

.hero-title {
  font-size: 56px;
  font-weight: bold;
  margin-bottom: 24px;
}

.hero-subtitle {
  font-size: 24px;
  margin-bottom: 40px;
}

.hero-description {
  font-size: 16px;
  margin-bottom: 24px;
}
</style>
