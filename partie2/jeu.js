var vaisseau = new Image();
vaisseau.src = "https://cdn4.iconfinder.com/data/icons/whsr-january-flaticon-set/512/rocket.png";
var tableauQuestionsPossibles = ["prop1", true, "prop2", false,"prop3", true, "prop4", false,"prop5", true, "prop6", false,"prop7", true, "prop8", false, "prop9", true, "prop10", false];
var tableauPropositions = new Array;
var position=0;
var nbQuestions = 4;
var pause = false;
//var canvas2 = document.getElementById('canvas2');
//var ctx2 = canvas2.getContext('2d');

/* TODO :
gérer le fait qu'il y ait parfois moins de quatre prop
gérer dix proposition sur trois lignes
fonction tirer() :
    mettre un faisceau laser
    obtenir la proposition tirée
    envoyer le résultat à la fonction vérifierReponse()
    faire disparaître la case si c'est bien une fausse prop
    faire apparaître une perte de points sinon
mettre des vaisseaux à la place des boutons
jauge de PV/score ?
*/
function addEvent(obj,event,fct)
{
        if( obj.attachEvent)
                obj.attachEvent('on' + event,fct);
        else
                obj.addEventListener(event,fct,true);
}

window.onload = function() 
{
   //déclaration des variables
   tableau = document.getElementById('tableau');
   canvas = document.getElementById('canvas');
   boutonCommencer = document.getElementById('boutonCommencer');
   
   //fusée
   ctx = canvas.getContext('2d'); 
   //ctx.drawImage(vaisseau, -10, 80,35,60); 
   
   addEvent(canvas,"mousemove",bougerFusee);
   //canvas.addEventListener("mousemove", bougerFusee, false);
   addEvent(canvas,"click",lancerLaser);
   //affichage avant le début
   tableau.hidden = true;
   canvas.hidden =true;
   //canvas2.hidden=true;
   
}
  

function lancerLaser(event)
{    
 pause=true;
 setTimeout(retablirBougerFusee,500);
 position=event.clientX-5;
 ctx.beginPath();
 ctx.moveTo(position,0);
 ctx.lineTo(position,205);
 ctx.strokeStyle='white'; 
 ctx.stroke(); 
}

function retablirBougerFusee()
{
pause=false;
}

function bougerFusee(event)
{
        if(!pause)
        {
   //déplacer la fusée selon les coordonnées en y de la souris
   position=event.clientX-42;
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   ctx.drawImage(vaisseau, position, 200,75,100);
}
}

//#maintable td.white {color: #ffffff;}  
function initialiserPartie()
{
   //affichage
   boutonCommencer.hidden=true;
   tableau.hidden = false;
   canvas.hidden = false;
   //canvas2.hidden = false;
   
   //gestion des mots sur lesquels tirer
   //on crée un tableau de douze cases, {"case2", "prop2",false,...}
   var questionDejaAttribuee = false;
   var questionAttribueeMax=0;
   var rnd = 0;
   for (var i = 0; i<nbQuestions ; i++)
      {
         do
	         {
               questionDejaAttribuee = false;
            	rnd = Math.floor(Math.random() * (10));
              if(questionAttribueeMax!=0)
               {
         			for (var j =0;j<questionAttribueeMax-1;j++)
                  {
                     if(tableauPropositions[j*3].substr(4)==rnd)
                     {questionDejaAttribuee = true;}
                  }
               }
               
               if(!questionDejaAttribuee)
                  {
               		tableauPropositions[i*3]=("case"+rnd);
               		tableauPropositions[i*3+1]=tableauQuestionsPossibles[rnd*2];
               		tableauPropositions[i*3+2]=tableauQuestionsPossibles[rnd*2+1];
                     questionAttribueeMax++;
                  }
            }
         while(questionDejaAttribuee);        
         
      }
   for (var k =0; k<nbQuestions; k++)
            {
               document.getElementById(tableauPropositions[k*3]).innerHTML = tableauPropositions[k*3+1];
               document.getElementById(tableauPropositions[k*3]).style="color:white"; 
               document.getElementById(tableauPropositions[k*3]).style.backgroundImage="url(./vaisseauAlien_petit.png)"; 
            }
}


