package me.sun;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.function.Function;

public class TagMdMaker {
    private static final String readPath = "/Users/dongmyeonglee/Procjects/vuepress-blog/docs/.vuepress/store/tag.js";
    private static final String writePath = "/Users/dongmyeonglee/Procjects/vuepress-blog/docs/tag";

    public static void main(String[] args) throws IOException {
        Arrays.stream(Objects.requireNonNull(new File(writePath).listFiles())).forEach(File::delete);
        final List<String> tagNames = new ReaderWrapper(readPath).lineList(TagMdMaker::extractTagName, TagMdMaker::contains);
        tagNames.forEach(tagName -> {
            try (Writer writer = new FileWriter(String.format("%s/%s.md", writePath, tagName))) {
                writer.write(String.format(template(), tagName));
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
    }

    private static boolean contains(String line) {
        return line.contains("tagStore.put");
    }

    private static String extractTagName(String line) {
        final String step1 = line.split(",")[0];
        return step1.substring(step1.indexOf('\'') + 1, step1.length() - 1);
    }

    private static String template() {
        return "---\n" +
                "sidebar: false\n" +
                "sitemap:\n" +
                "    exclude: true\n" +
                "---\n" +
                "<TagMain tagName=\"%s\"/>";
    }
}
