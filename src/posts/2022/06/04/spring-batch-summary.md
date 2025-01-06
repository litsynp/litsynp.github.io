---
title: "Spring Batch와 주요 클래스 정리"
date: 2022-06-04T23:55:52+09:00
draft: false
categories: ["Spring Batch"]
tags: ["Spring", "Spring Batch"]
series: ["Spring 알아보기"]
featuredImage: "https://user-images.githubusercontent.com/42485462/172010391-6e903327-fcce-4eb8-8610-5ddc51767735.png"
eleventyExcludeFromCollections: ["posts"]
---

# 배치 개발 시나리오

배치의 일반적인 시나리오는 **읽기** - **처리** - **쓰기**로 나누어진다.

# 배치 관련 객체 관계도

![Spring Batch Class Relationship](https://docs.spring.io/spring-batch/docs/4.3.5/reference/html/images/chunk-oriented-processing-with-item-processor.png)

`Job`과 `Step`은 **1:M**, `Step`과 `ItemReader`, `ItemProcessor`, `ItemWriter`는 **1:1 관계**를 갖는다.

`Job`이라는 하나의 큰 일감(`Job`)에 여러 단계(`Step`)를 두고, 각 단계를 배치의 기본 흐름대로 구현한다.

# 배치 관련 클래스 정의

## Job

`Job` 은 배치 처리 과정을 하나의 단위로 만들어 표현한 객체이다. 전체 배치 처리에 있어 항상 최상단 계층에 있다. `Job` 객체는 여러 `Step` 인스턴스를 포함하는 컨테이너다.

`Job` 객체를 만드는 빌더는 여러 개가 있다. `JobBuilderFactory`로 원하는 `Job`을 만들 수 있다. `JobBuilderFactory`의 `get()` 메서드로 `JobBuilder`를 생성하고 이를 응용하면 된다. `org.springframework.batch.core.Configuration.annotation.JobBuilderFactory`의 내부 코드이다. (길다 길어!)

```java
// org.springframework.batch.core.Configuration.annotation.JobBuilderFactory
public class JobBuilderFactory {
	private JobRepository jobRepository;

	public JobBuilderFactory(JobRepository jobRepository) {
			this.jobRepository = jobRepository;
	}

	public JobBuilder get(String name) {
			JobBuilder builder = new JobBuilder(name).repository(jobRepository);
			return builder;
	}
}
```

`get()` 메서드를 호출할 때마다 새로운 `JobBuilder` 인스턴스를 반환한다. 그리고 매번 생성할 때마다 `JobBuilderFactory` 를 생성할 때 주입받은 `JobRepository` 를 사용할 repository로 설정한다. 즉, 해당 `JobBuilderFactory` 에서 생성되는 모든 `JobBuilder` 가 동일한 리포지토리를 사용한다.

아래는 `JobBuilder` 코드 일부이다.

```java
// org.springframework.batch.core.job.builder.JobBuilder

// ...

public SimpleJobBuilder start(Step step) {
	return new SimpleJobBuilder(this).start(step);
}

public JobFlowBuilder start(Flow flow) {
	return new JobFlowBuilder(this).start(flow);
}

public JobFlowBuilder flow(Step step) {
	return new JobFlowBuilder(this).start(step);
}

// ...
```

공통점은 모두 빌더를 반환한다는 점이다. `JobBuilder`은 `Job`을 직접 생성하는 것이 아닌 별도의 구체적인 빌더를 만들어 반환한다. 이렇게 빌더를 생성하게끔 하는 이유는, 경우에 따라 `Job` 생성 방법이 다르기 때문이다. 구체적인 빌더를 구현하고 이를 통해 `Job` 생성이 이루어지게 하는 의도로 파악된다.

빌더를 받아 사용해야 하므로 불편해보이지만, 메서드 체인 방식을 이용하면 구체적인 빌더의 존재를 생각하지 않아도 될 만큼 손쉽게 처리할 수 있다.

메서드를 살펴보면 `Job`을 생성하기 위한 `Step` 또는 `Flow`를 파라미터로 받아 구체적인 빌더를 생성하고 있다. `Job`은 `Step` 또는 `Flow` 인스턴스의 **컨테이너 역할**을 하기 때문에 생성하기 전에 인스턴스를 전달받는다.

다음은 `Job` 생성 예제 코드이다.

```java
@Autowired
private JobBuilderFactory jobBuilderFactory;

@Bean
public Job simpleJob() {
    return jobBuilderFactory.get("simpleJob")  // 'simpleJob' 이라는 이름을 가진 Job을 생성할 수 있는 `JobBuilder` 객체 인스턴스 반환
                .start(simpleStep())  // `simpleStep()`은 간단한 `Step` 인스턴스를 생성해 반환하는 메서드라 가정한다. `start()` 메서드로 인해 생성되는 빌더는 `SimpleJobBuilder`
                .build();  // 'simpleJob'이라는 이름을 가진 `Job`이 생성되어 반환
}
```

### JobInstance

`JobInstance` 는 배치에서 `Job` 이 실행될 때 **하나의 `Job` 실행 단위**이다. 만약 하루에 한 번씩 배치의 `Job` 이 실행된다면, 어제와 오늘 실행한 각각의 `Job`을 `JobInstance` 라고 부를 수 있다.

그렇다면 각각의 `JobInstance` 는 하나의 `JobExecution` (`JobInstance`에 대한 한 번의 실행을 나타내는 객체)을 갖고 있을까? 그렇지 않다.

오늘 `Job`을 실행했는데 실패했다면 다음날 **동일한 `JobInstance` 를 가지고 또 실행**한다. `Job` 실행이 실패하면 `JobInstance` 가 끝난 것으로 간주하지 않기 때문이다.

그러면 `JobInstance` 는 **어제의 실패한 `JobExecution` 과 오늘 성공한 `JobExecution` 두 개**를 갖게 된다. 즉, **`JobExecution`을 여러 개 가질 수 있다.**

### JobExecution

`JobExecution` 은 `JobInstance`에 대한 한 번의 실행을 나타내는 객체이다.

위의 예제를 그대로 가져와 설명하자면, 만약 오늘의 `Job`이 실패해 내일 다시 동일한 `Job` 을 실행하면 오늘, 내일의 실행 모두 같은 `JobInstance` 를 사용할 것이다. 단, 오늘, 내일의 실행은 각기 다른 `JobExecution` 을 생성한다.

`JobExecution` 인터페이스를 보면 `Job` 실행에 대한 정보를 담고 있는 도메인 객체라는 것을 알 수 있다. `JobExecution` 은 `JobInstance`, 배치 실행 상태, 시작 시간, 끝난 시간, 실패했을 때의 메시지 등의 정보를 담고 있다.

다음은 `JobExecution` 내부의 코드이다.

```java
// org.springframework.batch.core.JobExecution
public class JobExecution extends Entity {

	private final JobParameters jobParameters;
	private JobInstance jobInstance;
	private volatile Collection<StepExecution> stepExecutions = Collections.synchronizedSet(new LinkedHashSet<>());
	private volatile BatchStatus status = BatchStatus.STARTING;
	private volatile Date startTime = null;
	private volatile Date createTime = new Date(System.currentTimeMillis());
	private volatile Date endTime = null;
	private volatile Date lastUpdated = null;
	private volatile ExitStatus exitStatus = ExitStatus.UNKNOWN;
	private volatile ExecutionContext executionContext = new ExecutionContext();
	private transient volatile List<Throwable> failureExceptions = new CopyOnWriteArrayList<>();
	private final String jobConfigurationName;

		// ...
}
```

- `jobParameters` : `Job` 실행에 필요한 매개변수 데이터.
- `jobInstance` : `Job` 실행의 단위가 되는 객체.
- `stepExecutions` : `StepExecution`을 여러 개 가질 수 있는 Collection 타입.
- `status` : `Job`의 **실행 상태**. (`COMPLETED`, `STARTING`, `STARTED`, `STOPPING`, `STOPPED`, `FAILED`, `ABANDONED`, `UNKNOWN` 등이 있다. default는 `STARTING`)
- `startTime` : `Job` 이 실행된 시간. `null` 이면 시작하지 않았다는 뜻.
- `createTime` : `JobExecution` 이 생성된 시간.
- `endTime` : `JobExecution`이 끝난 시간.
- `lastUpdated` : 마지막으로 수정된 시간.
- `exitStatus` : `Job` **실행 결과에 대한 상태**. (`UNKNOWN`, `EXECUTING`, `COMPLETED`, `NOOP`, `FAILED`, `STOPPED` 등이 있다. default는 `UNKNOWN`)
- `executionContext` : `Job` 실행 사이에 유지해야 하는 사용자 데이터가 들어 있다.
- `failureExceptions` : `Job` **실행 중 발생한 예외**를 `List` 에 넣어둔다.
- `jobConfigurationName` : `Job` 설정 이름.

### JobParameters

`JobParameters` 는 **`Job` 이 실행될 때 필요한 파라미터**들을 `Map` 타입으로 저장하는 객체이다.

`JobParameters` 는 **`JobInstance` 를 구분하는 기준**이 되기도 한다. 예를 들어 `Job` 하나를 생성할 때, 시작 시간 등의 정보를 파라미터로 해서 하나의 `JobInstance` 를 생성한다.

즉, `JobInstance`와 `JobParameters` 는 1:1 관계이다. 파라미터의 타입으로는 `String` , `Long` , `Date` , `Double` 을 사용할 수 있다.

## Step

`Step`은 실질적인 배치 처리를 정의하고 제어하는 데 필요한 모든 정보가 들어 있는 도메인 객체이다. **`Job` 을 처리하는 실질적인 단위**로 쓰인다.

**모든 `Job` 에는 1개 이상의 `Step`이 있어야 한다.**

### StepExecution

`Job` 에 `JobExecution` 이라는 `Job` 실행 정보가 있다면, `Step`에는 `StepExecution` 이라는 `Step` 실행 정보를 담는 객체가 있다. 각각의 `Step` 이 실행될 때마다 `StepExecution` 이 생성된다.

다음은 `StepExecution` 클래스이다.

```java
public class StepExecution extends Entity {

	private final JobExecution jobExecution;
	private final String stepName;
	private volatile BatchStatus status = BatchStatus.STARTING;
	private volatile long readCount = 0;
	private volatile long writeCount = 0;
	private volatile long commitCount = 0;
	private volatile long rollbackCount = 0;
	private volatile long readSkipCount = 0;
	private volatile long processSkipCount = 0;
	private volatile long writeSkipCount = 0;
	private volatile Date startTime = null;
	private volatile Date createTime = new Date(System.currentTimeMillis());
	private volatile Date endTime = null;
	private volatile Date lastUpdated = null;
	private volatile ExecutionContext executionContext = new ExecutionContext();
	private volatile ExitStatus exitStatus = ExitStatus.EXECUTING;
	private volatile boolean terminateOnly;
	private volatile long filterCount;
	private transient volatile List<Throwable> failureExceptions = new CopyOnWriteArrayList<>();

	// ...
}
```

- `jobExecution` : 현재의 `JobExecution` 정보.
- `stepName` : `Step`의 이름.
- `status` : `Step` 의 **실행 상태**. (`COMPLETED`, `STARTING`, `STARTED`, `STOPPING`, `STOPPED`, `FAILED`, `ABANDONED`, `UNKNOWN` 등이 있다. default는 `STARTING`.)
- `readCount` : 성공적으로 **읽은 레코드 수**.
- `writeCount` : 성공적으로 **쓴 레코드 수**.
- `commitCount` : `Step`의 실행에 대해 **커밋된 트랜잭션 수**.
- `rollbackCount` : `Step`의 실행에 대해 **롤백된 트랜잭션 수**.
- `readSkipCount` : 읽기에 실패해 건너뛴 레코드 수.
- `processSkipCount` : 프로세스가 실패해 건너뛴 레코드 수.
- `writeSkipCount` : 쓰기에 실패해 건너뛴 레코드 수.
- `startTime` : `Step`이 실행된 시간. `null`이면 시작하지 않았다는 뜻.
- `endTime` : `Step`의 **실행 성공 여부와 관련 없이** `Step`이 끝난 시간.
- `lastUpdated` : 마지막으로 수정된 시간.
- `executionContext` : `Step` 실행 사이에 유지해야 하는 사용자 데이터가 들어 있다.
- `exitStatus` : `Step` **실행 결과에 대한 상태**. (`UNKNOWN`, `EXECUTING`, `COMPLETED`, `NOOP`, `FAILED`, `STOPPED` 등이 있다. default는 `UNKNOWN`.)
- `terminateOnly` : `Job` 실행 중지 여부.
- `filterCount` : 실행에서 필터링된 레코드 수.
- `failureExceptions` : `Step` 실행 중 발생한 예외를 `List` 타입으로 저장한다.

## JobRepository

`JobRepository` 는 배치 처리 정보를 담고 있는 메커니즘이다. 어떤 `Job`이 실행되었으며, 몇 번 실행되었고, 언제 끝났는지 등 **배치 처리에 대한 메타데이터를 저장**한다.

예를 들어 `Job` 하나가 실행되면 `JobRepository` 에서는 배치 실행에 관련된 정보를 담고 있는 도메인인 `JobExecution` 을 생성한다.

`JobRepository` 는 `Step` 의 실행 정보를 담고 있는 `StepExecution` 도 저장소에 저장하며, 전체 메타데이터를 저장 및 관리하는 역할을 한다.

## JobLauncher

`JobLauncher` 는 `Job` , `JobParameters` 와 함께 **배치를 실행하는 인터페이스**이다. 인터페이스는 `run()` 하나이다.

```java
// org.springframework.batch.core.launch.JobLauncher
public interface JobLauncher {
	public JobExecution run(Job job, JobParameters jobParameters) throws ...
}
```

매개변수로 `Job`과 `JobParameters`를 받아 `JobExecution`을 반환한다. **매개변수가 이전과 동일하면서 이전에 `JobExecution`이 중단된 적 있다면 동일한 `JobExecution`을 반환**한다.

## ItemReader

`ItemReader`는 `Step`의 대상이 되는 **배치 데이터를 읽어오는 인터페이스**이다. 파일, XML, CSV, DB 등 여러 타입의 데이터를 읽어올 수 있다.

```java
// org.springframework.batch.item.ItemReader
public interface ItemReader<T> {
	T read() throws Exception, UnexpectedException, ParseException, NonTransientResourceException;
}
```

`ItemReader` 에서 `read()` 메서드의 반환 타입을 제네릭 `<T>` 으로 구성했기 때문에 직접 타입을 지정할 수 있다.

위에서 설명한 *읽기-처리-쓰기*에서 **읽기를 담당**한다고 볼 수 있겠다!

## ItemProcessor

`ItemProcessor` 는 `ItemReader` 로 읽어온 배치 데이터를 변환하는 역할을 수행한다.

_읽기-처리-쓰기_ 에서 **처리를 담당**한다고 볼 수 있겠다.

굳이 `ItemWriter`가 아니라 `ItemProcessor`라는 인터페이스를 분리한 이유는 두 가지다.

1. 비즈니스 로직을 분리하기 위해서이다. 각각 읽기-처리-쓰기를 담당하게 해 역할을 명확히 분리한다.
2. Input의 타입과 Output의 타입이 다를 수 있다. Input과 Output의 타입이 ItemProcesor의 제네릭 `<I, O>`에 들어가게 되니 더 직관적이다.

```java
// org.springframework.batch.item.ItemProcesor
public interface ItemProcessor<I, O> {
	O process(I item) throws Exception;
}
```

## ItemWriter

`ItemWriter` 는 배치 데이터를 저장한다. 일반적으로 DB 또는 파일에 저장한다.

읽기-처리-쓰기에서 마지막 단계인 **쓰기를 담당**한다.

```java
// org.springframework.batch.item.ItemWriter
public interface ItemWriter<T> {
	void write(List<? extends T> items) throws Exception;
}
```

`ItemWriter`은 `ItemReader`와 비슷한 방식으로 구현하면 된다.

`write()` 메서드는 `List` 자료구조를 이용해 **지정한 타입의 리스트**를 매개변수를 받는다. 리스트의 데이터 수는 설정한 **청크 (chunk) 단위**로 불러온다.

`write()` 메서드는 `void` 함수라서 반환 값은 따로 없다. 매개변수로 받은 데이터를 저장하는 로직만을 구현하면 된다.

# REF

- [<처음 배우는 스프링 부트 2> - 김영재 저](http://www.yes24.com/Product/Goods/64584833)

- [GitHub - spring-batch](https://github.com/spring-projects/spring-batch)

- [Spring Doc - Spring Batch](https://spring.io/projects/spring-batch)
