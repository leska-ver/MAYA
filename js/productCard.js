document.addEventListener('DOMContentLoaded', function() {
  
  // Массив с 6 изображениями
  const images = [
    // "https://incanto.eu/upload/webp/resize_cache/de1/9999_1430_1/luby3o1fn35z834bicre36x26furtshw.webp",
    // "https://incanto.eu/upload/webp/resize_cache/fe1/9999_1430_1/q0udolqsme23qadp0p0hkogz3jzi0kkt.webp",
    // "https://incanto.eu/upload/webp/resize_cache/4fc/9999_1430_1/m8i4da9xj6460kh17aa3defu9pjbi3o1.webp",
    // "https://incanto.eu/upload/webp/resize_cache/5c9/9999_1430_1/7pcogv0l7gd96djfselmpp046u6e0ovu.webp",
    // "https://incanto.eu/upload/webp/resize_cache/f79/9999_1430_1/z96q10y9x66gm3jhpe2yv7njixz2lvqt.webp",
    // "https://incanto.eu/upload/webp/resize_cache/303/9999_1430_1/u5sqhbi3l9cflbwl5zklrn538zd1qaq9.webp"
    "./img/productCard/1.jpg",
    "./img/productCard/2.jpg",
    "./img/productCard/3.jpg",
    "./img/productCard/4.jpg",
    "./img/productCard/5.jpg"
  ];

  const altTexts = [
    "ЧЕРНЫЙ_ЛИФЧИК",
    "СЕРЫЙ_ЛИФЧИК",
    "ЗЕЛЁНЫЙ_ЛИФЧИК",
    "БЕЖЕВЫЙ_ЛИФЧИК",
    "КРАСНЫЙ_ЛИФЧИК"//,
    // "БЕЛЫЙ_ЛИФЧИК"
  ];

  // Элементы DOM
  const mainImage = document.getElementById('mainImage');
  const miniaturesContainer = document.querySelector('.productCard__miniatures');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  let currentIndex = 0; // Активное основное изображение
  let thumbStartIndex = 0; // С какой миниатюры начинаем показ
  const visibleThumbs = 4; // Сколько миниатюр показывать

  // Создаем все миниатюры
  function createMiniatures() {
    miniaturesContainer.innerHTML = '';

    images.forEach((image, index) => {
      const miniature = document.createElement('div');
      miniature.className = index === currentIndex ? 'miniature active' : 'miniature';
      miniature.dataset.index = index;
      miniature.setAttribute('tabindex', '0');

      // Добавляем класс для 2-го и 4-го изображений
      if (index === 1 || index === 3) { // 2-е и 4-е изображения (индексы 1 и 3)
        miniature.classList.add('image-even');
      }

      const img = document.createElement('img');
      img.src = image;
      img.alt = `Миниатюра ${index + 1}: ${altTexts[index]}`;

      miniature.appendChild(img);
      miniaturesContainer.appendChild(miniature);

      miniature.addEventListener('click', () => {
        updateMainImage(index);
      });

      miniature.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          updateMainImage(index);
        }
      });
    });

    updateMiniaturesView();
    updateNavButtons(); // Обновляем кнопки навигации
  }

  // Обновляем вид миниатюр (какие показывать)
  function updateMiniaturesView() {
    const miniatures = document.querySelectorAll('.miniature');

    // Скрываем все миниатюры
    miniatures.forEach(thumb => {
      thumb.style.display = 'none';
    });

    // Показываем только 4 нужные миниатюры
    for (let i = 0; i < visibleThumbs; i++) {
      const index = thumbStartIndex + i;
      if (miniatures[index]) {
        miniatures[index].style.display = 'block';
      }
    }

    // Обновляем состояние стрелок прокрутки миниатюр
    prevBtn.disabled = thumbStartIndex === 0;
    nextBtn.disabled = thumbStartIndex + visibleThumbs >= images.length;
  }

  // Обновляем кнопки навигации (влево/вправо для основного изображения)
  function updateNavButtons() {
    // Не показываем кнопки если нет навигации
    // Или можно добавить класс disabled к самим стрелкам
    // В данном случае просто проверяем границы
  }

  // Прокрутка миниатюр вперед
  function scrollThumbsNext() {
    if (thumbStartIndex + visibleThumbs < images.length) {
      thumbStartIndex++;
      updateMiniaturesView();
    }
  }

  // Прокрутка миниатюр назад
  function scrollThumbsPrev() {
    if (thumbStartIndex > 0) {
      thumbStartIndex--;
      updateMiniaturesView();
    }
  }

  // Обновляем основное изображение
  function updateMainImage(index) {
    currentIndex = index;
    mainImage.src = images[index];
    mainImage.alt = altTexts[index];

    // Убираем все позиционирующие классы. Для @media (max-width: 990px) {}
    mainImage.classList.remove('image-even');
    
    // Добавляем класс для 2-го и 4-го изображений
    if (index === 1 || index === 3) {
      mainImage.classList.add('image-even');
    }

    // Обновляем активную миниатюру
    document.querySelectorAll('.miniature').forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });

    // Если активная миниатюра не видна, прокручиваем к ней
    if (index < thumbStartIndex || index >= thumbStartIndex + visibleThumbs) {
      thumbStartIndex = Math.max(0, Math.min(index - visibleThumbs + 1, images.length - visibleThumbs));
      updateMiniaturesView();
    }
    
    // Обновляем состояние кнопок навигации после смены изображения
    updateNavButtons();
  }

  // Функция для перехода к следующему изображению (без цикла)
  function goToNextImage() {
    if (currentIndex < images.length - 1) {
      updateMainImage(currentIndex + 1);
    }
  }

  // Функция для перехода к предыдущему изображению (без цикла)
  function goToPrevImage() {
    if (currentIndex > 0) {
      updateMainImage(currentIndex - 1);
    }
  }

  // Инициализация
  createMiniatures();

  // Обработчики для стрелок прокрутки миниатюр
  prevBtn.addEventListener('click', scrollThumbsPrev);
  nextBtn.addEventListener('click', scrollThumbsNext);

  // Клавиатурная навигация для основного слайдера (без цикла). Простой вариант: навигация стрелками для цветов
  document.addEventListener('keydown', (event) => {
    const focused = document.activeElement;
    
    // Если фокус на цветовой кнопке
    if (focused && focused.classList.contains('productCard__label--color')) {
      const colorLabels = document.querySelectorAll('.productCard__label--color');
      const currentIndex = Array.from(colorLabels).indexOf(focused);
      
      // Обрабатываем ТОЛЬКО стрелки влево/вправо
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault(); // Отменяем стандартное поведение
        
        let nextIndex;
        if (event.key === 'ArrowRight') {
          nextIndex = (currentIndex + 1) % colorLabels.length;
        } else {
          nextIndex = (currentIndex - 1 + colorLabels.length) % colorLabels.length;
        }
        
        // Перемещаем фокус и выбираем цвет
        if (colorLabels[nextIndex]) {
          const radioInput = colorLabels[nextIndex].querySelector('.productCard__radio-btn');
          if (radioInput) {
            radioInput.checked = true;
            // Визуальное выделение
            document.querySelectorAll('.productCard__label--color').forEach(l => {
              l.classList.remove('color-selected');
            });
            colorLabels[nextIndex].classList.add('color-selected');
          }
          colorLabels[nextIndex].focus();
        }
      }
    }
    
    // Если фокус на миниатюре - управляем слайдером
    else if (focused && focused.classList.contains('miniature')) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToPrevImage();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToNextImage();
      }
    }
  });




  // === Обработка формы заказа ===
  const orderForm = document.getElementById('orderForm');
  
  if (orderForm) {
    orderForm.addEventListener('submit', async function(event) {
      event.preventDefault(); // Отменяем стандартную отправку
      
      // ВАЖНО: Получаем красивое название цвета из data-атрибута
      const selectedColorRadio = document.querySelector('input[name="color"]:checked');
      const colorValueForServer = selectedColorRadio ? selectedColorRadio.value : null;
      const colorDisplayName = selectedColorRadio ? selectedColorRadio.dataset.displayName : null;

      // Собираем данные формы
      const formData = new FormData(orderForm);
      const data = {
        size: formData.get('size'),
        color: colorValueForServer, // Английское значение для сервера
        color_display: colorDisplayName, // Русское название для отображения
        email: formData.get('email'),
        product: document.querySelector('.product-title')?.textContent || 'Лифчик',
        timestamp: new Date().toLocaleString('ru-RU')
      };
      
      // Проверяем, выбраны ли размер и цвет
      let errorMessage = '';
      
      if (!data.size && !data.color) {
        showMessage('🚫 Вы не выбрали размер И цвет', 'error');
        return;
      }

      if (!data.size) {
        showMessage('📏 Вы не выбрали размер', 'error');
        return;
      }

      if (!data.color) {
        showMessage('🎨 Вы не выбрали цвет', 'error');
        return;
      }
      
      // Если есть ошибка - показываем и останавливаем
      if (errorMessage) {
        showMessage(errorMessage, 'error');
        return;
      }
      
      // Показываем состояние "отправка"
      const submitBtn = orderForm.querySelector('.productCard__btn');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Отправка...';
      submitBtn.disabled = true;
      
      try {
        // Имитация отправки на сервер (замените на реальный запрос)
        await simulateServerRequest(data);
       
        // ПОСЛЕ успешной отправки показываем "ЗАКАЗ ПРИНЯТ". ИСПОЛЬЗУЕМ colorDisplayName для красивого отображения
        showMessage(`
          <div style="text-align: center; padding: 20px;">
            <div style="font-size: 24px; margin-bottom: 10px;">✅</div>
            <strong style="font-size: 18px; color: #2e7d32;">ВАШ ЗАКАЗ ПРИНЯТ!</strong><br>
            <span style="color: #555;">Спасибо за покупку! 🎉</span>
          </div>
        `, 'success');
        
        // Дополнительная информация через секунду
        setTimeout(() => {
          const messageDiv = document.getElementById('formMessage');
          if (messageDiv.innerHTML.includes('ВАШ ЗАКАЗ ПРИНЯТ')) {
            messageDiv.innerHTML += `<br><small style="color: #666;">Заказ: ${data.size}, ${colorDisplayName}.</small>`;
          }
        }, 1000);
        
        // Сбрасываем форму
        orderForm.reset();
        
      } catch (error) {
        console.error('Ошибка отправки формы:', error);
        showMessage('❌ Ошибка отправки. Попробуйте еще раз.', 'error');
      } finally {
        // Возвращаем кнопку в исходное состояние
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
  
  // Функция показа сообщений
  function showMessage(text, type) {
    const messageDiv = document.getElementById('formMessage');
    messageDiv.innerHTML = text; // Изменил на innerHTML для поддержки эмодзи
    messageDiv.className = `productCard__message ${type}`;
    messageDiv.style.display = 'block';
    
    // Автоматически скрываем сообщение через 10 секунд
    setTimeout(() => {
      messageDiv.style.display = 'none';
    }, 10000);
  }
  
  // Функция имитации запроса к серверу
  function simulateServerRequest(data) {
    return new Promise((resolve) => {
      console.log('Отправка данных на сервер:', data);
      
      // Имитация задержки сети
      setTimeout(() => {
        resolve({ success: true, message: 'Данные получены сервером' });
      }, 800);
    });
  }

});