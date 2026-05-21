<template>
  <div>
    <div class="content">
      <v-timeline :reverse="reverse" dense>
        <v-timeline-item color="teal lighten-2" large>
          <span style="font-size: 2.5rem">全部文章 - {{ page.total }}</span>
        </v-timeline-item>
        <v-timeline-item
          v-for="item in pageList"
          :key="item.id"
          color="red lighten-2"
          large
        >
          <span style="font-size: 2.5rem">{{ item.createTime }}</span>
          <v-card class="elevation-2 card" @click="jumpDetail(item)">
            <v-card-title class="text-h5">
              {{ item.blogTitle }}
            </v-card-title>
            <v-card-text class="text-ellipsis">
              {{ item.blogPost }}
            </v-card-text>
          </v-card>
        </v-timeline-item>
      </v-timeline>
    </div>
    <v-pagination
      v-model="page.current"
      :length="pageCount"
      class="pagination"
      color="teal"
      @input="onPageChange"
    />
  </div>
</template>

<script>
import { removeMarkdown } from "@/utils/makedownSwitch.js";
import API_PREFIX from "@/utils/apiPrefix";

export default {
  name: "ArchivesPage",
  head() {
    return {
      title: "归档",
      meta: [{ hid: "description", name: "description", content: "博客文章归档时间线。" }],
    };
  },
  data: () => ({
    reverse: false,
    page: {
      current: 1,
      pageSize: 5,
      total: 0,
    },
    pageList: [],
  }),
  computed: {
    pageCount() {
      return Math.ceil(this.page.total / this.page.pageSize);
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    async onPageChange(current) {
      this.page.current = current;
      if (process.client) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      await this.getList();
    },
    jumpDetail(article) {
      const articleId = article?.publicId || article?.id;
      if (!articleId) return;
      this.$router.push({ path: `/article/${articleId}` });
    },
    async getList() {
      const res = await this.$axios.$get(`${API_PREFIX}/article/list`, {
        params: { current: this.page.current, pageSize: this.page.pageSize },
      });

      const rawList = Array.isArray(res?.data?.list)
        ? res.data.list
        : Array.isArray(res?.data)
          ? res.data
          : [];

      this.pageList = normalizeList(rawList);
      this.page.total = res?.data?.total || rawList.length || 0;
    },
  },
};

function normalizeList(list) {
  const seenYears = new Set();
  return (list || [])
    .sort((a, b) => b.createTime.slice(0, 4).localeCompare(a.createTime.slice(0, 4)))
    .map((item) => {
      const next = { ...item };
      next.blogPost = removeMarkdown(next.blogPost || "");
      const year = (next.createTime || "").slice(0, 4);
      if (seenYears.has(year)) {
        return { ...next, createTime: "" };
      }
      seenYears.add(year);
      return { ...next, createTime: year };
    });
}
</script>

<style scoped lang="scss">

.theme--dark.v-card {
  background-color: #22252B;
}

.content {
  margin-top: 10px;
  max-width: 980px;
  margin: 0 auto;
}

.card {
  max-width: 800px;
  cursor: pointer;
  &:hover {
    color: teal;
  }
}

.text-h5 {
  font-size: 1.6rem;
}

.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 600px;
  font-size: 1.4rem;
}

.meta-box {
  font-size: 12px;
  color: #757575;
  padding: 0 16px;
  display: flex;
  margin-bottom: 10px;
  align-content: center;

  .date {
    display: flex;
    align-items: center;
    margin-right: 12px;
  }
}
</style>
