package me.sun;

import me.sun.exceoption.AlreadyReadException;
import me.sun.exceoption.FileReadException;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;
import java.util.function.Predicate;

public class ReaderWrapper implements AutoCloseable{
    private BufferedReader reader;
    private boolean isAllRead;

    public ReaderWrapper(String path) {
        try {
            reader = new BufferedReader(new FileReader(path));
        } catch (FileNotFoundException e) {
            throw new IllegalArgumentException("Can't not read File. Please check the path: " + path);
        }
    }

    public List<String> lineList() {
        validIsRead();
        try {
            return readAllLinesAndMakeList(Function.identity());
        } finally {
            done();
        }
    }

    public List<String> lineList(Function<String, String> function, Predicate<String> predicate) {
        validIsRead();
        try {
            return readAllLinesAndMakeList(function, predicate);
        } finally {
            done();
        }
    }

    public List<String> lineList(Function<String, String> function) {
        validIsRead();
        try {
            return readAllLinesAndMakeList(function);
        } finally {
            done();
        }
    }

    private List<String> readAllLinesAndMakeList(Function<String ,String> function) {
        List<String> lines = new ArrayList<>();
        String line = null;
        while ((line = readLine()) != null) {
            lines.add(function.apply(line));
        }
        return lines;
    }

    private List<String> readAllLinesAndMakeList(List<Predicate<String>> predicates) {
        List<String> lines = new ArrayList<>();
        String line = null;
        readLoop:
        while ((line = readLine()) != null) {
            for (Predicate<String> predicate : predicates) {
                if (predicate.test(line)) continue readLoop;
            }
            lines.add(line);
        }
        return lines;
    }

    private List<String> readAllLinesAndMakeList(Predicate<String> predicates) {
        List<String> lines = new ArrayList<>();
        String line = null;
        while ((line = readLine()) != null) {
            if (predicates.test(line)) continue;
            lines.add(line);
        }
        return lines;
    }

    private List<String> readAllLinesAndMakeList(Function<String, String> function, Predicate<String> predicates) {
        List<String> lines = new ArrayList<>();
        String line = null;
        while ((line = readLine()) != null) {
            if (!predicates.test(line)) continue;
            lines.add(function.apply(line));
        }
        return lines;
    }

    private String readLine() {
        try {
            return reader.readLine();
        } catch (IOException e) {
            throw new FileReadException();
        }
    }

    private void done() {
        try {
            reader.close();
            isAllRead = true;
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void validIsRead() {
        if (isAllRead) throw new AlreadyReadException("Already read this file");
    }

    @Override
    public void close() throws Exception {
        reader.close();
    }
}
