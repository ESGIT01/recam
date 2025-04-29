<!-- src/components/partner/profile/BusinessInfo.vue -->
<template>
    <div class="business-info">
      <h3 class="section-title">사업자 정보</h3>
      
      <div class="form-grid">
        <form-input
          id="company-name"
          label="회사명"
          v-model="formData.companyName"
          placeholder="회사명을 입력하세요"
          required
          validate-on-blur
          error-message="회사명을 입력해주세요"
        />
        
        <form-input
          id="business-number"
          label="사업자등록번호"
          v-model="formData.businessNumber"
          placeholder="000-00-00000"
          maxlength="12"
          required
          validate-on-blur
          error-message="사업자등록번호를 입력해주세요"
          :formatter="formatBusinessNumber"
          :has-button="true"
          button-text="인증하기"
          @button-click="verifyBusinessNumber"
        />
        
        <form-input
          id="representative"
          label="대표자명"
          v-model="formData.representative"
          placeholder="대표자명을 입력하세요"
          required
          validate-on-blur
          error-message="대표자명을 입력해주세요"
        />
        
        <div class="business-type-select">
          <label for="business-type" class="form-label">
            업종 <span class="required-mark">*</span>
          </label>
          <select 
            id="business-type" 
            v-model="formData.businessType" 
            required
            class="select-field"
          >
            <option value="" disabled>업종을 선택하세요</option>
            <option v-for="(type, index) in businessTypes" :key="index" :value="type">
              {{ type }}
            </option>
          </select>
        </div>
        
        <form-input
          id="phone"
          label="연락처"
          v-model="formData.phone"
          placeholder="000-0000-0000"
          maxlength="13"
          required
          validate-on-blur
          error-message="연락처를 입력해주세요"
          :formatter="formatPhoneNumber"
        />
        
        <form-input
          id="email"
          label="이메일"
          type="email"
          v-model="formData.email"
          placeholder="example@email.com"
          required
          validate-on-blur
          error-message="유효한 이메일을 입력해주세요"
        />
        
        <form-input
          id="website"
          label="웹사이트"
          type="url"
          v-model="formData.website"
          placeholder="https://example.com"
        />
        
        <form-input
          id="address"
          label="주소"
          v-model="formData.address"
          placeholder="주소를 입력하세요"
          required
          readonly
          validate-on-blur
          error-message="주소를 입력해주세요"
          :has-button="true"
          button-text="주소 검색"
          @button-click="searchAddress"
        />
        
        <form-input
          id="address-detail"
          label="상세 주소"
          v-model="formData.addressDetail"
          placeholder="상세 주소를 입력하세요"
        />
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, reactive, watch } from 'vue';
  import FormInput from '@/components/partner/campaigns/FormInput.vue';
  
  export default defineComponent({
    name: 'BusinessInfo',
    components: {
      FormInput
    },
    props: {
      initialData: {
        type: Object,
        default: () => ({
          companyName: '',
          businessNumber: '',
          representative: '',
          businessType: '',
          phone: '',
          email: '',
          website: '',
          address: '',
          addressDetail: ''
        })
      }
    },
    emits: ['update:data'],
    setup(props, { emit }) {
      const formData = reactive({
        companyName: props.initialData.companyName || '',
        businessNumber: props.initialData.businessNumber || '',
        representative: props.initialData.representative || '',
        businessType: props.initialData.businessType || '',
        phone: props.initialData.phone || '',
        email: props.initialData.email || '',
        website: props.initialData.website || '',
        address: props.initialData.address || '',
        addressDetail: props.initialData.addressDetail || ''
      });
      
      const businessTypes = [
        '제조업',
        '도/소매업',
        '서비스업',
        'IT/소프트웨어',
        '음식/요식업',
        '교육업',
        '의료/건강',
        '금융/보험업',
        '부동산업',
        '문화/예술',
        '미디어/출판',
        '기타'
      ];
      
      // 사업자등록번호 형식화 (000-00-00000)
      const formatBusinessNumber = (value) => {
        value = value.replace(/[^0-9]/g, '');
        
        if (value.length > 10) {
          value = value.substring(0, 10);
        }
        
        if (value.length > 5) {
          value = value.substring(0, 3) + '-' + value.substring(3, 5) + '-' + value.substring(5);
        } else if (value.length > 3) {
          value = value.substring(0, 3) + '-' + value.substring(3);
        }
        
        return value;
      };
      
      // 전화번호 형식화 (000-0000-0000)
      const formatPhoneNumber = (value) => {
        value = value.replace(/[^0-9]/g, '');
        
        if (value.length > 11) {
          value = value.substring(0, 11);
        }
        
        if (value.length > 7) {
          value = value.substring(0, 3) + '-' + value.substring(3, 7) + '-' + value.substring(7);
        } else if (value.length > 3) {
          value = value.substring(0, 3) + '-' + value.substring(3);
        }
        
        return value;
      };
      
      // 사업자등록번호 인증
      const verifyBusinessNumber = () => {
        if (!formData.businessNumber) {
          alert('사업자등록번호를 입력해주세요.');
          return;
        }
        
        // 실제로는 API 호출하여 사업자번호 검증
        alert('사업자등록번호 인증이 완료되었습니다.');
      };
      
      // 주소 검색 (다음 주소 API 등을 연동)
      const searchAddress = () => {
        // 실제로는 다음 주소 API 등을 연동하는 로직
        // 예시로 임시 주소 설정
        formData.address = '서울특별시 강남구 테헤란로 123번길 45';
        alert('주소 검색 API를 연동하여 실제 주소를 검색할 수 있습니다.');
      };
      
      // 데이터 변경 시 상위 컴포넌트로 전달
      watch(formData, (newValue) => {
        emit('update:data', newValue);
      }, { deep: true });
      
      return {
        formData,
        businessTypes,
        formatBusinessNumber,
        formatPhoneNumber,
        verifyBusinessNumber,
        searchAddress
      };
    }
  });
  </script>
  
  <style scoped>
  .business-info {
    margin-bottom: 32px;
  }
  
  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: #424242;
    margin: 0 0 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
  
  .form-label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #424242;
    font-size: 15px;
  }
  
  .required-mark {
    color: #e11d48;
    margin-left: 2px;
  }
  
  .business-type-select {
    margin-bottom: 20px;
  }
  
  .select-field {
    width: 100%;
    padding: 12px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 16px;
    color: #424242;
    background-color: #fff;
    transition: all 0.3s;
    font-family: 'Pretendard', sans-serif;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px;
    padding-right: 40px;
  }
  
  .select-field:focus {
    outline: none;
    border-color: #48CFCB;
    box-shadow: 0 0 0 3px rgba(72, 207, 203, 0.1);
  }
  
  @media (max-width: 768px) {
    .form-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }
  </style>