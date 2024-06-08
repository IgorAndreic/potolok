import React, { useState } from 'react';
const fetch = require('node-fetch');

const roomTypes = {
    " ": " ",
    "Кухня": "Kitchen",
    "Комната": "Room",
    "Ванная": "Bathroom",
    "Туалет": "Toilet",
    "Гостиная": "Living Room",
    "Спальня": "Bedroom",
    "Детская комната": "Children's Room",
    "Прихожая": "Hallway"
};

const features = {
    "Светлые тона": "Light Tones",
    "Современный дизайн": "Modern Design",
    "Точечный свет": "Spot Lighting",
    "Минимализм": "Minimalism",
    "Эклектика": "Eclectic",
    "Винтажный стиль": "Vintage Style",
    "Роскошный декор": "Luxurious Decor",
    "Ретро стиль": "Retro Style"
};

const ImageGenerator = () => {
    const [roomType, setRoomType] = useState('');
    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const [prompt, setPrompt] = useState('');
    const [images, setImages] = useState([]);

    const processSelection = (roomType, selectedFeatures) => {
        const roomTypeEn = roomTypes[roomType];
        const selectedFeaturesEn = selectedFeatures.map(feature => features[feature]);
        const prompt = `${roomTypeEn} with ${selectedFeaturesEn.join(', ')}`;
        return prompt;
    };

    const query = async (data) => {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
            {
                headers: { Authorization: `Bearer ${process.env.REACT_APP_HF_API_KEY}` },
                method: "POST",
                body: JSON.stringify(data),
            }
        );
        const result = await response.blob();
        return result;
    };

    const handleGenerate = async () => {
        if (!prompt) return;

        // Создаем запрос в OpenAI для создания чата и получения ответа
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

        // Генерируем изображение с использованием полученного ответа в качестве промпта
        const imageData = await query({ prompt: chatPrompt });
        setImages([URL.createObjectURL(imageData)]);
    };

    return (
        <div>
            <select onChange={(e) => setRoomType(e.target.value)} value={roomType}>
                {Object.keys(roomTypes).map(type => (
                    <option key={type} value={type}>{type}</option>
                ))}
            </select>

            <div>
                {Object.keys(features).map(feature => (
                    <div key={feature}>
                        <input
                            type="checkbox"
                            value={feature}
                            checked={selectedFeatures.includes(feature)}
                            onChange={(e) => {
                                const newFeatures = [...selectedFeatures];
                                if (e.target.checked) {
                                    newFeatures.push(feature);
                                } else {
                                    const index = newFeatures.indexOf(feature);
                                    if (index > -1) {
                                        newFeatures.splice(index, 1);
                                    }
                                }
                                setSelectedFeatures(newFeatures);
                            }}
                        />
                        {feature}
                    </div>
                ))}
            </div>

            <button onClick={() => setPrompt(processSelection(roomType, selectedFeatures))}>
                Создать Промпт
            </button>
            <button onClick={handleGenerate}>
                Сгенерировать изображение
            </button>

            <div>
                <textarea value={prompt} readOnly />
            </div>
            
            <div>
                {images.map((src, index) => (
                    <img key={index} src={src} alt={`Generated ${index}`} />
                ))}
            </div>
        </div>
    );
};

export default ImageGenerator;
