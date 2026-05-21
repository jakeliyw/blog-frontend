<template>
  <div class="article">
    <header-title :title="title" />
    <br />
    <v-card class="mx-auto" max-width="1660">
      <v-card-text>
        共计
        <span class="title-article">{{ pagination.length }}</span>
        篇文章
      </v-card-text>
    </v-card>
    <br />
    <v-row>
      <v-col cols="12" sm="6" v-for="item of cardsdatalimit" :key="item.id">
        <v-hover v-slot:default="{ hover }" open-delay="200">
          <v-card
            subtitle
            :elevation="hover ? 16 : 2"
            class="mx-auto"
            max-width="799.5"
          >
            <v-card-title class="headline mb-1" @click="datail(item.id)">{{
              item.title
            }}</v-card-title>
            <div class="meta-box">
              <span class="date">
                <v-icon small class="con-yanjing"
                  >mdi-calendar-month-outline</v-icon
                >
                <span>{{ item.createtime }}</span>
              </span>
              <span class="author">
                <v-icon small class="con-yanjing">mdi-face-outline</v-icon>
                <span>{{ item.author }}</span>
              </span>
              <span class="watch">
                <v-icon small class="con-yanjing">mdi-eye-outline</v-icon>
                <span>{{ item.toalnum }}</span>
              </span>
            </div>
            <div class="content">
              {{ item.subContent }}
              <v-btn depressed x-small color="success" @click="datail(item.id)"
                >阅读全文</v-btn
              >
            </div>
            <v-card-actions>
              <v-btn class="pr-0" text icon color="blue-grey lighten-2">
                <v-icon small> mdi-tag-multiple </v-icon>
              </v-btn>
              <div class="underline">{{ item.tags }}</div>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
    <!--        分页器-->
    <v-pagination
      v-model="pagination.pagenum"
      color="teal"
      class="pagination"
      :length="total"
    ></v-pagination>
  </div>
</template>

<script>
import HeaderTitle from "@/components/HeaderTitle";
import { getBlogArticle } from "@/api/blogTags/blogTags";

export default {
  name: "index",
  components: {
    HeaderTitle,
  },
  data: () => ({
    title: "标签文章",
    listLen: 0,
    tags: "",
    cardsData: {},
    page: {
      start: 0,
    },
    pagination: {
      pagenum: 1,
      length: 0,
    },
  }),
  mounted() {
    this.getTags();
  },
  watch: {
    // 监听这个当前页面
    "pagination.pagenum"() {
      this.page.start = (this.pagination.pagenum - 1) * 5;
      this.getTags();
    },
  },
  computed: {
    total() {
      return Math.ceil(this.pagination.length / 5);
    },
    // 当前页start,取值
    cardsdatalimit() {
      return this.cardsData[this.page.start];
    },
  },
  methods: {
    async getTags() {
      const tags = this.$route.params.item;
      const { data: res } = await getBlogArticle({
        start: this.page.start,
        tags,
      });
      // 把数组的长度设置为后台计算的总长度
      this.$set(this.pagination, "length", res.listLen);
      // 将空对象修改成请求过来的数据
      this.$set(this.cardsData, this.page.start, res.listData);
      res.listData.map((item) => {
        item.createtime = this.$moment(item.createtime).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      });
    },
    datail(id) {
      this.$router.push({
        path: `/article/${id}`,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.article {
  @include Article;
}

.underline {
  color: #607d8b;
  text-decoration: underline;
}

.headline {
  cursor: pointer;

  &:hover {
    color: #009688;
  }
}

.title-article {
  color: teal;
}
</style>
