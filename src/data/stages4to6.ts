import type { StageData } from '../types/atlas';

export const STAGES_4_TO_6: StageData[] = [
  {
    id: 4,
    badge: '4단계',
    title: 'Transformer 혁명',
    subtitle: 'Self-Attention, Multi-Head Attention, Positional Encoding, Decoder-Only 아키텍처',
    readingTime: '약 18분',
    coreQuestion: '문장 속 모든 단어가 순서를 기다리지 않고 한꺼번에 서로의 문맥을 파악하려면 어떻게 해야 할까?',
    summary:
      '2017년 등장한 Transformer는 RNN의 순차 사슬을 끊고, 모든 토큰이 서로에게 Query·Key·Value를 던져 관련도를 직접 계산하는 Self-Attention을 도입했습니다. 위치 정보를 별도로 주입(Positional Encoding)하고 병렬 연산이 가능해지자, 인공지능은 비로소 거대한 데이터와 모델 크기를 마음껏 키울 수 있는 고속도로를 얻었습니다.',
    topics: ['Self-Attention (Q·K·V)', 'Multi-Head Attention', 'Positional Encoding', 'Decoder-Only 구조'],
    simulatorId: 'self-attention',
    simulatorCaption:
      '문장 속 토큰을 클릭해 어떤 단어를 얼마나 강하게 참조(Attention)하는지, 그리고 Causal Mask가 미래 토큰을 어떻게 가리는지 확인해 보세요.',
    sections: [
      {
        kind: 'limitation',
        heading: '1. 이전 기술의 한계: 줄 서서 읽기와 정보 병목',
        lead: 'RNN은 단어 간 거리가 멀어질수록 계산 단계도 늘어나고, 병렬 GPU 학습이 막혀 더 큰 모델로 확장할 수 없었습니다.',
        paragraphs: [
          '100단어 떨어진 주어와 동사를 연결하려면 RNN은 100번의 순차 전달을 거쳐야 합니다. 중간에 수많은 단어 정보가 같은 은닉 벡터에 덮어쓰기 되면서 멀리 떨어진 단서의 신호는 희미해집니다.',
          '더 치명적인 문제는 학습 속도였습니다. GPU는 수천 개의 행렬 곱셈을 동시에 처리할 때 빛을 발하는데, RNN은 앞 토큰의 계산이 끝날 때까지 뒷 토큰이 대기해야 했기에 막대한 인터넷 텍스트를 학습시키는 데 한계가 분명했습니다.',
        ],
        analogy: {
          title: '전언 게임 vs 원탁 회의',
          body: 'RNN이 옆 사람 귀에 속삭이며 끝까지 전달하는 "전언 게임"이라면, 필요한 사람은 회의실 건너편 상대방의 눈을 보고 한 번에 직접 묻는 방식이 필요했습니다.',
        },
        keyPoints: [
          '순차 의존성 제거 필요: 모든 토큰 쌍을 한 번에 병렬로 계산할 수 있어야 한다.',
          '장거리 직접 연결 필요: 문장 내 어떤 두 토큰이든 거리와 무관하게 단 1단계(O(1) 경로)로 연결되어야 한다.',
        ],
        deepDive: {
          title: '아키텍처별 경로 길이와 병렬화 복잡도 비교',
          formulas: [
            {
              label: '최대 경로 길이 및 순차 연산량',
              latex:
                '\\text{RNN: } O(N) \\text{ sequential}, \\quad \\text{Self-Attention: } O(1) \\text{ sequential},\\; O(N^2 d) \\text{ parallel}',
              explanation:
                'Self-Attention은 시퀀스 길이 N에 대해 O(N^2)의 메모리를 쓰지만, 순차 연산이 O(1)이라 GPU에서 완벽하게 병렬화됩니다.',
            },
          ],
          papers: [
            {
              title: 'Attention Is All You Need',
              authors: 'Ashish Vaswani et al. (Google Brain / Google Research)',
              year: 2017,
              venue: 'NeurIPS',
              takeaway:
                '순환(RNN)과 합성곱(CNN)을 완전히 제거하고 오직 어텐션과 피드포워드 층만으로 번역 최고 성능을 경신하며 현대 AI 시대를 열었습니다.',
            },
          ],
          implementationPoints: [
            '입력 길이가 N일 때 N×N 어텐션 행렬을 한 번에 계산하는 것은 GPU의 Tensor Core에 최적화된 거대 행렬 곱셈(GEMM)으로 직결됩니다.',
          ],
        },
      },
      {
        kind: 'mechanism',
        heading: '2. 핵심 작동 원리: Self-Attention · Multi-Head · 위치 인코딩',
        lead: '모든 토큰이 Query(질문), Key(색인), Value(내용) 역할을 맡아 서로의 관련도를 재고 문맥이 녹아든 새 표현을 만듭니다.',
        paragraphs: [
          'Self-Attention의 핵심은 도서관 검색과 비슷합니다. 각 단어는 "내가 지금 어떤 문맥 정보를 찾고 있는가?"를 뜻하는 Query(Q), "내가 어떤 정보를 갖고 있는가?"를 알리는 Key(K), 그리고 실제로 건네줄 내용인 Value(V) 세 가지 벡터를 만듭니다. 내 Q와 모든 단어의 K를 내적해 관련도 점수를 구하고, Softmax로 비중(%)을 정한 뒤 각 단어의 V를 가중합해 내 문맥 벡터를 업데이트합니다.',
          '이 과정을 하나의 관점으로만 하면 아쉽기 때문에 여러 개의 어텐션 헤드(Multi-Head Attention)를 동시에 돌립니다. 1번 헤드는 대명사가 가리키는 대상을 찾고, 2번 헤드는 동사와 목적어를 연결하는 식입니다. 또한 병렬 처리를 하면 단어 순서 정보가 사라지므로, 각 자리에 고유한 위치 신호(Positional Encoding / RoPE)를 더해 줍니다.',
          '그리고 GPT, Gemini, Claude 같은 현대 생성형 LLM은 미래 단어를 미리 컨닝하지 못하도록 자기보다 뒤쪽 토큰을 가리는 Causal Mask를 씌운 Decoder-Only 아키텍처를 채택했습니다. 아래 시뮬레이터에서 직접 체험해 보세요.',
        ],
        analogy: {
          title: 'Query · Key · Value = 검색어 · 책 제목 · 책 본문',
          body: '"고양이가 매트 위에 앉았다. 그것은 매우 졸렸다"에서 "그것은"이 검색어(Q)를 던지면, 모든 단어가 자신의 제목(K)과 대조해 "고양이가"와 높은 일치도를 보이고, 고양이의 의미(V)를 강하게 가져와 자신의 뜻에 반영합니다.',
        },
        keyPoints: [
          'Self-Attention: 문장 내 모든 토큰이 서로의 관련도를 내적으로 계산해 문맥을 동적으로 결합.',
          'Multi-Head: 여러 관점(지시, 구문, 의미)의 어텐션을 병렬로 수행.',
          'Positional Encoding: 병렬 입력에 순서와 상대 거리 정보를 주입.',
          'Decoder-Only + Causal Mask: 과거 토큰만 보고 다음 토큰을 예측하는 현대 LLM의 표준 뼈대.',
        ],
        deepDive: {
          title: 'Scaled Dot-Product Attention과 RoPE(Rotary Position Embedding)',
          formulas: [
            {
              label: 'Scaled Dot-Product Attention',
              latex:
                '\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^\\top}{\\sqrt{d_k}} + M\\right)V',
              explanation:
                '차원 수 d_k가 커질수록 내적 분산이 커져 Softmax 기울기가 0에 가까워지는 것을 막기 위해 √d_k로 나눕니다. Decoder-Only에서는 상삼각 행렬 M(미래 위치 = -∞)을 더해 미래 토큰을 차단합니다.',
            },
            {
              label: 'Multi-Head 결합',
              latex:
                '\\text{MHA}(X) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h)W^O',
              explanation:
                '각 헤드는 d_model / h 차원의 부분 공간에서 독립적인 어텐션 패턴을 학습한 뒤 다시 하나로 합쳐집니다.',
            },
          ],
          papers: [
            {
              title: 'Improving Language Understanding by Generative Pre-Training (GPT-1)',
              authors: 'Alec Radford, Karpathy Narasimhan, Tim Salimans, Ilya Sutskever',
              year: 2018,
              venue: 'OpenAI',
              takeaway:
                '인코더를 떼어낸 Decoder-Only Transformer로 다음 토큰 예측 사전학습을 수행하는 현대 LLM 패러다임을 정립했습니다.',
            },
            {
              title: 'RoFormer: Enhanced Transformer with Rotary Position Embedding',
              authors: 'Jianlin Su et al.',
              year: 2021,
              venue: 'arXiv:2104.09864',
              takeaway:
                '위치 정보를 더하는 대신 Q와 K 벡터를 위치에 비례해 회전시키는 RoPE를 제안해, 현대 LLM(LLaMA, Gemma 등)의 표준 위치 인코딩이 되었습니다.',
            },
          ],
          implementationPoints: [
            'Transformer 블록 하나는 [LayerNorm/RMSNorm → Causal Self-Attention → Residual Add → RMSNorm → MLP(SwiGLU) → Residual Add] 순서(Pre-Norm)로 쌓입니다.',
            'FlashAttention은 N×N 어텐션 행렬을 느린 HBM 메모리에 쓰지 않고 GPU SRAM 타일링으로 계산해 속도와 메모리를 획기적으로 개선했습니다.',
          ],
        },
      },
      {
        kind: 'bridge',
        heading: '3. 다음 단계로 이어지는 이유: 거대한 아키텍처에 무엇을 어떻게 채울 것인가',
        lead: '이제 병렬로 무한히 키울 수 있는 엔진(Transformer)을 손에 넣었습니다. 다음 질문은 "이 거대한 그릇을 어떻게 학습시켜 범용 지능을 끌어낼 것인가"입니다.',
        paragraphs: [
          'Transformer 이전에는 모델을 크게 키우고 싶어도 RNN의 순차 병목 때문에 감당할 수 없었습니다. 이제 아키텍처의 병렬화 문제가 풀리자, 연구자들은 데이터·파라미터·연산량을 10배, 100배, 1000배 키우면 어떤 일이 벌어지는지 실험하기 시작했습니다.',
          '5단계에서는 텍스트를 쪼개는 BPE 토큰화, 인터넷 규모 데이터로 "다음 단어 맞히기"를 훈련하는 사전학습과 스케일링 법칙, 그리고 단순한 자동완성 기계를 유용하고 안전한 대화형 비서로 탈바꿈시키는 사후학습(SFT·RLHF·DPO)을 알아봅니다.',
        ],
        keyPoints: [
          'Transformer는 대규모 병렬 학습을 가능하게 하여 스케일링 시대의 문을 열었다.',
          '5단계에서는 이 아키텍처 위에 사전학습(지식 축적)과 사후학습(정렬)을 얹어 현대 LLM을 완성하는 과정을 다룬다.',
        ],
        deepDive: {
          title: '아키텍처 혁신에서 스케일링 패러다임으로의 전환',
          formulas: [
            {
              label: 'Transformer 블록의 표현력 확장',
              latex:
                '\\text{Decoder-Only LLM} = \\text{Embed}(x) \\xrightarrow{\\text{Block}_1 \\dots \\text{Block}_L} \\text{Linear} \\xrightarrow{\\text{softmax}} P(x_{t+1} \\mid x_{\\le t})',
              explanation:
                '동일한 Decoder 블록을 L층(수십에서 백여 층) 깊이 쌓고 폭을 넓히는 것만으로 놀라운 창발적 능력이 나타나기 시작했습니다.',
            },
          ],
          papers: [
            {
              title: 'Language Models are Unsupervised Multitask Learners (GPT-2)',
              authors: 'Alec Radford et al.',
              year: 2019,
              venue: 'OpenAI',
              takeaway:
                '별도의 과제별 지도학습 없이 "다음 토큰 예측"만 충분히 크게 학습해도 번역·요약·질의응답을 수행함을 증명했습니다.',
            },
          ],
          implementationPoints: [
            '현대 LLM의 아키텍처는 2017년 원형에서 크게 벗어나지 않았지만, 정규화(RMSNorm), 활성화(SwiGLU), 위치 표현(RoPE), 어텐션 효율화(GQA)가 정교하게 다듬어졌습니다.',
          ],
        },
      },
    ],
    nextBridgeTeaser: '완벽한 병렬 아키텍처 Transformer에 인터넷 전체의 텍스트를 먹이면 어떤 일이 벌어지고, 어떻게 대화형 AI로 길들일까요?',
    resources: [
      {
        title: 'Attention in transformers, visually explained (Ch.6)',
        author: '3Blue1Brown',
        url: 'https://www.3blue1brown.com/lessons/attention',
        language: '영어 원문',
        subtitleInfo: '한국어 자막 지원',
        difficulty: '입문',
        duration: '26분',
        note: 'Query, Key, Value 행렬이 고차원 공간에서 어떻게 문맥의 의미를 이동시키고 합치는지 압도적인 3D 시각화로 보여줍니다.',
      },
      {
        title: 'The Illustrated Transformer',
        author: 'Jay Alammar',
        url: 'https://jalammar.github.io/illustrated-transformer/',
        language: '영어 원문',
        subtitleInfo: '일러스트 중심 가이드',
        difficulty: '중급',
        duration: '25분',
        note: '전 세계 엔지니어들이 Transformer를 공부할 때 가장 먼저 펼치는 고전적 일러스트 해설서입니다.',
      },
      {
        title: 'Let’s build GPT: from scratch, in code, spelled out',
        author: 'Andrej Karpathy',
        url: 'https://www.youtube.com/watch?v=kCc8FmEb1nY',
        language: '영어 원문',
        subtitleInfo: '영어/자동 자막 지원',
        difficulty: '심화',
        duration: '1시간 56분',
        note: 'Self-Attention부터 Decoder-Only GPT까지 직접 파이토치로 한 줄씩 코딩하며 완전히 체득하는 명강의입니다.',
      },
    ],
  },
  {
    id: 5,
    badge: '5단계',
    title: '현대 LLM의 탄생',
    subtitle: 'BPE 토큰화, 사전학습과 스케일링 법칙, 사후학습(SFT·RLHF·DPO)과 디코딩',
    readingTime: '약 18분',
    coreQuestion: '단순히 "다음 단어 맞히기"만 배운 모델이 어떻게 사람과 대화하고 지시를 따르는 조력자로 변할까?',
    summary:
      '현대 LLM은 세 단계의 과정을 거쳐 탄생합니다. 먼저 텍스트를 효율적인 조각(토큰)으로 쪼개고(BPE), 데이터와 연산량을 키울수록 지능이 예측 가능하게 오르는 스케일링 법칙에 따라 사전학습을 진행합니다. 마지막으로 SFT와 RLHF/DPO 같은 사후학습으로 "사람이 원하는 유용하고 안전한 답변 스타일"로 정렬한 뒤, Temperature와 Top-p 샘플링으로 문장을 생성합니다.',
    topics: ['BPE 토큰화', '사전학습과 스케일링 법칙', '사후학습(SFT·RLHF·DPO)', 'Temperature·Top-p 샘플링'],
    simulatorId: 'token-sampling',
    simulatorCaption:
      'Temperature와 Top-p 슬라이더를 조절하며 모델이 다음 토큰 후보들의 확률 분포를 어떻게 좁히거나 넓히는지 직접 샘플링해 보세요.',
    sections: [
      {
        kind: 'limitation',
        heading: '1. 이전 기술의 한계: 사전학습만 거친 모델은 "대화"를 모른다',
        lead: '아무리 방대한 지식을 사전학습으로 암기해도, 베이스 모델은 질문에 답하는 대신 비슷한 인터넷 문서를 계속 이어 쓸 뿐입니다.',
        paragraphs: [
          '먼저 입력 단계에서 글자 단위로 쪼개면 문장이 너무 길어지고, 단어 단위로 사전을 만들면 신조어나 오타, 다국어 처리에 취약합니다. 이를 해결할 효율적 분절법이 필요했습니다.',
          '더 큰 문제는 사전학습(Pre-training) 직후의 모델입니다. 베이스 모델에게 "프랑스의 수도가 어디야?"라고 물으면, "프랑스의 수도가 어디야? 독일의 수도가 어디야? 일본의 수도가 어디야?"처럼 인터넷 시험지 문맥을 그대로 이어서 생성하곤 합니다. 지식을 "어떻게 활용해서 사용자를 도울지" 정렬(Alignment)하는 단계가 없었기 때문입니다.',
        ],
        analogy: {
          title: '백과사전을 통째로 외운 사람 vs 유능한 비서',
          body: '사전학습만 마친 모델은 도서관의 모든 책을 외웠지만 "질문받으면 핵심만 정리해 답한다"는 대화 예절을 배운 적 없는 상태와 같습니다.',
        },
        keyPoints: [
          '토큰화의 딜레마: 너무 잘게 쪼개면 시퀀스가 길어지고, 단어 통째로 쓰면 어휘 사전이 감당 안 된다.',
          '사전학습 베이스 모델의 한계: 다음 토큰 확률 모방에 최적화되어 있어, 사용자의 의도(지시 따르기·거절·대화)에 정렬되어 있지 않다.',
        ],
        deepDive: {
          title: '어휘 크기와 시퀀스 길이의 트레이드오프, 그리고 정렬 격차',
          formulas: [
            {
              label: '자기회귀 언어 모델링 손실 (Cross-Entropy)',
              latex:
                '\\mathcal{L}_{\\text{PT}} = -\\sum_{t=1}^{T} \\log P_\\theta(x_t \\mid x_1, \\dots, x_{t-1})',
              explanation:
                '정답 다음 토큰의 로그 확률을 최대화하는 것이 사전학습의 유일한 목적함수입니다.',
            },
          ],
          papers: [
            {
              title: 'Neural Machine Translation of Rare Words with Subword Units (BPE)',
              authors: 'Rico Sennrich, Barry Haddow, Alexandra Birch',
              year: 2016,
              venue: 'ACL',
              takeaway:
                '자주 붙어 나오는 문자 쌍을 반복 병합하는 BPE(Byte Pair Encoding)를 신경망 언어 처리에 도입해 미등록 단어(OOV) 문제를 해결했습니다.',
            },
          ],
          implementationPoints: [
            '현대 LLM은 바이트 수준 BPE(Byte-level BPE)를 사용해 어휘 크기를 보통 32,000-256,000개 수준으로 유지하면서도 어떤 유니코드 문자든 깨짐 없이 인코딩합니다.',
          ],
        },
      },
      {
        kind: 'mechanism',
        heading: '2. 핵심 작동 원리: 스케일링 법칙 · 사후학습 · 확률적 디코딩',
        lead: '연산량과 데이터의 균형(Chinchilla)으로 지식을 채우고, SFT와 RLHF/DPO로 대화 능력을 입힌 뒤, 샘플링으로 문장을 빚어냅니다.',
        paragraphs: [
          '사전학습에서 놀라운 발견이 이루어졌습니다. 모델 크기(파라미터), 데이터 크기(토큰 수), 연산량을 함께 늘리면 손실값이 놀라울 정도로 매끄러운 거듭제곱 법칙(Scaling Law)을 따라 꾸준히 내려간다는 사실입니다. 특히 Chinchilla 연구는 모델 크기만큼 학습 데이터 토큰 수(파라미터당 약 20토큰 이상)를 충분히 늘리는 것이 훨씬 효율적임을 밝혔습니다.',
          '이렇게 똑똑해진 베이스 모델에 지도 미세조정(SFT)으로 모범 질의응답 예시를 가르치고, 이어서 인간 피드백 기반 강화학습(RLHF) 또는 직접 선호도 최적화(DPO)로 "사람이 더 선호하는 정확하고 유익하며 안전한 답변" 쪽으로 확률을 미세 조정합니다.',
          '마지막으로 실제 응답을 생성할 때는 매 스텝 다음 토큰 확률분포에서 단어를 뽑습니다. Temperature로 분포의 뾰족함(보수적 vs 창의적)을 조절하고, Top-p(Nucleus Sampling)로 누적 확률 상위 핵심 후보만 남깁니다. 아래 시뮬레이터에서 직접 체험해 보세요.',
        ],
        analogy: {
          title: '조각상 깎기와 온도 조절',
          body: '사전학습이 거대한 대리석 덩어리를 구하는 과정이라면, SFT와 RLHF는 불필요한 부분을 깎아내어 섬세한 조각상으로 다듬는 사후학습입니다. 그리고 Temperature는 말투의 모험심 다이얼입니다.',
        },
        keyPoints: [
          'BPE 토큰화: 자주 쓰이는 서브워드 단위로 텍스트를 압축 분할.',
          '스케일링 법칙: 연산·데이터·모델 크기의 예측 가능한 성능 향상.',
          'SFT → RLHF/DPO: 모범 답안 학습 후 인간 선호도 기반 정렬.',
          'Temperature & Top-p: 생성 시 정확성과 다양성의 균형을 맞추는 샘플링 제어.',
        ],
        deepDive: {
          title: 'Chinchilla 스케일링 법칙과 DPO 손실함수',
          formulas: [
            {
              label: 'Chinchilla 최적 손실 예측식',
              latex:
                'L(N, D) = E + \\frac{A}{N^\\alpha} + \\frac{B}{D^\\beta} \\quad (\\alpha \\approx 0.34,\\; \\beta \\approx 0.28)',
              explanation:
                '모델 파라미터 N과 학습 토큰 D를 균형 있게 늘려야 같은 컴퓨팅 예산 C ≈ 6ND에서 최저 손실에 도달합니다.',
            },
            {
              label: 'DPO (Direct Preference Optimization) 목적함수',
              latex:
                '\\mathcal{L}_{\\text{DPO}} = -\\mathbb{E}\\left[\\log \\sigma\\left(\\beta \\log \\frac{\\pi_\\theta(y_w|x)}{\\pi_{\\text{ref}}(y_w|x)} - \\beta \\log \\frac{\\pi_\\theta(y_l|x)}{\\pi_{\\text{ref}}(y_l|x)}\\right)\\right]',
              explanation:
                '별도의 보상 모델(Reward Model)과 PPO 강화학습 없이도, 선호 답변 y_w의 상대 확률은 높이고 비선호 답변 y_l은 낮추는 방식으로 정렬을 수행합니다.',
            },
          ],
          papers: [
            {
              title: 'Training Compute-Optimal Large Language Models (Chinchilla)',
              authors: 'Jordan Hoffmann et al. (DeepMind)',
              year: 2022,
              venue: 'NeurIPS',
              takeaway:
                '기존 LLM들이 모델 크기에 비해 학습 데이터가 턱없이 부족했음을 밝히며 현대 사전학습의 데이터-파라미터 비율 기준을 세웠습니다.',
            },
            {
              title: 'Training language models to follow instructions with human feedback (InstructGPT)',
              authors: 'Long Ouyang et al. (OpenAI)',
              year: 2022,
              venue: 'NeurIPS',
              takeaway:
                'SFT + 보상 모델 + RLHF 3단계 파이프라인이 훨씬 작은 모델로도 거대 베이스 모델보다 훨씬 유용한 응답을 만듦을 입증했습니다.',
            },
            {
              title: 'The Curious Case of Neural Text Degeneration (Top-p)',
              authors: 'Ari Holtzman et al.',
              year: 2020,
              venue: 'ICLR',
              takeaway:
                '확률 꼬리 부분을 동적으로 잘라내는 Nucleus(Top-p) 샘플링으로 반복적이고 부자연스러운 텍스트 생성을 해결했습니다.',
            },
          ],
          implementationPoints: [
            '실제 서비스에서는 추론 비용을 줄이기 위해 Chinchilla 최적점보다 훨씬 더 많은 토큰으로 작은 모델을 과훈련(Over-training)하는 경향이 강해졌습니다.',
          ],
        },
      },
      {
        kind: 'bridge',
        heading: '3. 다음 단계로 이어지는 이유: "빠른 직관"을 넘어 "깊은 사고"와 "행동"으로',
        lead: '표준 LLM은 질문이 아무리 어려워도 모든 토큰을 똑같은 시간과 연산량으로 즉답해 버리는 한계가 있었습니다.',
        paragraphs: [
          '5단계까지의 LLM은 일종의 "시스템 1(빠르고 직관적인 사고)"처럼 작동합니다. 복잡한 수학 증명이나 대규모 코드 리팩토링 문제를 만나도, 한 번 뱉은 첫 토큰이 틀렸다면 뒤돌아보거나 검증할 기회 없이 그럴듯한 오답을 끝까지 밀고 나갑니다.',
          '또한 모든 질문마다 수천억 개의 파라미터를 전부 켜야 하므로 비용이 막대하고, 텍스트만 처리하거나 외부 세계의 최신 정보에 접근하지 못하면 실무에 쓸 수 없습니다. 6단계에서는 바로 이 한계를 뚫고 나온 최신 프론티어 AI의 5대 핵심 기술을 만납니다.',
        ],
        keyPoints: [
          '즉답형 LLM의 한계: 어려운 문제에 더 오래 생각할 수 없고(Test-Time Compute 부재), 모든 입력에 모든 파라미터를 쓰는 비효율이 존재한다.',
          '6단계에서는 추론 모델, MoE, 긴 컨텍스트(KV Cache), 네이티브 멀티모달, AI 에이전트(MCP)로 이어지는 프론티어 지형을 다룬다.',
        ],
        deepDive: {
          title: '학습 시간 스케일링(Train-Time)에서 추론 시간 스케일링(Test-Time)으로',
          formulas: [
            {
              label: '고정 추론 연산량의 한계',
              latex:
                '\\text{FLOPs per token} \\approx 2 N \\quad (\\text{질문 난이도와 무관하게 상수})',
              explanation:
                '일반 자기회귀 LLM은 "1+1"을 풀 때나 올림피아드 수학 문제를 풀 때나 토큰 하나당 똑같은 연산량 2N을 사용합니다.',
            },
          ],
          papers: [
            {
              title: 'Chain-of-Thought Prompting Elicits Reasoning in Large Language Models',
              authors: 'Jason Wei et al. (Google Research)',
              year: 2022,
              venue: 'NeurIPS',
              takeaway:
                '중간 추론 과정을 토큰으로 먼저 출력하게 하면(연산 시간 확보) 복잡한 수학·논리 추론 성능이 급격히 향상됨을 보였습니다.',
            },
          ],
          implementationPoints: [
            '이제 프론티어 AI의 경쟁 축은 모델 크기 키우기뿐 아니라, 추론 시간 활용, 희소 전문가 활성화(MoE), 멀티모달 통합, 도구 실행 루프로 확장되었습니다.',
          ],
        },
      },
    ],
    nextBridgeTeaser: '그렇다면 오늘날의 최전선 프론티어 AI는 어떻게 스스로 더 오래 생각하고, 필요한 전문가만 깨우고, 도구를 사용해 행동할까요?',
    resources: [
      {
        title: 'Intro to Large Language Models',
        author: 'Andrej Karpathy',
        url: 'https://www.youtube.com/watch?v=zjkBMFhNj_g',
        language: '영어 원문',
        subtitleInfo: '한국어 자막 선택 가능',
        difficulty: '입문',
        duration: '1시간',
        note: '사전학습과 사후학습(RLHF), 그리고 LLM이 동작하는 전체 그림을 비전공자도 이해할 수 있게 명쾌히 요약한 강연입니다.',
      },
      {
        title: 'Let’s build the GPT Tokenizer',
        author: 'Andrej Karpathy',
        url: 'https://www.youtube.com/watch?v=zduSFxRajkE',
        language: '영어 원문',
        subtitleInfo: '영어/자동 자막 지원',
        difficulty: '중급',
        duration: '2시간 13분 (앞부분 40분 추천)',
        note: 'BPE 토큰화가 왜 LLM의 철자 오류, 다국어 비용, 코딩 성능에 직접적인 영향을 미치는지 파헤칩니다.',
      },
      {
        title: 'How to generate text: decoding methods (Greedy, Beam, Top-k, Top-p)',
        author: 'Hugging Face Blog',
        url: 'https://huggingface.co/blog/how-to-generate',
        language: '영어 원문',
        subtitleInfo: '코드 예제 포함 블로그',
        difficulty: '중급',
        duration: '15분',
        note: 'Temperature와 Top-p, Top-k가 실제 확률 분포에서 문장 생성 품질을 어떻게 바꾸는지 코드와 그래프로 정리했습니다.',
      },
    ],
  },
  {
    id: 6,
    badge: '6단계',
    title: '현대 프론티어 AI',
    subtitle: '추론 모델(Test-Time Compute·RLVR), MoE, KV Cache, 네이티브 멀티모달, AI 에이전트(MCP)',
    readingTime: '약 20분',
    coreQuestion: '오늘날 최전선(Frontier) AI는 어떻게 더 깊이 생각하고, 거대한 모델을 가볍게 돌리며, 스스로 도구를 써서 일을 완수할까?',
    summary:
      '현대 프론티어 AI는 5가지 축으로 진화했습니다. 어려운 문제에 추론 예산을 더 써서 스스로 검증하는 추론 모델(Test-Time Compute·RLVR), 토큰마다 필요한 일부 뇌 영역만 켜는 MoE, 긴 대화를 빠르게 기억하는 KV Cache, 텍스트·이미지·오디오를 하나의 공간에서 이해하는 네이티브 멀티모달, 그리고 외부 도구와 규격화된 프로토콜(MCP)로 연결되어 실제 작업을 수행하는 AI 에이전트입니다.',
    topics: ['Test-Time Compute·RLVR', 'MoE(Mixture of Experts)', '긴 컨텍스트와 KV Cache', '네이티브 멀티모달', 'AI 에이전트와 MCP'],
    simulatorId: 'frontier-ai',
    simulatorCaption:
      'MoE의 희소 전문가 라우팅으로 연산량이 어떻게 절감되는지, 그리고 추론 예산(Thinking Budget)을 늘릴 때 문제 난이도별로 정확도가 어떻게 변하는지 비교해 보세요.',
    sections: [
      {
        kind: 'limitation',
        heading: '1. 이전 기술의 한계: 덩치만 키우는 확장의 천장',
        lead: '고정된 연산량으로 즉답만 하고, 모든 파라미터를 매번 켜며, 외부 도구 없이 텍스트만 뱉는 구조는 비용과 신뢰성의 한계에 부딪혔습니다.',
        paragraphs: [
          '고품질 인터넷 텍스트 데이터는 점차 고갈되고, 수조 개 파라미터를 가진 밀집(Dense) 모델은 토큰 하나를 생성할 때마다 천문학적인 전력과 비용을 소모합니다. 또한 문맥 길이가 길어질수록 이전 토큰들을 매번 처음부터 다시 계산하면 응답 속도가 기하급수적으로 느려집니다.',
          '무엇보다 실제 업무에서는 "정답을 한 번에 찍는 모델"보다, 틀릴 수 있는 가설을 스스로 의심하고 수정할 수 있는 추론 능력, 이미지·음성을 번역 없이 곧바로 이해하는 감각, 그리고 데이터베이스·파일·터미널을 직접 다루어 결과를 검증하는 행동 능력이 요구되었습니다.',
        ],
        analogy: {
          title: '만능 박사 한 명 vs 협업하는 전문가 팀과 작업실',
          body: '혼자 모든 문제를 암산으로 1초 만에 대답하는 천재보다, 분야별 전문가가 필요한 순간에만 투입되고(MoE), 연습장에 충분히 고민하며 검산하고(Test-Time Compute), 도구를 꺼내 측정할 수 있는(Agent) 팀이 훨씬 강합니다.',
        },
        keyPoints: [
          '추론 한계: 어려운 문제에 추가 사고 시간을 쓸 수 없는 1-pass 즉답 구조.',
          '효율 한계: 모든 토큰에 전체 파라미터를 활성화하는 Dense 모델의 비용, 긴 문맥에서의 재계산 병목.',
          '행동 한계: 텍스트 창 안에 갇혀 외부 시스템과 안전하게 상호작용하지 못하는 수동적 챗봇.',
        ],
        deepDive: {
          title: '사전학습 데이터 벽과 추론 병목(Memory-Bandwidth Bound)',
          formulas: [
            {
              label: '자기회귀 디코딩의 KV Cache 메모리 증가',
              latex:
                '\\text{KV Cache Size} = 2 \\times L \\times n_{\\text{kv\\_heads}} \\times d_{\\text{head}} \\times N \\times \\text{bytes}',
              explanation:
                '컨텍스트 길이 N이 수십만에서 수백만 토큰으로 늘어나면, 이전 토큰들의 Key와 Value를 저장하는 KV Cache 크기가 GPU 메모리를 압도하는 주원인이 됩니다.',
            },
          ],
          papers: [
            {
              title: 'Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters',
              authors: 'Charlie Snell, Jaehoon Lee, Kelvin Xu, Aviral Kumar',
              year: 2024,
              venue: 'arXiv:2408.03314',
              takeaway:
                '단순히 모델 파라미터를 14배 키우는 것보다, 추론 시점에 문제 난이도에 맞게 사고 예산을 동적으로 배분하는 것이 훨씬 효율적임을 보였습니다.',
            },
          ],
          implementationPoints: [
            '추론 시 모델이 느려지는 주된 이유는 연산량보다 GPU 메모리에서 가중치와 KV Cache를 읽어오는 메모리 대역폭 병목(Memory-Bandwidth Bound)입니다.',
          ],
        },
      },
      {
        kind: 'mechanism',
        heading: '2. 핵심 작동 원리: 프론티어 AI의 5대 핵심 엔진',
        lead: '추론 시간 스케일링(RLVR), 희소 전문가(MoE), KV Cache, 네이티브 멀티모달, 그리고 에이전트·MCP가 하나로 결합됩니다.',
        paragraphs: [
          '① 추론 모델과 Test-Time Compute·RLVR: 수학·코딩처럼 정답을 기계적으로 검증할 수 있는 환경에서 강화학습(RLVR: 검증 가능한 보상 기반 RL)을 시키면, 모델은 스스로 긴 사고의 사슬을 펼치며 가설 검증, 되돌아가기(Backtracking), 자기 교정을 학습합니다. 답변 전에 Thinking Budget을 많이 줄수록 어려운 문제의 정답률이 극적으로 오릅니다.',
          '② MoE (Mixture of Experts): Transformer의 피드포워드(MLP) 층을 여러 개의 "전문가" 네트워크로 나누고, 작은 라우터가 토큰마다 가장 적합한 1-2개 전문가만 깨워 계산합니다. 전체 지식 용량(총 파라미터)은 수천억 개로 크게 유지하면서도, 실제 추론 연산량은 수백억 개 수준으로 가볍게 유지할 수 있습니다.',
          '③ 긴 컨텍스트와 KV Cache: 대화나 문서가 길어질 때 이전 토큰들의 Key·Value 계산 결과를 메모리에 캐싱(KV Cache)해 두면, 새 토큰을 생성할 때 과거를 다시 계산하지 않고 방금 추가된 토큰만 계산해 긴 문맥을 빠르게 처리합니다. (GQA, Ring Attention 등으로 확장)',
          '④ 네이티브 멀티모달 & ⑤ AI 에이전트(MCP): 이미지·오디오·비디오를 별도 번역기 없이 처음부터 같은 토큰 공간에서 통합 학습(네이티브 멀티모달)하고, 모델이 외부 API·파일·코드 실행기와 표준화된 규격(예: MCP, Model Context Protocol)으로 연결되어 "생각 → 도구 호출 → 결과 관찰 → 다음 행동" 루프를 자율적으로 완주합니다.',
        ],
        analogy: {
          title: 'MCP는 AI 시대의 USB-C 포트',
          body: '과거에는 AI와 외부 도구(GitHub, DB, 캘린더)를 연결할 때마다 제각각 다른 어댑터를 짜야 했지만, MCP 같은 표준 프로토콜을 쓰면 어떤 모델이든 USB-C 꽂듯 도구에 연결됩니다.',
        },
        keyPoints: [
          '추론 모델 & RLVR: 검증 가능한 보상으로 자기 교정 사고를 학습하고 Test-Time Compute로 성능 확장.',
          'MoE: 라우터가 토큰별 상위 K개 전문가만 활성화해 지능과 연산 효율을 동시에 확보.',
          'KV Cache: 과거 토큰의 Key·Value를 재사용해 긴 컨텍스트 추론 속도를 유지.',
          '네이티브 멀티모달: 텍스트·이미지·오디오를 단일 트랜스포머 공간에서 통합 이해·생성.',
          'AI 에이전트 & MCP: 추론 모델이 표준 도구 프로토콜로 외부 환경과 상호작용하며 목표를 완수.',
        ],
        deepDive: {
          title: 'MoE 라우팅 수식, KV Cache 재사용, RLVR(GRPO) 목적함수',
          formulas: [
            {
              label: 'Sparse MoE 라우팅 출력',
              latex:
                'y = \\sum_{i \\in \\text{TopK}(G(x))} \\text{softmax}(G(x))_i \\cdot E_i(x)',
              explanation:
                '게이팅 네트워크 G(x)가 모든 전문가 중 상위 K개(보통 1-2개)만 선택해 가중합하므로 나머지 전문가는 연산을 완전히 건너뜁니다.',
            },
            {
              label: 'KV Cache 기반 다음 토큰 어텐션',
              latex:
                '\\text{Attn}(q_t, K_{\\le t}, V_{\\le t}) = \\text{softmax}\\left(\\frac{q_t [K_{<t}; k_t]^\\top}{\\sqrt{d_k}}\\right)[V_{<t}; v_t]',
              explanation:
                '과거의 K_{<t}, V_{<t}는 캐시에서 그대로 읽고, 현재 시점 t의 q_t, k_t, v_t만 새로 계산합니다.',
            },
          ],
          papers: [
            {
              title: 'Switch Transformers: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity',
              authors: 'William Fedus, Barret Zoph, Noam Shazeer',
              year: 2022,
              venue: 'JMLR',
              takeaway:
                '토큰당 단 1개의 전문가만 선택(Top-1)해도 라우팅 부하 균형 손실과 함께 거대한 모델을 훨씬 빠르게 학습할 수 있음을 보였습니다.',
            },
            {
              title: 'DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning',
              authors: 'DeepSeek-AI',
              year: 2025,
              venue: 'arXiv:2501.12948',
              takeaway:
                '정답 검증이 가능한 규칙 기반 보상(RLVR)만으로도 모델이 스스로 긴 사고 과정, 반성, 재검증 행동을 창발함을 공개적으로 입증했습니다.',
            },
          ],
          implementationPoints: [
            '실전 에이전트 루프는 [시스템 프롬프트 + MCP 도구 목록 → LLM 추론 → Tool Call JSON 생성 → 호스트가 실제 도구 실행 → 결과를 Observation으로 재입력]의 반복입니다.',
            '긴 컨텍스트 비용을 줄이기 위해 공통 시스템 프롬프트와 대규모 문서는 Prefix Caching(Prompt Caching)으로 재사용합니다.',
          ],
        },
      },
      {
        kind: 'bridge',
        heading: '3. 여정의 완성: 하나의 인과관계 지도로 바라본 AI',
        lead: '기호주의의 한계에서 출발해 퍼셉트론, 역전파, 임베딩과 RNN, Transformer, 현대 LLM을 거쳐 오늘날의 프론티어 에이전트까지 한 줄로 이어졌습니다.',
        paragraphs: [
          '돌아보면 AI의 모든 발전은 우연한 유행이 아니라, 바로 앞 단계가 남긴 병목을 해결하려는 필연적인 응답이었습니다. 규칙의 폭발을 데이터 학습으로 풀었고, 단층의 한계를 역전파로 넘었으며, 순차 처리의 병목을 Self-Attention으로 돌파했습니다.',
          '그리고 오늘날 우리는 "더 크게 학습시키는 것"을 넘어 "더 깊이 생각하고, 필요한 전문가만 깨우며, 도구를 통해 현실 세계와 연결되는" 프론티어 AI의 시대에 서 있습니다. 이제 새로운 논문이나 모델을 만나더라도 "이 기술은 어떤 기존 병목을 해결하려 등장했는가?"라는 질문으로 그 위치를 정확히 짚어낼 수 있을 것입니다.',
        ],
        keyPoints: [
          '0단계의 벡터·미분·확률이 6단계의 MoE·추론·에이전트까지 관통하는 단 하나의 공통 언어다.',
          '새로운 AI 기술을 접할 때 "이전 한계 → 핵심 아이디어 → 다음 병목"의 3단 프레임으로 바라보면 흐름을 잃지 않는다.',
        ],
        deepDive: {
          title: '프론티어 AI의 다음 개척지',
          formulas: [
            {
              label: '지능의 3차원 확장 축',
              latex:
                '\\text{Capability} \\propto f(\\text{Pre-train Scale},\\; \\text{Test-Time Compute},\\; \\text{Environment Interaction})',
              explanation:
                '현대 AI의 역량은 사전학습 규모, 추론 시 사고 예산, 그리고 외부 도구·환경과의 상호작용 경험이라는 세 축의 곱으로 확장되고 있습니다.',
            },
          ],
          papers: [
            {
              title: 'Building Effective Agents',
              authors: 'Anthropic Research',
              year: 2024,
              venue: 'Anthropic Engineering Blog',
              takeaway:
                '복잡한 프레임워크보다 단순하고 검증 가능한 워크플로우와 명확한 도구 인터페이스 설계가 신뢰할 수 있는 에이전트의 핵심임을 정리했습니다.',
            },
          ],
          implementationPoints: [
            '이제 아래 시뮬레이터에서 MoE 라우팅과 Test-Time Compute 예산 조절을 직접 실험해 보며 여정을 마무리해 보세요.',
          ],
        },
      },
    ],
    resources: [
      {
        title: 'Building Effective Agents',
        author: 'Anthropic Research',
        url: 'https://www.anthropic.com/engineering/building-effective-agents',
        language: '영어 원문',
        subtitleInfo: '엔지니어링 리서치 아티클',
        difficulty: '중급',
        duration: '20분',
        note: '실무에서 동작하는 AI 에이전트 패턴(라우팅, 오케스트레이터-워커, 평가자-최적화 루프)의 정석 가이드입니다.',
      },
      {
        title: 'Model Context Protocol (MCP) 공식 문서',
        author: 'Anthropic / Open Standard',
        url: 'https://modelcontextprotocol.io/introduction',
        language: '영어 원문',
        subtitleInfo: '개발자 공식 스펙 문서',
        difficulty: '중급',
        duration: '15분',
        note: 'AI 모델이 외부 데이터 소스와 도구를 표준화된 방식으로 연결하는 MCP의 아키텍처와 핵심 개념을 소개합니다.',
      },
      {
        title: 'DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via RL',
        author: 'DeepSeek-AI',
        url: 'https://arxiv.org/abs/2501.12948',
        language: '영어 원문',
        subtitleInfo: 'arXiv 원문 논문',
        difficulty: '심화',
        duration: '40분',
        note: 'RLVR(검증 가능한 보상 기반 강화학습)만으로 추론 모델의 자기 교정 능력이 어떻게 학습되는지 상세히 공개한 논문입니다.',
      },
    ],
  },
];
