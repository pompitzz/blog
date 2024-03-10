---
title: Gradle 명령어 모음
date: 2024-03-05 18:32
img: 
    - gradle.png
tags: 
    - Gradle
---

## Dependency Tree 출력
```gradle
./gradlew dependencies >> ~/temp.txt
```

## 태스크 실행 전후 로그 추가하기
```groovy
gradle.taskGraph.beforeTask { Task task ->
    println "### beforeTask $task"
}

gradle.taskGraph.afterTask { Task task, TaskState state ->
    println "### afterTask $task $state.failure"
}
```

## 태스크 실행 전후 로그 추가 및 시간 측정
```groovy
class TimingsListener implements TaskExecutionListener, BuildListener {

    private long startTime
    private timings = []

    @Override
    void settingsEvaluated(Settings settings) {

    }

    @Override
    void projectsLoaded(Gradle gradle) {

    }

    @Override
    void projectsEvaluated(Gradle gradle) {

    }

    @Override
    void beforeExecute(Task task) {
        println "### beforeExecute $task"
        startTime = System.currentTimeMillis()
    }

    @Override
    void afterExecute(Task task, TaskState state) {
        long ms = System.currentTimeMillis() - startTime
        timings.add([ms, task.path])
        println "### afterExecute $task $state.failure took ${ms}ms"
    }

    @Override
    void buildFinished(BuildResult buildResult) {
        println "Task timings:"
        long total = 0
        timings.sort { a, b -> b[0] - a[0] }
        for (timing in timings) {
            total += timing[0]
            if (timing[0] > 0) {
                printf "%7sms %s\n", timing
            }
        }
        println "Total: ${total}ms"
    }
}

gradle.addListener new TimingsListener()
```

## 참고 자료
- [gradle user guide](https://docs.gradle.org/current/userguide/userguide.html)
- [stackoverflow - Track execution time per task in gradle script?](https://stackoverflow.com/questions/13031538/track-execution-time-per-task-in-gradle-script)
