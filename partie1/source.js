// source.js : code Flashcards (Eas'improve partie 1)

  var tableauQuestionsAPoser = [];
  var tableauVerbes = []; //toutes les paires possibles
  var tableauCartes = []; //les dix paires qui seront dans l'exercice
  var scoreEtape2 = 0; //à merger avec score !!
  var scoreEtape3 = 0;
  var jeuEnCours = 1;
  var card = document.getElementById('card');
  var rejouer = false;

$(document).ready(function(){
  //disabled bputon start false + disp icone chargement
  boutonCarte.disabled = false;
});

//Fonction de récupération des données de l'API
function ajaxGet(url, callback) {
    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) {
            // Appelle la fonction callback en lui passant la réponse de la requête
            callback(req.responseText);
        } else {
            console.error(req.status + " " + req.statusText + " " + url);
        }
    });
    req.addEventListener("error", function () {
        console.error("Erreur réseau avec l'URL " + url);
    });
    req.send(null);
}


window.onload = function() 
{
    var espaceScore = document.getElementById('espaceScore');
    var espaceReponse = document.getElementById('espaceReponse');
    var espaceConsigne = document.getElementById('espaceConsigne');

    var boutonFin = document.getElementById('boutonFin');
    var boutonEtape2 = document.getElementById('boutonEtape2');
    var boutonEtape3 = document.getElementById('boutonEtape3');
    var boutonCarte = document.getElementById('boutonCarte');
    boutonCarte.disabled = true;
    var boutonQuestionSuivante = document.getElementById('boutonQuestionSuivante');
    var boutonValider = document.getElementById('boutonValider');

    var tableau = document.getElementById('tableau');
    var groupeEtape3 = document.getElementById('groupeEtape3');
    var jeNeSaisPas = document.getElementById('jeNeSaisPas');
    var nomEtape = document.getElementById('nomEtape');
    var numQuestion = document.getElementById('numQuestion');
    var caseARemplir = document.getElementById('caseARemplir');

    var goodAnswer = document.getElementById('goodAnswer');
    var wrongAnswer = document.getElementById('wrongAnswer');  

    //chargerTableau()  
}


//Fonction qui permet de charger toutes les paires possibles dans tableauVerbes
function chargerTableau()
{
  ajaxGet("https://easimprove.herokuapp.com/api.php/verbes", function(reponse) {
  var resultat = JSON.parse(reponse);
  resultat.verbes.records.forEach(function (verbe) {
      console.log(verbe[0],verbe[1], verbe[2], verbe[3], verbe[4]);
      tableauVerbes[(verbe[0]-1)*2] = ""+verbe[1] +" "+ verbe[2];
      tableauVerbes[(verbe[0]-1)*2+1] = ""+verbe[3];
      chargerQuestions();
  });
});
}

function chargerQuestions()
{
    //rajouter une gestion des doublons pour ne pas avoir deux fois le meme verbe
for(var i =0; i<10;i++)
   {
        tableauQuestionsAPoser[i] = Math.floor(Math.random() * (104));
        //alert(tableauQuestionsAPoser[i]);
        //alert(tableauVerbes[tableauQuestionsAPoser[i]*2]);
        tableauCartes[2*i] = tableauVerbes[tableauQuestionsAPoser[i]*2];
        tableauCartes[2*i+1] = tableauVerbes[tableauQuestionsAPoser[i]*2+1];    
   }
}

  
var carteARemplir = document.getElementById('boutonCarte'); // voir où on le déclare
var numeroQuestion = 1; 

function afficherCarte()
{
//affiche l'étape 1 avec la carte qui vaut 'Start'
  if(!rejouer)
  {
    chargerTableau();
  }

  boutonRejouer.style.visibility = 'hidden';
  //boutonRejouer.style.visibility = 'visible';
  boutonCarte.style.backgroundColor="#8D5838";
  boutonCarte.style.visibility = 'visible';
  boutonCarte.disabled = false;
  boutonQuestionSuivante.disabled = false;
  boutonQuestionSuivante.style.visibility = 'visible';
  numeroQuestion=1;
  numQuestion.value="";
  numQuestion.hidden = false;
  jeuEnCours=1;
  espaceScore.hidden = true;
  boutonCarte.value="Start"; 
  boutonFin.hidden = true;
  boutonEtape2.hidden = true;
  boutonEtape3.hidden = true;
  espaceReponse.hidden = true;
  imageAnswer.hidden=true;
  tableau.hidden=true;
  groupeEtape3.hidden=true;
  boutonFin.style.visibility='hidden';
  jeNeSaisPas.style.visibility='hidden';
  nomEtape.innerHTML='First step : flip the cards and learn!';
}
  

function retournerCarte() 
{
        // var card = document.getElementById('card');
        // if (card.className === "")
        //   card.className = 'flipped';
        // else
        //   card.className = '';
  if(numeroQuestion==0) 
  {
    questionZero=true;
    numeroQuestion++;
  }
  else {questionZero=false;}
  boutonQuestionSuivante.hidden=false; 
  numQuestion.innerHTML='Question '+numeroQuestion;
  
  if(boutonCarte.value==tableauCartes[2*numeroQuestion-2])//si la carte affiche la question
  {
    //au clic, on affiche la réponse
    boutonCarte.value=tableauCartes[2*numeroQuestion -1]; 
    boutonCarte.style.backgroundColor="#314A5E";
  }
   
  else //sinon la carte affiche la réponse et au clic on affiche la question
  {
    boutonCarte.value=tableauCartes[2*numeroQuestion-2]; 
  	boutonCarte.style.backgroundColor="#47B19B";
  }
    
  
  if(jeuEnCours==3)
    {
      boutonCarte.style.pointerEvents='none';
      jeNeSaisPas.style.visibility='visible';
      groupeEtape3.hidden=false;
      boutonFin.style.visibility='hidden';
      boutonQuestionSuivante.disabled = false;
    	boutonQuestionSuivante.hidden = false;
      caseARemplir.value=""; 
    }
  
  //initialisation de l'étape 3 après l'appui sur Start : on ne peut que répondre, pas passer à la question suivante
  if(jeuEnCours==3 && questionZero)
    {
      caseARemplir.value=""; 
      jeNeSaisPas.disabled=false;
      boutonValider.disabled=false;
      boutonQuestionSuivante.style.backgroundColor="#FFF7E6";
      boutonQuestionSuivante.disabled=true;
      caseARemplir.focus();
      numQuestion.hidden=false;
      questionZero=false;
    }
}
  
function tirerNouvelleCarte()
{
  numeroQuestion++;
  boutonCarte.value=tableauCartes[2*numeroQuestion-2];
  boutonCarte.focus(); // rendre le focus à la carte à retourner pour pouvoir retourner au clic sur entrée
  boutonCarte.style.backgroundColor="#47B19B";
  document.getElementById('numQuestion').innerHTML='Question '+numeroQuestion;
    //tirer une nouvelle carte dans le tableau
    //les tirer dans l'ordre pour ne pas les tirer plusieurs fois (quitte à choisir dix questions aléatoirement dans le load)
  if(numeroQuestion==10 && jeuEnCours==1) //fin jeu 1, on met le bouton pour le passage à l'étape 2
    {
      boutonEtape2.hidden = false;
  		boutonQuestionSuivante.disabled = true;
    }
  if(jeuEnCours==3)
    {
      caseARemplir.value=""; 
      jeNeSaisPas.disabled=false;
      boutonValider.disabled=false;
      boutonQuestionSuivante.style.backgroundColor="#FFF7E6";
      boutonQuestionSuivante.disabled=true;
      caseARemplir.focus();
      espaceReponse.hidden=true;
    }
}
  //ETAPE DEUX : RELIER LE MOT ET SA TRADUCTION (JEU DES PAIRES)

 // variables nécessaires à l'étape 2
  var nombreCartesColorees = 0;
  var premiereCaseCliquee;
  var deuxiemeCaseCliquee;
  var reponsePrecedenteJuste=false;
  var nombreQuestionsRepondues=0;
  var scoreEtape2=10; //on commence à dix et on perd des points en cas d'ereur


  function chargerEtape2()
  {    
     // variables nécessaires à l'étape 2
    nombreCartesColorees = 0;
    reponsePrecedenteJuste=false;
    nombreQuestionsRepondues=0;
    scoreEtape2=10; 

    boutonCarte.style.visibility= 'hidden';
    espaceScore.hidden = false;
    boutonEtape2.hidden = true;
    numQuestion.hidden=true;  
    boutonQuestionSuivante.hidden = true;
    tableau.hidden=false;
    espaceConsigne.innerHTML="Click on a word and its translation to win!";
    espaceReponse.hidden = false;
    nomEtape.innerHTML='Second step : find the pairs';
    boutonQuestionSuivante.disabled=true;

    jeuEnCours=2;

    //AFFICHAGE DU TABLEAU TYPE MEMORY
    var numeroCase = "case1";
    var tableauMelange = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
    var temp;
    
    //on mélange les propositions
    for(var i=0; i<10; i++)
      {
            rnd = Math.floor(Math.random() * (20));
        		temp = tableauMelange[rnd];
        		rnd2 = Math.floor(Math.random() * (20));
        		tableauMelange[rnd]=tableauMelange[rnd2];
        		tableauMelange[rnd2]=temp;
                    
      }
    
    //on remplit les cases du tableau avec les propositions
    for(var i=1; i<21; i++)
      {
        numeroCase = numeroCase.slice(0,4);
        numeroCase = numeroCase.concat(i);
        document.getElementById(numeroCase).innerHTML = tableauCartes[tableauMelange[i-1]]; 
      }
   
  }
  
 
  function verifierCaseCliquee(caseCliquee) //changer nom fonction
  {
    var score=scoreEtape2;
      if(nombreCartesColorees == 0) //on n'a pas encore cliqué sur une carte
      {
        if(premiereCaseCliquee!=null) //ce n'est alors pas le premier tour, il faut tenir compte du coup précédent
          {
            if(reponsePrecedenteJuste)
            {
              //on met les cases de la paire qui vient d'être éliminée à la couleur de fond
              premiereCaseCliquee.style.backgroundColor="#FFE8BF"; 
              premiereCaseCliquee.innerHTML =" ";
              premiereCaseCliquee.style.pointerEvents='none';
        		 	deuxiemeCaseCliquee.style.backgroundColor="#FFE8BF"; 
              deuxiemeCaseCliquee.innerHTML =" ";
              deuxiemeCaseCliquee.style.pointerEvents='none';
            }
            else
            {
              //ou on les remet à la couleur des cases à éliminer si c'était un mauvais appariement
              premiereCaseCliquee.style.backgroundColor="#E89259";
        			deuxiemeCaseCliquee.style.backgroundColor="#E89259";
            }
          }

        //on colore la case cliquée
        caseCliquee.style.backgroundColor = "#47B19B";
        nombreCartesColorees++;
        premiereCaseCliquee = caseCliquee;
      }

      else if (nombreCartesColorees == 1) //ça ne peut valoir que 0 ou 1
      {

        deuxiemeCaseCliquee=caseCliquee;
        caseCliquee.style.backgroundColor = "#47B19B";
        
        // CODE DE VERIFICATION DE LA CONCORDANCE DES CASES CHOISIES
        for (var i=0;i<20;i++)
          {
            if (deuxiemeCaseCliquee.innerHTML == tableauCartes[i] && i%2==0)//c'est pair donc une question
              {
                if(premiereCaseCliquee.innerHTML == tableauCartes[i+1]) 
                  {
                    //bon appariement
                    espaceReponse.innerHTML ="Good answer!"
                    //$('#imageAnswer').fadeIn(50,function(){$('#imageAnswer').fadeOut(2500)});
                    reponsePrecedenteJuste=true;
                    nombreQuestionsRepondues++;
                  }
                else 
                	{
                  	//mauvais appariement 
                    espaceReponse.innerHTML ="Wrong answer: -1";
                    //$('#imageAnswer').fadeIn(50,function(){$('#imageAnswer').fadeOut(2500)});
                    reponsePrecedenteJuste=false;
                    scoreEtape2--;
                	}
              }
            else if (deuxiemeCaseCliquee.innerHTML == tableauCartes[i] && i%2==1)//reponse
              {
                if(premiereCaseCliquee.innerHTML == tableauCartes[i-1]) 
                  {
                    //bon appariement
                    espaceReponse.innerHTML ="Good answer!";
                    //$('#imageAnswer').fadeIn(50,function(){$('#imageAnswer').fadeOut(2500)});
                    reponsePrecedenteJuste=true;
                    nombreQuestionsRepondues++;
                  }
                else 
                	{
                  	//mauvais appariement 
                    espaceReponse.innerHTML ="Wrong answer: -1";
                    reponsePrecedenteJuste=false;
                    scoreEtape2--;
                	}
              }

              //le joueur a perdu tous ses points, il doit retourner aux flashcards
              if(scoreEtape2 == 0)
              {
                alert('You lost! You will have to try again...');
                rejouer = true;
                premiereCaseCliquee.style.backgroundColor="#E89259"; 
                deuxiemeCaseCliquee.style.backgroundColor="#E89259"; 
                premiereCaseCliquee = null;
                deuxiemeCaseCliquee = null;
                numQuestion.value = "";
                afficherCarte();
              }
          }

          if(scoreEtape2==score)//bonne réponse
          {
              $('#imageAnswer').attr("src","./goodAnswer.png");
          }
          else
          {
              $('#imageAnswer').attr("src","./wrongAnswer.png");
          }
        
        $('#imageAnswer').stop(true, true).fadeOut();
        $('#imageAnswer').fadeIn(50,function(){$('#imageAnswer').fadeOut(2500)});
        espaceScore.innerHTML="Score: "+scoreEtape2+"/10";
        

        if(nombreQuestionsRepondues==10) //fin du jeu, on ne peut plus cliquer sur les cases
          {
            boutonEtape3.hidden = false;
          }

        //on a cliqué sur deux cartes, donc on peut cliquer sur une nouvelle paire
        //comme si aucune carte n'était sélectionnée
        nombreCartesColorees = 0;
      }
  }
  
  //ETAPE TROIS : TAPER LA REPONSE
   function chargerEtape3()
   {
      numeroQuestion = 0; 
      scoreEtape3=0;
      jeuEnCours=3; 
      document.getElementById('imageAnswer').style.top="310px";
    
      //on cache les éléments de l'étape précédente
      tableau.hidden=true;
      
      //et on affiche ceux de cette étape qui apparaissent avant le clic sur Start
      espaceConsigne.innerHTML = "You will now have to write the translation of the words displayed on the cards.";
      boutonCarte.style.visibility= 'visible';
      boutonCarte.value="Start";
      boutonCarte.style.backgroundColor="#8D5838";
      boutonEtape3.hidden=true;
      boutonQuestionSuivante.disabled=true;
      espaceScore.innerHTML=" ";
      espaceReponse.innerHTML=" ";
      nomEtape.innerHTML='Third exercice : translation';
      
      //sauf ceux qui n'apparaissent qu'après le clic sur "Start"
      jeNeSaisPas.style.visibility='hidden';
    }
  
  function verifierReponse()
  {
    var bonneReponse = false;
    //on ne peut plus répondre, on voit son score et la réponse et on ne peut que cliquer sur Question suivante
    jeNeSaisPas.disabled=true;
    boutonValider.disabled=true;
    boutonQuestionSuivante.disabled=false;
    boutonQuestionSuivante.focus();
    boutonQuestionSuivante.style.backgroundColor="#E89259";
    
    if(caseARemplir.value=="") //si validation sans réponse ou appui sur "I don't know"
      {
        espaceReponse.hidden=false;
        espaceReponse.innerHTML="You gave no answer. The good answer was: "+tableauCartes[2*numeroQuestion-1]; 
        bonneReponse=false;
      }
    
  	else if(caseARemplir.value==tableauCartes[2*numeroQuestion-1])
    	{
      	//augmenter score
      	scoreEtape3++;

      	//dire qu'on a la bonne réponse
        espaceReponse.hidden=false;
      	espaceReponse.innerHTML = "You said: "+caseARemplir.value +". Congratulations! That's the good answer!";
        bonneReponse=true;
    	}
    
    else
    	{
      	//dire que la réponse est fausse et donner la bonne
        espaceReponse.hidden=false;
      	espaceReponse.innerHTML = "You said: "+caseARemplir.value + ". That's a wrong answer! The good answer was: "+tableauCartes[2*numeroQuestion-1];  
    	  bonneReponse=false;
      }

      if(bonneReponse)
          {
              $('#imageAnswer').attr("src","./goodAnswer.png");
          }
          else
          {
              $('#imageAnswer').attr("src","./wrongAnswer.png");
          }
        
        $('#imageAnswer').stop(true, true).fadeOut();
        $('#imageAnswer').fadeIn(50,function(){$('#imageAnswer').fadeOut(2500)});
    
    retournerCarte(); //affiche la bonne réponse dans la carte
    espaceScore.innerHTML="Your score is: "+scoreEtape3+"/10";
    
    if(numeroQuestion==10) //fin du jeu, on affiche le bouton de fin
      {
        boutonFin.style.visibility = 'visible';
        boutonFin.focus();
        boutonQuestionSuivante.disabled=true;
        boutonQuestionSuivante.style.backgroundColor="#FFF7E6";
      }
  }

  function terminer()
  {
    //fin du jeu, on cache tous les éléments et on affiche le score
        nomEtape.innerHTML ="End of the game! You scored "+scoreEtape2+"/10 at the pairing game and "+scoreEtape3+"/10 at the translating game.";
        boutonCarte.style.visibility= 'hidden';
        boutonQuestionSuivante.style.visibility= 'hidden';
        boutonRejouer.style.visibility='visible';
        boutonFin.style.visibility='hidden';
        jeNeSaisPas.style.visibility= 'hidden';
				groupeEtape3.hidden=true;
 				espaceScore.hidden=true;
        espaceConsigne.hidden=true;
        espaceReponse.hidden=true;
        numQuestion.hidden=true;
  }

  function nouvellePartie()
  {
    rejouer = false; //pour rejouer avec de nouveaux mots
    tableauQuestionsAPoser = [];
    tableauVerbes = []; //toutes les paires possibles
    tableauCartes = []; //les dix paires qui seront dans l'exercice
    scoreEtape2 = 0; //à merger avec score !!
    scoreEtape3 = 0;
    afficherCarte();
  }
