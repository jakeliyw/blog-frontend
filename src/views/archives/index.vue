<template>
  <div >
    <!-- <header-title :title="title" /> -->
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
          <v-card class="elevation-2 card" @click="jumpDetail(item.id)">
            <v-card-title class="text-h5" >
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
import HeaderTitle from "@/components/HeaderTitle";
import { getBlogArticle } from "@/api/blogArticle/blogArticle";

export default {
  name: "timeline",
  components: {
    HeaderTitle,
  },
  data: () => ({
    reverse: false,
    title: "归档",
    page: {
      current: 1,
      pageSize: 5,
      total: 0,
    },
    pageList: [],
  }),
  computed: {
    // 计算总页数
    pageCount() {
      return Math.ceil(this.page.total / this.page.pageSize);
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      const { current, pageSize } = this.page;
      const { data: res } = await getBlogArticle({
        current,
        pageSize,
      });
      const seenYears = new Set();

      const rawList = Array.isArray(res?.data?.list)
        ? res.data.list
        : Array.isArray(res?.data)
          ? res.data
          : [];

      const result = rawList
        .slice()
        .sort((a, b) =>
          String(b.createTime || "").slice(0, 4).localeCompare(String(a.createTime || "").slice(0, 4))
        )
        .map((item) => {
          const year = String(item.createTime || "").slice(0, 4);
          if (seenYears.has(year)) {
            return { ...item, createTime: "" };
          } else {
            seenYears.add(year);
            return { ...item, createTime: year };
          }
        });
      this.pageList = result;

      this.page.total = res?.data?.total || rawList.length || 0;
    },

    jumpDetail(id) {
      this.$router.push({ path: `/article/${id}` });
    },

    onPageChange(current) {
      this.page.current = current;
      this.getList(); // 调用获取数据的方法
    },
  },
};
</script>
<style scoped lang="scss">
.content {
  margin-top: 10px;
  max-width: 980px;
  margin: 0 auto;
  // padding-left: 120px;
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
