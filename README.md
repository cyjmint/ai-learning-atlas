# Frontier AI Atlas

AI 기술의 출발점부터 현대 프론티어 AI의 작동 방식까지 **인과관계 중심의 단일 경로**로 체계적으로 학습하는 인터랙티브 웹 가이드입니다.

- **라이브 웹페이지**: https://cyjmint.github.io/ai-learning-atlas/
- **GitHub 저장소**: https://github.com/cyjmint/ai-learning-atlas

---

## 주요 특징

- **2단계 학습 깊이 모드**
  - **직관 모드(기본)**: 수식 없이 비유, 도식, 인터랙티브 시뮬레이터를 통해 핵심 원리를 직관적으로 이해합니다.
  - **심화 모드(토글)**: 필요할 때 토글을 전환해 KaTeX 핵심 수식, 원문 논문 요약, 구현 포인트를 즉시 펼쳐볼 수 있습니다.
- **3단 인과관계 서사**
  - 모든 단계가 **이전 기술의 한계 → 핵심 작동 원리 → 다음 단계로 이어지는 이유** 흐름으로 구성되어 기술 간 맥락을 놓치지 않도록 설계했습니다.
- **인터랙티브 시뮬레이터 5종**
  - 별도 백엔드 없이 브라우저에서 즉시 파라미터를 조절하고 결과를 확인할 수 있는 체험형 시각화 도구를 제공합니다.
- **엄선된 외부 자료 큐레이션**
  - 단계당 2-4개의 핵심 자료를 언어, 자막 지원 여부, 난이도, 예상 소요시간 배지와 함께 연결합니다.
- **로컬 진도 저장 및 JSON 백업**
  - 별도의 회원가입이나 로그인 없이 `localStorage`에 학습 진도가 자동 저장되며, JSON 파일로 내보내기·가져오기 및 초기화를 지원합니다.
- **에디토리얼 UI 및 PWA 지원**
  - 읽기 집중도를 높이는 1단 에디토리얼 레이아웃, 라이트/다크 테마 전환, PWA 설치를 지원합니다.

---

## 커리큘럼 구성 (0단계 기초 + 1-6단계 본편)

| 단계 | 제목 | 핵심 학습 내용 |
| :--- | :--- | :--- |
| **0단계 (선택)** | AI를 이해하는 최소 수학 직관 | 벡터와 내적(유사도), 미분과 기울기(변화율), 확률분포의 직관적 이해 |
| **1단계** | AI의 시작 | 기호주의(Symbolic AI) → 퍼셉트론(Perceptron) → 고전 머신러닝의 한계 |
| **2단계** | 딥러닝의 엔진 | 다층 신경망, 손실함수(Loss), 역전파(Backpropagation), 경사하강법(Gradient Descent) |
| **3단계** | 표현과 시퀀스 | 워드 임베딩(Word Embedding), CNN·RNN의 구조와 순차 처리·장기 의존성 병목 |
| **4단계** | Transformer 혁명 | Self-Attention, Multi-Head Attention, Positional Encoding, Decoder-Only 아키텍처 |
| **5단계** | 현대 LLM의 탄생 | BPE 토큰화, 사전학습(Pre-training)과 스케일링 법칙, 사후학습(SFT, RLHF, DPO) |
| **6단계** | 현대 프론티어 AI | 추론 모델과 Test-Time Compute·RLVR, MoE(Mixture of Experts), 긴 컨텍스트와 KV Cache, 네이티브 멀티모달, AI 에이전트와 도구 사용(MCP 등) |

---

## 인터랙티브 시뮬레이터 5종

1. **2단계 — 경사하강법 & 학습률(Learning Rate) 체험** (`GradientDescentSimulator`)
   - 손실 곡면 위에서 학습률을 조절하며 수렴, 진동, 발산 과정을 시각적으로 확인합니다.
2. **3단계 — 단어 임베딩 벡터 공간·유사도 탐색** (`WordEmbeddingSimulator`)
   - 벡터 공간에서 단어 간 거리와 코사인 유사도 관계를 직접 탐색합니다.
3. **4단계 — Self-Attention 가중치 탐색기** (`SelfAttentionSimulator`)
   - 문장 내 토큰을 선택해 Query-Key-Value 기반 어텐션 가중치를 실시간으로 확인합니다.
4. **5단계 — 다음 토큰 확률 & Temperature·Top-p 샘플링** (`TokenSamplingSimulator`)
   - Temperature 및 Top-p 슬라이더를 조절하며 다음 토큰 후보 확률 분포 변화를 체험합니다.
5. **6단계 — MoE 전문가 라우팅 & 추론 예산(Test-Time Compute) 비교** (`FrontierAISimulator`)
   - 입력 토큰이 일부 전문가(Expert)에게만 라우팅되는 희소 활성화 구조와 추론 예산 증가에 따른 변화를 비교합니다.

---

## 기술 스택

- **Framework**: React 19, TypeScript
- **Build & Styling**: Vite 6, Tailwind CSS 4
- **Rendering & Icons**: KaTeX, Lucide React
- **Test & Lint**: Vitest, Testing Library, ESLint

---

## 프로젝트 구조

```text
.
├── DESIGN.md                        # 서비스 및 UI/UX 상세 설계 문서
├── index.html                       # HTML 엔트리 및 초기 테마 스크립트
├── public/                          # 파비콘, 앱 아이콘, PWA 매니페스트
└── src/
    ├── App.tsx                      # 해시 라우팅(#/stage/:id) 및 뷰 전환
    ├── main.tsx                     # React 루트 마운트 및 전역 스타일 로드
    ├── index.css                    # Tailwind CSS 및 라이트/다크 테마 토큰
    ├── components/                  # 헤더, 로드맵, 단계별 뷰, 백업 모달 등 UI
    │   └── simulators/              # 5종 인터랙티브 AI 원리 시뮬레이터
    ├── data/                        # 0-6단계 커리큘럼 데이터 및 조회 헬퍼
    ├── hooks/                       # 학습 상태 관리 커스텀 훅
    ├── types/                       # 커리큘럼 및 시뮬레이터 타입 정의
    ├── utils/                       # 수학 계산 및 localStorage 백업 유틸리티
    └── __tests__/                   # 단위 및 통합 테스트
```

---

## 로컬 실행 및 개발 명령어

```sh
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드 및 미리보기
npm run build
npm run preview

# 린트, 타입 체크, 테스트 실행
npm run lint
npm run typecheck
npm test
```

---

## 문서

- 상세 설계 및 디자인 가이드는 [DESIGN.md](./DESIGN.md)에서 확인할 수 있습니다.
