document.addEventListener('DOMContentLoaded', function() {

  //- slider 8+ Не удалять -//
  const swiper = new Swiper('.hero__swiper', {
    speed: 5000,//Интервал ожидания
    //allowTouchMove: false,Уберает прокрутку мыши
    
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
    }
  });
  
  
});