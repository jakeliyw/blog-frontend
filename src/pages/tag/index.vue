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
import API_PREFIX from "@/utils/apiPrefix";

export default {
  name: "TagPage",
  head() {
    return {
      title: "标签",
      meta: [{ hid: "description", name: "description", content: "博客标签列表。" }],
    };
  },
  data: () => ({
    listLen: 0,
    tagList: [],
  }),
  mounted() {
    this.getTag();
  },
  methods: {
    async getTag() {
      const res = await this.$axios.$get(`${API_PREFIX}/tag/list`);
      const tagList = Array.isArray(res?.data)
        ? res.data
        : [];
      this.tagList = tagList;
      this.listLen = tagList.length;
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

.theme--dark.v-card {
  background-color: #22252B;
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
