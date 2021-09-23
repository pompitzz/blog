(window.webpackJsonp=window.webpackJsonp||[]).push([[32],{519:function(v,_,t){"use strict";t.r(_);var a=t(56),i=Object(a.a)({},(function(){var v=this,_=v.$createElement,t=v._self._c||_;return t("ContentSlotsDistributor",{attrs:{"slot-key":v.$parent.slotKey}},[t("h3",{attrs:{id:"데이터-중심-애플리케이션"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#데이터-중심-애플리케이션"}},[v._v("#")]),v._v(" 데이터 중심 애플리케이션?")]),v._v(" "),t("ul",[t("li",[v._v("데이터 양, 데이터 복잡성, 데이터가 변하는 속도 등, 데이터가 주요  도전 과제인 애플리케이션을 "),t("code",[v._v("데이터 중심적(data-intensive)")]),v._v("이라고 한다.")]),v._v(" "),t("li",[v._v("반대로 CPU 사이클이 병목인 경우 "),t("code",[v._v("계산 중심적(compute-intensive)")]),v._v("이라고 한다.")])]),v._v(" "),t("h2",{attrs:{id:"chapter-1-신뢰할-수-있고-확장-가능하며-유지보수하기-쉬운-애플리케이션"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#chapter-1-신뢰할-수-있고-확장-가능하며-유지보수하기-쉬운-애플리케이션"}},[v._v("#")]),v._v(" Chapter 1. 신뢰할 수 있고 확장 가능하며 유지보수하기 쉬운 애플리케이션")]),v._v(" "),t("p",[v._v("오늘날 많은 애플리케이션은 데이터 중심적으로 많은 애플리케이션들은 DB, Cache, Search Index, Stream Processing, Batch Processing 등을 필요로 한다.")]),v._v(" "),t("p",[v._v("애플리케이션마다 요구사항은 제각기 다르고 데이터 시스템 또한 다양한 특성 및 접근 방식을 가지고 있으므로 어떤 도구와 어떤 접근 방식이 애플리케이션과 가장 적합한지 생각해야 한다.")]),v._v(" "),t("h3",{attrs:{id:"신뢰성-reliability"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#신뢰성-reliability"}},[v._v("#")]),v._v(" 신뢰성(Reliability)")]),v._v(" "),t("p",[v._v("하드웨어 결함, 소프트웨어 결함, 휴먼 에러와 같은 상황에서도 "),t("strong",[v._v("시스템은 지속적으로 올바르게 동작해야 한다.")])]),v._v(" "),t("h4",{attrs:{id:"결함-fault-과-장애-failure"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#결함-fault-과-장애-failure"}},[v._v("#")]),v._v(" 결함(fault)과 장애(failure)")]),v._v(" "),t("ul",[t("li",[v._v("잘못된 수 있는 일을 결함이라고 부른다. 결함을 예측하고 대처할 수 있는 시스템을 "),t("code",[v._v("내결함성(fault-tolerant) 또는 탄력성(resilient)")]),v._v("을 지녔다고 말한다.")]),v._v(" "),t("li",[t("strong",[v._v("결함은 장애와 동일하지 않다.")]),v._v(" 결함은 사양에서 벗어난 시스템의 한 구성요소로 정의되지만, 장애는 사용자에게 필요한 서비스를 제공하기 못하고 시스템 전체가 멈춘 경우다.\n"),t("ul",[t("li",[v._v("결함 확률을 0으로 줄이는 것을 불가능하므로, "),t("strong",[v._v("결함으로 인해 장애가 발생하지 않게 내결함성 구조를 설계하는 것이 가장 좋다.")])])])])]),v._v(" "),t("h3",{attrs:{id:"확장성-scalability"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#확장성-scalability"}},[v._v("#")]),v._v(" 확장성(Scalability)")]),v._v(" "),t("p",[v._v("시스템의 데이터 양, 트래픽 양, 복잡도등의 "),t("strong",[v._v("부하가 증가할 때 대처할 수 있는 시스템의 능력이다.")])]),v._v(" "),t("h4",{attrs:{id:"부하-기술하기"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#부하-기술하기"}},[v._v("#")]),v._v(" 부하 기술하기")]),v._v(" "),t("ul",[t("li",[v._v("현재 시스템의 부하를 간결하게 기술할 수 있어야 한다. 부하는 "),t("code",[v._v("부하 매개변수(초당 요청 수, DB Read and Write Ratio, Active User, Cache Hit Ratio 등)")]),v._v("로 나타낼 수 있다.")])]),v._v(" "),t("h4",{attrs:{id:"트위터-사례"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#트위터-사례"}},[v._v("#")]),v._v(" 트위터 사례")]),v._v(" "),t("ul",[t("li",[v._v("트위터의 주요 두 가지 동작은  "),t("code",[v._v("트윗 작성(팔로워에게 새로운 메시지 게시)과 홈 타임라인(팔로우한 사람이 작성한 트윗 확인)이다.")])]),v._v(" "),t("li",[v._v("트위터에서 확장성 문제는 주로 트윗 작성양이 아니라 해당 트윗을 팔로워에게 전파하는 것이다.")]),v._v(" "),t("li",[v._v("이를 구현하기 위한 두 가지 방법이 존재한다.\n"),t("ol",[t("li",[v._v("사용자가 홈 타임라인을 요청할 때 팔로우하는 사람들 찾아 트윗을 가져오는 쿼리를 작성한다.")]),v._v(" "),t("li",[v._v("각 사용자별 홈 타임라인 캐시를 유지하고, 트윗을 작성하면 팔로워들의 홈 타임라인 캐시에 추가한다.")])])]),v._v(" "),t("li",[v._v("평균적으로 트윗 작성보다 홈 타임라인 읽기 요청량이 훨씬 많기때문에 쓰기에 많은 일을하고, 읽기에 적은일을 하는 2번째 방식이 더 효율적이다.")]),v._v(" "),t("li",[t("strong",[v._v("팔로워가 매우 많다면?")]),v._v(" "),t("ul",[t("li",[v._v("팔로워가 3천만명이라면 2번째 방식은 트윗 작성 시 3천만건의 쓰기 요청이 필요할지도 모른다. 이런 경우엔 1번째 방식을 사용할 수 있게 하는게 효율적일 것이다.")])])]),v._v(" "),t("li",[t("strong",[v._v("트위터 사례에서 사용자당 팔로워의 분포가 부하에 큰 영항을 미치기 때문에 확장성을 논의할 때 "),t("code",[v._v("핵심 부하 매개변수")]),v._v("가 된다.")])])]),v._v(" "),t("h4",{attrs:{id:"성능-기술하기"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#성능-기술하기"}},[v._v("#")]),v._v(" 성능 기술하기")]),v._v(" "),t("ul",[t("li",[v._v("시스템의 부하를 기술하고나면 부하가 증가했을 때 어떤 일이 일어나는지 조사할 수 있다.")]),v._v(" "),t("li",[v._v("부하 매개변수를 증가시키고 시스템 자원을 유지하면 성능은 어떻게 될까?")]),v._v(" "),t("li",[v._v("부하 매개변수를 증가시켰을 때 성능을 유지하기 위해선 시스템 자원을 얼마나 늘려야 될까?")])]),v._v(" "),t("p",[v._v("위 질문을 답변하기 위해선 성능을 판단할 수 있는 수치가 필요하다.")]),v._v(" "),t("ul",[t("li",[v._v("보통 온라인 시스템에서는 "),t("code",[v._v("응답 시간(response time)")]),v._v("이 더 중요하다.")]),v._v(" "),t("li",[v._v("보통 일괄 처리 시스템에서는 "),t("code",[v._v("처리량(throughput)")]),v._v("이 더 중요하다.")])]),v._v(" "),t("h4",{attrs:{id:"지연-시간-latency-과-응답-시간-response-time"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#지연-시간-latency-과-응답-시간-response-time"}},[v._v("#")]),v._v(" 지연 시간(latency)과 응답 시간(response time)")]),v._v(" "),t("ul",[t("li",[v._v("지연 시간은 요청이 처리되길 기다리는 시간으로 서비스를 기다리며 휴지 상태인 시간을 말한다.")]),v._v(" "),t("li",[v._v("응답 시간은 클라이언트 관점에서 본 시간으로, 요청을 처리하는 실제 시간외에도 네트워크 지연과 큐 지연도 포함한다.")])]),v._v(" "),t("h4",{attrs:{id:"응답-시간은-백분위-percentile-를-사용하자"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#응답-시간은-백분위-percentile-를-사용하자"}},[v._v("#")]),v._v(" 응답 시간은 백분위(percentile)를 사용하자")]),v._v(" "),t("ul",[t("li",[v._v("응답 시간은 단순히 평균 값이 아니라 백분위를 활용하여 상황에 따라 기준에 맞게 사용하는 것이 좋다.")]),v._v(" "),t("li",[v._v("중앙값을 위해선 p50을 사용할 수 있을 것이다. 상위 백분위는 주로 p95, p99, p999가 일반적으로 사용된다.\n"),t("ul",[t("li",[v._v("p95의 응답 시간이 1.5초라면 100개 요청 중 95개의 응답시간은 1.5초 미만, 5개는 1.5초 이상을 의미한다.")])])]),v._v(" "),t("li",[v._v("아마존은 p999를 주로 사용하는데 이는 1000개 요청 중 가장 느린 1건을 포착한다. 이를 사용하는 이유는 보통 응답 시간이 가장 느린 요청을 경험한 고객들이 많은 구매를 해서 고객 중에 가장 많은 데이터를 보유한 소중한 고객이기 떄문이다.")])]),v._v(" "),t("h4",{attrs:{id:"부하-대응-접근-방식"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#부하-대응-접근-방식"}},[v._v("#")]),v._v(" 부하 대응 접근 방식")]),v._v(" "),t("ul",[t("li",[v._v("확장성은 보통 "),t("code",[v._v("용량 확장(sacle up)(수직 확장)과 규모 확장(scaling out)(수평 확장)")]),v._v("으로 구분한다.\n"),t("ul",[t("li",[v._v("가능하면 낮은 사양의 장비를 여러대로 분산할 수 있는 수평 확장이 효율적이지만 수평 확장이 어려운 서비스도 존재한다.")])])]),v._v(" "),t("li",[v._v("stateless 서비스는 수평 확장이 용이하지만 데이터 베이스와 같은 stateful 서비스의 경우엔 수평 확장을 하는데 많은 복잡성이 요구된다.")])]),v._v(" "),t("h4",{attrs:{id:"확장성을-갖춘-아키텍처"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#확장성을-갖춘-아키텍처"}},[v._v("#")]),v._v(" 확장성을 갖춘 아키텍처")]),v._v(" "),t("ul",[t("li",[v._v("모든 상황에 맞는 확장성을 보유한 아키텍처는 없다. 아키텍처를 결정하는 요소는 읽기의 양, 쓰기의 양, 저장할 데이터의 양, 응답 시간 요구사항, 접근 패턴등 다양하다.")]),v._v(" "),t("li",[v._v("1kB크기의 데이터 100,000건의 요청을 처리하는 시스템과 2GB크기의 데이터 3건의 요청을 처리하는 시스템은 서로 같은 처리량이라해도 아키텍처는 매우 다르다.")])]),v._v(" "),t("blockquote",[t("ul",[t("li",[v._v("특정 애플리케이션에 적합한 확장성을 갖춘 아키텍처는 주요 동적이 무엇이고, 잘 하지 않는 동작이 무엇인지에 대한 가정으로 구축된다. 이 가정은 "),t("code",[v._v("부하 매개변수")]),v._v("다.")]),v._v(" "),t("li",[v._v("이 가정이 잘못되면 확장에 대한 엔지니어링 노력은 헛수고가 된다. 검증되지 않은 제품의 경우 미래를 대비하기보단 빠르게 반복해서 제품 기능을 개선하는 작업이 좀 더 중요하다.")])])]),v._v(" "),t("h3",{attrs:{id:"유지보수성-maintainbility"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#유지보수성-maintainbility"}},[v._v("#")]),v._v(" 유지보수성(Maintainbility)")]),v._v(" "),t("p",[v._v("소프트웨어 비용의 대부분은 초기 개발이 아니라 지속해서 이어지는 유지보수에 들어간다. 이런 유지보수에는 버그 수정, 시스템 운영, 장애 조사, 새로운 플래폼 적응, 기술 부채 상환, 새로운 기능 추가등 다양하다.")]),v._v(" "),t("p",[v._v("유지보수성을 위한 소프트웨어 시스템 설계 원칙은 다음과 같다.")]),v._v(" "),t("h4",{attrs:{id:"운용성"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#운용성"}},[v._v("#")]),v._v(" 운용성")]),v._v(" "),t("ul",[t("li",[v._v("운영팀이 시스템을 원할하게 운영할 수 있게 쉽게 만들어라.")])]),v._v(" "),t("h4",{attrs:{id:"단순성"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#단순성"}},[v._v("#")]),v._v(" 단순성")]),v._v(" "),t("ul",[t("li",[v._v("시스템에서 복잡도를 최대한 제거해 새로운 엔지니어가 이해하기 쉽게 만들어라.")]),v._v(" "),t("li",[v._v("복잡도는 다양한 증상으로 나타난다.\n"),t("ul",[t("li",[v._v("모듈 간 강한 커플링")]),v._v(" "),t("li",[v._v("복잡한 의존성")]),v._v(" "),t("li",[v._v("일관성 없는 네이밍")]),v._v(" "),t("li",[v._v("성능 문제 해결을 위한 해키한 방식으로 특별한 케이스를 해결")])])]),v._v(" "),t("li",[v._v("이러한 복잡도를 줄이면 유지보수성이 크게 향상된다. 단순성이 시스템의 핵심 목표여야 한다.")]),v._v(" "),t("li",[t("strong",[v._v("복잡도를 제거하기 위한 최상의 도구는 "),t("code",[v._v("추상화")]),v._v("이다.")]),v._v(" "),t("ul",[t("li",[v._v("좋은 추상화는 깔끔하고 직관적인 외관 아래로 많은 세부 구현을 숨길 수 있다.")]),v._v(" "),t("li",[v._v("고수준 프로그래밍 언어는 기계 언어, CPU 레지스터, 시스템 호출을 숨긴 추상화다.")])])])]),v._v(" "),t("h4",{attrs:{id:"발전성"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#발전성"}},[v._v("#")]),v._v(" 발전성")]),v._v(" "),t("ul",[t("li",[v._v("엔지니어가 이후에 시스템을 쉽게 변경할 수 있게 하라.")]),v._v(" "),t("li",[v._v("서비스가 살아있는 한 시스템은 반드시 변경된다.")]),v._v(" "),t("li",[v._v("시스템 변경을 쉽게 하고 변화된 요구사항에 시스템을 맞추는 방법은 시스템의 간단함과 추상화에 밀접하게 관련된다.")])]),v._v(" "),t("h3",{attrs:{id:"정리"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#정리"}},[v._v("#")]),v._v(" 정리")]),v._v(" "),t("p",[v._v("애플리케이션이 유용하려면 다양한 요구사항을 충족시켜야 한다. 다양한 요구사항에는 **기능적 요구사항(데이터 저장, 조회 및 검색)**과 **비기능적 요구사항(보안, 법규 준수, 확장성, 호환성, 유지보수성)**이 있다.")]),v._v(" "),t("p",[t("strong",[v._v("신뢰성")]),v._v("은 결함이 발생해도 시스템이 올바르게 동작하게 만든다는 의미다.")]),v._v(" "),t("p",[t("strong",[v._v("확장성")]),v._v("은 부하가 증가해도 좋은 성능을 유지하기 위한 전략을 의미한다.")]),v._v(" "),t("p",[t("strong",[v._v("유지보수성")]),v._v("은 시스템에서 작업하는 엔지니어와 운영 팀의 삶을 개선하는데 있다.")])])}),[],!1,null,null,null);_.default=i.exports}}]);