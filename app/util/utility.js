const getUnixTicks = () => {
    const currentDate = new Date();
    const unixStartDate = new Date(1970, 1, 1);
    const ticks = ((currentDate.getTime() - unixStartDate.getTime()) * 10000);
    return ticks;
}

function htmlToElement(html) {
    var template = document.createElement('div');
    html = html.trim();
    template.innerHTML = html;
    return template.firstElementChild;
}

module.exports = {
    getUnixTicks: getUnixTicks,
    htmlToElement: htmlToElement
};