const convertToHttps = (url) => {
    if (!url) return url;
    return url.startsWith('http://') ? url.replace('http://', 'https://') : url;
};

export { convertToHttps }