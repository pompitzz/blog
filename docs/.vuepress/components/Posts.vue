<template>
    <div
            class="v-application"
            v-infinite-scroll="addNextPosts"
            infinite-scroll-distance="10">
        <v-row
                style="width: 100%"
                justify="center"
                v-if="posts.length"
        >
            <v-card
                    class="post-card"
                    v-for="(post, index) in posts"
                    :key="index"
                    :to="post.path"
                    hover
                    v-if="post.frontmatter"
            >
                <div class="post-card-img-wrapper">
                    <v-img class="post-card-img" :src="/img/ + getImgName(post)" alt=""></v-img>
                </div>
                <v-card-title class="post-card-title">{{post.frontmatter.title}}</v-card-title>
                <v-card-subtitle class="text--primary text-right">{{post.frontmatter.date}}</v-card-subtitle>
                <v-card-text class=text-center>
                    <v-chip
                            class="mr-2 font-weight-bold"
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
                if (this.posts.length === this.data.length) return;
                this.pageNumber += 1;
                const start = (this.pageNumber - 1) * this.pageItemSize;
                const end = (this.pageNumber * this.pageItemSize) > this.data.length ? this.data.length : (this.pageNumber * this.pageItemSize);
                this.data.slice(start, end).forEach(post => this.posts.push(post));
            },
            getImgName(post) {
                let number = Math.random() * 10;
                console.log(number);
                if (post.frontmatter && post.frontmatter.img) {
                    // return post.frontmatter.img
                }
                return number < 5 ? "default.png" : "effective.jpeg";
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
    .post-card {
        width: 20rem;
        margin: 1rem;
    }

    .post-card-img {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
    }

    .post-card-img-wrapper {
        position: relative;
        width: 100%;
        height: 0;
        overflow: hidden;
        padding-bottom: 40%;
    }

    .post-card-title {
        width: 100%;
        font-size: 1rem !important;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: inline-block;
        line-height: 1.5rem;
    }

    @media (max-width: 740px) {
        .post-card {
            width: 80%;
            margin-left: 10px;
            margin-right: 10px;
            margin-top: 20px;
        }
    }

    @media (max-width: 500px) {
        .post-card {
            width: 100%;
            margin-left: 10px;
            margin-right: 10px;
            margin-top: 20px;
        }
    }
</style>