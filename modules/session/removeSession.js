function removeSession(sessions,cookieID){
    let index;
    for(let val of sessions){
        if(val.cookieID == cookieID){
            index = sessions.indexOf(val)           
        }
    }
    if(index){
        sessions.splice(index,1)
    }
}

module.exports = removeSession;