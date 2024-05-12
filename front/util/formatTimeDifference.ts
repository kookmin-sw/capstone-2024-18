export const formatTimeDifference = (pastDate: Date) => {
    // 두 날짜의 차이를 밀리초 단위로 계산
    const currentDate = Date.now();
    const difference = currentDate - Number(pastDate);

    // 밀리초 단위 차이를 초, 분, 시간, 일 단위로 계산
    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    // 날짜 포맷터
    const formatDate = (date: Date) => {
        let day = date.getDate();
        let month = date.getMonth() + 1; // getMonth()는 0부터 시작
        let year = date.getFullYear();

        return `${year}.${month.toString().padStart(2, '0')}.${day.toString().padStart(2, '0')}`;
    };

    if (seconds < 60) {
        return `${seconds}초 전`;
    } else if (minutes < 60) {
        return `${minutes}분 전`;
    } else if (hours < 24) {
        return `${hours}시간 전`;
    } else if (days === 1) {
        return '어제';
    } else if (days === 2) {
        return '그저께';
    } else if (pastDate.getFullYear() === new Date().getFullYear()) {
        return `${pastDate.getMonth() + 1}월 ${pastDate.getDate()}일`;
    } else {
        return formatDate(pastDate);
    }
}
