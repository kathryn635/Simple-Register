import express from 'express';
import http from 'http';
import { Server } from 'socket.io'; //библиотека для сокетиков, io - сервер котоый слушает и отправлят запросы 
import cors from 'cors';  // cors - разрешает подключаться к серверу с других сайтов

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",  //  РАЗРЕШИТЬ ВСЕ АДРЕСА
    methods: ["GET", "POST"] //разпкшаем запросы гэт и пост
  }
});

const users = new Map();
const codes = new Map();

io.on('connection', (socket) => {
  console.log('Клиент подключен');

  // Проверка логина
  socket.on('check_login', ({ login }) => {
    let exists = false;
    for (let u of users.values()) {
      if (u.login === login) exists = true;
    }
    socket.emit('check_login_result', { available: !exists });
  });

  // Регистрация
  socket.on('register', ({ email, login, password }) => {
    if (users.has(email)) {
      socket.emit('register_error', 'Email уже занят');
      return;
    }
    
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    codes.set(email, { login, password, code });
    console.log(` Код для ${email}: ${code}`);
    socket.emit('register_success', { email });
  });

  // Подтверждение кода
  socket.on('verify', ({ email, code }) => {
    const data = codes.get(email);
    if (!data || data.code !== code) {
      socket.emit('verify_error', 'Неверный код');
      return;
    }
    
    const user = { id: Date.now(), email, login: data.login, createdAt: new Date() };
    users.set(email, user);
    codes.delete(email);
    socket.emit('verify_success', { user });
  });
});

server.listen(3001, () => console.log(' Сервер на порту 3001'));
