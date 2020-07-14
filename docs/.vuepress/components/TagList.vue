<template>
    <div class="v-application">
        <VContainer>
            <VRow class="w-100 mx-auto">
                <VChip
                        class="mr-2 mt-2 font-weight-bold"
                        v-for="(tag, index) in tags" v-bind:key="index"
                        :color="tag.color"
                        :to="'/tag/' + tag.tagName"
                        label
                        text-color="white"
                >
                    <VIcon left>mdi-label</VIcon>
                    {{tag.tagName}} ({{tag.count}})
                </VChip>
            </VRow>
        </VContainer>
    </div>
</template>
<script>
    export default {
        name: "TagList",
        props: ['tags']
    }
</script>

<style scoped>

</style>