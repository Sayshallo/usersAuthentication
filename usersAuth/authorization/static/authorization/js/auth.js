const csrfTokenInput = document.querySelector('[name="csrfmiddlewaretoken"]');
        const loginBtn = document.getElementById('login_enter');
        const registerBtn = document.getElementById('register_enter');

        registerName = document.getElementById('registerName');
        registerEmail = document.getElementById('registerEmail');
        registerPassword = document.getElementById('registerPassword');
        repeatPassword = document.getElementById('repeatPassword');

        loginPassword = document.getElementById('loginPassword');
        loginEmail = document.getElementById('loginEmail');

        let currentButtonText = null;

        // ----------------------------------------------        Попытка входа         -----------------------------------------------------------
        document.addEventListener('DOMContentLoaded', function () {

            loginBtn.addEventListener('click', async function () {
                currentButtonText = loginBtn.textContent || loginBtn.innerText;

                 try {
                    // Отправляем данные на сервер через fetch
                    const response = await fetch(login_url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': csrfTokenInput.value
                        },
                        body: JSON.stringify({
                            email: loginEmail.value,
                            password: loginPassword.value
                        })
                    });

                    const data = await response.json();
                    let login_message = data.message;

                    if (data.success) {
                        showNotification("success", data.auth_message);
                                setTimeout(() => {
                                    window.location.href = lk_url;
                                }, 2000);
                    } else {
                        showNotification("danger", data.auth_message);
                    }
                } catch (error) {
                    console.error('Ошибка при отправке данных:', error);
                    showNotification("danger",'Произошла ошибка при попытке входа');
                }

            });

            // ------------------------------  Проверка кода  -----------------------------------

            registerBtn.addEventListener('click', async function () {
                currentButtonText = registerBtn.textContent || registerBtn.innerText;

                if (registerName.value === '' || registerEmail.value === '' || repeatPassword.value === '' || registerPassword.value === '') {
                    showNotification("danger", "Не все поля заполнены.");
                    return;
                }

                if (repeatPassword.value != registerPassword.value) {
                    showNotification("danger", "Пароли не совпадают!");
                    return;
                }

                bodyContent = JSON.stringify({
                        name: registerName.value,
                        email: registerEmail.value,
                        password: registerPassword.value,
                    })

                fetch(register_url, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRFToken': csrfTokenInput.value
                            },
                            body: bodyContent
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                showNotification("success", data.auth_message);
                                setTimeout(() => {
                                    window.location.href = lk_url;
                                }, 2000);
                            } else {
                                showNotification("danger", data.auth_message);
                            }
                        })
                        .catch(error => {
                            console.error('Ошибка:', error);
                        });
            });
        });

        function showNotification(type, message) {
            const notificationContainer = document.getElementById('notification-container');
            const notification = document.createElement('div');
            notification.className = `alert alert-${type} alert-dismissible fade-in`;
            notification.role = 'alert';
            notification.innerHTML = `
                ${message}
            `;
            notificationContainer.appendChild(notification);

            // Удаляем уведомление через 3 секунды
            setTimeout(() => {
                notification.classList.remove('fade-in'); // Убираем класс для запуска исчезновения
                notification.classList.add('fade-out'); // Добавляем класс для анимации исчезновения

                // Удаляем элемент после завершения анимации
                notification.addEventListener('animationend', () => {
                    notification.remove();
                });
            }, 3000); // 3 секунды
        }