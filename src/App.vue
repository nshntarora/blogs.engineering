<template>
  <div class="layout">
    <header class="header">
      <a href="/"
        ><img src="/img/blogs.engineering.svg" height="100" width="100"
      /></a>
      <h1>blogs.engineering</h1>
      <p>discover great engineering blogs by great developers</p>
    </header>
    <router-view />
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Noto+Sans:400,800&display=swap");

body {
  font-family: "Noto Sans", sans-serif;
  /* color: #333; */
  color: #fff;
  line-height: 2;
  overflow-y: scroll;
  margin-bottom: 5rem;
  padding: 1rem;
  background-color: #242424;
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
  }
  p {
    opacity: 0.75;
    margin: 0;
    text-align: center;
    font-family: "Noto Sans", sans-serif;
    font-size: 0.9rem;
  }
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
