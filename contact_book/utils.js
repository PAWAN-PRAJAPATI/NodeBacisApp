 function makeText(n) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(var j=0;j<n;j<j++){
        for (var i = 0; i < Math.floor(Math.random() * 8 + 3); i++){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        text+=" "
    }
    return text
}


 function makeNumber(n) {
    var text = "";
    var possible = "1234567890";
    for (var i = 0; i <= n; i++){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text
}


module.exports = {makeText,makeNumber}