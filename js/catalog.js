document.addEventListener('DOMContentLoaded', function() {
  // ========== ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ДЛЯ ПОИСКА ПО ЦЕНЕ ========== //
  function smartPriceSearch(searchTerm, itemPrice) {
    // Защита от пустого поиска
    if (!searchTerm) return false;
    
    const term = searchTerm.toLowerCase().trim();
    const itemPriceStr = itemPrice.toString();
    
    // 1. Прямое совпадение числа
    if (/^\d+$/.test(term)) {
      return itemPrice === parseInt(term);
    }
    
    // 2. Поиск с "тыс", "т" (например "15тыс" = 15000)
    if (term.includes('тыс') || term.includes('т')) {
      const numPart = term.replace(/[^0-9]/g, '');
      if (numPart) {
        const priceInThousands = parseInt(numPart) * 1000;
        return Math.abs(itemPrice - priceInThousands) < 1000;
      }
    }
    
    // 3. Поиск по первым цифрам (например "15" найдет 15000)
    if (/^\d+$/.test(term) && itemPriceStr.startsWith(term)) {
      return true;
    }
    
    return false;
  }


  // ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ========== //
  const rangeSlider = document.getElementById("range-slider");
  const filterItems = document.querySelectorAll('.katalog__filter-item');
  const searchInput = document.querySelector('.katalog__search-input');
  const colorInputs = document.querySelectorAll('.katalog__input[name="color"]');
  const sizeSelect = document.querySelector('.katalog__size-select');
  
  // Глобальная переменная для экземпляра Choices
  let choicesInstance = null;
  
  // Карта ценовых категорий
  const priceCategories = {
    'budget': '0-3000',      // бюджет
    'standard': '3001-4500',  // стандарт
    'premium': '4501-50000',  // премиум
    'lux': '50001-150000',    // люкс
    'exclusive': '150001-225000' // эксклюзив
  };
  
  // Карта для отображения названий категорий
  const categoryDisplayNames = {
    'budget': 'до 3 000₽ (бюджет)',
    'standard': '3 001₽ - 4 500₽ (стандарт)',
    'premium': '4 501₽ - 50 000₽ (премиум)',
    'lux': '50 001₽ - 150 000₽ (люкс)',
    'exclusive': 'от 150 001₽ (эксклюзив)'
  };
  

  // ========== ОЧИСТКА ПОИСКА ========== //
  function clearSearch() {
    if (searchInput) searchInput.value = '';
    
    filterItems.forEach(item => {
      const priceElement = item.querySelector('.katalog__filter-price');
      const nameElement = item.querySelector('.katalog__filter-h3');
      
      // Восстанавливаем оригинальный текст цены
      if (priceElement && priceElement.innerHTML !== priceElement.textContent) {
        const originalPrice = item.getAttribute('data-price');
        priceElement.textContent = `${originalPrice}₽`;
      }
      
      // Восстанавливаем оригинальный текст названия
      if (nameElement && nameElement.innerHTML !== nameElement.textContent) {
        const originalText = nameElement.getAttribute('data-original-text') || nameElement.textContent;
        nameElement.textContent = originalText;
      }
    });
  }
  

  // ========== ПОЛУЧЕНИЕ ЦВЕТА КАРТОЧКИ ========== //
  function getItemColor(item) {
    const colors = ['blueXs', 'redS', 'greenM', 'yellowL', 'pinkXL', 'brownXXL', 'goldXXXL'];
    return colors.find(color => item.classList.contains(color)) || '';
  }
  

  // ========== ОСНОВНАЯ ФИЛЬТРАЦИЯ ========== //
  function applyFilters() {
    const searchTerm = searchInput ? searchInput.value.trim() : '';
    
    // Получаем активный цвет
    const activeColorInput = document.querySelector('.katalog__input[name="color"]:checked');
    const activeColor = activeColorInput ? activeColorInput.id : 'reset';
    
    // Диапазон цен из ползунка
    let minPrice = 0, maxPrice = 225000;
    if (rangeSlider && rangeSlider.noUiSlider) {
      const values = rangeSlider.noUiSlider.get();
      minPrice = Math.round(values[0]);
      maxPrice = Math.round(values[1]);
    }
    
    // Выбранная категория из селектора
    const selectedCategory = sizeSelect ? sizeSelect.value : '';

    // ЕСЛИ ЕСТЬ ПОИСК - ИЩЕМ КОЛОБКА И ДВИГАЕМ ПОЛЗУНОК
    if (searchTerm) {
      let foundPrice = 0;
      
      // Ищем все товары по поиску
      filterItems.forEach(item => {
        const nameElement = item.querySelector('.katalog__filter-h3');
        if (nameElement && nameElement.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
          const itemPrice = parseInt(item.getAttribute('data-price')) || 0;
          if (itemPrice > foundPrice) {
            foundPrice = itemPrice;
          }
        }
      });
      
      // Если нашли товар и его цена выше текущей границы - двигаем ползунок
      if (foundPrice > 0 && foundPrice > maxPrice && rangeSlider.noUiSlider) {
        const newMaxPrice = Math.ceil(foundPrice * 1.1);
        rangeSlider.noUiSlider.set([minPrice, newMaxPrice]);
        maxPrice = newMaxPrice;
      }
    }
    
    // Фильтруем карточки
    filterItems.forEach(item => {
      // 1. Проверяем цвет
      const itemColor = getItemColor(item);
      const colorPass = activeColor === 'reset' || itemColor === activeColor;
      
      // 2. Проверяем цену по ползунку
      const itemPrice = parseInt(item.getAttribute('data-price')) || 0;
      const pricePass = itemPrice >= minPrice && itemPrice <= maxPrice;
      
      // 3. Проверяем соответствие ценовой категории
      let categoryPass = true;
      if (selectedCategory && priceCategories[selectedCategory]) {
        const [catMin, catMax] = priceCategories[selectedCategory].split('-').map(Number);
        categoryPass = itemPrice >= catMin && itemPrice <= catMax;
      }
      
      // 4. Проверяем поиск (и по названию, и по цене)
      let searchPass = true;
      let searchMatch = false;
      let textMatch = false;
      let priceMatch = false;
      let matchedText = '';
      
      if (searchTerm) {
        const nameElement = item.querySelector('.katalog__filter-h3');
        const descElement = item.querySelector('.katalog__filter-desc');

        // Поиск по тексту (название, описание)
        const searchableText = [
          nameElement?.textContent || '',
          descElement?.textContent || ''
        ].join(' ').toLowerCase();
        
        // Ищем по тексту - частичное совпадение
        const normalizedSearch = searchTerm.toLowerCase().replace(/[^\w\sа-яА-ЯёЁ]/g, '');
        const normalizedText = searchableText.replace(/[^\w\sа-яА-ЯёЁ]/g, '');
        
        // Поиск по ПЕРВЫМ БУКВАМ СЛОВ
        const words = normalizedText.split(/\s+/);
        textMatch = words.some(word => word.startsWith(normalizedSearch));

        // Если нашли - сохраняем найденный текст
        if (textMatch) {
          // Находим слово, которое совпало
          const matchedWord = words.find(word => word.startsWith(normalizedSearch));
          matchedText = matchedWord ? matchedWord.substring(0, normalizedSearch.length) : '';
        }  
        
        
        // ПОИСК ПО ЦЕНЕ - ИЩЕМ ЧАСТИЧНОЕ СОВПАДЕНИЕ
        const itemPriceStr = itemPrice.toString();
        
        // 1. Ищем прямое вхождение числа (например, "15" в "152000")
        priceMatch = itemPriceStr.startsWith(searchTerm);
        
        // 2. Если не нашли - пробуем умный поиск (для "152т", "152тыс")
        if (!priceMatch) {
          priceMatch = smartPriceSearch(searchTerm, itemPrice);
        }
        
        // Товар найден по поиску
        searchMatch = textMatch || priceMatch;
        
        // Товар проходит фильтр поиска
        searchPass = searchMatch;
      }
      
      // Показываем только если ВСЕ условия выполнены
      const shouldShow = colorPass && pricePass && categoryPass && searchPass;
      item.style.display = shouldShow ? 'flex' : 'none';

      // Сохраняем оригинальный текст названия
      const nameElement = item.querySelector('.katalog__filter-h3');
      if (nameElement && !nameElement.hasAttribute('data-original-text')) {
        nameElement.setAttribute('data-original-text', nameElement.textContent);
      }
      
      // ПОДСВЕТКА НАЗВАНИЯ (для поиска по первым буквам)
      if (nameElement && searchTerm && textMatch && shouldShow) {
        const originalName = nameElement.getAttribute('data-original-text');
        const words = originalName.split(/\s+/);
        let highlighted = false;
        
        // Ищем слово, которое начинается с поискового запроса
        for (let word of words) {
          const wordLower = word.toLowerCase();
          const searchLower = searchTerm.toLowerCase();
          
          if (wordLower.startsWith(searchLower)) {
            // Нашли слово - подсвечиваем первые буквы
            const beforeWord = originalName.substring(0, originalName.indexOf(word));
            const afterWord = originalName.substring(originalName.indexOf(word) + word.length);
            const highlightedWord = `<span style="background-color: #ffeb3b; padding: 0 2px; border-radius: 2px;">${word.substring(0, searchTerm.length)}</span>${word.substring(searchTerm.length)}`;
            
            nameElement.innerHTML = beforeWord + highlightedWord + afterWord;
            highlighted = true;
            break;
          }
        }
        
        // Если не нашли (или для описания), подсвечиваем как раньше
        if (!highlighted && matchedText) {
          const originalText = nameElement.getAttribute('data-original-text');
          const index = originalText.toLowerCase().indexOf(searchTerm.toLowerCase());
          
          if (index !== -1) {
            const before = originalText.substring(0, index);
            const found = originalText.substring(index, index + searchTerm.length);
            const after = originalText.substring(index + searchTerm.length);
            nameElement.innerHTML = `${before}<span style="background-color: #ffeb3b; padding: 0 2px; border-radius: 2px;">${found}</span>${after}`;
          }
        }
      } else if (nameElement && !textMatch) {
        // Восстанавливаем оригинальный текст если не нашли
        const originalText = nameElement.getAttribute('data-original-text');
        if (originalText) {
          nameElement.textContent = originalText;
        }
      }

      // ПОДСВЕТКА ЦЕНЫ
      const priceElement = item.querySelector('.katalog__filter-price');
      if (priceElement) {
        const originalPrice = item.getAttribute('data-price');
        const originalPriceStr = originalPrice ? originalPrice.toString() : '';
        
        if (searchTerm && priceMatch && shouldShow) {
          // Ищем позицию поискового запроса в цене
          const index = originalPriceStr.indexOf(searchTerm);
          
          if (index !== -1) {
            // Подсвечиваем только найденную часть
            const before = originalPriceStr.substring(0, index);
            const found = originalPriceStr.substring(index, index + searchTerm.length);
            const after = originalPriceStr.substring(index + searchTerm.length);
            
            priceElement.innerHTML = `${before}<span style="background-color: #ffeb3b; padding: 2px 4px; border-radius: 3px; color: #000;">${found}</span>${after}₽`;
          } else {
            // Если не нашли точное вхождение, подсвечиваем всю цену
            priceElement.innerHTML = `<span style="background-color: #ffeb3b; padding: 2px 6px; border-radius: 4px; color: #000;">${originalPrice}₽</span>`;
          }
        } else {
          // Обычный вид
          priceElement.textContent = `${originalPrice}₽`;
        }
      }
    });
  }

  
  // ========== СБРОС ВСЕХ ФИЛЬТРОВ ========== //
  function resetAllFilters() {
    // Сбрасываем ползунок
    if (rangeSlider && rangeSlider.noUiSlider) {
      rangeSlider.noUiSlider.set([2000, 150000]);
    }
    
    // Сбрасываем радио "Все"
    const resetRadio = document.getElementById('reset');
    if (resetRadio) {
      resetRadio.checked = true;
    }
    
    // Очищаем поиск
    clearSearch();
    
    applyFilters();
  }
  

  // ========== ПОЛЗУНОК ЦЕНЫ ========== //
  function initPriceSlider() {
    if (!rangeSlider) return;
    
    noUiSlider.create(rangeSlider, {
      start: [2000, 150000],
      connect: true,
      step: 100,
      range: { 'min': 0, 'max': 225000 }
    });
    
    const minDisplay = document.getElementById("min-display");
    const maxDisplay = document.getElementById("max-display");
    const minInput = document.getElementById("first-price");
    const maxInput = document.getElementById("second-price");
    
    // Обновляем отображение при движении ползунка
    rangeSlider.noUiSlider.on("update", function(values) {
      const minVal = Math.round(values[0]);
      const maxVal = Math.round(values[1]);
      
      minInput.value = minVal;
      maxInput.value = maxVal;
      minDisplay.textContent = minVal === 2000 ? "от" : formatPrice(minVal);
      maxDisplay.textContent = maxVal === 150000 ? "до" : formatPrice(maxVal);
    });
    
    // Применяем фильтры после отпускания ползунка (не во время движения)
    rangeSlider.noUiSlider.on("change", function(values) {
      applyFilters();
    });
    
    // Функция для переключения между span и input
    function toggleToInput(display, input) {
      display.style.display = 'none';
      input.style.display = 'block';
      input.focus();
      input.select();
    }
    
    // Функция для применения значения из input
    function applyInputValue(input, display, isMin) {
      // СОХРАНЯЕМ ВВЕДЁННОЕ ЗНАЧЕНИЕ
      const originalValue = input.value;
      
      let value = parseInt(originalValue);
      
      if (isNaN(value)) {
        const currentValues = rangeSlider.noUiSlider.get();
        value = isMin ? Math.round(currentValues[0]) : Math.round(currentValues[1]);
      } else {
        const min = 0;
        const max = 225000;
        value = Math.max(min, Math.min(max, value));
        
        const currentValues = rangeSlider.noUiSlider.get();
        let newMin = isMin ? value : Math.round(currentValues[0]);
        let newMax = isMin ? Math.round(currentValues[1]) : value;
        
        if (newMin > newMax) {
          if (isMin) {
            newMin = newMax;
          } else {
            newMax = newMin;
          }
        }
        
        rangeSlider.noUiSlider.set([newMin, newMax]);
      }
      
      // ПОКАЗЫВАЕМ СОХРАНЁННОЕ ЗНАЧЕНИЕ
      display.textContent = formatPrice(parseInt(originalValue));
      
      input.style.display = 'none';
      display.style.display = 'flex';
    }
    
    // Клик по "от" - показываем input
    minDisplay.addEventListener('click', () => toggleToInput(minDisplay, minInput));
    
    // Клик по "до" - показываем input
    maxDisplay.addEventListener('click', () => toggleToInput(maxDisplay, maxInput));
    
    // Обработка потери фокуса для input
    minInput.addEventListener('blur', function() {
      applyInputValue(minInput, minDisplay, true);
    });
    
    maxInput.addEventListener('blur', function() {
      applyInputValue(maxInput, maxDisplay, false);
    });
    
    // Обработка нажатия Enter
    minInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.blur(); // Вызывает событие blur
      }
    });
    
    maxInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.blur(); // Вызывает событие blur
      }
    });
  }
  

  // ========== ФОРМАТИРОВАНИЕ ЦЕНЫ ========== //
  function formatPrice(num) {
    return new Intl.NumberFormat('ru-RU').format(num);
  }
  

  // ========== УМНЫЙ ПОИСК ПО ЦЕНЕ ========== //
  function smartPriceSearch(searchTerm, itemPrice) {
    const term = searchTerm.toLowerCase();
    const cleanTerm = term.replace(/руб|р|рублей|тыс|т\.|к|\s/g, '').replace(',', '.');
    
    if (/^\d+$/.test(cleanTerm)) return itemPrice === parseInt(cleanTerm);
    
    if (/^\d+[.,]\d+$/.test(cleanTerm)) {
      const priceInThousands = parseFloat(cleanTerm.replace(',', '.'));
      return Math.abs(itemPrice/1000 - priceInThousands) < 0.1;
    }
    
    return false;
  }
  

  // ========== ПОИСК С ПОДСВЕТКОЙ ========== //
  function initSearch() {
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function(e) {
      applyFilters();
    });
  }
  

  // ========== Селект Ценовые категории ========== //
  function initSizeSelect() {
    const element = document.querySelector('.katalog__size-select');
    if (!element) return;
    
    // Очищаем старые option
    element.innerHTML = '';
    
    // Добавляем option для сброса
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Сортировать по цене';
    element.appendChild(defaultOption);
    
    // Добавляем ценовые категории
    Object.entries(categoryDisplayNames).forEach(([value, text]) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = text;
      element.appendChild(option);
    });
    
    // Инициализируем Choices.js
    choicesInstance = new Choices(element, {
      searchEnabled: false,
      placeholder: true,
      placeholderValue: 'Сортировать по цене',
      itemSelectText: '',
      shouldSort: false,
      allowHTML: true
    });
    
    // Обработчик выбора категории
    element.addEventListener('change', function () {
      const selectedCategory = this.value;
      
      if (selectedCategory === '') {
        resetAllFilters();
      } else {
        const priceRange = priceCategories[selectedCategory];
        if (priceRange) {
          const [min, max] = priceRange.split('-').map(Number);
          
          if (rangeSlider && rangeSlider.noUiSlider) {
            rangeSlider.noUiSlider.set([min, max]);
          }
        }
        
        const resetRadio = document.getElementById('reset');
        if (resetRadio) {
          resetRadio.checked = true;
        }
        
        applyFilters();
      }
    });
  }
  

  // ========== РАДИО-КНОПКИ ========== //
  function initRadioButtons() {
    colorInputs.forEach(input => {
      input.addEventListener('change', () => {
        if (input.id !== 'reset' && sizeSelect) {
          sizeSelect.value = '';
          if (choicesInstance) {
            choicesInstance.setChoiceByValue('');
          }
        }
        
        clearSearch();  
        applyFilters();
      });
    });
  }


  // ========== ФУНКЦИЯ ДЛЯ ПЕРЕКЛЮЧЕНИЯ ПОИСКА ========== //
  function initSearchToggleIcons() {
    const searchBtn = document.querySelector('.katalog__search-icon');
    const searchInput = document.querySelector('.katalog__search-input');
    const iconSearch = document.querySelector('.icon-search');
    const iconClear = document.querySelector('.icon-clear');
    
    if (!searchBtn || !searchInput || !iconSearch || !iconClear) return;
    
    function updateIcons() {
      if (searchInput.value.trim() !== '') {
        iconSearch.style.display = 'none';
        iconClear.style.display = 'block';
        searchBtn.setAttribute('aria-label', 'Очистить поиск');
      } else {
        iconSearch.style.display = 'block';
        iconClear.style.display = 'none';
        searchBtn.setAttribute('aria-label', 'Поиск по товарам');
        clearSearch();
        applyFilters();
      }
    }
    
    searchBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      if (searchInput.value.trim() !== '') {
        searchInput.value = '';
        searchInput.focus();
        clearSearch();
        applyFilters();
        updateIcons();
      } else {
        searchInput.focus();
      }
    });
    
    searchInput.addEventListener('input', function() {
      applyFilters();
      updateIcons();
    });
    
    searchInput.removeAttribute('results');
    searchInput.removeAttribute('autosave');
    
    updateIcons();
  }
  

  // ========== ИНИЦИАЛИЗАЦИЯ ========== //
  function init() {
    initPriceSlider();
    initSizeSelect();
    initRadioButtons();
    initSearch();
    initSearchToggleIcons();
    
    applyFilters();
  }
  
  init();
});