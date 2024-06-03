export function calculateLength(x1, y1, x2, y2) {
    const lengthfloat = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2).toFixed(2);
    const length = parseFloat(lengthfloat);
    return length;
}

export function calculateAngle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
}

export function calculateNewEndPoint(x1, y1, length, angle) {
    const rad = angle * (Math.PI / 180);  // Конвертируем угол в радианы для расчетов
    let x2 = x1 + length * Math.cos(rad);
    let y2 = y1 + length * Math.sin(rad);
    x2 = parseFloat(x2.toFixed(0));
    y2 = parseFloat(y2.toFixed(0));
  
    return { x2, y2 };
  }

  export function calculateAngleBetweenLines(x1, y1, x2, y2, x3, y3) {
    // Вектор A от первой линии
    const Ax = x2 - x1;
    const Ay = y2 - y1;

    // Вектор B от второй линии
    const Bx = x3 - x2;
    const By = y3 - y2;

    // Скалярное произведение векторов A и B
    const dotProduct = Ax * Bx + Ay * By;

    // Модули (длины) векторов A и B
    const magnitudeA = Math.sqrt(Ax * Ax + Ay * Ay);
    const magnitudeB = Math.sqrt(Bx * Bx + By * By);

    // Вычисление косинуса угла между векторами
    const cosTheta = dotProduct / (magnitudeA * magnitudeB);

    // Угол в радианах
    const angleRadians = Math.acos(Math.min(Math.max(cosTheta, -1), 1));  // Ограничиваем косинус значениями от -1 до 1

    // Преобразование угла в градусы
    let angleDegrees = angleRadians * (180 / Math.PI);

    // Вычисление внутреннего угла, если вычисленный угол больше 180 градусов
    if (angleDegrees > 180) {
        angleDegrees = 360 - angleDegrees;
    }

    return angleDegrees;
}

export const calculatePerpendicularEndPoint = (x1, y1, angle, length) => {
  // Convert angle to radians and calculate the perpendicular angle (90 degrees clockwise)
  let perpendicularAngle = angle + 90;
  if (perpendicularAngle >= 360) {
    perpendicularAngle -= 360;
  }
  const radians = (perpendicularAngle * Math.PI) / 180;

  // Calculate the end point
  const x2 = x1 + length * Math.cos(radians);
  const y2 = y1 + length * Math.sin(radians);

  return { x2, y2 };
};

export function calculateEndPoint(x1, y1, x2, y2, length, angleDegrees, angleType, endPointSelection) {
  // Определение базовой точки в зависимости от выбора
  const baseX = endPointSelection === "start" ? x1 : x2;
  const baseY = endPointSelection === "start" ? y1 : y2;

  // Вычисление базового угла первой линии
  const baseAngle = Math.atan2(y2 - y1, x2 - x1);

  // Перевод угла в радианы и добавление/вычитание в зависимости от типа угла
  const angleRadians = angleDegrees * (Math.PI / 180);
  const adjustedAngle = angleType === "external" ? baseAngle + angleRadians : baseAngle - angleRadians;

  // Вычисление координат новой конечной точки
  const newX = baseX + length * Math.cos(adjustedAngle);
  const newY = baseY + length * Math.sin(adjustedAngle);

  return { newX, newY };
}