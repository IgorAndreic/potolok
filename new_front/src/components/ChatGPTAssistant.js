import React, { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import './css/ChatGPTAssistant.css';

const fetch = require('node-fetch');

const ChatGPTAssistant = () => {
  const [prompt, setPrompt] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isCodeMode, setIsCodeMode] = useState(false);  // Добавляем состояние для режима кода

  useEffect(() => {
    Prism.highlightAll();
  }, [chatMessages]);

  // Функция для проверки и переключения режима кода
  const toggleCodeMode = (input) => {
    const codeTicks = input.match(/```/g) || [];
    if (codeTicks.length % 2 !== 0) {  // Проверяем, нечетное ли количество раз использованы ```
      setIsCodeMode(!isCodeMode);      // Переключаем режим
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;

    toggleCodeMode(prompt);  // Проверяем и переключаем режим кода перед отправкой
    setChatMessages([...chatMessages, { role: 'user', content: prompt, isCode: isCodeMode }]);
    
    const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
        }),
    });

    const chatData = await chatResponse.json();
    const chatPrompt = chatData.choices[0].message.content;

    setChatMessages([...chatMessages, { role: 'user', content: prompt }, { role: 'assistant', content: chatPrompt }]);
    setPrompt('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="chat-container">
      <h2>ChatGPT Assistant</h2>
      <div className="chat-messages">
        {chatMessages.map((msg, index) => (
          <div key={index} className={msg.role === 'user' ? 'user-message' : 'assistant-message'}>
            <strong>{msg.role === 'user' ? 'You' : 'Assistant'}:</strong>
            {msg.isCode ? (
                <pre><code className="language-javascript">{msg.content}</code></pre>
              ) : (
                <p>{msg.content}</p>  
              )}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Введите ваше сообщение"
          rows={1}
          style={{ resize: 'none', overflowY: 'auto', maxHeight: '120px' }}
        />
        <button onClick={handleGenerate}>
          Отправить
        </button>
      </div>
    </div>
  );
};

export default ChatGPTAssistant;
