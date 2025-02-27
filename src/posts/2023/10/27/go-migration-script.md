---
title: Go에서 서버 개발에 필요한 마이그레이션 스크립트 작성하기
date: 2023-10-27T21:27:53+09:00
categories: ["go"]
featuredImage: /assets/img/0_nS60p8jhqGpjZbcU.webp
---

## 개요

최근 Go를 이용해 백엔드 서버를 작성하고 있는데요. 서버를 개발하다 보면 데이터베이스의 스키마가 달라진다던가, enum의 성격을 가진 셋업 데이터를 DB로 불러온다던가, 아니면 대량의 데이터를 한번에 DB로 로드하는 등 다양한 상황을 직면하게 됩니다.

이런 상황에서 통상적으로 스크립트를 작성하여 일련의 작업을 수행하도록 하는데, 이걸 저는 “마이그레이션 스크립트”라고 부르곤 합니다.

특히 이미 배포를 나간 서버에서는 스크립트를 통해 데이터를 불러오면 좀 더 편리하게 데이터를 불러올 수 있습니다.

이번 글에서는 마이그레이션 스크립트를 작성하는 방법을 소개하고자 합니다.

## 패키지는 어떻게?

Go에서 main 함수들은 통상적으로 cmd 경로에 들어갑니다. ([참고](https://github.com/golang-standards/project-layout?tab=readme-ov-file#cmd))
그렇다면 우리의 서버 애플리케이션도 cmd 경로 안에 있겠죠. 이런 식으로:

```
cmd/
├── server.go
├── program1.go
├── program2.go
└── program3/
    ├── main.go
    └── package1/
        └── ...
...
```

참고로 실행가능한 프로그램이 되려면 main 함수는 main 패키지에 존재해야 합니다.

```go
package main

import "fmt"

func main() {
	fmt.Print("Hello, world!")
}
```

Go는 보통 다른 언어를 사용하다가 온 개발자가 유독 많은 언어인 것 같은데요. 그래서 프로젝트 구조 및 패키지 관리 간에 몇 가지 주의할 점이 있습니다.

1. Go에서는 경로와 패키지는 다릅니다.
2. Go에서는 같은 경로에 있는 파일이 모두 같은 패키지에 있어야 합니다.

1번부터 이야기해봅시다.

> 1. Go에서는 경로와 패키지는 다릅니다.

Java와 같은 언어는 패키지 관리를 이렇게 하곤 합니다. 먼저 폴더를 이렇게 생성합니다.

```
src/
└── com/
    └── litsynp/
        └── math/
            └── Calculator.java
```

그러면 패키지명도 경로와 동일하게 작성해야 합니다.

```java
package com.litsynp.math; // 경로와 매칭

public class Calculator {
    // ...
}
```

이건 Python 같은 언어에서도 비슷하게, 패키지 경로로 절대경로든 상대경로든 경로명이 들어가게 됩니다.

그런데 Go의 경우에는 경로를 어떻게 지정하든, 패키지명은 달라도 됩니다. 예를 들어 경로가 다음과 같다면:

```
somedir/
├── runner.go
├── parser.go
└── lexer.go
```

runner.go의 패키지명은 이렇게 해도 되지만:

```go
package pkg1

func runner() {
	// ...
}
```

이렇게 해도 된다는 뜻입니다.

```go
package randompackage

func runner() {
	// ...
}
```

참고로 여기서 유추할 수 있는 사실이 있는데요. Go 프로젝트에서 경로를 아무리 중첩하더라도 패키지명은 중첩할 수 없습니다. 즉, 이런 게 안됩니다:

```go
package something.cool // 중첩 package 문법은 존재하지 않습니다.

// ...
```

2번째로 넘어갑니다.

> 2. Go에서는 같은 경로에 있는 파일이 모두 같은 패키지에 있어야 합니다.

바로 위의 예시를 그대로 가져와보면, runner.go, parser.go, lexer.go 모두 같은 경로에 있으므로, 패키지명도 같아야 한다는 겁니다. 하나라도 패키지명이 다르면 컴파일 에러가 일어납니다.

이제 경로와 패키지 설정에 대한 주의사항을 마쳤으니, 우리의 마이그레이션 스크립트는 어디에 위치해야할지 결정해봅시다.

```
cmd/
├── server.go
└── migratedata/
    ├── main.go
    └── services/
        └── ...
...
```

이 정도면 적당할 것 같습니다. migratedata(또는 migrate_data) 경로 안에 main.go를 넣었습니다. services 경로 안에는 마이그레이션 스크립트에 들어갈 비즈니스 로직과 테스트 코드를 넣을 수 있겠네요.

## 마이그레이션 스크립트 작성하기

이제 예시와 함께 스크립트를 작성해보겠습니다.

우리의 앱은 반려견과 반려묘를 키우는 사람들을 위한 커뮤니티 애플리케이션입니다.

요구사항은 다음과 같습니다:

1. 스크립트를 실행할 때 CLI에서 넘긴 매개변수에 따라 견종만 불러올지, 묘종만 불러올지, 아니면 모두 불러올지를 결정할 수 있습니다.
2. 구글 스프레드 시트에 저장된 견종, 묘종 데이터를 불러옵니다.
3. 불러온 견종, 묘종 데이터를 DB에 적재해야 합니다.

CLI 프로그램의 시작은 대개 **매개변수(flag)를 읽는 것**부터 진행합니다. Go에서 [flag라는 스탠다드 라이브러리](https://pkg.go.dev/flag)를 제공합니다.

```go
package main

import "flag"

func main() {
	flags := parseFlags()

	// ... do something with parsed flags
}

type PetTypeToImport string

const (
	Cat PetTypeToImport = "cat"
	Dog PetTypeToImport = "dog"
	All PetTypeToImport = "all"
)

func fromString(breedToImport string) PetTypeToImport {
	switch breedToImport {
	case "cat":
		return Cat
	case "dog":
		return Dog
	default:
		return All
	}
}

type Flags struct {
	petTypeToImport PetTypeToImport
}

func parseFlags() Flags {
	flag.String("petType", "", "Pet type to import to database")
	flag.Parse()

	petTypeToImportArg := flag.Arg(0)

	petTypeToImport := fromString(petTypeToImportArg)

	return Flags{petTypeToImport: petTypeToImport}
}
```

이런 식으로 parseFlags 함수를 만들고 여기서 데이터의 validation 처리를 진행합니다.

flag.Arg(0)을 이용해 첫 번째 플래그를 받아오는데, 이 플래그에서 견종 또는 묘종을 불러올지 선택합니다. “cat”을 읽어들이면 묘종, “dog”를 읽어들이면 견종, 나머지 경우엔 모두 불러옵니다. fromString 함수는 enum의 파싱을 위한 부분입니다.

모두 읽어들였다면 Flags라는 struct를 반환합니다.

스프레드시트를 읽는 부분은 구글에서 [Go용 Google API 라이브러리](https://github.com/googleapis/google-api-go-client)를 제공하고 있습니다. 해당 라이브러리를 사용해서 진행하면 되는데, 설명은 코드로 대체하겠습니다.

참고로 입력으로 들어가는 스프레드시트는 이렇게 생겼습니다. 첫 번째 시트는 묘종, 두 번째 시트는 견종입니다. 두 번째 컬럼에 종류 이름이 들어갑니다.

![스프레드시트 예시](/assets/img/1_3jG_VW0ZDve3084IOJe3qg.webp)

스프레드시트로부터 견종/묘종을 불러오는 BreedsImporterService를 만듭니다. 이전에 만들었던 services/breeds_importer_service.go에 넣겠습니다.

```go
package breeds_importer_service

import (
	"context"

	"google.golang.org/api/option"
	"google.golang.org/api/sheets/v4"
)

const catSheetIndex = 0
const dogSheetIndex = 1

type BreedsImporterService struct {
	client *sheets.Service
}

func NewBreedsImporterService(ctx context.Context, apiKey string) (*BreedsImporterService, error) {
	client, err := sheets.NewService(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return nil, err
	}

	return &BreedsImporterService{client: client}, nil
}

func (c *BreedsImporterService) GetSpreadsheet(spreadsheetId string) (*sheets.Spreadsheet, error) {
	resp := c.client.Spreadsheets.Get(spreadsheetId)
	resp.IncludeGridData(true)
	spreadsheet, err := resp.Do()

	if err != nil {
		return nil, err
	}

	return spreadsheet, nil
}

func (c *BreedsImporterService) GetCatNames(spreadsheet *sheets.Spreadsheet) []Row {
	var catRows []Row

	var catsSheet *sheets.Sheet = spreadsheet.Sheets[catSheetIndex]
	for _, row := range catsSheet.Data[0].RowData[1:] {
		if len(row.Values) == 0 {
			continue
		}

		catRows = append(catRows, parseRow(row))
	}

	return catRows
}

func (c *BreedsImporterService) GetDogNames(spreadsheet *sheets.Spreadsheet) []Row {
	var dogRows []Row

	var dogsSheet *sheets.Sheet = spreadsheet.Sheets[dogSheetIndex]
	for _, row := range dogsSheet.Data[0].RowData[1:] {
		if len(row.Values) == 0 {
			continue
		}

		dogRows = append(dogRows, parseRow(row))
	}

	return dogRows
}

type Row struct {
	Breed string
}

func parseRow(row *sheets.RowData) Row {
	return Row{
		Breed: row.Values[1].FormattedValue,
	}
}
```

사실 service의 struct 정의에 들어가는 client는 DI 간 필요한 메소드만 추출해서 인터페이스화 시키면 테스트에 더 용이합니다만, 그러면 설명이 길어지니 넘어가겠습니다.

New로 시작하는 생성자 함수로 service를 초기화하고, **GetSpreadSheet**으로 스프레드시트 데이터를 불러옵니다.

이후, **GetCatNames**와 **GetDogNames**로, 각 시트의 row에 있는 견종/묘종 데이터를 한 줄씩 불러와 배열에 추가하는 방식입니다.

즉, 이름 그대로, 스프레드시트에서 데이터만 불러오는 서비스입니다.

이제 데이터베이스 접근을 해야 합니다. 데이터베이스 접근을 위해 store(~=repository)를 만듭니다. 이름은 BreedStore로 하겠습니다. 데이터베이스에 접근하는 방식은 사람마다, 프로젝트마다 다르니 저만의 방식으로 하겠습니다.

저는 주로 store를 인터페이스화시키고, Postgres를 쓰면 Postgres 구현체를 만들곤 합니다.

Store 생성자를 이용해 store를 초기화시켜줍니다.

```go
breedStore := postgres.NewBreedPostgresStore(db)
```

우리의 스크립트에 row 하나에 있는 견종/묘종 정보를 DB에 저장하는 함수인 importBreed 함수를 추가합니다.

```go
func importBreed(breedStore pet.BreedStore, petType pet.PetType, row breeds_importer_service.Row) (*pet.Breed, error) {
	log.Printf("Importing breed with pet_type: %s, name: %s to database", petType, row.Breed)

	existing, err := breedStore.FindBreedByPetTypeAndName(petType, row.Breed)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return nil, err
	}

	if existing != nil {
		log.Printf("Breed with id: %d, pet_type: %s, name: %s already exists in database", existing.ID, existing.PetType, existing.Name)
		return existing, nil
	}

	breed, err := breedStore.CreateBreed(&pet.Breed{
		PetType: petType,
		Name:    row.Breed,
	})

	if err != nil {
		return breed, err
	}

	log.Printf("Succeeded to import breed with id: %d, pet_type: %s, name: %s to database", breed.ID, breed.PetType, breed.Name)
	return breed, nil
}

```

이제 스크립트에서는 스프레드시트를 읽는 코드와 DB에 저장하는 코드가 들어가면 핵심 로직은 완료입니다.

```go
switch flags.petTypeToImport {
	case Cat:
		var catRows = client.GetCatNames(spreadsheet)
		importBreeds(breedStore, pet.PetTypeCat, &catRows)
		break
	case Dog:
		var dogRows = client.GetDogNames(spreadsheet)
		importBreeds(breedStore, pet.PetTypeDog, &dogRows)
		break
	case All:
		var catRows = client.GetCatNames(spreadsheet)
		var dogRows = client.GetDogNames(spreadsheet)

	importBreeds(breedStore, pet.PetTypeCat, &catRows)
	importBreeds(breedStore, pet.PetTypeDog, &dogRows)
}
```

이제 최종적으로 main 함수는 이렇게 됩니다.

```go
func main() {
	flags := parseFlags()

	log.Printf("Starting to import pet types: %s to database\n", flags.petTypeToImport)

	db, err := database.Open(configs.DatabaseURL)

	if err != nil {
		log.Fatalf("error opening database: %v\n", err)
	}

	breedStore := postgres.NewBreedPostgresStore(db)

	ctx := context.Background()
	client, err := breeds_importer_service.NewBreedsImporterService(ctx, configs.GoogleSheetsAPIKey)

	if err != nil {
		log.Fatalf("error initializing google sheets client: %v\n", err)
	}

	spreadsheet, err := client.GetSpreadsheet(configs.BreedsGoogleSheetsID)

	switch flags.petTypeToImport {
	case Cat:
		var catRows = client.GetCatNames(spreadsheet)
		importBreeds(breedStore, pet.PetTypeCat, &catRows)
		break
	case Dog:
		var dogRows = client.GetDogNames(spreadsheet)
		importBreeds(breedStore, pet.PetTypeDog, &dogRows)
		break
	case All:
		var catRows = client.GetCatNames(spreadsheet)
		var dogRows = client.GetDogNames(spreadsheet)

		importBreeds(breedStore, pet.PetTypeCat, &catRows)
		importBreeds(breedStore, pet.PetTypeDog, &dogRows)
	}

	log.Println("Completed importing pet types to database")
}
```

1. flag를 이용해 플래그(매개변수)를 읽어줍니다.
2. db 인스턴스를 초기화해서 store를 생성합니다.
3. 구글 스프레드시트에 있는 데이터를 읽어옵니다.
4. flag에 따라 옵션을 적용해 데이터를 한 줄씩 DB에 저장합니다.
5. 결과를 출력합니다.

실행할 때는 다음과 같은 방식으로 하면 됩니다.

```bash
$ go run cmd/migratedata/main.go
```

미흡한 부분이 많은 코드입니다만, 정성을 들이면 테스트 용이성과 성능도 잡아볼 순 있을 것 같습니다. 하지만 그렇게 하지 않은 이유는, 일회성 스크립트이기 때문이기도 하고 워낙 간단한 로직이기 때문입니다.

자세한 코드는 다음 레포에서 확인하실 수 있습니다.

- [https://github.com/pet-sitter/pets-next-door-api](https://github.com/pet-sitter/pets-next-door-api)

심심하면 제 GitHub도 놀러오세요: [https://github.com/litsynp](https://github.com/litsynp)

읽어주셔서 감사합니다!
