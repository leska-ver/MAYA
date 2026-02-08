# Полезная инфа 

## Ссылка на сайт 
- https://leska-ver.github.io/MAYA/

## Ссылка на макет 

- https://www.figma.com/design/PNogkXytjGofko43p13ZZQ/MAYA?m=auto&t=bymNkBN3SvYHtYKb-6

## Название цвета

- https://chir.ag/projects/name-that-color/#4D4D4D

## Шрифты

```txt
 - font-weight: 500; Montserrat-Medium
 - font-weight: 400; Montserrat-Regular
 - font-weight: 300; Montserrat-Light
 - font-weight: 400; Montserrat-Italic
 - font-weight: 400; OptimaCyr
 - font-weight: 600; Montserrat-SemiBold
 - font-weight: 300; Montserrat-LightItalic
```

## Как очистить кэш?

- Ctrl+Shift+Delete

## Временный багфикс. Когда гугл показывает старые данные, ставим это. 
### Добавь в HTML перед закрывающим </head>:

```txt
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
```

## Переход с #484848 на RGBA(80%)
- https://get-color.ru/code/484848

## JS Для ценика пишим отдельным файлом
- catalog.js

### Добавляем библиотечные файлы
```txt
- nouislider.min.css(CDN версия -> <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/nouislider@15.6.0/dist/nouislider.min.css">) 
- nouislider.min.js(CDN версия -> <script src="https://cdn.jsdelivr.net/npm/nouislider@15.6.0/dist/nouislider.min.js"></script>)
```

### swiper-у задала отдельный файл, ценик ошибки выдавал
- hero__swiper.js

## У чексбокса нет JS кода.
- section class="katalog"

## Как добавить srcset для ретины (если есть разные размеры одной картинки):
```html
<img class="katalog__filter-img" 
     src="img/underwear.jpg" 
     srcset="img/underwear@2x.jpg 2x, 
             img/underwear@3x.jpg 3x"
     alt="Название товара">
```

## 🎨 Полный улучшенный вариант (но без <picture>):
```txt
<div class="katalog__filter-platform">
  <img class="katalog__filter-img" 
     src="img/underwear.jpg" 
     srcset="img/underwear@2x.jpg 2x" 
     width="250" 
     height="356"
     loading="lazy"
     alt="Название товара, категория">
</div>
```

## Добавьте role="button" для семантики, чтобы скринридеры понимали, что это кнопка.

## <label> не интерактивный элемент по стандартам доступности. 
```txt
Добавить tabindex="0"
```

## Классы section
```txt
1. index.html
 - .hero
 - .catalog
 - .novelty
 - .cta .cta--coupon
 - .reviews
 - .faq
 - .cta .cta--app
 - .latest

2. o-nas.html
 - .o-nas
 - .instagram
 - .latest

3. catalog.html
 - .katalog
 - .latest

4. productCard.html
 - .productCard

5. otzyvy.html
 - .reviews
 - .cta .cta--app
 - .latest

6. dostavka.html
 - .dostavka
 - .payment
 - .latest
```

## В 6 версии PHPMailer для файлов .php(mail.php и list.php)

### Качаем здесь - https://github.com/PHPMailer/PHPMailer -> Code -> Download ZIP

```txt
- Оставляем в папке PHPMailer
- Папку - language
- Папку - src и 3шт. файлов: Exception.php, PHPMailer.php, SMTP.php 
```

### Для БД(домен и хост)
```txt 
sql 
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    message TEXT,
    size VARCHAR(10),
    color VARCHAR(50),
    form_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## в mail.php добавляем ЛОГ
<p>Создала папку logs, суда будем складывать ответы от клиентов. Не удалять!!!</p>
```txt
Для сайта с заказами и автоматической отправкой БД логирование - это система безопасности №1. Это как видеонаблюдение в магазине: когда все хорошо, оно не нужно, но когда происходит инцидент - без него вы беспомощны.

Бюджетное решение: хотя бы минимальное логирование ошибок (как в вашем примере)
Правильное решение: структурированные логи с ротацией, мониторингом и уведомлениями
```

## За чем мы в mail.php и в mail-NoLoga.php пишешь <?php ... > а не <? ... >
```txt
- Код с <?php будет работать везде
- Код с <? может сломаться при переносе на другой сервер
```

## ФАЙЛ: mail-NoLoga.php - ВЕРСИЯ БЕЗ ЛОГОВ
- для продакшена

## Что получилось:
```txt
mail.php ← принимает заявки, сохраняет в БД, отправляет email
list.php ← показывает все заявки из БД с пояснениями
База данных ← связывает их между собой
```

## Создан отдельный файл для проверки list.php 
- check-db.php: С отладочным кодом. После проверки удалять!
```txt
<?php
$pdo = new PDO("mysql:host=localhost;dbname=ci54422_elochka", 
               "ci54422_elochka", "1GmHsZV");
$result = $pdo->query("SELECT * FROM orders");
echo "Записей: " . $result->rowCount();
?>
```