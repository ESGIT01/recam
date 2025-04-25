<!-- CampaignRegister.vue -->
<template>
    <div class="campaign-register">
      <!-- 상단 프로그레스 바 -->
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress" :style="{ width: `${(currentStep / totalSteps) * 100}%` }"></div>
        </div>
        <div class="progress-text">{{ currentStep }} / {{ totalSteps }}</div>
      </div>
      
      <!-- 단계별 컨텐츠 영역 -->
      <div class="step-content">
        <!-- 1단계: 상호명 입력 -->
        <div v-if="currentStep === 1" class="step-container">
          <h2>상호명을 입력해주세요</h2>
          <div class="input-container">
            <input 
              v-model="campaignData.companyName" 
              type="text" 
              placeholder="상호명을 입력하세요" 
              class="base-input"
            />
          </div>
          <div class="button-group">
            <button 
              @click="nextStep" 
              :disabled="!campaignData.companyName" 
              class="base-button primary"
            >
              다음
            </button>
          </div>
        </div>
        
        <!-- 2단계: 썸네일 등록 -->
        <div v-else-if="currentStep === 2" class="step-container">
          <h2>썸네일을 등록해주세요</h2>
          <div class="image-uploader">
            <div v-if="!campaignData.thumbnail" class="upload-placeholder" @click="triggerFileInput">
              <div class="upload-icon">+</div>
              <div class="upload-text">이미지를 업로드하세요</div>
            </div>
            <div v-else class="thumbnail-preview">
              <img :src="campaignData.thumbnailPreview" alt="썸네일 미리보기" />
              <div class="remove-thumbnail" @click="removeThumbnail">×</div>
            </div>
            <input 
              type="file" 
              ref="fileInput" 
              accept="image/*" 
              class="file-input" 
              @change="handleFileUpload" 
            />
          </div>
          <div class="button-group">
            <button @click="prevStep" class="base-button outline">이전</button>
            <button 
              @click="nextStep" 
              :disabled="!campaignData.thumbnail" 
              class="base-button primary"
            >
              다음
            </button>
          </div>
        </div>
        
        <!-- 3단계: 담당자 연락처 등록 -->
        <div v-else-if="currentStep === 3" class="step-container">
          <h2>담당자 연락처를 입력해주세요</h2>
          <div class="input-container">
            <input 
              v-model="campaignData.contactInfo" 
              type="text" 
              placeholder="담당자 연락처를 입력하세요" 
              class="base-input"
            />
          </div>
          <div class="button-group">
            <button @click="prevStep" class="base-button outline">이전</button>
            <button 
              @click="nextStep" 
              :disabled="!campaignData.contactInfo" 
              class="base-button primary"
            >
              다음
            </button>
          </div>
        </div>
        
        <!-- 4단계: 캠페인 유형 선택 -->
        <div v-else-if="currentStep === 4" class="step-container">
          <h2>캠페인 유형을 선택해주세요</h2>
          <div class="campaign-type-options">
            <div 
              v-for="type in campaignTypes" 
              :key="type.value" 
              class="campaign-type-option" 
              :class="{ 'selected': campaignData.campaignType === type.value }"
              @click="selectCampaignType(type.value)"
            >
              <div class="option-icon">{{ type.icon }}</div>
              <div class="option-label">{{ type.label }}</div>
            </div>
          </div>
          <div class="button-group">
            <button @click="prevStep" class="base-button outline">이전</button>
            <button 
              @click="nextStep" 
              :disabled="!campaignData.campaignType" 
              class="base-button primary"
            >
              다음
            </button>
          </div>
        </div>
        
        <!-- 5단계: 캠페인별 카테고리 선택 (조건부 렌더링) -->
        <div v-else-if="currentStep === 5" class="step-container">
          <!-- 배송형 카테고리 -->
          <div v-if="campaignData.campaignType === 'delivery'">
            <h2>제품 URL을 입력하고 카테고리를 선택해주세요</h2>
            <div class="input-container">
              <input 
                v-model="campaignData.productUrl" 
                type="text" 
                placeholder="제품 URL을 입력하세요" 
                class="base-input"
              />
            </div>
            <div class="category-selection">
              <div 
                v-for="category in deliveryCategories" 
                :key="category.value" 
                class="category-item" 
                :class="{ 'selected': campaignData.category === category.value }"
                @click="selectCategory(category.value)"
              >
                {{ category.label }}
              </div>
            </div>
          </div>
          
          <!-- 방문형 카테고리 -->
          <div v-else-if="campaignData.campaignType === 'visit'">
            <h2>방문 주소를 입력하고 카테고리를 선택해주세요</h2>
            <div class="input-container">
              <input 
                v-model="campaignData.address" 
                type="text" 
                placeholder="방문 주소를 입력하세요" 
                class="base-input"
              />
            </div>
            <div class="category-selection">
              <div 
                v-for="category in visitCategories" 
                :key="category.value" 
                class="category-item" 
                :class="{ 'selected': campaignData.category === category.value }"
                @click="selectCategory(category.value)"
              >
                {{ category.label }}
              </div>
            </div>
          </div>
          
          <!-- 구매형 카테고리 -->
          <div v-else-if="campaignData.campaignType === 'purchase'">
            <h2>구매 URL을 입력하고 카테고리를 선택해주세요</h2>
            <div class="input-container">
              <input 
                v-model="campaignData.purchaseUrl" 
                type="text" 
                placeholder="구매 URL을 입력하세요" 
                class="base-input"
              />
            </div>
            <div class="category-selection">
              <div 
                v-for="category in purchaseCategories" 
                :key="category.value" 
                class="category-item" 
                :class="{ 'selected': campaignData.category === category.value }"
                @click="selectCategory(category.value)"
              >
                {{ category.label }}
              </div>
            </div>
          </div>
          
          <!-- 기자단 카테고리 -->
          <div v-else-if="campaignData.campaignType === 'reporter'">
            <h2>참고 URL을 입력하고 카테고리를 선택해주세요</h2>
            <div class="input-container">
              <input 
                v-model="campaignData.referenceUrl" 
                type="text" 
                placeholder="참고 URL을 입력하세요" 
                class="base-input"
              />
            </div>
            <div class="category-selection">
              <div 
                v-for="category in reporterCategories" 
                :key="category.value" 
                class="category-item" 
                :class="{ 'selected': campaignData.category === category.value }"
                @click="selectCategory(category.value)"
              >
                {{ category.label }}
              </div>
            </div>
          </div>
          
          <div class="button-group">
            <button @click="prevStep" class="base-button outline">이전</button>
            <button 
              @click="nextStep" 
              :disabled="!isStep5Valid" 
              class="base-button primary"
            >
              다음
            </button>
          </div>
        </div>
        
        <!-- 6단계: 채널 유형 선택 -->
        <div v-else-if="currentStep === 6" class="step-container">
          <h2>채널 유형을 선택해주세요</h2>
          <div class="channel-selection">
            <div 
              v-for="channel in channelTypes" 
              :key="channel.value" 
              class="channel-item"
              :class="{ 'selected': campaignData.channelTypes.includes(channel.value) }"
              @click="toggleChannelType(channel.value)"
            >
              <div class="channel-icon">{{ channel.icon }}</div>
              <div class="channel-label">{{ channel.label }}</div>
            </div>
          </div>
          <div class="button-group">
            <button @click="prevStep" class="base-button outline">이전</button>
            <button 
              @click="nextStep" 
              :disabled="campaignData.channelTypes.length === 0" 
              class="base-button primary"
            >
              다음
            </button>
          </div>
        </div>
        
        <!-- 7단계: 체험단 미션 설정 -->
        <div v-else-if="currentStep === 7" class="step-container">
          <h2>체험단 미션을 설정해주세요</h2>
          <p class="step-description">리뷰시에 강조하고 싶은 점들을 선택해주세요</p>
          
          <div class="mission-input-container">
            <div class="mission-input-wrap">
              <input 
                v-model="newMission" 
                type="text" 
                placeholder="미션을 입력하세요" 
                class="base-input"
                @keyup.enter="addMission"
              />
              <button @click="addMission" class="add-button" :disabled="!newMission">추가</button>
            </div>
            
            <div class="mission-examples">
              <div 
                v-for="example in missionExamples" 
                :key="example"
                class="mission-example"
                @click="selectMissionExample(example)"
              >
                {{ example }}
              </div>
            </div>
          </div>
          
          <div class="mission-tags">
            <div 
              v-for="(mission, index) in campaignData.missions" 
              :key="index" 
              class="mission-tag"
            >
              <span>{{ mission }}</span>
              <button @click="removeMission(index)" class="remove-tag">×</button>
            </div>
          </div>
          
          <div class="button-group">
            <button @click="prevStep" class="base-button outline">이전</button>
            <button 
              @click="nextStep" 
              :disabled="campaignData.missions.length === 0" 
              class="base-button primary"
            >
              다음
            </button>
          </div>
        </div>
        
        <!-- 8단계: 키워드 설정 -->
        <div v-else-if="currentStep === 8" class="step-container">
          <h2>키워드를 설정해주세요</h2>
          <p class="step-description">키워드 1개를 제목에 필수입력하고, 키워드 중 3개를 본문에 포함합니다</p>
          
          <div class="keyword-input-container">
            <div class="keyword-input-wrap">
              <input 
                v-model="newKeyword" 
                type="text" 
                placeholder="키워드를 입력하세요" 
                class="base-input"
                @keyup.enter="addKeyword"
              />
              <button 
                @click="addKeyword" 
                class="add-button" 
                :disabled="!newKeyword || campaignData.keywords.length >= 5"
              >
                추가
              </button>
            </div>
            
            <div class="keyword-count">{{ campaignData.keywords.length }}/5</div>
          </div>
          
          <div class="keyword-tags">
            <div 
              v-for="(keyword, index) in campaignData.keywords" 
              :key="index" 
              class="keyword-tag"
            >
              <span>{{ keyword }}</span>
              <button @click="removeKeyword(index)" class="remove-tag">×</button>
            </div>
          </div>
          
          <div class="button-group">
            <button @click="prevStep" class="base-button outline">이전</button>
            <button 
              @click="nextStep" 
              :disabled="campaignData.keywords.length < 5" 
              class="base-button primary"
            >
              다음
            </button>
          </div>
        </div>
        
        <!-- 9단계: 제공 내역 설정 -->
        <div v-else-if="currentStep === 9" class="step-container">
          <h2>제공 내역을 설정해주세요</h2>
          <p class="step-description">체험단에게 제공할 품목과 가격을 입력해주세요</p>
          
          <div class="provision-items">
            <div 
              v-for="(item, index) in campaignData.provisionItems" 
              :key="index" 
              class="provision-item"
            >
              <div class="provision-item-content">
                <div class="provision-item-name">{{ item.name }}</div>
                <div class="provision-item-price">{{ formatPrice(item.price) }}원</div>
              </div>
              <button @click="removeProvisionItem(index)" class="remove-item">삭제</button>
            </div>
            
            <div v-if="showAddProvisionForm" class="add-provision-form">
              <input 
                v-model="newProvisionItem.name" 
                type="text" 
                placeholder="품목명" 
                class="base-input"
              />
              <input 
                v-model.number="newProvisionItem.price" 
                type="number" 
                placeholder="가격" 
                class="base-input"
                min="0"
              />
              <div class="provision-form-buttons">
                <button @click="cancelAddProvisionItem" class="base-button outline sm">취소</button>
                <button 
                  @click="confirmAddProvisionItem" 
                  class="base-button primary sm"
                  :disabled="!newProvisionItem.name || !newProvisionItem.price"
                >
                  확인
                </button>
              </div>
            </div>
            
            <button 
              v-if="!showAddProvisionForm" 
              @click="showAddProvisionForm = true" 
              class="add-provision-button"
            >
              + 품목 추가
            </button>
          </div>
          
          <div class="total-provision">
            <span>총 제공 금액</span>
            <span class="total-price">{{ formatPrice(totalProvisionPrice) }}원</span>
          </div>
          
          <div class="button-group">
            <button @click="prevStep" class="base-button outline">이전</button>
            <button 
              @click="nextStep" 
              :disabled="campaignData.provisionItems.length === 0" 
              class="base-button primary"
            >
              다음
            </button>
          </div>
        </div>
        
        <!-- 10단계: 체험단 모집 인원 -->
        <div v-else-if="currentStep === 10" class="step-container">
          <h2>체험단 모집 인원을 설정해주세요</h2>
          
          <div class="recruitment-input">
            <div class="counter-control">
              <button 
                @click="decreaseRecruitment" 
                class="counter-button" 
                :disabled="campaignData.recruitmentCount <= 1"
              >
                -
              </button>
              <div class="counter-value">{{ campaignData.recruitmentCount }}명</div>
              <button 
                @click="increaseRecruitment" 
                class="counter-button"
                :disabled="campaignData.recruitmentCount >= 100"
              >
                +
              </button>
            </div>
          </div>
          
          <div class="button-group">
            <button @click="prevStep" class="base-button outline">이전</button>
            <button 
              @click="nextStep" 
              :disabled="campaignData.recruitmentCount <= 0" 
              class="base-button primary"
            >
              다음
            </button>
          </div>
        </div>
        
        <!-- 11단계: 지급할 포인트 설정 -->
        <div v-else-if="currentStep === 11" class="step-container">
          <h2>지급할 포인트를 설정해주세요</h2>
          <p class="step-description">체험단에게 지급할 포인트를 설정하세요. 포인트가 없을 시 결제가 필요합니다.</p>
          
          <div class="point-input-container">
            <input 
              v-model.number="campaignData.rewardPoint" 
              type="number" 
              placeholder="지급할 포인트" 
              class="base-input with-suffix"
              min="0"
            />
            <div class="input-suffix">P</div>
          </div>
          
          <div v-if="campaignData.rewardPoint > 0" class="fee-info">
            <div class="fee-item">
              <span>수수료 (5%)</span>
              <span>{{ formatPrice(calculateFee()) }}P</span>
            </div>
            <div class="fee-item total">
              <span>총 차감 포인트</span>
              <span>{{ formatPrice(calculateTotalPoint()) }}P</span>
            </div>
          </div>
          
          <div v-else class="payment-required-message">
            포인트를 지급하지 않을 경우 별도의 결제 과정이 진행됩니다.
          </div>
          
          <div class="button-group">
            <button @click="prevStep" class="base-button outline">이전</button>
            <button 
              @click="finishRegistration" 
              class="base-button primary"
            >
              등록 완료
            </button>
          </div>
        </div>
        
        <!-- 등록 완료 화면 -->
        <div v-else-if="currentStep > totalSteps" class="step-container completion">
          <div class="completion-icon">✓</div>
          <h2>캠페인 등록이 완료되었습니다!</h2>
          <p class="completion-message">등록하신 캠페인은 검수 후 승인됩니다.</p>
          <div class="button-group centered">
            <button @click="goToMyPage" class="base-button primary">마이페이지로 이동</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  
  const router = useRouter();
  const route = useRoute();
  const fileInput = ref(null);
  
  // 현재 단계 (라우터 쿼리에서 가져옴)
  const currentStep = computed(() => {
    return parseInt(route.query.step || '1');
  });
  
  const totalSteps = 11;
  
  // 캠페인 데이터
  const campaignData = ref({
    companyName: '',
    thumbnail: null,
    thumbnailPreview: '',
    contactInfo: '',
    campaignType: '',
    category: '',
    productUrl: '',
    address: '',
    purchaseUrl: '',
    referenceUrl: '',
    channelTypes: [],
    missions: [],
    keywords: [],
    provisionItems: [],
    recruitmentCount: 1, // 기본값 1명
    rewardPoint: 0
  });
  
  // 캠페인 유형 옵션
  const campaignTypes = [
    { value: 'delivery', label: '배송형', icon: '📦' },
    { value: 'visit', label: '방문형', icon: '🏠' },
    { value: 'purchase', label: '구매형', icon: '🛒' },
    { value: 'reporter', label: '기자단', icon: '📝' }
  ];
  
  // 배송형 카테고리
  const deliveryCategories = [
    { value: 'food', label: '식품' },
    { value: 'living', label: '생활' },
    { value: 'beauty', label: '뷰티' },
    { value: 'kids', label: '유아동' },
    { value: 'sports', label: '스포츠/아웃도어' },
    { value: 'fashion', label: '패션/잡화' },
    { value: 'pet', label: '반려동물' },
    { value: 'tech', label: '테크/가전' },
    { value: 'books', label: '도서/교육' },
    { value: 'service', label: '서비스' },
    { value: 'etc', label: '기타' }
  ];
  
  // 방문형 카테고리
  const visitCategories = [
    { value: 'restaurant', label: '맛집' },
    { value: 'accommodation', label: '숙박' },
    { value: 'beauty', label: '뷰티' },
    { value: 'culture', label: '문화' },
    { value: 'delivery', label: '배달' },
    { value: 'sports', label: '스포츠/레저' },
    { value: 'takeout', label: '테이크아웃' },
    { value: 'etc', label: '기타' }
  ];
  
  // 구매형 카테고리
  const purchaseCategories = [
    { value: 'review', label: '구매평' },
    { value: 'review_plus', label: '구매평 + 리뷰' }
  ];
  
  // 기자단 카테고리
  const reporterCategories = [
    { value: 'article', label: '원고형' },
    { value: 'return', label: '회수형' }
  ];
  
  // 5단계 유효성 검사
  const isStep5Valid = computed(() => {
    if (campaignData.value.campaignType === 'delivery') {
      return campaignData.value.productUrl && campaignData.value.category;
    } else if (campaignData.value.campaignType === 'visit') {
      return campaignData.value.address && campaignData.value.category;
    } else if (campaignData.value.campaignType === 'purchase') {
      return campaignData.value.purchaseUrl && campaignData.value.category;
    } else if (campaignData.value.campaignType === 'reporter') {
      return campaignData.value.referenceUrl && campaignData.value.category;
    }
    return false;
  });
  
  // 단계 이동 함수
  const nextStep = () => {
    if (currentStep.value < totalSteps) {
      router.push({
        query: { step: currentStep.value + 1 }
      });
    }
  };
  
  const prevStep = () => {
    if (currentStep.value > 1) {
      router.push({
        query: { step: currentStep.value - 1 }
      });
    }
  };
  
  // 캠페인 유형 선택
  const selectCampaignType = (type) => {
    campaignData.value.campaignType = type;
    // 유형이 바뀌면 카테고리 초기화
    campaignData.value.category = '';
  };
  
  // 카테고리 선택
  const selectCategory = (category) => {
    campaignData.value.category = category;
  };
  
  // 이미지 업로드 관련 함수
  const triggerFileInput = () => {
    fileInput.value.click();
  };
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      campaignData.value.thumbnail = file;
      // 미리보기 URL 생성
      campaignData.value.thumbnailPreview = URL.createObjectURL(file);
    }
  };
  
  const removeThumbnail = () => {
    campaignData.value.thumbnail = null;
    campaignData.value.thumbnailPreview = '';
    fileInput.value.value = ''; // 파일 인풋 초기화
  };
  
  // 채널 유형 옵션
  const channelTypes = [
    { value: 'blog', label: '블로그', icon: '📄' },
    { value: 'instagram', label: '인스타그램', icon: '📸' },
    { value: 'youtube', label: '유튜브', icon: '🎥' },
    { value: 'tiktok', label: '틱톡', icon: '🎵' },
    { value: 'clip', label: '클립 - 블로그', icon: '📎' },
    { value: 'reels', label: '릴스 - 인스타그램', icon: '🎞️' },
    { value: 'shorts', label: '쇼츠 - 유튜브', icon: '📱' }
  ];
  
  // 체험단 미션 예시
  const missionExamples = [
    '분위기 좋은 카페',
    '회식 장소',
    '주차장이 넓어요',
    '친절한 서비스',
    '가성비 좋음',
    '인테리어가 예쁨',
    '아이와 함께하기 좋음'
  ];
  
  // 새로운 미션 입력을 위한 데이터
  const newMission = ref('');
  
  // 새로운 키워드 입력을 위한 데이터
  const newKeyword = ref('');
  
  // 제공 품목 추가 관련 데이터
  const showAddProvisionForm = ref(false);
  const newProvisionItem = ref({
    name: '',
    price: null
  });
  
  // 총 제공 금액 계산
  const totalProvisionPrice = computed(() => {
    return campaignData.value.provisionItems.reduce((sum, item) => sum + (item.price || 0), 0);
  });
  
  // 채널 유형 토글
  const toggleChannelType = (channelType) => {
    const index = campaignData.value.channelTypes.indexOf(channelType);
    if (index === -1) {
      campaignData.value.channelTypes.push(channelType);
    } else {
      campaignData.value.channelTypes.splice(index, 1);
    }
  };
  
  // 미션 추가
  const addMission = () => {
    if (newMission.value && !campaignData.value.missions.includes(newMission.value)) {
      campaignData.value.missions.push(newMission.value);
      newMission.value = '';
    }
  };
  
  // 미션 삭제
  const removeMission = (index) => {
    campaignData.value.missions.splice(index, 1);
  };
  
  // 미션 예시 선택
  const selectMissionExample = (example) => {
    if (!campaignData.value.missions.includes(example)) {
      campaignData.value.missions.push(example);
    }
  };
  
  // 키워드 추가
  const addKeyword = () => {
    if (newKeyword.value && !campaignData.value.keywords.includes(newKeyword.value) && campaignData.value.keywords.length < 5) {
      campaignData.value.keywords.push(newKeyword.value);
      newKeyword.value = '';
    }
  };
  
  // 키워드 삭제
  const removeKeyword = (index) => {
    campaignData.value.keywords.splice(index, 1);
  };
  
  // 제공 품목 추가
  const confirmAddProvisionItem = () => {
    if (newProvisionItem.value.name && newProvisionItem.value.price) {
      campaignData.value.provisionItems.push({
        name: newProvisionItem.value.name,
        price: newProvisionItem.value.price
      });
      newProvisionItem.value = { name: '', price: null };
      showAddProvisionForm.value = false;
    }
  };
  
  // 제공 품목 추가 취소
  const cancelAddProvisionItem = () => {
    newProvisionItem.value = { name: '', price: null };
    showAddProvisionForm.value = false;
  };
  
  // 제공 품목 삭제
  const removeProvisionItem = (index) => {
    campaignData.value.provisionItems.splice(index, 1);
  };
  
  // 모집 인원 증가
  const increaseRecruitment = () => {
    if (campaignData.value.recruitmentCount < 100) {
      campaignData.value.recruitmentCount++;
    }
  };
  
  // 모집 인원 감소
  const decreaseRecruitment = () => {
    if (campaignData.value.recruitmentCount > 1) {
      campaignData.value.recruitmentCount--;
    }
  };
  
  // 수수료 계산 (5%)
  const calculateFee = () => {
    return Math.round(campaignData.value.rewardPoint * 0.05);
  };
  
  // 총 차감 포인트 계산
  const calculateTotalPoint = () => {
    return campaignData.value.rewardPoint + calculateFee();
  };
  
  // 가격 포맷팅
  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0';
  };
  
  // 등록 완료
  const finishRegistration = () => {
    // API 호출 또는 데이터 저장 로직이 들어갈 수 있음
    // 여기서는 단순히 마지막 단계로 이동
    router.push({
      query: { step: totalSteps + 1 }
    });
  };
  
  // 마이페이지로 이동
  const goToMyPage = () => {
    router.push('/my-page'); // 실제 마이페이지 경로로 수정 필요
  };
  
  // 라우터 변경시 데이터 처리
  watch(() => route.query.step, () => {
    // 필요한 경우 데이터 저장 또는 유효성 검사
    // 아직 구현되지 않은 상태
  });
  </script>
  
  <style scoped>
  /* 기본 스타일 */
  .campaign-register {
    max-width: 560px;
    margin: 0 auto;
    padding: 40px 20px;
    font-family: 'Pretendard', sans-serif;
    background-color: #F5F5F5;
    min-height: 100vh;
  }
  
  h2 {
    color: #424242;
    font-size: 24px;
    margin-bottom: 24px;
    font-weight: 600;
  }
  
  /* 프로그레스 바 */
  .progress-container {
    display: flex;
    align-items: center;
    margin-bottom: 40px;
  }
  
  .progress-bar {
    flex-grow: 1;
    height: 8px;
    background-color: #E0E0E0;
    border-radius: 4px;
    overflow: hidden;
    margin-right: 10px;
  }
  
  .progress {
    height: 100%;
    background-color: #48CFCB;
    transition: width 0.3s ease;
  }
  
  .progress-text {
    font-size: 14px;
    color: #424242;
    min-width: 50px;
    text-align: right;
  }
  
  /* 단계 컨테이너 */
  .step-container {
    background-color: white;
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    animation: fadeIn 0.3s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  /* 입력 필드 */
  .input-container {
    margin-bottom: 24px;
  }
  
  .base-input {
    width: 100%;
    padding: 14px 16px;
    border: 1px solid #E0E0E0;
    border-radius: 8px;
    font-family: 'Pretendard', sans-serif;
    font-size: 16px;
    transition: border-color 0.2s;
  }
  
  .base-input:focus {
    border-color: #48CFCB;
    outline: none;
  }
  
  /* 버튼 */
  .button-group {
    display: flex;
    gap: 10px;
    margin-top: 24px;
  }
  
  .base-button {
    padding: 14px 24px;
    border-radius: 8px;
    font-family: 'Pretendard', sans-serif;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }
  
  .base-button.primary {
    background-color: #48CFCB;
    color: white;
  }
  
  .base-button.primary:hover {
    background-color: #229799;
  }
  
  .base-button.primary:disabled {
    background-color: #E0E0E0;
    cursor: not-allowed;
  }
  
  .base-button.outline {
    background-color: transparent;
    border: 1px solid #229799;
    color: #229799;
  }
  
  .base-button.outline:hover {
    background-color: rgba(34, 151, 153, 0.05);
  }
  
  /* 이미지 업로더 */
  .image-uploader {
    margin-bottom: 24px;
  }
  
  .upload-placeholder {
    width: 100%;
    height: 200px;
    border: 2px dashed #E0E0E0;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: border-color 0.2s;
  }
  
  .upload-placeholder:hover {
    border-color: #48CFCB;
  }
  
  .upload-icon {
    font-size: 32px;
    color: #BDBDBD;
    margin-bottom: 8px;
  }
  
  .upload-text {
    color: #757575;
  }
  
  .thumbnail-preview {
    width: 100%;
    height: 200px;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
  }
  
  .thumbnail-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .remove-thumbnail {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 28px;
    height: 28px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 18px;
  }
  
  .file-input {
    display: none;
  }
  
  /* 캠페인 유형 옵션 */
  .campaign-type-options {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }
  
  .campaign-type-option {
    padding: 20px;
    border: 1px solid #E0E0E0;
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .campaign-type-option:hover {
    border-color: #48CFCB;
  }
  
  .campaign-type-option.selected {
    border-color: #48CFCB;
    background-color: rgba(72, 207, 203, 0.05);
  }
  
  .option-icon {
    font-size: 24px;
    margin-bottom: 8px;
  }
  
  .option-label {
    font-weight: 500;
  }
  
  /* 카테고리 선택 */
  .category-selection {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 24px;
  }
  
  .category-item {
    padding: 10px 14px;
    border: 1px solid #E0E0E0;
    border-radius: 20px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .category-item:hover {
    border-color: #48CFCB;
  }
  
  .category-item.selected {
    border-color: #48CFCB;
    background-color: #48CFCB;
    color: white;
  }
  
  /* 채널 선택 */
  .channel-selection {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }
  
  .channel-item {
    padding: 16px;
    border: 1px solid #E0E0E0;
    border-radius: 8px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .channel-item:hover {
    border-color: #48CFCB;
  }
  
  .channel-item.selected {
    border-color: #48CFCB;
    background-color: rgba(72, 207, 203, 0.05);
  }
  
  .channel-icon {
    font-size: 20px;
    margin-right: 12px;
  }
  
  .channel-label {
    font-weight: 500;
  }
  
  /* 단계 설명 텍스트 */
  .step-description {
    color: #757575;
    margin-bottom: 20px;
    font-size: 14px;
    line-height: 1.5;
  }
  
  /* 미션 입력 */
  .mission-input-container {
    margin-bottom: 20px;
  }
  
  .mission-input-wrap {
    display: flex;
    margin-bottom: 12px;
  }
  
  .mission-input-wrap .base-input {
    flex-grow: 1;
    margin-bottom: 0;
  }
  
  .add-button {
    padding: 14px 16px;
    background-color: #48CFCB;
    color: white;
    border: none;
    border-radius: 8px;
    margin-left: 8px;
    cursor: pointer;
    font-family: 'Pretendard', sans-serif;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .add-button:hover {
    background-color: #229799;
  }
  
  .add-button:disabled {
    background-color: #E0E0E0;
    cursor: not-allowed;
  }
  
  .mission-examples {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
  }
  
  .mission-example {
    padding: 6px 12px;
    background-color: #F5F5F5;
    border-radius: 16px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .mission-example:hover {
    background-color: #E0E0E0;
  }
  
  .mission-tags, .keyword-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 24px;
  }
  
  .mission-tag, .keyword-tag {
    padding: 8px 12px;
    background-color: #E0E0E0;
    border-radius: 16px;
    font-size: 14px;
    display: flex;
    align-items: center;
  }
  
  .remove-tag {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: #757575;
    color: white;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 8px;
    cursor: pointer;
    font-size: 12px;
    line-height: 1;
  }
  
  /* 키워드 입력 */
  .keyword-input-container {
    margin-bottom: 20px;
    position: relative;
  }
  
  .keyword-input-wrap {
    display: flex;
  }
  
  .keyword-count {
    position: absolute;
    right: 0;
    top: -24px;
    font-size: 12px;
    color: #757575;
  }
  
  /* 제공 내역 설정 */
  .provision-items {
    margin-bottom: 24px;
  }
  
  .provision-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color: #F5F5F5;
    border-radius: 8px;
    margin-bottom: 8px;
  }
  
  .provision-item-content {
    display: flex;
    flex-direction: column;
  }
  
  .provision-item-name {
    font-weight: 500;
    margin-bottom: 4px;
  }
  
  .provision-item-price {
    font-size: 14px;
    color: #757575;
  }
  
  .remove-item {
    padding: 6px 10px;
    background-color: transparent;
    border: 1px solid #E0E0E0;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    color: #757575;
    transition: all 0.2s;
  }
  
  .remove-item:hover {
    border-color: #ff6b6b;
    color: #ff6b6b;
  }
  
  .add-provision-form {
    margin-bottom: 16px;
    padding: 16px;
    background-color: #F5F5F5;
    border-radius: 8px;
  }
  
  .add-provision-form .base-input {
    margin-bottom: 8px;
  }
  
  .provision-form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
  
  .base-button.sm {
    padding: 8px 12px;
    font-size: 14px;
  }
  
  .add-provision-button {
    width: 100%;
    padding: 12px;
    background-color: transparent;
    border: 1px dashed #BDBDBD;
    border-radius: 8px;
    color: #757575;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .add-provision-button:hover {
    border-color: #48CFCB;
    color: #48CFCB;
  }
  
  .total-provision {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background-color: #F5F5F5;
    border-radius: 8px;
    margin-bottom: 24px;
    font-weight: 500;
  }
  
  .total-price {
    color: #229799;
    font-size: 18px;
  }
  
  /* 모집 인원 설정 */
  .recruitment-input {
    margin-bottom: 24px;
  }
  
  .counter-control {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
  }
  
  .counter-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #E0E0E0;
    background-color: white;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .counter-button:hover:not(:disabled) {
    background-color: #F5F5F5;
  }
  
  .counter-button:disabled {
    color: #BDBDBD;
    cursor: not-allowed;
  }
  
  .counter-value {
    padding: 0 20px;
    font-size: 24px;
    font-weight: 600;
    min-width: 80px;
    text-align: center;
  }
  
  /* 포인트 설정 */
  .point-input-container {
    position: relative;
    margin-bottom: 24px;
  }
  
  .base-input.with-suffix {
    padding-right: 40px;
  }
  
  .input-suffix {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #757575;
    font-weight: 500;
  }
  
  .fee-info {
    background-color: #F5F5F5;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 24px;
  }
  
  .fee-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 14px;
    color: #757575;
  }
  
  .fee-item.total {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #E0E0E0;
    font-weight: 600;
    font-size: 16px;
    color: #424242;
  }
  
  .payment-required-message {
    background-color: #FFF9C4;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 24px;
    font-size: 14px;
    color: #5D4037;
  }
  
  /* 완료 화면 */
  .completion {
    text-align: center;
    padding: 60px 30px;
  }
  
  .completion-icon {
    width: 80px;
    height: 80px;
    background-color: #48CFCB;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    margin: 0 auto 24px;
  }
  
  .completion-message {
    color: #757575;
    margin-bottom: 32px;
  }
  
  .button-group.centered {
    justify-content: center;
  }
  </style>