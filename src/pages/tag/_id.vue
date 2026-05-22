<template>
  <div>
    <v-card class="mx-auto card" style="width: 99%">
      <v-card-title style="padding: 0px; font-size: 24px">
        共计 {{ page.total }} 篇文章
      </v-card-title>
      <div v-for="(item, i) in articleList" :key="i">
        <v-card-title style="padding-left: 0px; font-size: 1.6rem;">{{
          item[0].createTime
        }}</v-card-title>
        <v-divider style="padding-left: 20px" />
        <v-card-text
          class="card-hover"
          v-for="(list, j) in item"
          :key="j"
          @click="datail(list)"
        >
          {{ list.creationTime }}
          {{ list.blogTitle }}
        </v-card-text>
      </div>
    </v-card>
    <v-pagination
      v-if="pageCount > 0"
      v-model="page.current"
      :length="pageCount"
      class="pagination"
      color="teal"
      @input="onPageChange"
    />
  </div>
</template>

<script>
import API_PREFIX from "@/utils/apiPrefix";

export default {
  name: "TagDetailPage",
  head() {
    return {
      title: `标签：${this.title}`,
      meta: [
        { hid: "description", name: "description", content: `标签 ${this.title} 的文章列表。` },
      ],
    };
  },
  data: () => ({
    title: "",
    articleList: [],
    page: {
      current: 1,
      pageSize: 6,
      total: 0,
    },
  }),
  computed: {
    pageCount() {
      return Math.ceil(this.page.total / this.page.pageSize);
    },
  },
  mounted() {
    this.title = this.$route.params.id;
    this.getList();
  },
  watch: {
    '$route.params.id'(next) {
      this.title = next;
      this.page.current = 1;
      this.getList();
    },
  },
  methods: {
    async onPageChange(current) {
      this.page.current = current;
      if (process.client) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      await this.getList();
    },
    async getList() {
      const res = await this.$axios.$get(`${API_PREFIX}/article/list`, {
        params: { current: this.page.current, pageSize: this.page.pageSize, tag: this.title },
      });
      const rawList = Array.isArray(res?.data?.list)
        ? res.data.list
        : Array.isArray(res?.data)
          ? res.data
          : [];
      this.articleList = groupByCreateTime(rawList);
      this.page.total = res?.data?.total || rawList.length || 0;
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

function groupByCreateTime(blogs) {
  const grouped = {};
  blogs.forEach((blog) => {
    const next = { ...blog };
    next.creationTime = (next.createTime || "").substring(5);
    next.createTime = (next.createTime || "").split("-")[0];
    if (!grouped[next.createTime]) {
      grouped[next.createTime] = [];
    }
    grouped[next.createTime].push(next);
  });
  const map = new Map(
    Object.entries(grouped).sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
  );
  const arr = [];
  map.forEach((blogs) => {
    arr.push(blogs);
  });
  return arr;
}
</script>

<style lang="scss" scoped>

.theme--dark.v-card {
  background-color: #22252B;
}

.card {
  margin-top: 20px;
  padding: 20px;

  .card-hover {
    cursor: pointer;
    font-size: 1.4rem;
    &:hover {
      background-color: rgba(142, 241, 232, 0.1);
      color: rgb(0, 150, 136);
    }
  }
}

.pagination {
  margin-top: 2rem;
}
</style>
