const net = require('net')
const readline = require('readline');
const process = require('process'); 
const port = process.argv[2]


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });


const client = new net.Socket()

client.connect(port, '127.0.0.1', () => {
  console.log('connected')


    rl.on('line', (request) =>[
     client.write(request)
    ])


  
})


client.on('data', (data) => {

  // Selon la réponse du serveur, le client affichera un message différent

  // Initialement j'ai essayé de respecter les bons codes mais j'ai pas réussis à trouver tout les bons conde ^^

  switch(data.toString()) {
    
    case '331':
        console.log("Entrer le mot de passe \n");

     break;

     case '430':
      console.log("Erreur d'identification retry (re entrer un nouveau username)");

     break;

    case '230':
         console.log("Connexion réussie");
          
     break;    
    
    case '001':
         console.log("Liste des fichiers");    
    break; 

    case '002':
      console.log("répertoire changé");    
    break; 

    
    case '003':
      console.log("Voici le répertoire courrant");    
    break;
    
     
    case '004':
      console.log("Le fichier a été copié dans le server");    
    break; 

    case '005':
      console.log("Le fichier a été copié dans votre répertoire");    
    break; 

    case '010':
      console.log("Liste des commandes et leurs signification");    
    break; 

    case '011':
      console.log("Voici le chemin du répertoire de travail actuel local : ");    
      console.log(process.cwd())
    break; 


    case '231':
        client.end()
        rl.close()
        console.log("Aurevoir");
        return
        

   
}


  console.log(data.toString())
})


