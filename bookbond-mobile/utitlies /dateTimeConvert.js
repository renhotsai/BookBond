const DateTimeConvert = (item) => {
    if (item.seconds && item.nanoseconds) {
        const millisecondsFromSeconds = item.seconds * 1000;
        const millisecondsFromNanoseconds = item.nanoseconds / 1000000;
        const totalMilliseconds = millisecondsFromSeconds + millisecondsFromNanoseconds;
        const date = new Date(totalMilliseconds);
        return date
    } else {
        return item
    }
}
export { DateTimeConvert }