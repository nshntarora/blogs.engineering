<template>
  <div>
    <div class="no-results-found" v-if="developers.length === 0">
      <img class="error-image" src="/img/search.svg" height="250" width="250" />
      <div class="title">
        No Developers In This Feed
      </div>
      <div class="subtitle">
        Search developer blogs and build your own feed
        <a href="/" style="margin-left: 5px;"> here</a>
      </div>
    </div>
    <div
      class="no-results-found"
      v-else-if="failedResults.length !== 0 && fetchedPosts.length === 0"
    >
      <img class="error-image" src="/img/search.svg" height="250" width="250" />
      <div class="title">
        We were unable to load your feed
      </div>
      <div class="subtitle">
        We tried fetching the feeds of
        <div
          class="developer"
          v-for="developer in developers.filter(d =>
            failedResults.includes(d.twitter)
          )"
          :key="developer.twitter"
        >
          <img
            class="image mb-0"
            :src="`https://avatars.io/twitter/${developer.twitter}`"
            height="16"
            width="16"
            v-if="developer.twitter"
          />
          <img
            class="image placeholder mb-0"
            src="/img/blogs.engineering.placeholder.png"
            height="16"
            width="16"
            v-else
          />
          {{ developer.name }}
        </div>
      </div>
    </div>
    <div class="row" v-else>
      <div class="col-md-9">
        <!-- <h1>
          My Feed
        </h1> -->
        <div class="feed">
          <div class="feed-item" v-for="post in sortedPosts" :key="post.link">
            <img
              class="image"
              :src="`https://avatars.io/twitter/${post.developer.twitter}`"
              height="50"
              width="50"
              v-if="post.developer.twitter"
            />
            <img
              class="image placeholder"
              src="/img/blogs.engineering.placeholder.png"
              height="50"
              width="50"
              v-else
            />
            <div>
              <a :href="post.link" target="_blank" class="title">
                {{ post.title }}
              </a>
              <div class="timestamp">
                {{ new Date(post.updated).toDateString() }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="sidebar-block mb-4">
          <div class="sidebar-title mb-2">
            developers powering this feed
          </div>
          <div
            class="developer"
            v-for="developer in developers.filter(
              d => !failedResults.includes(d.twitter)
            )"
            :key="developer.twitter"
          >
            <img
              class="image"
              :src="`https://avatars.io/twitter/${developer.twitter}`"
              height="16"
              width="16"
              v-if="developer.twitter"
            />
            <img
              class="image placeholder"
              src="/img/blogs.engineering.placeholder.png"
              height="16"
              width="16"
              v-else
            />
            {{ developer.name }}
          </div>
        </div>
        <div class="sidebar-block" v-if="failedResults.length">
          <div class="sidebar-title mb-2">
            developers we were unable to fetch the feed for
          </div>
          <div
            class="developer"
            v-for="developer in developers.filter(d =>
              failedResults.includes(d.twitter)
            )"
            :key="developer.twitter"
          >
            <img
              class="image"
              :src="`https://avatars.io/twitter/${developer.twitter}`"
              height="16"
              width="16"
              v-if="developer.twitter"
            />
            <img
              class="image placeholder"
              src="/img/blogs.engineering.placeholder.png"
              height="16"
              width="16"
              v-else
            />
            {{ developer.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import developers from "../../public/developers.json";

export default {
  name: "YourFeed",
  metaInfo: {
    title: "My Feed - blogs.engineering"
  },
  data() {
    return {
      fetchedPosts: [],
      failedResults: []
    };
  },
  computed: {
    developers() {
      if (this.$route.query.devs) {
        const devs = this.$route.query.devs.split(",");
        return developers.filter(dev => devs.includes(dev.twitter));
      }
      return [];
    },
    sortedPosts() {
      const posts = JSON.parse(JSON.stringify(this.fetchedPosts));
      return posts.sort((a, b) => {
        return (
          new Date(a.updated).toISOString() < new Date(b.updated).toISOString()
        );
      });
    }
  },
  methods: {
    updateFeedForDeveloper(developer) {
      fetch(developer.feed)
        .then(res => {
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
              posts.push({ title, link, updated, developer });
            });
            this.fetchedPosts = [...this.fetchedPosts, ...posts.slice(0, 10)];
          });
        })
        .catch(() => {
          this.failedResults = [...this.failedResults, developer.twitter];
        });
    },
    generateFeedForAllDevelopers() {
      this.developers.forEach(dev => {
        this.updateFeedForDeveloper(dev);
      });
    }
  },
  watch: {
    developers() {
      this.generateFeedForAllDevelopers();
    }
  },
  mounted() {
    if (this.developers.length) {
      this.generateFeedForAllDevelopers();
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  margin-bottom: 1rem;
  margin-top: 0;
  font-weight: 700;
}

.feed {
  background-color: #111;
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid #000;
}
.image {
  border: 1px solid #000;
  border-radius: 1rem;
  margin-right: 0.25rem;
}
.image.placeholder {
  filter: grayscale(1);
  opacity: 0.15;
}

.feed-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  .title {
    font-weight: 700;
    color: inherit;
  }

  .image {
    margin-right: 1rem;
  }

  .title:hover,
  .title:focus,
  .title:active {
    border-bottom: none;
    color: #f06a35;
  }

  .timestamp {
    opacity: 0.75;
    font-size: 0.75rem;
  }
}

.sidebar {
  padding-left: 1rem;
  .sidebar-block {
    margin-top: 2rem;
  }
  .sidebar-title {
    font-weight: 700;
    margin-bottom: 1rem;
    font-size: 0.8rem;
  }
}

.developer {
  display: flex;
  align-items: center;
  opacity: 0.75;
  margin-bottom: 0.25rem;
  font-size: 0.75rem;
}

.no-results-found {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  .error-image {
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
    display: flex;
    align-items: center;
  }
  .developer {
    margin-left: 0.5rem;
  }
}
</style>
