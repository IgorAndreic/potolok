import { distance } from './geometryUtils';

export function snapLastTwoLines(lines, snapDistance = 20) {
    if (lines.length < 2) return { lines, modified: false };

    const lastLine = lines[lines.length - 1];
    const previousLine = lines[lines.length - 2];

    let modified = false;
    const pairs = [
        [previousLine.points[0], previousLine.points[1], lastLine.points[0], lastLine.points[1], 0, 0],
        [previousLine.points[0], previousLine.points[1], lastLine.points[2], lastLine.points[3], 2, 0],
        [previousLine.points[2], previousLine.points[3], lastLine.points[0], lastLine.points[1], 0, 2],
        [previousLine.points[2], previousLine.points[3], lastLine.points[2], lastLine.points[3], 2, 2]
    ];

    pairs.forEach(([x1, y1, x2, y2, pIndex2, pIndex1]) => {
        if (distance(x1, y1, x2, y2) < snapDistance) {
            // Обновляем только координаты второй линии
            lastLine.points[pIndex2] = x1;
            lastLine.points[pIndex2+1] = y1;
            modified = true;
        }
    });

    return { lines, modified };
}

export const snapLines = (lines, snapDistance) => {
    console.log("snapLines", lines);
    const points = lines.reduce((acc, line, index) => {
        // Доступ к координатам начальной и конечной точек линии
        const x1 = line.points[0];
        const y1 = line.points[1];
        const x2 = line.points[2];
        const y2 = line.points[3];

        // Проверка на валидность данных
        if (typeof x1 !== 'number' || typeof y1 !== 'number' ||
        typeof x2 !== 'number' || typeof y2 !== 'number') {
        console.error("Invalid point data in line", index, line.points);
        return acc;  // Пропускаем эту линию
        }
      
        // Добавление начальной и конечной точек в аккумулятор
        acc.push({ x: x1, y: y1, lineIndex: index, pointType: 'start' });
        acc.push({ x: x2, y: y2, lineIndex: index, pointType: 'end' });
        return acc;
      }, []);
  
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dist = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
          if (dist < snapDistance && points[i].lineIndex !== points[j].lineIndex) {
            // Сцепляем точки
            const lineToUpdate = lines[points[j].lineIndex];
            if (points[j].pointType === 'start') {
              lineToUpdate.points[0] = points[i].x;
              lineToUpdate.points[1] = points[i].y;
            } else {
              lineToUpdate.points[2] = points[i].x;
              lineToUpdate.points[3] = points[i].y;
            }
          }
        }
      }
  
    return lines; // Возвращаем обновленный массив линий
};
