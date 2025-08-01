# Пошаговая инструкция по созданию моделей в Strapi через административную панель

1. Запустите Strapi и откройте административную панель по адресу:  
   http://localhost:1337/admin

2. Войдите под своей учетной записью администратора.

3. В меню слева выберите раздел **Content-Types Builder**.

4. Создайте новую коллекцию (Content Type) для каждой из моделей:

---

### Клиенты (Clients)

- Нажмите **Create new collection type**.
- Введите имя: `Client`.
- Добавьте поля:
  - `name` — Text (Short text)
  - `phone` — Text (Short text)
  - `email` — Email
  - `address` — Text (Long text)
  - `registrationDate` — Date

- Сохраните изменения.

---

### Автомобили (Cars)

- Создайте новый collection type `Car`.
- Добавьте поля:
  - `client` — Relation (Many-to-One) с `Client`
  - `make` — Text (Short text)
  - `model` — Text (Short text)
  - `year` — Number (Integer)
  - `vin` — Text (Short text)
  - `licensePlate` — Text (Short text)

- Сохраните изменения.

---

### Заказ-наряды (Orders)

- Создайте новый collection type `Order`.
- Добавьте поля:
  - `client` — Relation (Many-to-One) с `Client`
  - `car` — Relation (Many-to-One) с `Car`
  - `description` — Rich Text
  - `status` — Enumeration (например: `new`, `in_repair`, `completed`)
  - `createdAt` — Дата создания (автоматически)
  - `updatedAt` — Дата обновления (автоматически)

- Сохраните изменения.

---

### Мониторинг ремонта (RepairMonitor)

- Создайте новый collection type `RepairMonitor`.
- Добавьте поля:
  - `order` — Relation (Many-to-One) с `Order`
  - `status` — Enumeration (например: `pending`, `in_progress`, `done`)
  - `notes` — Rich Text
  - `updatedAt` — Дата обновления (автоматически)

- Сохраните изменения.

---

5. После создания моделей перейдите в раздел **Settings > Roles & Permissions**.

6. Выберите роль `Public` или `Authenticated` (в зависимости от того, кто будет обращаться к API).

7. В разделе **Permissions** разрешите доступ к нужным действиям (find, findOne, create, update, delete) для созданных моделей.

8. Сохраните настройки.

---

9. Проверьте работу API, сделав запросы через Postman или curl, например:  
   GET http://localhost:1337/api/clients

10. После успешной настройки моделей и разрешений можно интегрировать фронтенд с backend.

---

Если нужна помощь с интеграцией или тестированием, сообщите.
