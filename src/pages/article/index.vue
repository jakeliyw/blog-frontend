<template>
  <div class="article">
    <div class="article-container container--fluid">
      <div v-if="articleList.length">
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
      </div>
      <div v-else >
        <!-- 最简修复版 -->
      <v-card
        v-for="value in 2"
        :key="value"
        class="responsive-card skeleton"
        elevation="2"
      >
        <div class="card-grid">
          <div class="img-area">
            <v-skeleton-loader
              type="image"
              height="200"
              class="skeleton-img"
            />
          </div>

          <div class="content-area skeleton-content">
            <v-skeleton-loader type="heading" class="skeleton-title" />
            <v-skeleton-loader type="text" class="skeleton-text" />
            <v-skeleton-loader type="text" width="40%" class="skeleton-text" />
          </div>
        </div>
      </v-card>
      </div>
      <div class="text-center">
        <v-pagination
          v-if="pageCount > 0"
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
/* 使用 Grid 实现响应式布局 */
.responsive-card {
  margin-bottom: 16px;
  overflow: hidden;
}

.card-grid {
  display: grid;
  gap: 16px;
  padding: 16px;
}

/* PC端：左图右文 */
@media (min-width: 960px) {
  .card-grid {
    grid-template-columns: 300px 1fr;
    gap: 24px;
  }

  .img-area {
    max-width: 300px;
  }
}

/* 移动端：上图下文 */
@media (max-width: 959px) {
  .card-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .img-area {
    width: 100%;
  }
}

/* 图片样式 */
.card-img {
  border-radius: 0.5rem;
  width: 100%;
  height: auto;
  object-fit: cover;
}

.article-img {
  border-radius: 0.5rem;
  overflow: hidden;
}

/* 内容区域 */
.content-area {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

.headline {
  font-size: 1.2rem;
  font-weight: bold;
  line-height: 1.4;
}

.desc {
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.date {
  color: #999;
  font-size: 0.875rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 骨架屏样式 */
.skeleton-content {
  gap: 12px;
}

.skeleton-title :deep(.v-skeleton-loader__heading) {
  height: 28px;
  width: 70%;
}

.skeleton-text :deep(.v-skeleton-loader__text) {
  height: 20px;
}

/* 移动端适配 */
@media (max-width: 959px) {
  .card-grid {
    padding: 12px;
  }

  .headline {
    font-size: 1rem;
  }

  .desc {
    font-size: 0.875rem;
  }

  .skeleton-title :deep(.v-skeleton-loader__heading) {
    height: 24px;
  }

  .skeleton-text :deep(.v-skeleton-loader__text) {
    height: 16px;
  }
}


// ---------------


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
  padding: 5rem 8rem;
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
