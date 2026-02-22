<?php
  // Подключение "Базы данных", тот же код. ПРОФИ КОД. Скопировали и закинули в файл mail.php
  $dbname = 'cc50985_maya';/*Из сайта имя "Базы данных MySQL"*/
  $dbuser = 'cc50985_maya';/*Из сайта имя "Базы данных MySQL"*/
  $dbpass = 'yaStore20';/*Пароль из сайта "Базы данных"*/

  try {
    // С обработкой ошибок
    $pdo = new PDO("mysql:host=localhost;dbname=$dbname", $dbuser, $dbpass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);// С EXCEPTION - защищённый код
		$pdo->exec("SET NAMES utf8");
  
    // Подготовленный запрос (защита от SQL-инъекций) - СОВМЕСТИМ С mail.php/mail-NoLoga.php
    $stmt = $pdo->prepare('SELECT * FROM form_submissions ORDER BY id DESC');
    $stmt->execute();
    
  } catch(PDOException $e) {
      die("Ошибка подключения к базе данных: " . $e->getMessage());
  }

?>
  <!-- Пишим таблицу через html код. Она выйдет по акуратнее и симпатичной в браузере(https://ссылка/list.php)-->
<!DOCTYPE html>
<html>
  <!--Результат таблицы https://тест333.рф/list.php -->
  <head>
    <title>Список заявок</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        padding: 20px;
        min-height: 100vh;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: linear-gradient(135deg, #BF7691 0%, #9e5e76 100%);
      }
      
      .container {
        margin: 0 auto;
        padding: 30px;
        border-radius: 20px;
        max-width: 1400px;
        background-color: white;
        box-shadow: 0 20px 60px rgba(158, 94, 118, 0.4);
      }
      
      h1 {
        position: relative;
        margin-bottom: 30px;
        padding-bottom: 15px;
        font-family: 'Montserrat', sans-serif;
        font-size: clamp(20px, 5vw, 30px);
        font-weight: 400;
        line-height: 1.2;
        text-align: center;
        color: #4d4d4d;
      }
      
      h1:after {
        position: absolute;
        bottom: 0;
        left: 50%;
        content: '';
        border-radius: 3px;
        width: 100px;
        height: 3px;
        background: linear-gradient(to right, #BF7691, #9e5e76);
        transform: translateX(-50%);
      }
      
      .table-wrapper {
        margin: 20px 0;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(191, 118, 145, 0.2);
        overflow-x: auto;
      }
      
      table {
        border-collapse: collapse;
        width: 100%;
        font-family: 'Montserrat', sans-serif;
        font-size: 10px; 
        font-weight: 400;
        line-height: 1.2;
        background-color: #fff;
      }
      
      th {
        padding: 10px 6px; 
        border: 1px solid #BF7691;
        font-weight: 600;
        text-align: left;
        color: #fff;
        background: linear-gradient(135deg, #BF7691, #9e5e76);
        white-space: nowrap;
      }
      
      td {
        padding: 8px 6px; 
        border: 1px dashed #9e5e76;
        border-bottom: 1px solid #e0e0e0;
        text-align: center;
        color: #555;
        vertical-align: top;
      }
      
      tr:hover {
        background-color: #fce4ec;
        transition: background 0.3s ease;
      }
      
      /* Стиль для пустых ячеек */
      td:empty:before {
        content: "—";
        color: #ccc;
      }
      
      /* Компактные бейджи */
      .type-badge {
        display: inline-block;
        padding: 2px 6px;
        border-radius: 10px;
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
        white-space: nowrap;
      }
      
      .type-order {
        color: #fff;
        background-color: #BF7691;
      }
      
      .type-newsletter {
        color: #BF7691;
        background-color: #fce4ec;
      }
      
      .type-review {
        background-color: #9e5e76;
        color: #fff;
      }
      
      /* Маленький цветной индикатор */
      .color-dot {
        display: inline-block;
        margin-right: 3px;
        border: 1px solid #ddd;
        border-radius: 50%;
        width: 12px;
        height: 12px;
        vertical-align: middle;
      }
      
      /* Сообщение с переносом */
      .message-preview {
        max-width: 250px;
        word-break: break-word;
      }
      
      .total-count {
        margin-top: 20px;
        padding: 12px;
        border-radius: 10px;
        font-size: 14px;
        text-align: right;
        background-color: #fce4ec;
      }
      
      .total-count span {
        margin-left: 8px;
        font-size: 20px;
        font-weight: bold;
        color: #BF7691;
      }
      
      /* Телефоны */
      @media (max-width: 768px) {
        .container {
          padding: 15px;
        }
          
        h1 {
          font-size: 1.8em;
        }
        
        th, td {
          padding: 6px 4px;
          font-size: 11px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Список заявок MAYA Store</h1>
      
      <?php if ($stmt->rowCount() > 0): ?>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Фамилия и Имя</th>
            <th>Email</th>
            <th>Сообщение</th>
            <th>Цвет</th>
            <th>Размер</th>
            <th>Тип формы</th>
            <th>Тема</th> <!-- ← ЗАГОЛОВОК (form_subject) -->
            <th>Страница</th>
            <th>Дата</th>
          </tr>
        </thead>
        <tbody>
          <?php while ($row = $stmt->fetch(PDO::FETCH_ASSOC)): ?>
          <tr>
            <td><?= htmlspecialchars($row['id']) ?></td>
            <td><?= htmlspecialchars($row['name']) ?></td>
            <td><?= htmlspecialchars($row['email']) ?></td>
            <td><?= htmlspecialchars($row['message']) ?></td>
            <td><?= htmlspecialchars($row['color']) ?></td>
            <td><?= htmlspecialchars($row['size']) ?></td>
            <td><?= htmlspecialchars($row['form_type']) ?></td>
            <td><?= htmlspecialchars($row['form_subject']) ?></td><!-- ← list.php читает эти поля: и mail.php и в mail-NoLoga.php --> 
            <!-- ← Тема(form_subject) содержит:
              - "Заказ товара: Название" 
              - "Получать новости на email"
              - "Новый отзыв о MAYA" 
            -->  
            <!-- Показывает с какой страницы пришла шаблон форма -->
            <td><?= htmlspecialchars($row['page_url'] ?? '') ?></td>                  
            <td style="white-space: wrap; text-align:center"><!-- ← list.php читает эти поля: и mail.php и в mail-NoLoga.php   -->
              <!-- Дата будет отображаться в формате 17-02-2026 16:56 -->
              <?php 
              if (!empty($row['date'])) {
                  echo date('d-m-Y H:i', strtotime($row['date']));
              } else {
                  echo '—';
              }
              ?>
            </td>
          </tr>
          <?php endwhile; ?>
        </tbody>
      </table>
      
      <p>Всего заявок: <?= $stmt->rowCount() ?></p>
      
      <?php else: ?>
      <p style="text-align: center; color: #666; font-size: 18px;">
        Заявок пока нет.
      </p>
      <?php endif; ?>
    </div>
  </body>
</html>


