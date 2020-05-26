<template>
    <div>
        <v-chip
                class="mr-2 font-weight-bold"
                v-for="(tag, index) in tags" v-bind:key="index"
                :color="getColor(tag)"
                @click="moveToTag('/tag/' + tag)"
                label
                small
                text-color="white"
        >
            <v-icon left>mdi-label</v-icon>
            {{tag}}
        </v-chip>
    </div>
</template>

<script>
    import {getTagStore} from "../utils/tag";

    export default {
        name: "Tag",
        props: ['tags', 'noneRouing'],
        methods: {
            getColor(tag) {
                return getTagStore().color(tag);
            },
            moveToTag(path) {
                if (this.noneRouing === false) return;
                this.$router.push(path).catch(() => {});
            }
        }
    }
</script>

<style scoped>

</style>