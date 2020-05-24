<template>
    <div class="v-application">
        <v-row style="width: 100%">
            <v-row style="width: 100%">
                <div class="content-title">
                    <h1>{{title}}</h1>
                </div>

                <v-row class="px-5">
                    <v-col class="pb-0">
                        <v-chip
                                class="mr-2 font-weight-bold"
                                v-for="(tag, index) in tags" v-bind:key="index"
                                :color="'#000000'"
                                label
                                small
                                text-color="white"
                        >
                            <v-icon left>mdi-label</v-icon>
                            {{tag}}
                        </v-chip>
                    </v-col>
                    <v-col class="pb-0">
                        <div class="text--primary text-right">
                            <div>작성일: {{date}}</div>
                        </div>
                    </v-col>
                </v-row>
                <hr class="content-divider">
            </v-row>
        </v-row>
    </div>
</template>

<script>
    export default {
        name: "ContentTitle.vue",
        data() {
            return {
                title: '',
                tags: ["SPRING", "ANYTAGS"],
                date: '',
            }
        },
        beforeMount() {
            const frontmatter = this.$page.frontmatter;
            this.title = frontmatter.title;
            this.tags = frontmatter.tags;
            this.date = frontmatter.date;
        }
    }
</script>

<style scoped>
    .content-title {
        width: 100%;
        text-align: center;
    }

    .content-divider {
        width: 100%;
        margin-top: 1rem;
        margin-bottom: 1rem;
    }
</style>