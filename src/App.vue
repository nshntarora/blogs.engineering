<template>
  <div class="container-fluid">
    <header class="header position-relative">
      <div @click="handleFeedLinkClick" class="feed-link button">
        My Feed
      </div>
      <div class="logo">
        <router-link to="/"
          ><img src="/img/blogs.engineering.svg" height="100" width="100"
        /></router-link>
      </div>
      <h1 class="mb-3">blogs.engineering</h1>
      <p>discover great engineering blogs by great developers</p>
      <div class="mt-4">
        <div class="d-flex align-items-center">
          <a
            class="github-button"
            href="https://github.com/nshntarora/blogs.engineering"
            data-size="large"
            data-show-count="true"
            aria-label="Star nshntarora/blogs.engineering on GitHub"
            >Star</a
          >
          <a
            class="ml-3"
            href="https://github.com/nshntarora/blogs.engineering"
            target="_blank"
          >
            Contribute to this project on GitHub</a
          >
        </div>
      </div>
    </header>
    <router-view />
    <div class="mt-4 px-4 font-size-sm">
      Created by
      <a href="https://twitter.com/nshntarora" target="_blank">@nshntarora</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  methods: {
    handleFeedLinkClick() {
      const devsInStore = window.localStorage.getItem("devs");
      if (devsInStore) {
        this.$router.push(`/feed?devs=${encodeURIComponent(devsInStore)}`);
      } else {
        this.$router.push(`/feed`);
      }
    }
  }
};
</script>

<style lang="scss">
@import "./assets/bootstrap/bootstrap.scss";
@import url("https://fonts.googleapis.com/css?family=Noto+Sans:400,800&display=swap");

body {
  font-family: "Noto Sans", sans-serif;
  /* color: #333; */
  color: #fff;
  margin-bottom: 5rem;
  background-color: #242424;
  padding-right: 16px;
}

a {
  color: #f06a35;
  text-decoration: none;
}

a:hover,
a:active,
a:focus {
  color: #f06a35;
  text-decoration: none;
  border-bottom: 3px solid #f06a35;
}

p {
  font-family: "Noto Sans", sans-serif;
  margin-bottom: 2rem;
}

blockquote {
  font-size: 1.3rem;
  opacity: 0.6;
  border-left: 2px solid #333;
  padding-left: 2rem;
}

.header {
  padding: 2rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 2rem;
  h1 {
    text-align: center;
    margin-bottom: 0;
    margin-top: 1rem;
    opacity: 1;
    font-weight: 900;
    font-size: 2rem;
  }
  p {
    opacity: 0.75;
    margin: 0;
    text-align: center;
    font-family: "Noto Sans", sans-serif;
    font-size: 0.9rem;
  }
}

.logo {
  a {
    color: inherit;
    text-decoration: none;
    &:hover,
    &:focus,
    &:active {
      color: inherit;
      text-decoration: none;
      border-bottom: none;
    }
  }
}

.main-content {
  display: flex;
}

.main {
  width: 75%;
}

.sidebar {
  width: 25%;
}

.feed-link {
  position: absolute;
  right: 1rem;
  top: 1rem;
}

.button {
  border: 1px solid #000;
  background-color: #f06a35;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.75rem;
}

.button:hover,
.button:focus,
.button:active {
  background-color: #e64709;
}
</style>
