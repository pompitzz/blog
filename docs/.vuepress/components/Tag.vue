<template>
    <div>
        <VChip
                class="mr-2 mt-2 font-weight-bold"
                v-for="(tag, index) in tags" v-bind:key="index"
                :color="getColor(tag)"
                @click="moveToTag('/tag/' + tag)"
                label
                small
                text-color="white"
        >
            <VIcon left>mdi-label</VIcon>
            {{tag}}
        </VChip>
    </div>
</template>

<script>
    import {getTagStore} from "../store/tag";

    export default {
        name: "Tag",
        props: ['tags', 'canRouting'],
        methods: {
            getColor(tag) {
                return getTagStore().color(tag);
            },
            moveToTag(path) {
                if (this.canRouting) {
                    this.$router.push(path).catch(() => {});
                }
            }
        }
    }
</script>

<style scoped>

</style>