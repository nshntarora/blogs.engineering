<template>
  <div class="container-fluid">
    <header class="header">
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
            href="https://github.com/nshtarora/blogs.engineering"
            target="_blank"
          >
            Contribute to this project on GitHub</a
          >
        </div>
      </div>
    </header>
    <router-view />
  </div>
</template>

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
</style>
