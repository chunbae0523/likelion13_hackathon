# likelion13_hackathon
멋쟁이사자처럼 syu 13기 중앙해커톤 지역 소통 프로젝트

### 깃 브랜치 사용 규칙

main
- 완성된 안정적인 코드만 모여있는 브랜치입니다.

dev
- 개발 중인 기능들이 모이는 통합 브랜치입니다.

feature/기능명
- 각자 맡은 기능을 개발하는 브랜치입니다.
- 예) feature/login, feature/community


dev 브랜치에서 작업할 기능별 feature/기능명 브랜치를 만듭니다.

기능 개발을 완료한 뒤, feature 브랜치에서 dev 브랜치로 Pull Request를 요청합니다.

코드 리뷰 후 문제가 없으면 dev 브랜치에 병합합니다.

모든 기능이 모이고 테스트가 완료되면 dev 브랜치 내용을 main 브랜치에 병합합니다.

### 중요
main 브랜치는 직접 작업하지 않습니다.

작업 전 항상 최신 dev 브랜치를 받아서 시작합니다.

충돌이 발생하면 빠르게 해결하고 공유합니다.


main:완성본
dev:개발 완료한 기능(안정성 확인 안됨)
feature/기능명:각자 맡은 기능<--새로 만들어야함

dev 브랜치로 이동 + 최신화
git checkout dev
git pull origin dev

새 기능 브랜치 생성
git checkout -b feature/login

작업 내용 커밋
git add .
git commit -m "feat: 로그인 기능 구현"

레포지토리로 푸시 (깃허브에 브랜치 생성됨)
git push origin feature/login

기능 개발완료->feature/기능명->리뷰 후 문제 없으면 dev 병합-> 모든 기능 통합+테스트 완료->main


# 중요!!!!!!!!!!
절대 dev에서 직접 작업하지 마세요 (다른 사람이 작업한 코드가 날아가거나 덮어씌워질 수 있습니다..........)
