export const areMinutesEqual = (date1: Date | string | undefined, date2: Date | string | undefined) => {
  console.log("date1:", date1, "date2:", date2);

  // date1과 date2가 문자열이라면 Date 객체로 변환
  const d1 = (typeof date1 === 'string' || date1 instanceof Date) ? new Date(date1) : date1;
  const d2 = (typeof date2 === 'string' || date2 instanceof Date) ? new Date(date2) : date2;

  // date1 또는 date2가 유효하지 않은 경우
  if (d1 === undefined || d2 === undefined || isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      return false; // 날짜 데이터가 없거나 유효하지 않으면 같지 않다고 처리
  }

  // 연, 월, 일, 시, 분이 같은지 확인
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate() &&
    d1.getHours() === d2.getHours() &&
    d1.getMinutes() === d2.getMinutes()
  );
}

export const areDatesEqual = (date1: Date | string | undefined, date2: Date | string | undefined) => {
  console.log("date1:", date1, "date2:", date2);

  // date1과 date2가 문자열이라면 Date 객체로 변환
  const d1 = (typeof date1 === 'string' || date1 instanceof Date) ? new Date(date1) : date1;
  const d2 = (typeof date2 === 'string' || date2 instanceof Date) ? new Date(date2) : date2;

  // date1 또는 date2가 유효하지 않은 경우
  if (d1 === undefined || d2 === undefined || isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      return false; // 날짜 데이터가 없거나 유효하지 않으면 같지 않다고 처리
  }

  // 연, 월, 일이 같은지 확인
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

