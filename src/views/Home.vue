<template>
  <div>
    <div class="row flex-column-reverse flex-lg-row">
      <div class="col-md-9">
        <div>
          <div class="developers-wrapper row no-gutters">
            <div
              class="no-results-found col-md-12"
              v-if="searchText && searchResults.length === 0"
            >
              <img src="/img/search.svg" height="250" width="250" />
              <div class="title">
                No Results Found
              </div>
              <div class="subtitle">
                Know a developer or blog with the name, {{ searchText }}?
              </div>
            </div>
            <div
              class="col-md-6 pl-3 pb-3"
              v-for="developer in searchText ? searchResults : sortedDevelopers"
              :key="developer.link"
            >
              <div class="developer-card w-100">
                <img
                  class="image"
                  :src="`https://avatars.io/twitter/${developer.twitter}`"
                  height="100"
                  width="100"
                  v-if="developer.twitter"
                />
                <img
                  class="image placeholder"
                  src="/img/blogs.engineering.placeholder.png"
                  height="100"
                  width="100"
                  v-else
                />
                <div class="content">
                  <div class="name">
                    {{ developer.name }}
                  </div>
                  <div class="twitter">
                    <img src="/img/twitter.svg" />
                    <a
                      :href="`https://twitter.com/${developer.twitter}`"
                      target="_blank"
                    >
                      {{ developer.twitter }}
                    </a>
                  </div>
                  <div class="description" v-if="developer.description">
                    {{ developer.description }}
                  </div>
                  <a class="link" :href="developer.link" target="_blank">{{
                    developer.link
                  }}</a>

                  <!-- <div
                  class="tags"
                  v-if="developer.tags"
                >
                  Tagged with: {{ developer.tags }}
                </div> -->

                  <div class="latest-posts" v-if="developer.feed">
                    <div
                      class="latest-posts-loading"
                      v-if="
                        fetchedPosts &&
                          fetchedPosts[developer.twitter] &&
                          fetchedPosts[developer.twitter].state === 'loading'
                      "
                    >
                      Loading...
                    </div>
                    <div
                      v-else-if="
                        fetchedPosts && fetchedPosts[developer.twitter]
                      "
                      class="latest-posts-button"
                      @click="clearLatestPosts(developer)"
                    >
                      Hide Latest Posts
                    </div>
                    <div
                      v-else
                      class="latest-posts-button"
                      @click="getLatestPosts(developer)"
                    >
                      View Latest Posts
                    </div>
                    <div
                      class="latest-posts-list mt-2"
                      v-if="fetchedPosts && fetchedPosts[developer.twitter]"
                    >
                      <div
                        v-if="
                          fetchedPosts[developer.twitter].state === 'success'
                        "
                      >
                        <div
                          class="post"
                          v-for="(post, index) in fetchedPosts[
                            developer.twitter
                          ].posts"
                          :key="index"
                        >
                          <a
                            :href="post.link"
                            target="_blank"
                            class="post-title"
                          >
                            {{ post.title }}
                          </a>
                          <div class="post-updated">
                            {{ new Date(post.updated).toDateString() }}
                          </div>
                        </div>
                      </div>
                      <div v-else>
                        {{ fetchedPosts[developer.twitter].error }}<br /><br />
                        It's usually due to
                        <a
                          href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS"
                          target="_blank"
                          >CORS</a
                        >. So, here is their feed URL in case you want to
                        subscribe any other way,
                        <a :href="developer.feed" target="_blank">{{
                          developer.feed
                        }}</a>
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <a
                      class="ask-feed-link"
                      :href="
                        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                          `Hi ${developer.twitter}, I wanted to subscribe to your blog using your RSS or Atom feed, but I'm unable to find it. Can you share the feed link with @nshntarora for blogs.engineering?`
                        )}`
                      "
                      target="_blank"
                      >Ask them for their feed</a
                    >
                  </div>
                </div>

                <div class="top-right">
                  <div v-if="developer.feed">
                    <div
                      class="button"
                      v-if="!isDeveloperAdded(developer)"
                      @click="addDeveloperToFeed(developer)"
                    >
                      Add to feed
                    </div>
                    <div
                      class="add-to-feed button"
                      v-else
                      @click="removeDeveloperFromFeed(developer)"
                    >
                      Added
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-4">
        <div class="search-wrapper w-100">
          <input
            class="search-input w-100"
            v-model="searchText"
            placeholder="Search..."
          />
        </div>
        <div class="tags-wrapper">
          <div
            class="tag"
            :class="{ active: selectedTags.includes(tag) }"
            v-for="tag in tags"
            :key="tag"
            @click="handleTagClick(tag)"
          >
            {{ tag }}
          </div>
        </div>
      </div>
    </div>
    <div class="subscribed-footer" v-if="selectedDevelopers.length">
      You've added {{ selectedDevelopers.length }} developers to your feed
      <div
        @click="handleViewFeedClick"
        :to="`/feed?devs=${encodeURIComponent(selectedDevelopers.join(','))}`"
        class="button"
      >
        View feed
      </div>
    </div>
  </div>
</template>

<script>
import developers from "../../public/developers.json";
import Fuse from "fuse.js";

const fuseOptions = {
  shouldSort: true,
  threshold: 0.3,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 2,
  keys: ["name", "tags", "twitter", "description"]
};

export default {
  metaInfo: {
    title: "blogs.engineering - discover great engineering blogs"
  },
  data() {
    return {
      selectedTags: [],
      searchText: "",
      searchResults: [],
      fetchedPosts: {},
      selectedDevelopers: []
    };
  },
  computed: {
    developers: () => developers,
    filteredDevelopers() {
      if (this.selectedTags.length) {
        return this.developers.filter(dev =>
          dev.tags.split(",").some(t => this.selectedTags.includes(t))
        );
      }
      return this.developers;
    },
    sortedDevelopers() {
      const devs = JSON.parse(JSON.stringify(this.filteredDevelopers));
      return devs.sort((a, b) => a.name > b.name);
    },
    tags() {
      let tags = [];
      developers.forEach(dev => {
        tags = [...tags, ...dev.tags.split(",")];
      });
      return new Set(tags.filter(t => t !== ""));
    }
  },
  methods: {
    handleViewFeedClick() {
      const devsInStore = window.localStorage.getItem("devs");
      if (devsInStore) {
        this.$router.push(`/feed?devs=${encodeURIComponent(devsInStore)}`);
      } else {
        this.$router.push(`/feed`);
      }
    },
    handleTagClick(tag) {
      if (this.selectedTags.includes(tag)) {
        this.selectedTags.splice(
          this.selectedTags.findIndex(t => t === tag),
          1
        );
      } else {
        this.selectedTags.push(tag);
      }
    },
    clearLatestPosts(developer) {
      const posts = JSON.parse(JSON.stringify(this.fetchedPosts));
      Object.keys(posts).forEach(dev => {
        if (dev === developer.twitter) {
          delete posts[dev];
        }
      });
      this.fetchedPosts = posts;
    },
    async getLatestPosts(developer) {
      fetch(developer.feed)
        .then(res => {
          this.fetchedPosts = {
            ...this.fetchedPosts,
            [developer.twitter]: {
              visible: false,
              state: "loading"
            }
          };
          res.text().then(xmlTxt => {
            var domParser = new DOMParser();
            let doc = domParser.parseFromString(xmlTxt, "text/xml");
            let feedType = "rss";
            let postTag = "item";
            let timestampTag = "pubDate";
            if (!doc.querySelector("rss")) {
              feedType = "atom";
              postTag = "entry";
              timestampTag = "updated";
            }
            const posts = [];
            doc.querySelectorAll(postTag).forEach(item => {
              const title = item.querySelector("title").textContent;
              let link = "";
              if (feedType === "rss") {
                link = item.querySelector("link").innerHTML;
              } else {
                link = item.querySelector("link").attributes.href.value;
              }
              const updated = item.querySelector(timestampTag).textContent;
              posts.push({ title, link, updated });
            });
            this.fetchedPosts = {
              ...(this.fetchedPosts || {}),
              [developer.twitter]: {
                visible: true,
                state: "success",
                posts: posts.slice(0, 5)
              }
            };
          });
        })
        .catch(err => {
          this.fetchedPosts = {
            ...(this.fetchedPosts || {}),
            [developer.twitter]: {
              state: "error",
              error: err.toString()
            }
          };
        });
    },
    addDeveloperToFeed(developer) {
      this.selectedDevelopers.push(developer.twitter);
    },
    removeDeveloperFromFeed(developer) {
      const devIndex = this.selectedDevelopers.findIndex(
        d => d === developer.twitter
      );
      if (devIndex > -1) {
        this.selectedDevelopers.splice(devIndex, 1);
      }
    },
    isDeveloperAdded(developer) {
      return this.selectedDevelopers.includes(developer.twitter);
    }
  },
  watch: {
    filteredDevelopers(devs) {
      this.fuse = new Fuse(devs, fuseOptions);
    },
    searchText(query) {
      if (!query) {
        this.searchResults = [];
      } else {
        this.searchResults = this.fuse.search(query);
      }
    },
    selectedDevelopers(devs) {
      window.localStorage.setItem("devs", devs.join(","));
    }
  },
  mounted() {
    this.fuse = new Fuse(this.filteredDevelopers, fuseOptions);

    const devsInStore = window.localStorage.getItem("devs");
    if (devsInStore) {
      const devsArray = devsInStore.split(",");
      this.selectedDevelopers = devsArray;
    }
  }
};
</script>

<style lang="scss">
.developers-wrapper {
  display: flex;
  flex-wrap: wrap;
}

.developer-card {
  /* display: flex;
  align-items: center; */
  position: relative;
  border: 1px solid #000;
  border-radius: 1rem;
  overflow: hidden;
  /* box-shadow: 0px 1px 12px #00000061; */
  padding: 1rem;
  background-color: #333;
}

.image {
  border: 1px solid #000;
  border-radius: 1rem;
}

.image.placeholder {
  filter: grayscale(1);
  opacity: 0.15;
}

.content {
  margin-top: 1rem;
}

.name {
  font-weight: 700;
}

.twitter {
  display: flex;
  align-items: center;
}

.tags {
  font-size: 0.6rem;
  opacity: 0.75;
}

.twitter img {
  height: 16px;
  width: 16px;
  margin-right: 0.5rem;
}

.twitter a {
  color: inherit;
}
.twitter a:hover,
.twitter a:focus,
.twitter a:active {
  border-bottom: none;
}

.rss a:hover,
.rss a:focus,
.rss a:active {
  border-bottom: none;
}

.latest-posts-button {
  color: #f06a35;
  font-size: 0.75rem;
  cursor: pointer;
  border-bottom: 3px solid transparent;
}

.latest-posts-loading {
  opacity: 0.75;
  font-size: 0.75rem;
}

.latest-posts-button:hover,
.latest-posts-button:focus,
.latest-posts-button:active {
  border-bottom: 3px solid #f06a35;
}

.rss img {
  cursor: pointer;
}

.rss .inactive {
  filter: grayscale(1);
  opacity: 0.5;
}

.description {
  opacity: 0.75;
  font-size: 0.75rem;
}

.tooltip {
  background-color: #000;
  color: #fff;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
}

.link {
  font-size: 0.75rem;
}

.search-input {
  font-size: 1rem;
  font-family: inherit;
  border: 1px solid #000;
  /* box-shadow: 0px 0px 5px #eaeaea; */
  padding: 1rem 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  width: 70%;
  background-color: #333;
  color: #fff;
}

.search-input:focus {
  background-color: #111;
}

.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
}

.tag {
  margin: 0.2rem;
  background-color: #333;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  color: #fff;
  font-size: small;
  cursor: pointer;
  border: 1px solid #000;
}

.tag:hover,
.tag:focus,
.tag:active {
  background-color: #222;
}

.tag.active {
  background-color: #f06a35;
  color: #fff;
}

.top-right {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.latest-posts-list {
  font-size: 0.8rem;
  opacity: 0.75;
  background-color: #111;
  border-radius: 1rem;
  padding: 1rem;
}

.post {
  margin-bottom: 0.5rem;
}

.post-title {
  font-weight: 700;
  font-size: 0.8rem;
  color: inherit;
}

.post-title:hover,
.post-title:focus,
.post-title:active {
  border-bottom: none;
  color: #f06a35;
}

.post-updated {
  opacity: 0.5;
}

.ask-feed-link {
  font-size: 0.75rem;
  color: #1da1f2;
}

.ask-feed-link:hover,
.ask-feed-link:focus,
.ask-feed-link:active {
  color: #1da1f2;
  border-bottom: 3px solid #1da1f2;
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

.add-to-feed {
  background-color: #1eb474;
}

.add-to-feed:hover,
.add-to-feed:focus,
.add-to-feed:active {
  background-color: #19935f;
}

.remove-from-feed {
  background-color: #f8333c;
}

.remove-from-feed:hover,
.remove-from-feed:focus,
.remove-from-feed:active {
  background-color: #f70e19;
}

.subscribed-footer {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  padding: 1rem 2rem;
  background-color: #f06a35;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.subscribed-footer .button {
  border: 1px solid #fff;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  margin-left: 1rem;
}

.subscribed-footer .button:hover,
.subscribed-footer .button:focus,
.subscribed-footer .button:active {
  background-color: #fff;
  color: #f06a35;
}

.no-results-found {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  img {
    margin-bottom: 1rem;
    opacity: 0.75;
    filter: grayscale(1);
  }
  .title {
    font-size: 2rem;
    opacity: 0.75;
  }
  .subtitle {
    opacity: 0.5;
    font-size: 0.75rem;
  }
}
</style>
