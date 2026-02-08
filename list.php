<?php
  // Подключение "Базы данных", тот же код. ПРОФИ КОД. Скопировали и закинули в файл mail.php
  // Исправляем код на своё ci54422_elochka 1GmHsZV
  $dbname = 'ci54422_elochka';/*Из сайта имя "Базы данных MySQL"*/
  $dbuser = 'ci54422_elochka';/*Из сайта имя "Базы данных MySQL"*/
  $dbpass = '1GmHsZV';/*Пароль из сайта "Базы данных"*/

  try {
    // С обработкой ошибок
    $pdo = new PDO("mysql:host=localhost;dbname=$dbname", $dbuser, $dbpass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);// С EXCEPTION - защищённый код
		$pdo->exec("SET NAMES utf8");
  
    // Подготовленный запрос (защита от SQL-инъекций) - СОВМЕСТИМ С mail.php/mail-NoLoga.php
    $stmt = $pdo->prepare('SELECT * FROM orders ORDER BY id DESC');
    $stmt->execute();
    
  } catch(PDOException $e) {
      die("Ошибка подключения к базе данных: " . $e->getMessage());
  }

?>
  <!-- Пишим таблицу через html код. Она выйдет по акуратнее и симпатичной в браузере(https://ссылка/list.php)-->
  <!DOCTYPE html>
  <html>
    <!--Результат таблицы http://ссылка/list.php -->
    <head>
      <title>Список заявок</title>
      <style>
        .container { margin: 0 auto; padding: 20px; max-width: 1200px; }        
        h1 { color: #BF7691; text-align: center; }
        table { margin: 20px 0; border: 1px solid darkgray; border-collapse: collapse; width: 100%; }
        th { padding: 10px; color: #fff; text-align: left; background-color: #BF7691; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        tr:hover { background-color: #f5f5f5; }        
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
            <td><?= htmlspecialchars($row['date']) ?></td><!-- ← list.php читает эти поля: и mail.php и в mail-NoLoga.php   -->
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


