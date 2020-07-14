import re

readPath = "/Users/dongmyeonglee/Procjects/vuepress-blog/docs/.vuepress/store/tag.js"
writePath = "/Users/dongmyeonglee/Procjects/vuepress-blog/docs/tag"

readlines = list(filter(lambda s: s.__contains__('tagStore.put'), open(readPath, 'r').readlines()))


def templte(_tagName):
    return f'---\n' \
           f'sidebar: false\n' \
           f'sitemap:\n' \
           f'   exclude: true\n' \
           f'---\n' \
           f'<TagMain tagName="{_tagName}"/>'


for line in readlines:
    tagWithRest = re.search('\'[A-Za-z.]+\'', line).group(0)
    tagName = tagWithRest[1:len(tagWithRest) - 1]
    writer = open(f'{writePath}/{tagName}.md', 'w')
    writer.write(templte(tagName))
