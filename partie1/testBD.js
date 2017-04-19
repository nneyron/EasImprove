ajaxGet("https://easimprove.herokuapp.com/api.php/verbes", function (reponse) 
{
    // Transforme la réponse en tableau d'objets JavaScript
    var verbes = JSON.parse(reponse);
    // Affiche le titre de chaque film
    /*verbes.records.forEach(function (verbe) 
    {
        console.log(verbe["verbe"]);
    });*/
    //console.log(verbes["records"]["0"]["1"]);
    //console.log(verbes["columns"][4]);
    //console.log(verbes.columns[0]);
    //console.log(verbes["columns"].length);
    console.log(verbes);
    console.log(verbes.valueOf(['columns'][0]));
    console.log(verbes['columns']);
    console.log(verbes.verbes);
});
/*// Exécute un appel AJAX GET
// Prend en paramètres l'URL cible et la fonction callback appelée en cas de succès
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

ajaxGet("https://easimprove.herokuapp.com/api.php/verbes", function(reponse) {
  var resultat = JSON.parse(reponse);
  resultat.verbes.records.forEach(function (verbe) {
      console.log(verbe[1], verbe[2], verbe[3], verbe[4]);
  });
});*/