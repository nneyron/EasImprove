var tableauCartes = [
"question1", 
"reponse1",
"question2", 
"reponse2",
  "question3",
  "reponse3",
  "question4",
  "reponse4",
  "question5",
  "reponse5",
  "question6",
  "reponse6",
  "question7",
  "reponse7",
  "question8",
  "reponse8",
  "question9", 
  "reponse9",
  "question10",
  "reponse10"
]; //code de récupération des données pour remplir le tableau
  var tableauQuestionsAPoser = [];
  var tableauVerbes = [];
  var scoreEtape2 = 0; //à merger avec score !!
  var scoreEtape3 = 0;
  var jeuEnCours = 1;
  var espaceScore = document.getElementById('espaceScore');
  
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

function chargerTableau()
{
  setTimeout(chargerQuestions,1500);
  ajaxGet("https://easimprove.herokuapp.com/api.php/verbes", function(reponse) {
  var resultat = JSON.parse(reponse);
  resultat.verbes.records.forEach(function (verbe) {
      console.log(verbe[0],verbe[1], verbe[2], verbe[3], verbe[4]);
      //alert(verbe[0]);
      //alert((verbe[0]-1)*2);
      //tableauVerbes[] = [""+verbe[1] + verbe[2], ""+verbe[3], verbe[4]] ;
      tableauVerbes[(verbe[0]-1)*2] = ""+verbe[1] +" "+ verbe[2];
      tableauVerbes[(verbe[0]-1)*2+1] = ""+verbe[3];
      //alert(tableauVerbes[(verbe[0]-1)*2]);
  });
});
  //chargerQuestions();
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
  chargerTableau();
  var carteARemplir = document.getElementById('boutonCarte');
  carteARemplir.value="Start"; 
  document.getElementById('boutonEtape2').hidden = true;
  document.getElementById('boutonEtape3').hidden = true;
  document.getElementById('espaceReponse').hidden = true;
  document.getElementById('tableau').hidden=true;
  document.getElementById('groupeEtape3').hidden=true;
  document.getElementById('jeNeSaisPas').style.visibility='hidden';
  document.getElementById('nomEtape').innerHTML='First step : flip the cards and learn!';
}
  
function retournerCarte() 
{
  if(numeroQuestion==0) 
  {
    questionZero=true;
    numeroQuestion++;
  }
  else {questionZero=false;}
  document.getElementById('boutonQuestionSuivante').hidden=false; 
  document.getElementById('numQuestion').innerHTML='Question '+numeroQuestion;
  var carteARemplir = document.getElementById('boutonCarte');
  
  if(carteARemplir.value==tableauCartes[2*numeroQuestion-2])//si la carte affiche la question
  {
    //au clic, on affiche la réponse
    carteARemplir.value=tableauCartes[2*numeroQuestion -1]; 
    document.getElementById('boutonCarte').style.backgroundColor="#314A5E";
  }
   
  else //sinon la carte affiche la réponse et au clic on affiche la question
  {
    carteARemplir.value=tableauCartes[2*numeroQuestion-2]; 
  	document.getElementById('boutonCarte').style.backgroundColor="#47B19B";
  }
    
  
  if(jeuEnCours==3)
    {
      document.getElementById('boutonCarte').style.pointerEvents='none';
      document.getElementById('jeNeSaisPas').style.visibility='visible';
      document.getElementById('groupeEtape3').hidden=false;
      document.getElementById('boutonQuestionSuivante').disabled = false;
    	document.getElementById('boutonQuestionSuivante').hidden = false;
      document.getElementById('caseARemplir').value=""; 
    }
  
  //initialisation de l'étape 3 après l'appui sur Start : on ne peut que répondre, pas passer à la question suivante
  if(jeuEnCours==3 && questionZero)
    {
      document.getElementById('caseARemplir').value=""; 
      document.getElementById('jeNeSaisPas').disabled=false;
      document.getElementById('boutonValider').disabled=false;
      document.getElementById('boutonQuestionSuivante').style.backgroundColor="#FFF7E6";
      document.getElementById('boutonQuestionSuivante').disabled=true;
      document.getElementById('caseARemplir').focus();
      document.getElementById('numQuestion').hidden=false;
      questionZero=false;
    }
}
  
function tirerNouvelleCarte()
{
  numeroQuestion++;
  var boutonCarte = document.getElementById('boutonCarte');
  boutonCarte.value=tableauCartes[2*numeroQuestion-2];
  boutonCarte.focus(); // rendre le focus à la carte à retourner pour pouvoir retourner au clic sur entrée
  boutonCarte.style.backgroundColor="#47B19B";
  document.getElementById('numQuestion').innerHTML='Question '+numeroQuestion;
    //tirer une nouvelle carte dans le tableau
    //les tirer dans l'ordre pour ne pas les tirer plusieurs fois (quitte à choisir dix questions aléatoirement dans le load)
  if(numeroQuestion==10 && jeuEnCours==1) //fin jeu 1, on met le bouton pour le passage à l'étape 2
    {
      document.getElementById('boutonEtape2').hidden = false;
  		document.getElementById('boutonQuestionSuivante').disabled = true;
    }
  if(jeuEnCours==3)
    {
      document.getElementById('caseARemplir').value=""; 
      document.getElementById('jeNeSaisPas').disabled=false;
      document.getElementById('boutonValider').disabled=false;
      document.getElementById('boutonQuestionSuivante').style.backgroundColor="#FFF7E6";
      document.getElementById('boutonQuestionSuivante').disabled=true;
      document.getElementById('caseARemplir').focus();
      document.getElementById('espaceReponse').hidden=true;
    }
}
  //ETAPE DEUX : RELIER LE MOT ET SA TRADUCTION (JEU DES PAIRES)
  function chargerEtape2()
  {    
    document.getElementById('boutonCarte').style.visibility= 'hidden';
    document.getElementById('boutonEtape2').hidden = true;
  document.getElementById('numQuestion').hidden=true;  document.getElementById('boutonQuestionSuivante').hidden = true;
    document.getElementById('tableau').hidden=false;
    document.getElementById('espaceConsigne').innerHTML="Click on a word and its translation to win!";
    document.getElementById('espaceReponse').hidden = false;
    document.getElementById('nomEtape').innerHTML='Second step : find the pairs';
    document.getElementById('boutonQuestionSuivante').disabled=true;

    jeuEnCours=2;
    //AFFICHAGE DU TABLEAU TYPE MEMORY
 
    var numeroCase = "case1";
    var tableauMelange = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
    var temp;
    
    for(var i=0; i<10; i++)
      {
            rnd = Math.floor(Math.random() * (20));
        		temp = tableauMelange[rnd];
        		rnd2 = Math.floor(Math.random() * (20));
        		tableauMelange[rnd]=tableauMelange[rnd2];
        		tableauMelange[rnd2]=temp;
                    
      }
    
    for(var i=1; i<21; i++)
      {
        numeroCase = numeroCase.slice(0,4);
        numeroCase = numeroCase.concat(i);
        document.getElementById(numeroCase).innerHTML = tableauCartes[tableauMelange[i-1]]; 
      }
   
  }
  
  var nombreCartesColorees = 0;
  var premiereCaseCliquee;
  var deuxiemeCaseCliquee;
  var reponsePrecedenteJuste=false;
  var nombreQuestionsRepondues=0;
  var scoreEtape2=10; 
  function test(caseCliquee) //changer nom fonction
  {
      if(nombreCartesColorees == 0)
      {
        if(premiereCaseCliquee!=null)
          {
           
            if(reponsePrecedenteJuste)
              {
              premiereCaseCliquee.style.backgroundColor="#FFE8BF"; 
              premiereCaseCliquee.innerHTML =" ";
              premiereCaseCliquee.style.pointerEvents='none';
        		 	deuxiemeCaseCliquee.style.backgroundColor="#FFE8BF"; 
              deuxiemeCaseCliquee.innerHTML =" ";
              deuxiemeCaseCliquee.style.pointerEvents='none';
              }
            else
              {
              premiereCaseCliquee.style.backgroundColor="#E89259";
        			deuxiemeCaseCliquee.style.backgroundColor="#DBFFDF";
              }
          }
        caseCliquee.style.backgroundColor = "#47B19B";
        nombreCartesColorees++;
        premiereCaseCliquee = caseCliquee;
      }
    else if (nombreCartesColorees == 1)
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
                    document.getElementById('espaceReponse').innerHTML ="Good answer!"
                    reponsePrecedenteJuste=true;
                    nombreQuestionsRepondues++;
                  }
                else 
                	{
                  	//mauvais appariement 
                    document.getElementById('espaceReponse').innerHTML ="That's a wrong answer. You lose a point";
                    reponsePrecedenteJuste=false;
                    scoreEtape2--;
                	}
              }
            else if (deuxiemeCaseCliquee.innerHTML == tableauCartes[i] && i%2==1)//reponse
              {
                if(premiereCaseCliquee.innerHTML == tableauCartes[i-1]) 
                  {
                    //bon appariement
                    document.getElementById('espaceReponse').innerHTML ="Good answer!"
                    reponsePrecedenteJuste=true;
                    nombreQuestionsRepondues++;
                    
                  }
                else 
                	{
                  	//mauvais appariement 
                    document.getElementById('espaceReponse').innerHTML ="That's a wrong answer. You lose a point";
                    reponsePrecedenteJuste=false;
                    scoreEtape2--;
                	}
              }
          }
        document.getElementById('espaceScore').innerHTML="Your score is: "+scoreEtape2+"/10";
        if(nombreQuestionsRepondues==10)
                  {
                    document.getElementById('boutonEtape3').hidden = false;
                  }
        nombreCartesColorees = 0;
      }
  }
  
  //ETAPE TROIS : TAPER LA REPONSE
  //gestion avec un form
   function chargerEtape3()
  {
    numeroQuestion = 0; 
    scoreEtape3=0;
    jeuEnCours=3; 
   
    //on cache les éléments de l'étape précédente
    document.getElementById('tableau').hidden=true;
    
    //et on affiche ceux de cette étape qui apparaissent avant le clic sur Start
    document.getElementById('espaceConsigne').innerHTML = "You will now have to write the translation of the words displayed on the cards.";
    var boutonCarte = document.getElementById('boutonCarte');
    boutonCarte.style.visibility= 'visible';
    boutonCarte.value="Start";
    boutonCarte.style.backgroundColor="#8D5838";
    document.getElementById('boutonEtape3').hidden=true;
  	document.getElementById('boutonQuestionSuivante').disabled=true;
    document.getElementById('espaceScore').innerHTML=" ";
    document.getElementById('espaceReponse').innerHTML=" ";
    document.getElementById('nomEtape').innerHTML='Third exercice : translation';
    
    //sauf ceux qui n'apparaissent qu'après le clic sur "Start"
    document.getElementById('jeNeSaisPas').style.visibility='hidden';
  }
  
  function verifierReponse()
  {
    //on ne peut plus répondre, on voit son score et la réponse et on ne peut que cliquer sur Question suivante
    document.getElementById('jeNeSaisPas').disabled=true;
    document.getElementById('boutonValider').disabled=true;
    document.getElementById('boutonQuestionSuivante').disabled=false;
    document.getElementById('boutonQuestionSuivante').focus();
    document.getElementById('boutonQuestionSuivante').style.backgroundColor="#E89259";
    
    if(document.getElementById('caseARemplir').value=="") //si validation sans réponse ou appui sur "I don't know"
      {
        document.getElementById('espaceReponse').hidden=false;
        document.getElementById('espaceReponse').innerHTML="You gave no answer. The good answer was: 				"+tableauCartes[2*numeroQuestion-1]; 
      }
    
  	else if(document.getElementById('caseARemplir').value==tableauCartes[2*numeroQuestion-1])
    	{
      	//augmenter score
      	scoreEtape3++;
      	//dire qu'on a la bonne réponse
        document.getElementById('espaceReponse').hidden=false;
      	document.getElementById('espaceReponse').innerHTML = "You said: 				 	"+document.getElementById('caseARemplir').value +". Congratulations! That's the good answer!"
    	}
    
    else
    	{
      	//dire que la réponse est fausse et donner la bonne
        document.getElementById('espaceReponse').hidden=false;
      	document.getElementById('espaceReponse').innerHTML = "You said: "+document.getElementById('caseARemplir').value + ". That's a wrong answer! The good answer was: "+tableauCartes[2*numeroQuestion-1];  
    	}
    
    retournerCarte(); //affiche la bonne réponse dans la carte
    document.getElementById('espaceScore').innerHTML="Your score is: "+scoreEtape3+"/10";
    
    if(numeroQuestion==10) //fin du jeu, on cache tous les éléments et on affiche le score
      {
        document.getElementById('nomEtape').innerHTML ="End of the game! You scored "+scoreEtape2+"/10 at the pairing game and "+scoreEtape3+"/10 at the translating game.";
        document.getElementById('boutonCarte').style.visibility= 'hidden';
        document.getElementById('boutonQuestionSuivante').style.visibility= 'hidden';
        document.getElementById('jeNeSaisPas').style.visibility= 'hidden';
				document.getElementById('groupeEtape3').hidden=true;
 				document.getElementById('espaceScore').hidden=true;
        document.getElementById('espaceConsigne').hidden=true;
        document.getElementById('espaceReponse').hidden=true;
        document.getElementById('numQuestion').hidden=true;
      }
  }
