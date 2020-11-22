const net = require('net')
const fs = require('fs')
const process = require('process'); 
const port = process.argv[2]


const server = net.createServer((socket) => {
  console.log('new connection')

  socket.on('data', (data) => {

    const [directive, parameter] = data.toString().split(' ')
    
    
    switch(directive) {

      // Selon la commande indiqué par le client le serveur agit différement.
        case 'USER':
  
            const rawdata = fs.readFileSync('login.json');
            const student = JSON.parse(rawdata);

            
            // On vérifie que le username est présent dans mon json
            student.forEach(element => {
    
              if(element["username"] == parameter){
          
                  socket.username = parameter;
                  socket.write('331');
              }
            });
            if(socket.username == null){
              socket.write('430');
            }
          
            break;

        case 'PASS':
            
            const rawdata2 = fs.readFileSync('login.json');
            const student2 = JSON.parse(rawdata2);


            student2.forEach(element => {
               // On vérifie que le username et le password sont présent dans mon json et que le mdp correspondent bien au username
              if(element["password"] == parameter && element['username'] == socket.username){
        
                socket.connected = true;
                socket.write('230');

              }

            });
            if(socket.connected == null){
              socket.write('430');
            }
          
            break;

        case 'LIST':

                if(socket.connected == true){
                
                // ON REVIENT A LA RACINE AU CAS OU L USER CHANGE DE REPERTOIRE DE TRAVAIL, La base de donnée reste au meme endroit
      
                // CHEMIN A CHANGER SI VOUS VOULEZ EXECUTER LE CODE 
                const files = fs.readdirSync('D:/Users/sosol/Desktop/Codeflix/onecode/Ftpserver/files')
                console.log(files)
                socket.write('001')
                for(let i = 0; i<files.length;i++){
                    socket.write(files[i]+'\n')
                }
            }else{
                socket.write("CONNECTEZ-VOUS AVANT")
            }
        break;

        case 'CWD':
            if(socket.connected == true){
            process.chdir(parameter)
            socket.write("Nouveau répertoire de travail: "+process.cwd())
            socket.write('002');
            }else{
              socket.write("CONNECTEZ-VOUS AVANT")
            }

      break;





        case 'RETR':

          if(socket.connected == true){
            let chemin = process.cwd()
            // On vérifie que les fichiers sont bien présent dans les répertoires demandés et on copie du répertoire vers mon dossier files
            // CHEMIN A CHANGER SI VOUS VOULEZ EXECUTER LE CODE 
            if(fs.existsSync('D:/Users/sosol/Desktop/Codeflix/onecode/Ftpserver/files/'+parameter) && fs.existsSync(chemin+'\\'+parameter)){
              
              // CHEMIN A CHANGER SI VOUS VOULEZ EXECUTER LE CODE 
              fs.copyFileSync(chemin+'\\'+parameter, 'D:/Users/sosol/Desktop/Codeflix/onecode/Ftpserver/files/'+parameter);
              socket.write("004")

            }else{
              socket.write('Veuillez vérifier la source du fichier demandé');
            }
          
          }else{
                socket.write("CONNECTEZ-VOUS AVANT")
            }


        break;


         case 'STOR':
          // On vérifie que les fichiers sont bien présent dans les répertoires demandés et on copie du dossier files vers le repertoire courant
          if(socket.connected == true){
          let chemin2 = process.cwd()
          
          // CHEMIN A CHANGER SI VOUS VOULEZ EXECUTER LE CODE 
          if(fs.existsSync('D:/Users/sosol/Desktop/Codeflix/onecode/Ftpserver/files/'+parameter) && fs.existsSync(chemin2+'\\'+parameter)){
            // CHEMIN A CHANGER SI VOUS VOULEZ EXECUTER LE CODE 
            fs.copyFileSync('D:/Users/sosol/Desktop/Codeflix/onecode/Ftpserver/files/'+parameter,chemin2+'\\'+parameter);
            socket.write("005")
          }else{
            socket.write('Veuillez vérifier la source du fichier demandé');
          }
   
          }else{
            socket.write("CONNECTEZ-VOUS AVANT")
          }
         break;
        
        case 'PWD':

          if(socket.connected == true){
          socket.write('003');
          socket.write(process.cwd())
          
          }else{
            socket.write("CONNECTEZ-VOUS AVANT")
          }

      break;

      case 'HELP':

        socket.write('010');
        const rawdatacommand = fs.readFileSync('Command.json');
        const command = JSON.parse(rawdatacommand);  

        command.forEach(element => {

          socket.write(element["commande"]+" : "+element["happened"]+"\n" )
      
        })
      break;
      

        case 'QUIT':
   
            socket.write('231')
            socket.end()
            return
          
    }

  })

  
})

server.listen(port, () => {
  console.log('Server started at port '+port)
})