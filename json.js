const fs = require('fs')
const rawdata = fs.readFileSync('login.json');
const student = JSON.parse(rawdata);


//console.log(student)

let user = "Soufian"
student.forEach(element => {
    //console.log(element["username"])
    if(element["username"] == user){

        socket.username = parameter;
        socket.write('331');
    }else{
        socket.write('008');
    }
});