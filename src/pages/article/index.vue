<template>
  <div class="article">
    <div class="article-container container--fluid">
      <v-hover v-slot:default="{ hover }" open-delay="200" v-for="item of articleList" :key="item.id">
        <v-card subtitle :elevation="hover ? 16 : 2" class="mx-auto card" @click="datail(item)">
          <div class="article-img" :style="{backgroundColor: bgStyle}">
            <v-img
              :src="item.cover"
              style="border-radius: 0.5rem; width: 32rem;  height: 100%;"
            />
          </div>
          <div style="width: 100%; text-align: left;">
            <span class="headline" >
              {{ item.blogTitle }}
            </span>

            <div class="desc">
              {{ item.blogPost }}
            </div>
            <p class="date">
              <v-icon small class="con-yanjing" style="margin-right: 5px;">
                mdi-calendar-month-outline
              </v-icon>
              {{ item.createTime }}
            </p>
          </div>
        </v-card>
      </v-hover>
      <div class="text-center">
        <v-pagination
          v-if="pageCount > 1"
          v-model="page.current"
          :length="pageCount"
          class="pagination"
          color="teal"
          @input="onPageChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { removeMarkdown } from "@/utils/makedownSwitch.js";
import API_PREFIX from "@/utils/apiPrefix";

export default {
  name: "ArticlePage",
  data() {
    return {
      bgStyle: '#fff',
      articleList: [],
      page: {
        current: 1,
        pageSize: 6,
        total: 0,
      },
    };
  },
  head() {
    return {
      title: "首页",
      meta: [
        { hid: "description", name: "description", content: "博客文章列表与最新内容" },
      ],
    };
  },
  computed: {
    pageCount() {
      const total = this.page?.total || 0;
      const pageSize = this.page?.pageSize || 1;
      return Math.ceil(total / pageSize);
    },
  },

  watch: {
    '$vuetify.theme.dark'(newVal) {
      this.bgStyle = newVal ? '#22252B' : '#fff';
    },

  },
  mounted() {
    this.loadList();

    const theme = localStorage.getItem('theme');

    if (theme === 'dark') {
      this.bgStyle = '#22252B';
    } else {
      this.bgStyle = '#fff';
    }

  },
  methods: {
    async loadList() {
      try {
        const { data } = await this.$axios.$get(`${API_PREFIX}/article/list`, {
          params: { current: this.page.current, pageSize: this.page.pageSize },
        });
        const rawList = Array.isArray(data?.list)
          ? data.list
          : Array.isArray(data)
            ? data
            : [];
        this.articleList = rawList.map((item) => {
          const next = { ...item };
          next.tag = (next.tag || "").split(",");
          next.blogPost = removeMarkdown(next.blogPost || "");
          next.cover = next.cover.replace("http://43.136.115.90:9000", "");
          return next;
        });
        this.page.total = data?.total || rawList.length || 0;
      } catch (error) {
        console.error("Failed to load article list", error);
      }
    },
    async onPageChange(current) {
      this.page.current = current;
      if (process.client) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      await this.loadList();
    },
    datail(article) {
      const articleId = article?.publicId || article?.id;
      if (!articleId) return;
      this.$router.push({
        path: `/article/${articleId}`,
      });
    },
  },
};
</script>

<style scoped lang="scss">

.theme--dark.v-card {
  background-color: #22252B;
}

.article-img {
  width: 32rem;
  height: 24rem;
  margin-right: 4rem;
  background-color: #fff;
  border-bottom-left-radius: inherit;
  border-bottom-right-radius: inherit;
}

.article {
  max-width: 980px;
  margin: 0 auto;
  @include Article;
}

.underline {
  color: #607d8b;
  text-decoration: underline;
  font-size: 1.4rem;
}

@media screen and (max-width: 600px) {
  .card {
    flex-direction: column !important;
    padding: 20px !important;
    margin: 10px 0;
  }
}

@media screen and (max-width: 600px) {
  .article-img {
    margin-left: 0;
    margin-right: 0;
    margin-bottom: 2rem;
    width: 100%;
  }
}

.card {
  margin-bottom: 2rem;
  padding: 8rem 10rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  &:hover .headline {
    color: #009688;
  }

  .date {
    font-size: 16px;
    line-height: 30px;
    opacity: 0.5;
    display: flex;
    align-items: center;
  }

  .headline {
    cursor: pointer;
    font-weight: 600;
    font-size: 2.8rem !important;
    line-height: 4rem;
  }

  .desc {
    font-size: 16px;
    line-height: 30px;
    margin-top: 20px;
    margin-bottom: 15px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
}
</style>
.theme-dark .article-img {
  background-color: #22252B;
}
