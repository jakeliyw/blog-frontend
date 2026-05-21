<template>
  <div class="article">
    <v-card class="mx-auto" style="width: 99%">
      <v-card-text>
        <span style="font-size: 1.4rem;">所有标签：</span>
        <span class="title-article">{{ listLen }}</span>
        <v-chip-group active-class="deep-purple--text text--accent-4">
          <v-chip
            v-for="item in tagList"
            :key="item.id"
            @click="getArticle(item.label)"
            class="tag"
          >
            {{ item.label }}
          </v-chip>
        </v-chip-group>
      </v-card-text>
    </v-card>
    <br />
  </div>
</template>

<script>
import HeaderTitle from "@/components/HeaderTitle";
import { tagList } from "@/api/blogTag/blogTag";

export default {
  name: "tag",
  components: {
    HeaderTitle,
  },
  data: () => ({
    title: "标签",
    tagData: [],
    listLen: 20,
    tags: "",
    page: {
      start: 0,
    },
    pagination: {
      pagenum: 1,
      length: 0,
    },
  }),
  mounted() {
    this.getTag();
  },
  methods: {
    async getTag() {
      const { data: res } = await tagList();
      this.tagList = res;
      this.listLen = res.length;
    },
    getArticle(id) {
      this.$router.push({
        path: `/tag/${id}`,
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

.tag {
  cursor: pointer;

  &:hover {
    color: white;
    background-color: #009688;
  }
}

.title-article {
  font-size: 1.4rem;
  color: teal;
}
</style>
