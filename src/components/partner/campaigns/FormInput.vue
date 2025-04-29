<!-- src/components/partner/common/FormInput.vue -->
<template>
    <div class="form-input" :class="{ 'form-input-error': showError }">
      <label :for="id" class="form-label">
        {{ label }}
        <span v-if="required" class="required-mark">*</span>
      </label>
      
      <div class="input-container" :class="{ 'input-with-button': hasButton }">
        <input
          :id="id"
          :type="inputType"
          :value="modelValue"
          :placeholder="placeholder"
          :required="required"
          :disabled="disabled"
          :readonly="readonly"
          :maxlength="maxlength"
          :autocomplete="autocomplete"
          class="input-field"
          @input="onInput"
          @blur="onBlur"
        />
        
        <button
          v-if="hasButton"
          type="button"
          class="input-button"
          @click="$emit('button-click')"
        >
          {{ buttonText }}
        </button>
  
        <div 
          v-if="inputType === 'password' && modelValue" 
          class="toggle-password"
          @click="togglePasswordVisibility"
        >
          <svg v-if="inputType === 'password'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
        </div>
      </div>
      
      <div v-if="helperText" class="helper-text">{{ helperText }}</div>
      <div v-if="showError" class="error-text">{{ errorMessage }}</div>
    </div>
  </template>
  
  <script>
  import { ref, defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'FormInput',
    props: {
      id: {
        type: String,
        required: true
      },
      label: {
        type: String,
        required: true
      },
      modelValue: {
        type: [String, Number],
        default: ''
      },
      type: {
        type: String,
        default: 'text'
      },
      placeholder: {
        type: String,
        default: ''
      },
      required: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      readonly: {
        type: Boolean,
        default: false
      },
      maxlength: {
        type: [String, Number],
        default: null
      },
      autocomplete: {
        type: String,
        default: 'off'
      },
      helperText: {
        type: String,
        default: ''
      },
      errorMessage: {
        type: String,
        default: ''
      },
      validateOnBlur: {
        type: Boolean,
        default: false
      },
      hasButton: {
        type: Boolean,
        default: false
      },
      buttonText: {
        type: String,
        default: '버튼'
      },
      formatter: {
        type: Function,
        default: null
      }
    },
    emits: ['update:modelValue', 'button-click', 'blur'],
    setup(props, { emit }) {
      const showError = ref(false);
      const inputType = ref(props.type);
      
      const onInput = (event) => {
        let value = event.target.value;
        
        // Apply formatter if provided
        if (props.formatter) {
          value = props.formatter(value);
        }
        
        emit('update:modelValue', value);
        
        // Reset error state when user types
        if (showError.value) {
          showError.value = false;
        }
      };
      
      const onBlur = (event) => {
        if (props.validateOnBlur && props.required && !props.modelValue) {
          showError.value = true;
        }
        
        emit('blur', event);
      };
      
      const togglePasswordVisibility = () => {
        inputType.value = inputType.value === 'password' ? 'text' : 'password';
      };
      
      return {
        showError,
        inputType,
        onInput,
        onBlur,
        togglePasswordVisibility
      };
    }
  });
  </script>
  
  <style scoped>
  .form-input {
    margin-bottom: 20px;
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
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
  
  .input-container {
    position: relative;
    width: 100%;
  }
  
  .input-field {
    width: 100%;
    padding: 12px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 16px;
    color: #424242;
    background-color: #fff;
    transition: all 0.3s;
    font-family: 'Pretendard', sans-serif;
  }
  
  .input-field:focus {
    outline: none;
    border-color: #48CFCB;
    box-shadow: 0 0 0 3px rgba(72, 207, 203, 0.1);
  }
  
  .input-field:disabled,
  .input-field:readonly {
    background-color: #f9fafb;
    cursor: not-allowed;
  }
  
  .input-with-button .input-field {
    padding-right: 100px;
  }
  
  .input-button {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    padding: 0 16px;
    background-color: #F5F5F5;
    border: 1px solid #e5e7eb;
    border-left: none;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    font-weight: 500;
    color: #424242;
    cursor: pointer;
    transition: all 0.3s;
    white-space: nowrap;
  }
  
  .input-button:hover {
    background-color: #e5e7eb;
  }
  
  .toggle-password {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #9ca3af;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .helper-text {
    margin-top: 4px;
    font-size: 12px;
    color: #64748b;
  }
  
  .error-text {
    margin-top: 4px;
    font-size: 12px;
    color: #e11d48;
  }
  
  .form-input-error .input-field {
    border-color: #e11d48;
  }
  
  @media (max-width: 640px) {
    .input-with-button {
      display: flex;
      flex-direction: column;
    }
    
    .input-with-button .input-field {
      padding-right: 12px;
      margin-bottom: 8px;
    }
    
    .input-button {
      position: relative;
      width: 100%;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    }
  }
  </style>