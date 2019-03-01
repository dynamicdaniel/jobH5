let mathUtil = {};

// 将金额的数据显示在页面上时使用,无效数据时显示空字符串
mathUtil.getYuanInForm = (value) => {
    if (typeof parseInt(value) === 'number' && Math.abs(parseInt(value)) > 0) {
        if (parseFloat(value) % 100 === 0) {
            return parseInt(value / 100);
        } else if (parseFloat(value) % 10 === 0) {
            return parseFloat(value / 100).toFixed(1);
        } else {
            return parseFloat(value / 100).toFixed(2);
        }
    } else {
        return "";
    }
};

// 将金额的数据显示在页面上时使用,无效数据时显示空0
mathUtil.getYuanInTable = (value) => {
    if (typeof parseInt(value) === 'number' && Math.abs(parseInt(value)) >= 0) {
        if (parseFloat(value) % 100 === 0) {
            return parseInt(value / 100);
        } else if (parseFloat(value) % 10 === 0) {
            return parseFloat(value / 100).toFixed(1);
        } else {
            return parseFloat(value / 100).toFixed(2);
        }
    } else {
        return 0;
    }
};

export default mathUtil;
