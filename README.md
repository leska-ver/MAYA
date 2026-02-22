🧩 СТРУКТУРА: ОТ ОБЩЕГО К ЧАСТНОМУ


1️⃣ НАЧАЛО — дизайн и общая информация ✅

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


2️⃣ ПОЛЕЗНЫЕ МЕЛОЧИ — кэш, багфиксы ✅

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


<hr>
<h2><span>🎨 ФРОНТЕНД (ВЁРСТКА, СКРИПТЫ, СТИЛИ)</span></h2>
<hr>


3️⃣ JS И БИБЛИОТЕКИ — ценник, свайпер, чекбоксы ✅

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


4️⃣ ОПТИМИЗАЦИЯ И ДОСТУПНОСТЬ — srcset, role, tabindex ✅

## Как добавить srcset для ретины (если есть разные размеры одной картинки):
```html
<img class="katalog__filter-img" 
     src="img/underwear.jpg" 
     srcset="img/underwear@2x.jpg 2x, 
             img/underwear@3x.jpg 3x"
     alt="Название товара">
```

## 🖼️ Полный улучшенный вариант (но без <picture>):
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


5️⃣ КАЧЕСТВО КОДА — проверка HTML, CSS, доступности ✅

## 🌳 Генератор HTML-дерева и DOM-структура
- https://yoksel.github.io/html-tree/ — визуализация структуры
- DOM-дерево построено корректно ✅

## HTML-валидатор (W3C)
- https://validator.w3.org/#validate_by_input
- Проверка синтаксиса, вложенности, атрибутов
- Ошибок нет ✅

## 🎨 CSS-валидатор (W3C)
- https://jigsaw.w3.org/css-validator/#validate_by_input
- Проверка свойств, значений, поддержки браузерами
- Стили написаны корректно ✅

## 📐 Pixel Perfect 
- вёрстка совпадает с макетом

## **DOM-дерево** 
- структура корректна

## ♿ Доступность (a11y)
- Lighthouse (встроен в браузер)
- WAVE (расширение для Chrome/Firefox)
- Добавлены `role`, `tabindex`, `aria-label`, `alt`



6️⃣ СТРУКТУРА ПРОЕКТА — классы секций ✅

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


<hr>
<h2><span>🖥️ БЭКЕНД (PHP, БД, ПОЧТА)</span></h2>
<hr>



7️⃣ PHPMailer — установка и настройка ✅

## В 6 версии PHPMailer для файлов .php(mail.php и list.php)

### Качаем здесь - https://github.com/PHPMailer/PHPMailer -> Code -> Download ZIP

```txt
- Оставляем в папке PHPMailer
- Папку - language
- Папку - src и 3шт. файлов: Exception.php, PHPMailer.php, SMTP.php 
```


8️⃣ БАЗА ДАННЫХ — SQL, phpMyAdmin ✅

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


9️⃣ ЛОГИРОВАНИЕ — mail.php, папка logs ✅

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


🔟 ЧТО ПОЛУЧИЛОСЬ — схема работы ✅

## Что получилось:
```txt
mail.php ← принимает заявки, сохраняет в БД, отправляет email
list.php ← показывает все заявки из БД с пояснениями
База данных ← связывает их между собой
```

1️⃣1️⃣ ПРОВЕРКА И ОТЛАДКА — test-файлы, права 755 ✅

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

# Создали Базу данных MySQL
- cc50985_maya (https://hosting.timeweb.ru/mysql) -> https://vh454.timeweb.ru/pma/index.php?route=/table/structure&db=cc50985_maya&table=form_submissions 

## Проверяли ошибку 500 
- Создали папку logs -> .gitkeep
- test-db.php - https://тест333.рф/test-db.php
- test-mail.php - https://тест333.рф/test-mail.php
- test-insert.php - https://тест333.рф/test-insert.php
- В FileZilla -> test -> public_html -> logs -> ПКМ -> Права доступа к файлу -> Числовое значение 755 -> ОК
- В https://hosting.timeweb.ru/fileman -> logs -> ПКМ -> Изменить атрибуты -> Кодовое значение 755 -> Сохранить


1️⃣2️⃣ НАСТРОЙКА ПОЧТЫ — isMail vs isSMTP, SPF, DKIM, DMARC ✅

## Чем отличается $mail->isMail(); от $mail->isSMTP();
$mail->isMail(); - Минус: письма могут иногда попадать в спам. Плюс: никаких паролей, никаких настроек.
$mail->isSMTP(); - Минус: письма могут не приходит, придётся менят парол в ящике Тимвеба - noreply@cc50985.tw1.ru. Плюс: Пароли пользователей хакеры не могут видит! Письма не попадают в спам(Надо настраивать его в Тимвебе ).   

### ШАГ 1. Настройте SPF-запись
В Timeweb (https://hosting.timeweb.ru/domains/settings/dns-editor?fqdn=тест333.рф) -> +Добавить запись 

<p>Если есть TXT, то удалите его!</p> 

#### 🔥 SPF-запись (самая важная)
- Убедитесь, что выбран тип TXT (не A, не MX, а именно TXT)
- TTL: 600
- Поле «Хост» оставьте пустым (или введите @, если система требует), он сам добавить название домена(тест333.рф)
- В поле «Значение» вставьте:
```txt
v=spf1 include:_spf.timeweb.ru ~all
```
- Жмём СОХРАНИТЬ -> Ждём 15 минут!

<p>Это разрешит серверам Timeweb отправлять почту от вашего домена.</p>

### ШАГ 2. Настройте DKIM-подпись. Для чего он нужен? - Автоматически настроится. Если нет то вот решение настройки.
- Репутация домена ✅✅ Максимальная | ✅ Письма выглядят "легально" для Яндекса и Mail.ru</p>

```txt
В панели Timeweb:
Раздел "Почта" → "Почтовые ящики" → найдите ваш ящик noreply@cc50985.tw1.ru
Там должна быть опция "DKIM-подпись" — включите её
Система покажет DNS-запись, которую нужно добавить (обычно TXT с именем mail._domainkey.тест333.рф)
```
#### И после настроек у нас вышел облом. Либо:
- Timeweb Cloud (новая панель, облачные серверы) — там DKIM включается автоматически .
- Обычный Timeweb (ваш, со старой панелью timeweb.ru) — там нет кнопки "Включить DKIM" в интерфейсе.

##### Ждём ответа от админа Тимвеба(timeweb.ru) на мой тикет.
PS:
```txt
Ответ от админов: - Для доменов вида .tw1.ru невозможно настроить DNS-записи
```

### ШАГ 3. Настройте DMARC-политику - Автоматически настроится. Если нет то вот решение настройки.
Добавьте TXT-запись:

```txt
Имя: _dmarc
TXT значение: v=DMARC1; p=none; rua=mailto:админ@тест333.рф
```
<p>Начните с политики p=none (только мониторинг), потом усилите</p>

### Подождите 15-30 минут (DNS обновляется)
### Отправьте тестовое письмо — теперь должно прийти во "Входящие"

🏁 Итог
Сделали всё возможное с ИИ:

✅ SPF настроен
✅ DKIM создан автоматически
✅ DMARC добавлен

## 🔥 РАЗБЛОКИРОВКА IP (важно!)
Если письма перестали приходить на Mail.ru, причина может быть в IP-адресе сервера.

**Что делать:**
1. Проверить IP сервера: `92.53.116.149`
2. Если письма блокируются — писать в поддержку Timeweb с текстом:
```text
Здравствуйте! IP 92.53.116.149 попал в чёрный список Mail.ru.
Прошу очистить репутацию IP или предложить альтернативу (выделенный IP/SMTP-реле).
```

## Не ставить! его письма mail.ru блокирует
```text
// Кому отвечать — пользователь
    // $reply_email = $_POST['email'] ?? ($admin_emails[0] ?? 'noreply@' . $_SERVER['HTTP_HOST']);
    // $mail->addReplyTo($reply_email, $_POST['name'] ?? '');
```


1️⃣3️⃣ ЛОГИ ЗАЯВОК — где искать, как хранить ✅

## 📁 Логи заявок (orders)

### 🔍 Где искать на сервере (Timeweb)

1. Зайти в **FileZilla** (или любой FTP-клиент)
2. Подключиться к серверу:
```text
   - **Хост:** `92.53.96.105`
   - **Логин:** `cc50985`
   - **Пароль:** [твой пароль]
```   
3. Перейти в папку:
/test/public_html/logs
4. Там лежат файлы:
```text
orders_2026-02-14.log
orders_2026-02-15.log
orders_2026-02-16.log
```
— каждый день создаётся новый файл.

### 💾 Куда сохранять скачанные логи (архив)

После скачивания через FileZilla складываем в папку на компьютере:
Документы / MAYA / логи /
└── 2026 /
└── 02-февраль /
├── orders_2026-02-14.log
├── orders_2026-02-15.log
└── ...

**Структура по годам и месяцам** — чтобы легко найти нужный файл через полгода.

### ☁️ Для важных заказов
Если файл нужен как подтверждение клиенту — **дублируем в облако**:
```text
- Google Диск
- Яндекс.Диск
- Dropbox
```

Папка: `MAYA / логи / 2026 / 02-февраль /`


1️⃣4️⃣ AJAX И UX — без перезагрузки, очистка полей ✅

## 📬 AJAX для форм (чтобы страница не перезагружалась)

Скрипт для всех страниц (вставлять перед `</body>`):
```javascript
<script>
  document.addEventListener('DOMContentLoaded', function() {
  const form1 = document.querySelector('.cta__form');
  const form2 = document.querySelector('.latest__form');
  const forms = [];

  if (form1) forms.push(form1);
  if (form2) forms.push(form2);

  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(this);

      fetch(this.action, { method: 'POST', body: formData })
        .then(response => {
          if (response.ok) {
            const message = document.createElement('div');
            message.className = 'success-message';
            message.textContent = '👍 Спасибо! Данные отправлены.';
            message.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #BF7691; color: white; padding: 15px; border-radius: 5px; z-index: 9999;';
            document.body.appendChild(message);
            setTimeout(() => message.remove(), 3000);

            // Очистка полей
            const email = this.querySelector('input[name="email"]');
            if (email) email.value = '';

            if (this.classList.contains('cta__form')) {
              const name = this.querySelector('input[name="name"]');
              const msg = this.querySelector('textarea[name="message"]');
              if (name) name.value = '';
              if (msg) msg.value = '';
            }
          }
        });
    });
  });
});
</script>
```

## ✅ ВАЛИДАЦИЯ ФОРМ

### На клиенте (HTML5)
- `required` — обязательные поля
- `type="email"` — проверка формата email
- `maxlength="35"` — ограничение длины

### На сервере (PHP)
- `filter_var($email, FILTER_VALIDATE_EMAIL)` — проверка email админов
- `$_POST['email'] ?? ''` — защита от Undefined index
- PDO + подготовленные запросы — защита от SQL-инъекций

### Для пользователя (UX)
- `data-validate-field="email"` — для плагина валидации (если подключён)
- Сообщение об успехе после AJAX-отправки

## 📌 ОПРЕДЕЛЕНИЕ СТРАНИЦЫ ДЛЯ СТАТИСТИКИ

Добавлено поле page_url в таблицу form_submissions
Чтобы видеть, с какой страницы пришла заявка.

### В форме добавляем скрытое поле:
```html
<input type="hidden" name="page_url" id="page_url" value="главная">
```

### На странице отзывов (где две формы):
```html
<input type="hidden" name="page_url" id="page_url_sms" value="отзыв-смс">
<input type="hidden" name="page_url" id="page_url_subscribe" value="отзыв-подписка">
```

### Скрипт для заполнения (вставлять перед </body>):
```javascript
<script>
  const path = window.location.pathname;
  if (path.includes('otzyvy')) {
    const sms = document.getElementById('page_url_sms');
    const sub = document.getElementById('page_url_subscribe');
    if (sms) sms.value = 'отзыв-смс';
    if (sub) sub.value = 'отзыв-подписка';
  } else if (path.includes('index') || path === '/') {
    const main = document.getElementById('page_url');
    if (main) main.value = 'главная';
  } // и так для других страниц
</script>
```


1️⃣5️⃣ ТЕСТОВЫЕ ФАЙЛЫ И СТРУКТУРА ПАПОК ✅

🧪 Тестовые файлы (для проверки)
```text
test-db.php      — проверка подключения к БД
test-mail.php    — проверка отправки почты
test-insert.php  — проверка вставки в БД
После проверки — удалять!
```

📂 Структура папок
```text
test/
  public_html/
    logs/              — сюда пишутся логи заявок
    PHPMailer/         — библиотека для почты
    mail.php           — обработчик с логами
    mail-NoLoga.php    — обработчик без логов (для продакшена)
    list.php           — просмотр заявок из БД
    *.html             — страницы сайта
```

⚠️ Важно!
```text
В формах всегда указывать action="mail.php"

Для логов нужна папка logs с правами 755

При переносе на другой хостинг проверить настройки PHP и SMTP
```