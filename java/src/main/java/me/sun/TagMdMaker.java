package me.sun;

import java.io.*;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;

public class TagMdMaker {
  public static void main(String[] args) throws IOException {
    final String targetTagPath = "/Users/dongmyeonglee/Procjects/vuepress-blog/docs/.vuepress/store/tag.js";
    final String saveMdPath = "/Users/dongmyeonglee/Procjects/vuepress-blog/docs/tag";
    final String key = "tagStore.put";
    final Set<String> alreadyExistFiles = Arrays.stream(Objects.requireNonNull(new File(saveMdPath).listFiles())).map(File::getName).collect(toSet());

    try (BufferedReader reader = new BufferedReader(new FileReader(targetTagPath))) {
      final List<String> tagNames = reader.lines()
          .filter(line -> line.contains(key))
          .map(TagMdMaker::extractTagName)
          .collect(toList());
      for (String tagName : tagNames) {
        String fileName = tagName + ".md";
        if (alreadyExistFiles.contains(fileName)) continue;
        final String template = tagMdTemplate(tagName);
        try (FileWriter writer = new FileWriter(saveMdPath + "/" + fileName)) {
          writer.write(template);
        }
      }
    }
  }

  private static String extractTagName(String line) {
    // "tagStore.put('Java', new Tag('Java', '#eb2025'))";
    final String step1 = line.split(",")[0];
    return step1.substring(step1.indexOf('\'') + 1, step1.length() - 1);
  }

  private static String tagMdTemplate(String tagName) {
    return String.format(
            "---\n" +
            "sidebar: false\n" +
            "---\n" +
            "<TagMain tagName=\"%s\"/>", tagName);
  }
}
