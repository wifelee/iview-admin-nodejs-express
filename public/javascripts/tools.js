module.exports = {
    isEmpty:function (obj){
        if(typeof obj === 'undefined' ||  obj == null || obj == "") {
            return true
        }else {
            return false
        }
    },
    formatDate : (timeStamp, startType) => {
        const d = new Date(timeStamp)
        const year = d.getFullYear()
        const month = d.getMonth() + 1
        const date = d.getDate()
        const hours = d.getHours()
        const minutes = d.getMinutes()
        const second = d.getSeconds()
        let resStr = ''
        if (startType === 'year') resStr = year + '-' + (month < 10 ? `0${month}` : month) + '-' + (date < 10 ? `0${date}` : date) + ' ' + (hours < 10 ? `0${hours}` : hours) + ':' + (minutes < 10 ? `0${minutes}` : minutes) + ':' + (second < 10 ? `0${second}` : second)
        else resStr = month + '-' + date + ' ' + hours + ':' + minutes
        return resStr
    }
}

