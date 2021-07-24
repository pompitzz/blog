(window.webpackJsonp=window.webpackJsonp||[]).push([[30],{511:function(s,t,a){"use strict";a.r(t);var n=a(56),e=Object(n.a)({},(function(){var s=this,t=s.$createElement,a=s._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("p",[s._v("실무를 하면서 참고하면 좋다고 생각이 드는 아이템들만 정리하였습니다.")]),s._v(" "),a("h2",{attrs:{id:"item-1-생성자-대신-정적-팩터리-메서드를-고려하라"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#item-1-생성자-대신-정적-팩터리-메서드를-고려하라"}},[s._v("#")]),s._v(" ITEM 1. 생성자 대신 정적 팩터리 메서드를 고려하라.")]),s._v(" "),a("h4",{attrs:{id:"장점"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#장점"}},[s._v("#")]),s._v(" 장점")]),s._v(" "),a("ol",[a("li",[s._v("생성자와 달리 명시적인 이름을 가질 수 있다.")]),s._v(" "),a("li",[s._v("인스턴스를 캐싱하여 재활용할 수 있다.")]),s._v(" "),a("li",[s._v("반환 타입의 하위 타입 객체를 반환할 수 있어 유연성이 좋다.\n"),a("ul",[a("li",[s._v("자바 8 전에는 인터페이스에 static 메서드를 선언할 수 없어 주로 동반 클래스를 만들어서 정적 팩터리를 제공함.(List -> Lists)")]),s._v(" "),a("li",[s._v("자바 8부터는 인터페이스에 static 메서드를 선언할 수 있으므로 동반 클래스를 만들 필요가 별로 없음.")])])]),s._v(" "),a("li",[s._v("매개변수 값에 따라 서로 다른 객체를 반환할 수 있다.\n"),a("ul",[a("li",[s._v("매개변수에 따라 최적화된 객체를 제공할 수 있음.")])])]),s._v(" "),a("li",[s._v("코드를 작성하는 시점에 반환할 객체의 클래스가 존재하지 않아도 된다.\n"),a("ul",[a("li",[s._v("JDBC에서 Driver를 등록하고 Connection을 가져올 때 활용하는 방식이다.")]),s._v(" "),a("li",[s._v("JDBC를 사용할 때 "),a("code",[s._v("Class.forName(Driver)")]),s._v(" 혹은 "),a("code",[s._v("DriverManager.registerDrivers(Driver)")]),s._v("으로 Driver를 등록하고 "),a("code",[s._v("DriverManager.getConnection()")]),s._v("을 통해 Connection을 가져온다.")]),s._v(" "),a("li",[a("code",[s._v("DriverManager.getConnection()")]),s._v("를 작성하는 시점엔 반환할 특정 Driver의 Connection 클래스를 모른채로 코드를 작성할 수 있다.")])])])]),s._v(" "),a("h4",{attrs:{id:"단점"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#단점"}},[s._v("#")]),s._v(" 단점")]),s._v(" "),a("ol",[a("li",[s._v("정적 팩터리 메서드만 제공하면 상속이 불가능하다.\n"),a("ul",[a("li",[s._v("정적 팩터리 메서드만 제공하기 위해 생성자를 private로 만들면 상속 불가능")])])]),s._v(" "),a("li",[s._v("코드 상으로 정적 팩터리 메서드를 찾기 어려울 수 있다.\n"),a("ul",[a("li",[s._v("Naming convention 지키면 문제를 완화할 수 있음.")])])])]),s._v(" "),a("h4",{attrs:{id:"정적-패터리-메서드-naming-convention"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#정적-패터리-메서드-naming-convention"}},[s._v("#")]),s._v(" 정적 패터리 메서드 Naming Convention")]),s._v(" "),a("p",[a("strong",[s._v("from")])]),s._v(" "),a("ul",[a("li",[s._v("하나의 매개변수를 받아 인스턴스를 생성")]),s._v(" "),a("li",[a("code",[s._v("Date d = Date.from(instant);")])])]),s._v(" "),a("p",[a("strong",[s._v("of")])]),s._v(" "),a("ul",[a("li",[s._v("여러 매개변수를 받아 인스턴스를 생성")]),s._v(" "),a("li",[a("code",[s._v('Set<String> stringSet = Set.of("1", "2")')])])]),s._v(" "),a("p",[a("strong",[s._v("type")])]),s._v(" "),a("ul",[a("li",[s._v("생성할 클래스가 아닌 다른 클래스에 팩터리 메서드를 정의할 때 반환할 객체를 명시하기 위해 사용")]),s._v(" "),a("li",[a("code",[s._v("List<String> stringList = Collections.list()")])])]),s._v(" "),a("p",[a("strong",[s._v("instance, getInstance")])]),s._v(" "),a("ul",[a("li",[s._v("매개변수로 명시한 인스턴스를 반환 하지만 같은 인스턴스임을 보장하진 않는다.")])]),s._v(" "),a("p",[a("strong",[s._v("create, newInstance")])]),s._v(" "),a("ul",[a("li",[s._v("메번 새로운 인스턴스를 반환함을 보장한다.")])]),s._v(" "),a("h2",{attrs:{id:"item-3-private-생성자나-열거-타입으로-싱글턴임을-보증하라"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#item-3-private-생성자나-열거-타입으로-싱글턴임을-보증하라"}},[s._v("#")]),s._v(" ITEM 3. private 생성자나 열거 타입으로 싱글턴임을 보증하라.")]),s._v(" "),a("h3",{attrs:{id:"private-생성자-방식"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#private-생성자-방식"}},[s._v("#")]),s._v(" private 생성자 방식")]),s._v(" "),a("div",{staticClass:"language-java line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-java"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// #1 public static final 이용")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("public")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("class")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Elvis")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("public")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("static")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("final")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Elvis")]),s._v(" INSTANCE "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("new")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Elvis")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("private")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Elvis")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// #2 정적 팩터리 이용")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("public")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("class")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Elvis")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("private")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("static")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("final")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Elvis")]),s._v(" INSTANCE "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("new")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Elvis")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("private")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Elvis")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("public")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("static")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Elvis")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("getInstance")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("return")]),s._v(" INSTANCE"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br")])]),a("ul",[a("li",[s._v("정적 팩터리 방식은 원할 때 클라이언트 변경없이 싱글턴을 반환하지 않도록 수정이 가능하다. 이런 장점이 필요 없다면 public가 간결하다.")])]),s._v(" "),a("blockquote",[a("p",[s._v("직렬화나 리플렉션에 의해 싱글턴 보장이 되지 않을 수 있는데 실무에서 이를 고려해야하는 경우는 아직 보지 못했다.")])]),s._v(" "),a("h3",{attrs:{id:"enum-방식"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#enum-방식"}},[s._v("#")]),s._v(" enum 방식")]),s._v(" "),a("div",{staticClass:"language-java line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-java"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("public")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("enum")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Elvis")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    INSTANCE\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br")])]),a("ul",[a("li",[s._v("간결하게 싱글턴을 보장할 수 있고 직렬화나 리플렉션 문제도 없다.")]),s._v(" "),a("li",[a("strong",[s._v("저자는 이 방식을 추천한다.")])])]),s._v(" "),a("h2",{attrs:{id:"item-6-불필요한-객체-생성을-피하라"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#item-6-불필요한-객체-생성을-피하라"}},[s._v("#")]),s._v(" ITEM 6. 불필요한 객체 생성을 피하라.")]),s._v(" "),a("ul",[a("li",[s._v("불필요한 객체 생성은 피하기 위해 객체 재사용은 효율적이지만 "),a("strong",[s._v("방어적 복사가 필요한 상황에서 객체를 재사용 했을 때의 피해가, 불필요한 객체를 반복 생성한 경우보다 훨씬 크다는 것을 인지하자.")])]),s._v(" "),a("li",[s._v("불필요한 객체 생성으로 인한 피해는 그저 코드 형태와 성능에만 영향을 준다.")])])])}),[],!1,null,null,null);t.default=e.exports}}]);