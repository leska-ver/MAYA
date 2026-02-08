document.addEventListener('DOMContentLoaded', function() {

  // Добавьте обработку ошибок в ваш script.js: //
  try {
    // ваш существующий код
    console.log('✅ Скрипт инициализирован');
  } catch (error) {
      console.error('❌ Ошибка в скрипте:', error);
  }



  //- Бургер -//
  console.log('=== ТЕСТ БУРГЕРА ЗАПУЩЕН ===');

  const elements = {
    burger: document.querySelector('.burger'),
    headerNav: document.querySelector('.navigation__nav'),
    overlay: document.querySelector('.navigation__overlay'),
    links: document.querySelectorAll('.navigation__link')
  };

  console.log('Найденные элементы:');
  console.log('- burger:', elements.burger);
  console.log('- navigation__nav:', elements.headerNav);
  console.log('- overlay:', elements.overlay);
  console.log('- links:', elements.links.length);

  function toggleMenu() {
    const isActive = elements.burger.classList.contains('burger--active');

    if (!isActive) {
      // Открываем меню
      elements.burger.classList.add('burger--active');
      elements.headerNav.classList.add('navigation__nav--active');
      elements.overlay.classList.add('overlay--active');
      document.body.style.overflow = 'hidden';
    } else {
      // Закрываем меню
      elements.burger.classList.remove('burger--active');
      elements.headerNav.classList.remove('navigation__nav--active');
      elements.overlay.classList.remove('overlay--active');
      document.body.style.overflow = '';
    }

    console.log('Состояние меню:', !isActive ? 'OPEN' : 'CLOSED');
  }

  function closeMenu() {
    elements.burger.classList.remove('burger--active');
    elements.headerNav.classList.remove('navigation__nav--active');
    elements.overlay.classList.remove('overlay--active');
    document.body.style.overflow = '';
    console.log('Меню закрыто');
  }

  // Обработчики событий
  if (elements.burger) {
    elements.burger.addEventListener('click', toggleMenu);
    console.log('✅ Бургер инициализирован');
  }

  if (elements.overlay) {
    elements.overlay.addEventListener('click', closeMenu);
  }

  elements.links.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Закрытие меню при ресайзе окна
  window.addEventListener('resize', function() {
    if (window.innerWidth > 666) {
      closeMenu();
    }
  });



  //- Модальное окно index.html -//
  // Находим все карточки и кнопки закрытия
  const cards = document.querySelectorAll('.card');
  const closeButtons = document.querySelectorAll('.close');
  const modals = document.querySelectorAll('.modal');

  // Функция для открытия модального окна
  function openModal(modal) {
    // Блокируем прокрутку страницы
    document.body.classList.add('body-no-scroll');
    
    // Показываем модалку
    modal.classList.add('modal--active');
    
    // Запускаем анимацию появления
    setTimeout(() => {
        modal.style.display = 'block';
    }, 10);
  }

  // Функция для закрытия модального окна
  function closeModal(modal) {
    // Убираем активный класс для анимации исчезновения
    modal.classList.remove('modal--active');
    
    // Ждем окончания анимации и скрываем модалку
    setTimeout(() => {
        modal.style.display = 'none';
        // Разблокируем прокрутку страницы
        document.body.classList.remove('body-no-scroll');
    }, 300);
  }

  // Добавляем обработчики для карточек
  cards.forEach(card => {
    card.addEventListener('click', function() {
      const modalId = this.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      if (modal) {
        openModal(modal);
      }
    });
  });

  // Добавляем обработчики для кнопок закрытия
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const modal = this.closest('.modal');
      if (modal) {
        closeModal(modal);
      }
    });
  });

  // Предотвращаем всплытие события для кнопок внутри карточек
  const cardButtons = document.querySelectorAll('.card__btn');
  cardButtons.forEach(button => {
    button.addEventListener('click', function(event) {
      event.stopPropagation();
      const card = this.closest('.catalog__item');
      const modalId = card.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      if (modal) {
        openModal(modal);
      }
    });
  });




  //- faq - аккордеона (табов) index.html
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Закрываем все элементы
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
        otherItem.querySelector('.faq__answer').setAttribute('hidden', '');
      });
      
      // Если элемент не был активен - открываем его
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        answer.removeAttribute('hidden');
      }
    });
  });




  //- Общая функция для Посмотреть еще больше отзывов // Шаблон otzyvy.html
  function toggleToCollapseText(buttonElement) {
    // Сохраняем оригинальный текст при первом клике
    if (!buttonElement.dataset.originalText) {
        buttonElement.dataset.originalText = buttonElement.textContent;
    }
    
    // Если сейчас не "Свернуть", меняем на "Свернуть"
    if (buttonElement.textContent !== 'Свернуть') {
        buttonElement.textContent = 'Свернуть';
    } else {
        // Если сейчас "Свернуть", возвращаем оригинальный текст
        buttonElement.textContent = buttonElement.dataset.originalText;
    }
  }

  //- reviews btn-more. Посмотреть еще больше отзывов //
  const reviewsList = document.getElementById('list-further');
  const reviewsMoreButton = document.getElementById('more');

  if (reviewsMoreButton && reviewsList) {
      const reviewsBtnText = reviewsMoreButton.querySelector('.btn-text');
      
      reviewsMoreButton.addEventListener('click', function () {
          reviewsList.classList.toggle('full');
          
          // Используем общую функцию вместо if-else
          if (reviewsBtnText) {
              toggleToCollapseText(reviewsBtnText);
          }
      });
  }

  //- Для другой кнопки (например, "Загрузить ещё")
  // Находим вторую кнопку - замените '#load-more-btn' на правильный селектор вашей кнопки
  const loadMoreBtn = document.getElementById('load-more-btn'); // или document.querySelector('.load-more')
  const loadMoreContent = document.getElementById('load-more-content'); // элемент, который нужно показать/скрыть

  if (loadMoreBtn && loadMoreContent) {
      const loadMoreBtnText = loadMoreBtn.querySelector('.btn-text') || loadMoreBtn;
      
      loadMoreBtn.addEventListener('click', function() {
          // Показываем/скрываем контент
          loadMoreContent.classList.toggle('full');
          
          // Используем общую функцию для смены текста
          toggleToCollapseText(loadMoreBtnText);
      });
  }

  // Если у второй кнопки нет отдельного элемента для контента, можно просто менять текст
  if (loadMoreBtn && !loadMoreContent) {
      const loadMoreBtnText = loadMoreBtn.querySelector('.btn-text') || loadMoreBtn;
      
      loadMoreBtn.addEventListener('click', function() {
          // Здесь ваша логика для загрузки контента
          // Например: loadMoreContentFunction();
          
          // Меняем текст кнопки
          toggleToCollapseText(loadMoreBtnText);
      });
  }




//-



  
});