<template>
    <div class="v-application">
        <VNavigationDrawer
                app
                right
                width="200"
                permanent
        >
            <VRow class="w-100; h-100 text-center"
                   align="center"
            >
                <VCol class="col-12">
                    <div v-for="(tag, index) in tags" v-bind:key="index">
                        <VChip
                                style="width: 150px"
                                class="mt-3 font-weight-bold"
                                :color="tag.color"
                                label
                                :to="'/tag/' + tag.tagName"
                                text-color="white"
                        >
                            <VIcon left>mdi-label</VIcon>
                            {{tag.tagName}} ({{tag.count}})
                        </VChip>
                    </div>
                </VCol>
            </VRow>
        </VNavigationDrawer>
    </div>
</template>
<script>
    export default {
        name: "TagListDrawer",
        props: ['tags']
    }
</script>

<style scoped>

</style>