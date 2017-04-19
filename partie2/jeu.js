var vaisseau = new Image();
vaisseau.src = "https://cdn4.iconfinder.com/data/icons/whsr-january-flaticon-set/512/rocket.png";
var vaisseauAlien = new Image();
vaisseauAlien.src = "./vaisseauAlien_petit.png";
var explosion = new Image();
explosion.src = "./giphy.gif";
var tableauQuestions = ["prop1t", true, "prop2f", false,"prop3t", true, "prop4f", false,"prop5t", true, "prop6f", false,"prop7t", true, "prop8f", false, "prop9", true, "prop10", false];
//var tableauPositionsQuestions = new Array;
var tableauPositionsQuestions=[14,68,62,33,99,6,35,4,41,0];
var tableauVaisseauxDisparus = [];
var tableauQuestionsAPoser = [];
var tableauVerbes = [];
var position=0;
var nbQuestions = 4;
var pause = false;
var nbVaisseauxADetruire=0;
var fini = false;
var sonTir = new Audio('./sonTir.mp3');
var sonExplosion = new Audio('./sonExplosion.mp3');


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
    //alert(resultat.verbes.records.length);
}



function chargerTableau()
{
    ajaxGet("https://easimprove.herokuapp.com/api.php/verbes", function(reponse) {
  var resultat = JSON.parse(reponse);
  resultat.verbes.records.forEach(function (verbe) {
      console.log(verbe[0],verbe[1], verbe[2], verbe[3], verbe[4]);
      //alert(verbe[0]);
      //tableauVerbes[verbe[0]-1] = [""+verbe[1] + verbe[2], ""+verbe[3], verbe[4]] ;
      tableauVerbes[0] = " "+verbe[1] +" "+ verbe[2];
      //alert(tableauVerbes[0]);
  });
});
    //rajouter une gestion des doublons pour ne pas avoir deux fois le meme verbe
for(var i =0; i<10;i++)
   {
        tableauQuestionsAPoser[i] = Math.floor(Math.random() * (104));
   }
}

function test()
{
alert(tableauVerbes[0]);
}

window.onload = function() 
{
//ajaxGet();
chargerTableau();
setTimeout(test,1000);

/*ajaxGet("https://easimprove.herokuapp.com/api.php/verbes", function (reponse) 
{
    // Transforme la réponse en tableau d'objets JavaScript
    var verbes = JSON.parse(reponse);
    console.log(verbes.verbes);
});*/


   //déclaration des éléments HTML
   //tableau = document.getElementById('tableau');
   boutonCommencer = document.getElementById('boutonCommencer');

   //canvas
   canvas = document.getElementById('canvas');
   canvasLaser = document.getElementById('canvasLaser');
   canvasProp1 = document.getElementById('canvasProp1');
   canvasProp2 = document.getElementById('canvasProp2');
   canvasProp3 = document.getElementById('canvasProp3');
   canvasProp4 = document.getElementById('canvasProp4');
   canvasProp5 = document.getElementById('canvasProp5');
   canvasProp6 = document.getElementById('canvasProp6');
   canvasProp7 = document.getElementById('canvasProp7');
   canvasProp8 = document.getElementById('canvasProp8');
   canvasProp9 = document.getElementById('canvasProp9');
   canvasProp10 = document.getElementById('canvasProp10');
   
   //contextes
   ctx = canvas.getContext('2d'); 
   ctx2 = canvasLaser.getContext('2d'); 
   ctxProp1 = canvasProp1.getContext('2d');
   ctxProp2 = canvasProp2.getContext('2d');
   ctxProp3 = canvasProp3.getContext('2d');
   ctxProp4 = canvasProp4.getContext('2d');
   ctxProp5 = canvasProp5.getContext('2d');
   ctxProp6 = canvasProp6.getContext('2d');
   ctxProp7 = canvasProp7.getContext('2d');
   ctxProp8 = canvasProp8.getContext('2d');
   ctxProp9 = canvasProp9.getContext('2d');
   ctxProp10 = canvasProp10.getContext('2d');
   //ctx.drawImage(vaisseau, position, 200,75,100);
   addEvent(window,"mousemove",bougerFusee);
   addEvent(window,"click",lancerLaser);
   //affichage avant le début
   //tableau.hidden = true;
   canvas.hidden =true;
   canvasLaser.hidden=true;
   canvasProp1.hidden=true;
   canvasProp2.hidden=true;
   canvasProp3.hidden=true;
   canvasProp4.hidden=true;
   canvasProp5.hidden=true;
   canvasProp6.hidden=true;
   canvasProp7.hidden=true;
   canvasProp8.hidden=true;
   canvasProp9.hidden=true;
   canvasProp10.hidden=true;

   //initialisation du nombre de vaisseaux à détruire
   for(var i = 0; i<10;i++)
   {
        if (tableauQuestions[i*2+1]==false)
        nbVaisseauxADetruire++;
   }
   
}
  

function lancerLaser(event)
{ 
    var vaisseauDejaDisparu = false;
    position=event.clientX-7;
    var distanceAuVaisseau = (position)%120;//reste
    var lieuDuTir = Math.floor((position)/120); 
    //alert(distanceAuVaisseau+"  "+lieuDuTir);
    if(boutonCommencer.hidden)   
    {
        sonTir.play();
        setTimeout(supprimerLaser,500);
        //position=event.clientX-7;
        ctx2.lineWidth=5;
        ctx2.beginPath();
        for(var i = 0; i<tableauVaisseauxDisparus.length;i++)
        {
            if(tableauVaisseauxDisparus[i]==lieuDuTir)
            vaisseauDejaDisparu = true;
        }
        if(distanceAuVaisseau<=50 && vaisseauDejaDisparu==false) //tir sur un vaisseau
        {
        ctx2.moveTo(position,tableauPositionsQuestions[lieuDuTir]+20);
        ctx2.lineTo(position,358);
            if(tableauQuestions[lieuDuTir*2+1])//ne doit pas disparaître
            {
                 //perdre des points
            }
            else
            {
                detruireVaisseauAlien(lieuDuTir+1);
            }
        }
        else //tir dans le vide
        {
            ctx2.moveTo(position,0);
            ctx2.lineTo(position,358);
        }
        ctx2.strokeStyle='white'; 
        ctx2.stroke(); 
    }
}

function detruireVaisseauAlien(lieuDuTir)
{
    var nomContexte = "ctxProp"+lieuDuTir;
    sonExplosion.play();
    window[nomContexte].clearRect(0, 0, 1200, 800);
    tableauVaisseauxDisparus[tableauVaisseauxDisparus.length]=(lieuDuTir-1);
    window[nomContexte].drawImage(explosion, 120*(lieuDuTir-1),tableauPositionsQuestions[lieuDuTir-1],80,80);
    if(tableauVaisseauxDisparus.length==nbVaisseauxADetruire)
    {
        terminer();
    }
}


function terminer()
{
    canvas.hidden=true;
    fini = true;
    ctx2.font="100px Arial";
    ctx2.fillStyle = "white";
    ctx2.textAlign = "center";
    ctx2.fillText("Finished!",canvas.width/2,canvas.height/2);
}

function supprimerLaser()
{
     ctx2.clearRect(0, 0, canvasLaser.width, canvasLaser.height);
     if(fini)
    {
        ctx2.fillStyle = "white";
        ctx2.font="100px Arial";
        ctx2.textAlign = "center";
        ctx2.fillText("Finished!",canvas.width/2,canvas.height/2);
    }  
}

function bougerFusee(event)
{  
   //déplacer la fusée selon les coordonnées en y de la souris
   position=event.clientX-65;
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   ctx.drawImage(vaisseau, position, 350,120,160);
}

 
function initialiserPartie()
{
   //affichage
   boutonCommencer.hidden=true;
   //tableau.hidden = false;
   canvas.hidden = false;
   canvasLaser.hidden = false;
   canvasProp1.hidden=false;
   canvasProp2.hidden=false;
   canvasProp3.hidden=false;
   canvasProp4.hidden=false;
   canvasProp5.hidden=false;
   canvasProp6.hidden=false;
   canvasProp7.hidden=false;
   canvasProp8.hidden=false;
   canvasProp9.hidden=false;
   canvasProp10.hidden=false;
   

   //remplir tableauPositionsQuestions
for(var i =0; i<10;i++)
   {
        tableauPositionsQuestions[i] = Math.floor(Math.random() * (140));
   }



   var nomContexte;
   //window[nomContexte].drawImage(vaisseauAlien, 120, 50,50,50);

   for(var i =0; i<10;i++)
   {
        nomContexte="ctxProp"+(i+1);
        window[nomContexte].drawImage(vaisseauAlien, 120*i,tableauPositionsQuestions[i],50,50);
        window[nomContexte].fillStyle = "white";
        window[nomContexte].textAlign = "center";
        window[nomContexte].fillText(tableauQuestions[i*2],120*i+25,tableauPositionsQuestions[i]+55);
   }

   //gestion des mots sur lesquels tirer
   //on crée un tableau de vingt cases, {"prop1",false,...}
   /*
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
               		tableauPropositions[i*3+1]=tableauQuestions[rnd*2];
               		tableauPropositions[i*3+2]=tableauQuestions[rnd*2+1];
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
            }*/
}


