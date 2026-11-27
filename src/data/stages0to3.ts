import type { StageData } from '../types/atlas';

export const STAGES_0_TO_3: StageData[] = [
  {
    id: 0,
    badge: '0단계 · 선택',
    isOptional: true,
    title: 'AI를 이해하는 최소 수학 직관',
    subtitle: '벡터와 내적, 미분과 기울기, 확률분포 — 수식 공포 없이 핵심 직관 3가지만 챙기기',
    readingTime: '약 12분',
    coreQuestion: 'AI는 세상의 단어, 이미지, 오차를 어떻게 숫자로 바꾸고 스스로 수정할 수 있을까?',
    summary:
      '현대 AI가 사용하는 방대한 수학 중에서 실제로 원리를 이해하는 데 꼭 필요한 것은 딱 세 가지입니다. 의미를 좌표로 표현하는 벡터와 내적, 오차를 줄이는 방향을 알려주는 기울기, 그리고 불확실한 선택을 숫자로 다루는 확률분포입니다.',
    topics: ['벡터와 내적(유사도)', '미분과 기울기(변화율)', '확률분포와 소프트맥스'],
    diagramId: 'math-intuition',
    sections: [
      {
        kind: 'limitation',
        heading: '1. 이전 방식의 한계: 컴퓨터는 "의미"를 모른다',
        lead: '컴퓨터는 본래 0과 1의 기호만 비교할 뿐, "고양이"와 "호랑이"가 얼마나 비슷한지 알지 못합니다.',
        paragraphs: [
          '전통적인 컴퓨터 프로그램에서 단어와 개념은 서로 무관한 텍스트 ID로 취급됩니다. "고양이"와 "강아지"가 비슷하고 "책상"과는 멀다는 직관은 사람에게는 당연하지만, 단순 문자열 비교에서는 세 단어가 모두 똑같이 "서로 다른 글자"일 뿐입니다.',
          '마찬가지로 프로그램이 틀린 답을 냈을 때, 정답과 "조금 틀렸는지" 아니면 "완전히 빗나갔는지"를 연속적인 크기로 재고 조금씩 고쳐 나가는 수학적 언어가 없다면 스스로 학습하는 시스템은 불가능합니다.',
        ],
        analogy: {
          title: '지도 위의 위치로 생각하기',
          body: '서울과 인천이 가깝고 부산이 멀다는 사실은 두 도시의 이름을 비교해서가 아니라, 위도와 경도라는 "숫자 좌표" 위에 놓았을 때 비로소 계산할 수 있습니다.',
        },
        keyPoints: [
          '기호(텍스트) 자체에는 거리나 유사도 개념이 없다.',
          '학습하려면 "얼마나 비슷한지", "어느 방향으로 얼마나 고쳐야 하는지", "얼마나 확신하는지"를 숫자로 다뤄야 한다.',
        ],
        deepDive: {
          title: '연속 표현 공간(Continuous Representation Space)의 필요성',
          formulas: [
            {
              label: '유클리드 공간의 표현 벡터',
              latex: '\\mathbf{x} = (x_1, x_2, \\dots, x_d) \\in \\mathbb{R}^d',
              explanation:
                '이산적인 기호를 d차원 실수 공간의 한 점으로 매핑하면, 미적분과 선형대수 연산을 통해 의미의 거리와 변화량을 계산할 수 있습니다.',
            },
          ],
          papers: [
            {
              title: 'Representation Learning: A Review and New Perspectives',
              authors: 'Yoshua Bengio, Aaron Courville, Pascal Vincent',
              year: 2013,
              venue: 'IEEE TPAMI',
              takeaway:
                '좋은 AI 모델의 핵심은 사람이 규칙을 짜는 것이 아니라, 데이터로부터 유용한 연속 벡터 표현을 스스로 학습하는 데 있음을 체계화했습니다.',
            },
          ],
          implementationPoints: [
            '딥러닝 프레임워크(PyTorch 등)의 모든 데이터는 다차원 실수 배열(Tensor)로 표현됩니다.',
            '단어 하나, 이미지 패치 하나가 모두 수백에서 수천 차원의 float32/bfloat16 벡터로 변환되어 계산됩니다.',
          ],
        },
      },
      {
        kind: 'mechanism',
        heading: '2. 핵심 작동 원리: 3가지 최소 수학 직관',
        lead: '벡터(방향과 거리), 기울기(가장 가파른 내리막), 확률분포(가능성의 배분)가 AI의 기본 언어입니다.',
        paragraphs: [
          '첫째, 벡터(Vector)와 내적(Dot Product)입니다. 어떤 대상의 성질을 여러 숫자의 묶음(화살표)으로 나타내면, 두 화살표가 같은 방향을 가리킬수록 내적 값이 커집니다. 이후 등장할 임베딩 유사도와 Transformer의 어텐션 점수는 모두 이 내적 계산에서 출발합니다.',
          '둘째, 미분과 기울기(Gradient)입니다. 현재 모델이 얼마나 틀렸는지를 나타내는 "오차 지형" 위에서, 어느 쪽으로 한 걸음 움직여야 오차가 가장 빨리 줄어드는지 알려주는 나침반이 바로 기울기입니다.',
          '셋째, 확률분포(Probability Distribution)입니다. AI는 "다음 단어는 무조건 이것"이라고 단정 짓지 않고, 모든 후보에 0-1 사이의 가능성을 배분해 합이 1이 되도록 만든 뒤 가장 그럴듯한 선택을 합니다.',
        ],
        analogy: {
          title: '안개 낀 산에서 내려오기',
          body: '발밑의 경사(기울기)를 발끝으로 느껴 가장 가파르게 내려가는 방향으로 한 걸음씩 내딛는 것이 학습이며, 갈림길마다 어느 길로 갈지 가능성(확률분포)을 재는 것이 추론입니다.',
        },
        keyPoints: [
          '벡터 & 내적: 두 개념이 얼마나 비슷한 방향을 향하는지 재는 유사도 측정기',
          '미분 & 기울기: 오차를 줄이기 위해 매개변수를 어느 방향으로 얼마나 바꿀지 알려주는 신호',
          '확률분포 & 소프트맥스: 모델의 점수를 합계 100%의 확률로 바꿔 불확실성을 다루는 도구',
        ],
        deepDive: {
          title: '코사인 유사도, 편미분 기울기, 소프트맥스 함수',
          formulas: [
            {
              label: '내적과 코사인 유사도',
              latex:
                '\\mathbf{a} \\cdot \\mathbf{b} = \\sum_{i=1}^{d} a_i b_i, \\quad \\cos(\\theta) = \\frac{\\mathbf{a} \\cdot \\mathbf{b}}{\\|\\mathbf{a}\\|\\|\\mathbf{b}\\|}',
              explanation:
                '두 벡터의 방향이 같을수록 1에 가까워지고, 직교하면 0, 정반대면 -1이 됩니다.',
            },
            {
              label: '다변수 함수의 기울기(Gradient)',
              latex:
                '\\nabla_\\theta L(\\theta) = \\left(\\frac{\\partial L}{\\partial \\theta_1}, \\frac{\\partial L}{\\partial \\theta_2}, \\dots, \\frac{\\partial L}{\\partial \\theta_n}\\right)',
              explanation:
                '손실함수 L이 가장 빠르게 증가하는 방향을 가리키므로, 반대 방향(-∇L)으로 이동하면 오차가 줄어듭니다.',
            },
            {
              label: '소프트맥스(Softmax)',
              latex:
                '\\text{softmax}(z_i) = \\frac{e^{z_i}}{\\sum_{j=1}^{V} e^{z_j}}',
              explanation:
                '임의의 실수 점수(Logit)를 모두 양수로 만들고 합이 1인 확률분포로 정규화합니다.',
            },
          ],
          papers: [
            {
              title: 'The Matrix Calculus You Need For Deep Learning',
              authors: 'Terence Parr, Jeremy Howard',
              year: 2018,
              venue: 'arXiv:1802.01528',
              takeaway:
                '벡터와 행렬 미분이 신경망 역전파와 어떻게 직접 연결되는지 최소한의 개념으로 정리한 입문 필독서입니다.',
            },
          ],
          implementationPoints: [
            '실제 구현에서는 exp(z_i) 오버플로우를 막기 위해 max(z)를 먼저 뺀 exp(z_i - max(z)) 형태로 계산합니다.',
            '행렬 곱셈(MatMul)은 수많은 내적을 한 번에 병렬 처리하는 연산이며, GPU가 가장 잘하는 일입니다.',
          ],
        },
      },
      {
        kind: 'bridge',
        heading: '3. 다음 단계로 이어지는 이유: 도구는 준비되었다',
        lead: '이제 "숫자로 생각을 표현하고 오차를 고칠 수 있다"는 무기를 손에 쥐었습니다. 그렇다면 최초의 AI 연구자들은 이 도구를 처음부터 썼을까요?',
        paragraphs: [
          '놀랍게도 AI의 첫 출발은 통계나 벡터가 아니었습니다. 1950년대 초기 연구자들은 인간의 논리와 규칙을 코드로 직접 적으면 지능이 탄생할 것이라 믿었습니다.',
          '1단계에서는 규칙 기반 기호주의 AI가 왜 벽에 부딪혔는지, 그리고 데이터를 통해 스스로 경계선을 긋는 퍼셉트론과 머신러닝이 어떻게 그 빈자리를 메웠는지 살펴봅니다.',
        ],
        keyPoints: [
          '벡터·기울기·확률은 2-6단계 모든 기술의 공통 기반 언어가 된다.',
          '1단계에서는 "사람이 규칙을 적어주는 방식"에서 "데이터로 학습하는 방식"으로의 첫 전환을 다룬다.',
        ],
        deepDive: {
          title: '기호적 추론과 연속적 학습의 대비',
          formulas: [
            {
              label: '선형 결합의 일반형',
              latex: 'y = f(\\mathbf{w} \\cdot \\mathbf{x} + b)',
              explanation:
                '입력 벡터 x에 가중치 w를 내적하고 편향 b를 더한 뒤 함수 f를 통과시키는 구조는 퍼셉트론부터 LLM까지 변치 않는 기본 단위입니다.',
            },
          ],
          papers: [
            {
              title: 'Computing Machinery and Intelligence',
              authors: 'Alan M. Turing',
              year: 1950,
              venue: 'Mind',
              takeaway:
                '기계가 생각할 수 있는가라는 질문과 함께, 처음부터 완성된 지능 대신 아이처럼 경험을 통해 학습하는 기계의 가능성을 제시했습니다.',
            },
          ],
          implementationPoints: [
            '이 단계의 세 개념은 이후 2단계 경사하강법, 3단계 워드 임베딩, 4단계 Self-Attention 시뮬레이터에서 직접 손으로 만져보며 체득하게 됩니다.',
          ],
        },
      },
    ],
    nextBridgeTeaser: '그렇다면 초창기 AI 연구자들은 왜 처음부터 학습 대신 "규칙"을 직접 적는 길을 택했을까요?',
    resources: [
      {
        title: 'Essence of Linear Algebra — 벡터와 내적의 기하학적 직관',
        author: '3Blue1Brown',
        url: 'https://www.3blue1brown.com/topics/linear-algebra',
        language: '영어 원문',
        subtitleInfo: '한국어 자막 지원',
        difficulty: '입문',
        duration: '약 25분 (핵심 1-3강)',
        note: '벡터를 숫자 목록이 아닌 공간상의 변환과 방향 화살표로 시각화해 내적의 본질을 가장 명쾌하게 보여줍니다.',
      },
      {
        title: 'Essence of Calculus — 미분과 변화율의 직관',
        author: '3Blue1Brown',
        url: 'https://www.3blue1brown.com/topics/calculus',
        language: '영어 원문',
        subtitleInfo: '한국어 자막 지원',
        difficulty: '입문',
        duration: '약 20분 (1-2강)',
        note: '공식 암기 없이 기울기(미분)가 왜 변화율의 극한인지 시각적으로 단번에 이해할 수 있습니다.',
      },
      {
        title: 'Seeing Theory — 확률과 분포 인터랙티브 입문',
        author: 'Brown University',
        url: 'https://seeing-theory.brown.edu/',
        language: '영어 원문',
        subtitleInfo: '한국어 번역 페이지 선택 가능',
        difficulty: '입문',
        duration: '15-20분',
        note: '브라우저에서 직접 주사위와 분포를 조작하며 확률분포의 감각을 익힐 수 있는 시각화 교과서입니다.',
      },
    ],
  },
  {
    id: 1,
    badge: '1단계',
    title: 'AI의 시작',
    subtitle: '기호주의(Symbolic AI)에서 퍼셉트론, 그리고 고전 머신러닝의 한계까지',
    readingTime: '약 14분',
    coreQuestion: '인간이 모든 규칙을 직접 적어주는 AI는 왜 실패했고, 데이터에서 배우는 방식은 어떤 벽에 부딪혔을까?',
    summary:
      '초기 AI는 "사람이 지식을 논리 규칙으로 코딩하면 된다"는 기호주의로 출발했습니다. 하지만 세상의 모호함 앞에서 규칙은 폭발했고, 이를 극복하려 등장한 퍼셉트론과 고전 머신러닝 역시 "특징(Feature)을 사람이 직접 설계해야 한다"는 한계에 부딪혔습니다.',
    topics: ['기호주의(Symbolic AI)', '퍼셉트론(Perceptron)', 'XOR 문제와 고전 머신러닝'],
    diagramId: 'symbolic-to-ml',
    sections: [
      {
        kind: 'limitation',
        heading: '1. 이전 기술의 한계: 논리 규칙만으로 세상을 담을 수 없다',
        lead: '1950-1980년대의 기호주의(Symbolic AI)와 전문가 시스템은 명확한 규칙의 세계에서는 강했지만, 현실의 예외 앞에서 무너졌습니다.',
        paragraphs: [
          '기호주의 AI의 아이디어는 명쾌합니다. "만약(IF) 고양이에게 수염이 있고 뾰족한 귀가 있다면(THEN) 고양이다"처럼 인간의 지식을 수많은 조건문으로 옮겨 적는 방식입니다. 체스 프로그램이나 세법 계산처럼 규칙이 닫힌 영역에서는 꽤 훌륭한 성과를 냈습니다.',
          '하지만 사진 속 수많은 조명, 각도, 가려짐 속에서 고양이를 구분하거나 일상 대화의 뉘앙스를 해석하려 하자 규칙의 수가 기하급수적으로 폭증했습니다. "만약 털이 깎였다면?", "만약 뒷모습만 보인다면?"처럼 예외가 예외를 낳았고, 결국 유지보수가 불가능해지며 AI 겨울이 찾아왔습니다.',
        ],
        analogy: {
          title: '요리 레시피 vs 미각 훈련',
          body: '기호주의는 "소금 3.2g, 물 412ml, 불 세기 65%"처럼 모든 변수를 종이에 적어 요리하려는 시도입니다. 재료 상태가 조금만 달라져도 망가지기 쉽습니다.',
        },
        keyPoints: [
          '기호주의(GOFAI): 인간 전문가가 명시적 규칙(IF-THEN)을 작성하는 하향식(Top-down) 접근.',
          '지식 획득 병목: 현실 세계의 암묵지와 수많은 예외를 규칙으로 다 적을 수 없었다.',
        ],
        deepDive: {
          title: '물리 기호 시스템 가설과 조합 폭발(Combinatorial Explosion)',
          formulas: [
            {
              label: '규칙 기반 추론의 상태 공간',
              latex: '|S| = \\prod_{i=1}^{k} b_i \\quad \\text{(조건 분기 } b_i \\text{가 쌓일수록 지수적 증가)}',
              explanation:
                '규칙과 예외 조건이 늘어날수록 가능한 상태 조합과 규칙 간 충돌 검사가 지수적으로 폭발합니다.',
            },
          ],
          papers: [
            {
              title: 'Computer Science as Empirical Inquiry: Symbols and Search',
              authors: 'Allen Newell, Herbert A. Simon',
              year: 1976,
              venue: 'Communications of the ACM (Turing Award Lecture)',
              takeaway:
                '물리 기호 시스템이 지능의 충분조건이라는 기호주의 철학의 정점을 선언한 논문입니다.',
            },
          ],
          implementationPoints: [
            '현대 에이전트 시스템에서도 툴 호출 스키마나 안전 가드레일처럼 명확한 제약이 필요한 곳에는 여전히 규칙 기반 로직이 하이브리드로 결합됩니다.',
          ],
        },
      },
      {
        kind: 'mechanism',
        heading: '2. 핵심 작동 원리: 퍼셉트론과 고전 머신러닝의 도약',
        lead: '사람이 규칙을 짜는 대신, 데이터 예시를 보고 "경계선"의 가중치를 스스로 조절하는 학습 패러다임이 등장했습니다.',
        paragraphs: [
          '1957년 프랭크 로젠블랫이 제안한 퍼셉트론(Perceptron)은 뇌의 뉴런을 본뜬 단순한 수학 장치입니다. 입력 신호마다 중요도(가중치)를 곱해 모두 더한 뒤, 기준치를 넘으면 1, 못 넘으면 0을 출력합니다. 정답과 다르면 가중치를 조금씩 고칩니다.',
          '이후 발전한 서포트 벡터 머신(SVM), 랜덤 포레스트 같은 고전 머신러닝은 이 아이디어를 훨씬 정교하게 다듬어 스팸 메일 분류, 신용 평가, 초기 추천 시스템에서 큰 성공을 거두었습니다. 규칙을 직접 적는 대신 데이터에서 결정 경계를 학습하게 된 것입니다.',
        ],
        analogy: {
          title: '과일 선별기의 무게추 맞추기',
          body: '사과와 배를 구분할 때 "지름에 2점, 붉은 정도에 5점" 같은 가중치를 처음엔 대충 두고, 틀릴 때마다 점수 비중을 조금씩 고쳐 최적의 구분선을 찾는 원리입니다.',
        },
        keyPoints: [
          '퍼셉트론: 가중합이 임계값을 넘는지 판별하는 가장 단순한 인공 뉴런 모델.',
          '고전 머신러닝: 사람이 직접 규칙을 코딩하는 대신 데이터에서 패턴(경계선)을 학습.',
        ],
        deepDive: {
          title: '퍼셉트론 학습 규칙과 선형 분류기',
          formulas: [
            {
              label: '퍼셉트론 출력과 가중치 업데이트',
              latex:
                '\\hat{y} = \\mathbb{I}(\\mathbf{w} \\cdot \\mathbf{x} + b > 0), \\quad \\mathbf{w} \\leftarrow \\mathbf{w} + \\eta (y - \\hat{y}) \\mathbf{x}',
              explanation:
                '예측이 틀렸을 때만(y - y_hat ≠ 0) 정답 방향으로 입력 벡터 x만큼 가중치 w를 이동시킵니다.',
            },
          ],
          papers: [
            {
              title: 'The Perceptron: A Probabilistic Model for Information Storage and Organization in the Brain',
              authors: 'Frank Rosenblatt',
              year: 1958,
              venue: 'Psychological Review',
              takeaway:
                '가중치 조절을 통해 기계가 패턴을 스스로 학습할 수 있음을 보인 신경망의 시초 논문입니다.',
            },
          ],
          implementationPoints: [
            '선형 분리 가능한(Linearly Separable) 데이터에 대해서는 퍼셉트론 수렴 정리에 의해 유한 번의 업데이트 안에 반드시 해를 찾습니다.',
          ],
        },
      },
      {
        kind: 'bridge',
        heading: '3. 다음 단계로 이어지는 이유: XOR의 벽과 수동 피처의 한계',
        lead: '단층 퍼셉트론은 직선 하나만 그을 수 있었고, 고전 머신러닝은 "무엇을 보고 판단할지"를 여전히 사람이 뽑아줘야 했습니다.',
        paragraphs: [
          '1969년 마빈 민스키와 시모어 페퍼트는 단층 퍼셉트론이 직선 하나로는 XOR(배타적 논리합) 같은 가장 단순한 비선형 패턴조차 풀지 못한다는 사실을 증명했습니다. 이 한계를 넘으려면 퍼셉트론을 여러 층으로 쌓아야 했지만, 당시에는 여러 층을 한꺼번에 학습시킬 방법이 마땅치 않았습니다.',
          '고전 머신러닝 역시 이미지에서 "가장자리 윤곽", "눈과 코의 비율" 같은 핵심 특징(Feature)을 도메인 전문가가 손으로 추출해 넣어주어야만 잘 작동했습니다. 데이터로부터 특징 자체를 여러 층에 걸쳐 스스로 추출하는 엔진, 바로 "딥러닝"이 필요해진 순간입니다.',
        ],
        keyPoints: [
          '단층 퍼셉트론의 한계: 직선 하나로 나눌 수 없는 문제(XOR)를 풀지 못한다.',
          '고전 ML의 한계: 이미지·음성·텍스트처럼 비정형 데이터에서는 사람이 좋은 특징(Feature)을 수작업으로 설계하기 어렵다.',
        ],
        deepDive: {
          title: 'XOR 비선형성과 표현 학습(Representation Learning)의 필요',
          formulas: [
            {
              label: 'XOR 진리표의 선형 분리 불가능성',
              latex:
                '\\text{XOR}(0,0)=0,\\; \\text{XOR}(1,1)=0,\\; \\text{XOR}(0,1)=1,\\; \\text{XOR}(1,0)=1',
              explanation:
                '2차원 평면에서 대각선 쌍이 같은 클래스를 가지므로, 단일 직선 w1*x1 + w2*x2 + b = 0으로는 두 클래스를 나눌 수 없습니다.',
            },
          ],
          papers: [
            {
              title: 'Perceptrons: An Introduction to Computational Geometry',
              authors: 'Marvin Minsky, Seymour Papert',
              year: 1969,
              venue: 'MIT Press',
              takeaway:
                '단층 퍼셉트론의 수학적 한계(XOR, 연결성 판별 불가)를 엄밀히 지적하며 다층 구조 학습의 필요성을 일깨웠습니다.',
            },
          ],
          implementationPoints: [
            '은닉층(Hidden Layer)을 추가하고 계단 함수 대신 미분 가능한 비선형 활성화 함수(ReLU, Sigmoid 등)를 쓰면 공간을 접어 XOR을 쉽게 풀 수 있습니다.',
          ],
        },
      },
    ],
    nextBridgeTeaser: '그렇다면 여러 층으로 쌓은 거대한 신경망은 대체 어떻게 수백만 개의 가중치를 한 번에 고칠 수 있을까요?',
    resources: [
      {
        title: 'AI의 역사 — 기호주의에서 연결주의(신경망)로의 전환',
        author: 'Stanford Encyclopedia of Philosophy (AI Overview)',
        url: 'https://plato.stanford.edu/entries/artificial-intelligence/',
        language: '영어 원문',
        subtitleInfo: '웹 텍스트 (브라우저 번역 권장)',
        difficulty: '입문',
        duration: '25분',
        note: '기호주의(GOFAI)의 철학적 가정과 논리적 접근이 왜 통계적 학습으로 이동했는지 가장 깊이 있게 정리한 백과사전입니다.',
      },
      {
        title: 'But what is a neural network? (Ch.1)',
        author: '3Blue1Brown',
        url: 'https://www.3blue1brown.com/lessons/neural-networks',
        language: '영어 원문',
        subtitleInfo: '한국어 자막 지원',
        difficulty: '입문',
        duration: '19분',
        note: '단일 뉴런(퍼셉트론)을 층층이 쌓았을 때 어떻게 이미지 속 패턴을 계층적으로 인식하게 되는지 직관적으로 보여줍니다.',
      },
      {
        title: 'A Visual Introduction to Machine Learning',
        author: 'R2D3',
        url: 'http://www.r2d3.us/visual-intro-to-machine-learning-part-1/',
        language: '영어 원문',
        subtitleInfo: '시각화 스크롤 아티클',
        difficulty: '입문',
        duration: '10분',
        note: '데이터에서 경계선을 긋는 고전 머신러닝(의사결정나무)의 작동 방식을 스크롤 애니메이션으로 체험할 수 있습니다.',
      },
    ],
  },
  {
    id: 2,
    badge: '2단계',
    title: '딥러닝의 엔진',
    subtitle: '다층 신경망, 손실함수, 역전파(Backpropagation), 그리고 경사하강법',
    readingTime: '약 16분',
    coreQuestion: '수억 개의 가중치가 얽힌 깊은 신경망에서 "누가 얼마나 잘못했는지"를 어떻게 정확히 찾아 고칠까?',
    summary:
      '단층 퍼셉트론의 벽을 넘기 위해 뉴런을 여러 층으로 쌓고 부드러운 비선형 함수를 넣었습니다. 그리고 최종 오차(손실함수)를 출력에서 입력 방향으로 거꾸로 전파해 각 가중치의 책임을 묻는 역전파와, 그 신호를 따라 오차를 줄이는 경사하강법이 결합되며 현대 딥러닝의 엔진이 완성되었습니다.',
    topics: ['다층 신경망(MLP)', '손실함수(Loss)', '역전파(Backpropagation)', '경사하강법(Gradient Descent)'],
    simulatorId: 'gradient-descent',
    simulatorCaption:
      '학습률(Learning Rate)과 손실 곡면을 바꿔가며 경사하강법이 수렴·진동·발산하는 과정을 직접 실험해 보세요.',
    sections: [
      {
        kind: 'limitation',
        heading: '1. 이전 기술의 한계: 층을 쌓아도 학습시킬 방법이 없었다',
        lead: 'XOR을 풀기 위해 은닉층을 추가하자, 이번에는 "중간층 가중치를 어떻게 업데이트해야 하는가"라는 책임 할당 문제가 등장했습니다.',
        paragraphs: [
          '출력층은 실제 정답과 직접 비교할 수 있으니 틀린 방향을 바로 알 수 있습니다. 하지만 입력과 출력 사이에 숨어 있는 중간층(은닉층) 뉴런들은 "내 가중치를 올려야 최종 오차가 줄어드는지, 내려야 줄어드는지" 알 길이 막막했습니다.',
          '게다가 초기 퍼셉트론의 계단 함수는 값이 0 아니면 1로 뚝뚝 끊어졌기 때문에, 가중치를 아주 조금 바꿨을 때 오차가 얼마나 변하는지(기울기)를 계산할 수 없었습니다. 깊은 신경망을 학습시키려면 미분 가능한 구조와 효율적인 책임 분배 알고리즘이 절실했습니다.',
        ],
        analogy: {
          title: '릴레이 팀의 실수 원인 찾기',
          body: '마지막 주자가 결승선에 늦게 들어왔을 때, 1번·2번·3번 주자 중 누가 얼마나 속도를 높여야 전체 기록이 단축되는지를 정확히 역산하는 것과 같습니다.',
        },
        keyPoints: [
          '신용 할당 문제(Credit Assignment Problem): 최종 오차에 각 중간층 가중치가 미친 영향을 알아내야 한다.',
          '계단 함수 대신 미분 가능한 활성화 함수(Sigmoid, Tanh, ReLU)가 필요했다.',
        ],
        deepDive: {
          title: '보편 근사 정리(Universal Approximation)와 미분 가능성의 역할',
          formulas: [
            {
              label: '비선형 활성화 함수 (ReLU)',
              latex: '\\text{ReLU}(x) = \\max(0, x)',
              explanation:
                '선형 변환 사이에 비선형 함수를 끼워 넣지 않으면 층을 백 개 쌓아도 결국 하나의 선형 변환과 같아집니다. ReLU는 양수 영역에서 기울기가 1로 일정해 깊은 망 학습에 혁명을 일으켰습니다.',
            },
          ],
          papers: [
            {
              title: 'Approximation by Superpositions of a Sigmoidal Function',
              authors: 'George Cybenko',
              year: 1989,
              venue: 'Mathematics of Control, Signals and Systems',
              takeaway:
                '비선형 활성화 함수를 가진 은닉층이 하나만 있어도 이론적으로 어떤 연속 함수든 원하는 정밀도로 근사할 수 있음을 증명했습니다.',
            },
          ],
          implementationPoints: [
            '실무에서는 깊이가 깊어져도 기울기가 0으로 사라지지 않도록(Vanishing Gradient 방지) ReLU, GELU, SwiGLU 같은 활성화 함수를 사용합니다.',
          ],
        },
      },
      {
        kind: 'mechanism',
        heading: '2. 핵심 작동 원리: 손실함수 · 역전파 · 경사하강법',
        lead: '오차를 하나의 숫자로 요약(손실함수)하고, 연쇄법칙으로 책임을 거꾸로 계산(역전파)한 뒤, 내리막으로 이동(경사하강법)합니다.',
        paragraphs: [
          '딥러닝의 학습 루프는 놀라울 정도로 일관된 3단계 반복입니다. 먼저 순전파(Forward Pass)로 예측값을 내고, 정답과 얼마나 다른지를 손실함수(Loss Function)라는 단 하나의 점수로 계산합니다.',
          '다음으로 역전파(Backpropagation)가 작동합니다. 출력의 오차에서 출발해 미분의 연쇄법칙(Chain Rule)을 따라 거꾸로 이동하며, 수억 개의 가중치 각각이 "전체 오차를 줄이려면 커져야 하는지 작아져야 하는지" 기울기(Gradient)를 한 번에 계산합니다.',
          '마지막으로 경사하강법(Gradient Descent)이 그 기울기의 반대 방향으로 학습률(Learning Rate)만큼 가중치를 이동시킵니다. 아래 시뮬레이터에서 학습률이 너무 작거나 클 때 어떤 일이 벌어지는지 직접 확인해 보세요.',
        ],
        analogy: {
          title: '보폭(학습률)의 예술',
          body: '산 아래 계곡(최소 오차)으로 내려갈 때 보폭이 너무 작으면 해가 저물도록 도착하지 못하고, 보폭이 너무 크면 계곡을 훌쩍 뛰어넘어 반대편 산등성이로 튕겨 나가 버립니다.',
        },
        keyPoints: [
          '손실함수(Loss): 모델의 실수를 하나의 숫자로 계량화한 점수판.',
          '역전파(Backprop): 연쇄법칙을 이용해 출력에서 입력 방향으로 모든 가중치의 기울기를 효율적으로 계산.',
          '경사하강법(Gradient Descent): 계산된 기울기를 따라 오차가 줄어드는 방향으로 가중치를 반복 수정.',
        ],
        deepDive: {
          title: '연쇄법칙 기반 역전파와 Adam 옵티마이저',
          formulas: [
            {
              label: '역전파의 연쇄법칙 (Chain Rule)',
              latex:
                '\\frac{\\partial L}{\\partial w_{ij}^{(l)}} = \\frac{\\partial L}{\\partial z_j^{(l)}} \\cdot \\frac{\\partial z_j^{(l)}}{\\partial w_{ij}^{(l)}} = \\delta_j^{(l)} \\cdot a_i^{(l-1)}',
              explanation:
                '상위 층에서 전달받은 오차 신호 δ에 해당 가중치로 들어온 입력 활성값 a를 곱하기만 하면 기울기가 즉시 구해집니다.',
            },
            {
              label: '경사하강법 업데이트 규칙',
              latex:
                '\\theta_{t+1} = \\theta_t - \\eta \\nabla_\\theta L(\\theta_t)',
              explanation:
                'η(학습률)는 한 스텝의 보폭을 결정하는 가장 중요한 하이퍼파라미터입니다.',
            },
          ],
          papers: [
            {
              title: 'Learning representations by back-propagating errors',
              authors: 'David E. Rumelhart, Geoffrey E. Hinton, Ronald J. Williams',
              year: 1986,
              venue: 'Nature',
              takeaway:
                '역전파가 다층 신경망의 은닉층에 의미 있는 내부 표현을 자동으로 만들어낸다는 사실을 대중화하며 신경망 부활을 이끌었습니다.',
            },
            {
              title: 'Adam: A Method for Stochastic Optimization',
              authors: 'Diederik P. Kingma, Jimmy Ba',
              year: 2015,
              venue: 'ICLR',
              takeaway:
                '과거 기울기의 관성(모멘텀)과 변동 폭(적응적 학습률)을 함께 추적해 현대 딥러닝 학습의 사실상 표준 옵티마이저가 되었습니다.',
            },
          ],
          implementationPoints: [
            '실제 대규모 모델은 전체 데이터를 다 쓰지 않고 미니배치(Mini-batch) 단위로 기울기를 추정하는 SGD/AdamW를 사용합니다.',
            '학습 초기에는 워밍업(Warmup)으로 학습률을 서서히 올리고, 이후 코사인 스케줄로 서서히 줄여 안정적으로 수렴시킵니다.',
          ],
          codeSnippet: {
            language: 'python',
            caption: 'PyTorch 스타일 학습 루프의 4줄 핵심',
            code: `loss = loss_fn(model(x_batch), y_batch)
optimizer.zero_grad()  # 이전 스텝의 기울기 초기화
loss.backward()        # 역전파로 모든 파라미터의 기울기 계산
optimizer.step()       # 경사하강법으로 가중치 업데이트`,
          },
        },
      },
      {
        kind: 'bridge',
        heading: '3. 다음 단계로 이어지는 이유: "무엇을, 어떤 순서로" 볼 것인가',
        lead: '역전파라는 강력한 학습 엔진을 얻었지만, 기본 다층 신경망(MLP)은 이미지의 공간 구조나 문장의 순서·문맥을 다루는 데 비효율적이었습니다.',
        paragraphs: [
          '기본 다층 신경망은 모든 입력을 일렬로 펼쳐서 연결합니다. 고양이 사진이 왼쪽에서 오른쪽으로 조금만 이동해도 완전히 다른 입력으로 인식하고, 문장 속 단어의 앞뒤 순서와 멀리 떨어진 문맥을 연결하기도 어렵습니다.',
          '게다가 단어를 어떻게 숫자로 바꿔야 의미가 보존될까요? 3단계에서는 의미를 공간에 심는 워드 임베딩과, 공간(CNN)·순서(RNN)를 다루기 위해 등장한 구조, 그리고 그 구조가 마주한 새로운 병목을 살펴봅니다.',
        ],
        keyPoints: [
          '딥러닝의 학습 엔진(손실함수+역전파+경사하강법)은 이후 모든 아키텍처에서도 그대로 쓰인다.',
          '3단계에서는 데이터 형태(단어·이미지·시퀀스)에 특화된 표현과 구조, 그리고 순차 처리의 병목을 다룬다.',
        ],
        deepDive: {
          title: '귀납적 편향(Inductive Bias)의 필요성',
          formulas: [
            {
              label: '완전연결층(MLP)의 파라미터 수',
              latex: '\\text{Params} = d_{\\text{in}} \\times d_{\\text{out}} + d_{\\text{out}}',
              explanation:
                '해상도가 큰 이미지나 긴 문장을 통째로 완전연결층에 넣으면 파라미터 수가 폭증하고 위치 불변성이나 시간 순서를 활용하지 못합니다.',
            },
          ],
          papers: [
            {
              title: 'Gradient-Based Learning Applied to Document Recognition',
              authors: 'Yann LeCun, Léon Bottou, Yoshua Bengio, Patrick Haffner',
              year: 1998,
              venue: 'Proceedings of the IEEE',
              takeaway:
                '가중치 공유와 지역 수용장을 도입한 합성곱 신경망(LeNet)으로 단순 MLP 대비 시각 패턴 인식의 압도적 효율을 증명했습니다.',
            },
          ],
          implementationPoints: [
            '아키텍처의 진화는 결국 "어떤 데이터 구조를 가정하고 가중치를 효율적으로 공유할 것인가"의 역사입니다.',
          ],
        },
      },
    ],
    nextBridgeTeaser: '그렇다면 AI는 인간의 언어를 어떻게 의미 있는 숫자로 바꾸고, 문장의 순서를 어떻게 처리했을까요?',
    resources: [
      {
        title: 'Gradient descent, how neural networks learn (Ch.2)',
        author: '3Blue1Brown',
        url: 'https://www.3blue1brown.com/lessons/gradient-descent',
        language: '영어 원문',
        subtitleInfo: '한국어 자막 지원',
        difficulty: '입문',
        duration: '21분',
        note: '손실함수 지형 위에서 경사하강법이 최소점을 찾아 내려가는 과정을 시각적으로 완벽히 이해할 수 있습니다.',
      },
      {
        title: 'What is backpropagation really doing? (Ch.3)',
        author: '3Blue1Brown',
        url: 'https://www.3blue1brown.com/lessons/backpropagation',
        language: '영어 원문',
        subtitleInfo: '한국어 자막 지원',
        difficulty: '중급',
        duration: '14분',
        note: '역전파가 단순히 미분 공식이 아니라, 출력 오차가 이전 층의 가중치들을 어떻게 밀고 당기는지 직관적으로 설명합니다.',
      },
      {
        title: 'micrograd — 직접 만들어보는 자동미분(Autograd) 엔진',
        author: 'Andrej Karpathy',
        url: 'https://www.youtube.com/watch?v=VMj-3S1tku0',
        language: '영어 원문',
        subtitleInfo: '영어/자동 자막 지원',
        difficulty: '중급',
        duration: '2시간 25분 (필요 구간 발췌 추천)',
        note: '단 100줄의 파이썬 코드로 역전파와 경사하강법을 바닥부터 구현하며 엔진의 작동 원리를 완전히 해부합니다.',
      },
    ],
  },
  {
    id: 3,
    badge: '3단계',
    title: '표현과 시퀀스',
    subtitle: '워드 임베딩(Word Embedding), CNN·RNN의 구조와 순차 처리·장기 의존성 병목',
    readingTime: '약 16분',
    coreQuestion: 'AI는 단어의 뜻을 어떻게 공간 좌표로 배웠고, 문장을 앞에서부터 한 글자씩 읽던 RNN은 왜 한계에 부딪혔을까?',
    summary:
      '문맥 속에서 함께 등장하는 단어들이 비슷한 좌표를 갖도록 학습하는 워드 임베딩은 AI에게 언어의 의미 공간을 선물했습니다. 이어서 이미지를 다루는 CNN과 문장의 순서를 따라 읽는 RNN(LSTM)이 활약했지만, 한 번에 한 단어씩만 읽어야 하는 순차 병목과 긴 문장 앞부분을 까먹는 장기 의존성 문제가 거대한 벽으로 남았습니다.',
    topics: ['워드 임베딩(Word2Vec)', 'CNN과 공간 계층', 'RNN·LSTM의 순차 처리 병목'],
    simulatorId: 'word-embedding',
    simulatorCaption:
      '2D 의미 공간에서 단어 간 유사도를 탐색하고, "왕 - 남자 + 여자 ≈ 여왕" 같은 벡터 유추 연산을 직접 실험해 보세요.',
    sections: [
      {
        kind: 'limitation',
        heading: '1. 이전 기술의 한계: 단어를 번호표(One-Hot)로 취급하던 시절',
        lead: '단어를 단순히 사전 번호로 매기면 "왕"과 "여왕"의 거리나 "왕"과 "사과"의 거리가 똑같이 취급됩니다.',
        paragraphs: [
          '초기 자연어 처리에서는 사전에 단어가 5만 개 있다면 각 단어를 5만 칸짜리 배열 중 자기 칸만 1이고 나머지는 0인 원-핫 벡터(One-Hot Vector)로 표현했습니다. 이 방식에서는 두 단어 벡터를 내적하면 언제나 0이 나옵니다. 의미적 유사성이 전혀 반영되지 않는 것입니다.',
          '또한 문장의 길이는 매번 달라지는데, 고정 크기 입력만 받는 일반 신경망(MLP)은 5단어 문장과 50단어 문장을 같은 구조로 처리할 수 없었습니다. 가변 길이 시퀀스를 읽고 기억하는 새로운 설계가 필요했습니다.',
        ],
        analogy: {
          title: '도서관 청구기호 vs 주제별 서가',
          body: '원-핫 인코딩은 책을 가나다순 번호표로만 구분해 "물리학 개론"과 "양자역학"이 전혀 다른 서가에 흩어진 상태와 같습니다. 의미가 가까운 책들을 같은 구역에 모으는 것이 임베딩입니다.',
        },
        keyPoints: [
          '원-핫 인코딩의 한계: 단어 수가 늘어날수록 차원이 폭발하고 단어 간 의미 유사도를 표현하지 못한다.',
          '고정 길이 입력의 한계: 문장처럼 길이가 변하는 순서 데이터(시퀀스)를 유연하게 다루지 못한다.',
        ],
        deepDive: {
          title: '원-핫 벡터의 직교성과 분포 가설(Distributional Hypothesis)',
          formulas: [
            {
              label: '원-핫 벡터의 내적',
              latex: '\\mathbf{e}_i \\cdot \\mathbf{e}_j = 0 \\quad (i \\neq j)',
              explanation:
                '서로 다른 모든 단어 벡터가 수학적으로 완전히 직교하므로, 통계적 공유나 의미적 근접성을 학습하기 어렵습니다.',
            },
          ],
          papers: [
            {
              title: 'A Neural Probabilistic Language Model',
              authors: 'Yoshua Bengio, Réjean Ducharme, Pascal Vincent, Christian Jauvin',
              year: 2003,
              venue: 'JMLR',
              takeaway:
                '단어를 저차원 연속 벡터(분산 표현)로 투영해 학습함으로써 처음 보는 단어 조합도 일반화할 수 있음을 보인 현대 언어 모델의 원형입니다.',
            },
          ],
          implementationPoints: [
            '임베딩 층(Embedding Layer)은 사실상 원-핫 벡터에 거대한 조회 테이블 행렬을 곱하는 것과 같아, 인덱스 조회(Lookup)만으로 O(1)에 벡터를 꺼냅니다.',
          ],
        },
      },
      {
        kind: 'mechanism',
        heading: '2. 핵심 작동 원리: 워드 임베딩과 CNN·RNN의 등장',
        lead: 'Word2Vec은 단어를 의미 지도에 배치했고, CNN은 국소 패턴을, RNN은 시간의 흐름을 따라 기억을 전달했습니다.',
        paragraphs: [
          '"비슷한 문맥에 등장하는 단어는 비슷한 뜻을 가진다"는 아이디어에서 탄생한 워드 임베딩(Word2Vec 등)은 주변 단어를 예측하는 학습을 통해 단어를 수백 차원의 연속 공간에 배치합니다. 놀랍게도 이 공간에서는 "서울 - 한국 + 일본 ≈ 도쿄"처럼 의미의 방향 연산이 성립합니다.',
          '한편 데이터 구조에 특화된 신경망도 발전했습니다. CNN(합성곱 신경망)은 작은 돋보기(필터)를 이미지 위로 훑으며 선·질감·사물 전체로 계층을 쌓아 시각 AI를 정복했고, RNN(순환 신경망)은 이전 단어까지 읽은 요약 상태(Hidden State)를 다음 스텝으로 넘기며 문장을 순서대로 읽었습니다. LSTM은 중요한 기억을 오래 남기는 게이트를 추가해 RNN을 한층 강화했습니다.',
        ],
        analogy: {
          title: '메모장 하나를 들고 책 읽기 (RNN)',
          body: 'RNN은 책을 첫 단어부터 끝 단어까지 한 글자씩 읽으면서, 손바닥만 한 메모장(Hidden State)에 지금까지의 줄거리를 매번 지우고 다시 적어가며 읽는 독자입니다.',
        },
        keyPoints: [
          '워드 임베딩: 단어의 의미를 연속 벡터 공간의 좌표와 방향으로 압축 표현.',
          'CNN: 이동 불변성과 지역 패턴 계층화로 컴퓨터 비전의 표준을 수립.',
          'RNN / LSTM: 은닉 상태(Hidden State)를 순차적으로 전달해 시퀀스의 순서를 처리.',
        ],
        deepDive: {
          title: 'Skip-gram 목적함수와 RNN의 순환 상태 업데이트',
          formulas: [
            {
              label: 'RNN 은닉 상태 순환식',
              latex:
                '\\mathbf{h}_t = \\tanh(W_{hh}\\mathbf{h}_{t-1} + W_{xh}\\mathbf{x}_t + \\mathbf{b})',
              explanation:
                '시점 t의 기억 h_t는 반드시 직전 시점 t-1의 기억 h_{t-1}이 계산된 뒤에야 계산할 수 있습니다.',
            },
            {
              label: 'Word2Vec Skip-gram 확률',
              latex:
                'P(w_o \\mid w_c) = \\frac{\\exp(\\mathbf{u}_{w_o}^\\top \\mathbf{v}_{w_c})}{\\sum_{w \\in V} \\exp(\\mathbf{u}_w^\\top \\mathbf{v}_{w_c})}',
              explanation:
                '중심 단어 w_c의 벡터와 주변 단어 w_o의 벡터 내적이 클수록 함께 등장할 확률이 높아지도록 학습합니다.',
            },
          ],
          papers: [
            {
              title: 'Efficient Estimation of Word Representations in Vector Space',
              authors: 'Tomas Mikolov, Kai Chen, Greg Corrado, Jeffrey Dean',
              year: 2013,
              venue: 'ICLR Workshop',
              takeaway:
                'Word2Vec을 제안하며 단순 선형 벡터 연산만으로 단어 간 의미·문법 유추(Analogy)가 가능함을 보여주었습니다.',
            },
            {
              title: 'Long Short-Term Memory',
              authors: 'Sepp Hochreiter, Jürgen Schmidhuber',
              year: 1997,
              venue: 'Neural Computation',
              takeaway:
                '망각 게이트와 입력 게이트로 기울기 소실 문제를 완화해 RNN의 기억 길이를 크게 늘렸습니다.',
            },
          ],
          implementationPoints: [
            '대규모 어휘집에서 Softmax 분모를 다 계산하는 것은 느리므로 Word2Vec은 Negative Sampling을 사용합니다.',
            '현대 LLM의 토큰 임베딩(Token Embedding)은 고정된 Word2Vec과 달리 모델 전체와 함께 End-to-End로 학습되며, 문맥에 따라 의미가 동적으로 변합니다.',
          ],
        },
      },
      {
        kind: 'bridge',
        heading: '3. 다음 단계로 이어지는 이유: 순차 병목과 장기 의존성의 한계',
        lead: 'RNN은 본질적으로 "앞 단어 계산이 끝나야 다음 단어를 읽을 수 있는" 구조라 GPU 병렬화가 불가능했고, 문장이 길어지면 앞부분 기억이 흐려졌습니다.',
        paragraphs: [
          'RNN은 100번째 단어를 처리하려면 반드시 1번부터 99번까지 순서대로 거쳐야 합니다. 수천 개의 코어로 동시에 계산하는 GPU의 강력한 병렬 처리 능력을 놀릴 수밖에 없었고, 그래서 인터넷 전체의 텍스트를 학습시키는 대규모 확장이 불가능했습니다.',
          '또한 아무리 LSTM 게이트로 보완해도, 모든 과거 정보를 고정된 크기의 작은 은닉 상태 벡터 하나에 계속 압축해 넣다 보니 문장이 수백 토큰을 넘어가면 초반의 핵심 맥락이 희석되는 정보 병목이 발생했습니다. "순서대로 읽지 말고, 문장 안의 모든 단어가 서로를 직접 쳐다보게 만들면 어떨까?" — 이것이 바로 Transformer 혁명의 출발점입니다.',
        ],
        keyPoints: [
          '순차 처리 병목: h_t가 h_{t-1}에 의존하므로 학습 시 시간축 병렬화가 불가능하다.',
          '장기 의존성 병목: 긴 문맥이 단일 은닉 벡터로 압축되며 멀리 떨어진 단어 간 연결이 약해진다.',
        ],
        deepDive: {
          title: '순환 구조의 경로 길이 O(N) 문제',
          formulas: [
            {
              label: '거리 N만큼 떨어진 두 토큰 간 기울기 전달',
              latex:
                '\\frac{\\partial \\mathbf{h}_T}{\\partial \\mathbf{h}_1} = \\prod_{t=2}^{T} \\frac{\\partial \\mathbf{h}_t}{\\partial \\mathbf{h}_{t-1}}',
              explanation:
                '거리가 멀수록 야코비안 행렬을 T-1번 거듭 곱해야 하므로 기울기 소실 또는 폭발이 구조적으로 발생하기 쉽습니다.',
            },
          ],
          papers: [
            {
              title: 'Neural Machine Translation by Jointly Learning to Align and Translate',
              authors: 'Dzmitry Bahdanau, Kyunghyun Cho, Yoshua Bengio',
              year: 2015,
              venue: 'ICLR',
              takeaway:
                '고정 크기 벡터 하나의 병목을 깨기 위해 디코더가 인코더의 모든 시점 은닉 상태를 직접 참조하는 어텐션(Attention) 메커니즘을 처음 도입했습니다.',
            },
          ],
          implementationPoints: [
            'Bahdanau 어텐션은 여전히 RNN 위에 얹힌 보조 장치였지만, 2년 뒤 구글 연구진은 RNN 자체를 완전히 버리고 어텐션만 남기는 결단을 내립니다.',
          ],
        },
      },
    ],
    nextBridgeTeaser: 'RNN을 버리고 문장 내 모든 단어가 거리에 상관없이 서로를 한 번에 직접 연결하려면 어떤 장치가 필요할까요?',
    resources: [
      {
        title: 'Understanding LSTM Networks',
        author: 'Christopher Olah (Colah’s Blog)',
        url: 'https://colah.github.io/posts/2015-08-Understanding-LSTMs/',
        language: '영어 원문',
        subtitleInfo: '시각화 다이어그램 중심 블로그',
        difficulty: '중급',
        duration: '20분',
        note: 'RNN이 왜 장기 기억에 실패하는지, LSTM의 게이트가 어떻게 정보를 유지하고 버리는지 전설적인 도식으로 설명합니다.',
      },
      {
        title: 'The Illustrated Word2Vec',
        author: 'Jay Alammar',
        url: 'https://jalammar.github.io/illustrated-word2vec/',
        language: '영어 원문',
        subtitleInfo: '일러스트 중심 가이드',
        difficulty: '입문',
        duration: '15분',
        note: '단어가 임베딩 벡터로 변환되고 유사도 공간에 자리 잡는 과정을 직관적인 그림으로 완벽하게 풀어냅니다.',
      },
      {
        title: 'The Unreasonable Effectiveness of Recurrent Neural Networks',
        author: 'Andrej Karpathy',
        url: 'https://karpathy.github.io/2015/05/21/rnn-effectiveness/',
        language: '영어 원문',
        subtitleInfo: '텍스트 에세이',
        difficulty: '중급',
        duration: '25분',
        note: 'RNN이 코드, 셰익스피어 희곡, 수학 논문까지 생성해 내던 시대의 생생한 통찰과 한계를 함께 엿볼 수 있습니다.',
      },
    ],
  },
];
