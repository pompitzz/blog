<template>
    <div
            class="v-application"
            v-infinite-scroll="addNextPosts"
            infinite-scroll-distance="10">
        <v-row
                class="posts"
                v-if="posts.length"
        >
            <v-card
                    class="post my-card"
                    v-for="(post, index) in posts"
                    :key="index"
                    :to="post.path"
                    hover
            >
                <div class="img-div">
                    <v-img class="white--text align-end img" :src="/img/ + post.frontmatter.img" alt=""></v-img>
                </div>
                <v-card-title>{{post.frontmatter.title}}</v-card-title>
                <v-card-subtitle class="text--primary text-right">{{post.frontmatter.date}}</v-card-subtitle>
                <v-card-text class=text-center>
                    <v-chip
                            class="tag"
                            v-for="(tag, index) in post.frontmatter.tags" v-bind:key="index"
                            :color="colors[index]"
                            label
                            @click="goTagPage(tag)"
                            small
                            text-color="white"
                    >
                        <v-icon left>mdi-label</v-icon>
                        {{tag}}
                    </v-chip>
                </v-card-text>
            </v-card>
        </v-row>
    </div>
</template>

<script>
    import html from '../utils/htmlUtils'
    import "vuetify/dist/vuetify.min.css";
    import "vuetify/dist/vuetify"

    export default {
        props: ["page"],
        data() {
            return {
                posts: [],
                data: [],
                colors: ['blue', 'green', 'yellow accent-4'],
                pageNumber: 0,
                pageItemSize: 10,
            }
        },
        methods: {
            addNextPosts() {
                this.pageNumber += 1;
                const start = (this.page - 1) * this.pageItemSize;
                const end = (this.page * this.pageItemSize) > this.data.length ? this.data.length : (this.page * this.pageItemSize);
                this.posts.push(this.data.slice(start, end));
            }
        },
        created() {
            let currentPath = this.page ? this.path : this.$page.path;
            console.log(this.$site.pages);
            this.data = html(currentPath, this.$site.pages).sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
            this.pageNumber = 1;
            this.posts = this.data.slice(0, this.pageItemSize);
        }
    }
</script>

<style scoped>
    .my-card {
        width: 20rem;
        margin: 1rem;
    }

    .img {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
    }

    .img-div {
        position: relative;
        width: 100%;
        height: 0;
        overflow: hidden;
        padding-bottom: 40%;
    }

    .tag {
        margin-right: 10px;
    }

    @media (max-width: 740px) {
        .my-card {
            width: 80%;
            margin-left: 10px;
            margin-right: 10px;
            margin-top: 20px;
        }
    }

    @media (max-width: 500px) {
        .my-card {
            width: 100%;
            margin-left: 10px;
            margin-right: 10px;
            margin-top: 20px;
        }
    }
</style>